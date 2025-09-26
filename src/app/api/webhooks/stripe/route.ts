import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { convertOrderRowToOrder, convertRegimeRowToRegime } from '@/models/database';
import { sendOrderCompleteEmail } from '@/lib/email';
import { stripe } from '@/lib/stripe';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  if (!endpointSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('💰 Payment succeeded:', paymentIntent.id);

      // Get order ID from metadata
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        try {
          // Update order status to completed
          const { data: orderData, error } = await supabaseClient
            .from('orders')
            .update({ 
              status: 'completed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
            .select('*')
            .single();

          if (error) {
            console.error('Failed to update order status:', error);
          } else {
            console.log('Order status updated to completed:', orderId);
            
            // Convert order and send completion email
            const convertedOrder = convertOrderRowToOrder(orderData);
            
            // Fetch regime details for the email
            let regime = undefined;
            if (convertedOrder.regimeId) {
              const { data: regimeData } = await supabaseClient
                .from('regimes')
                .select('*')
                .eq('id', convertedOrder.regimeId)
                .single();

              if (regimeData) {
                regime = convertRegimeRowToRegime(regimeData);
              }
            }

            // Send completion email
            const emailResult = await sendOrderCompleteEmail({
              order: convertedOrder,
              regime,
            });

            if (emailResult.success) {
              console.log('Order completion email sent:', emailResult.id);
            } else {
              console.error('Failed to send order completion email:', emailResult.error);
            }
          }
        } catch (updateError) {
          console.error('Error updating order after payment success:', updateError);
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('❌ Payment failed:', paymentIntent.id);

      // Get order ID from metadata
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        try {
          // Update order status to cancelled
          await supabaseClient
            .from('orders')
            .update({ 
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          console.log('Order status updated to cancelled:', orderId);
        } catch (updateError) {
          console.error('Error updating order after payment failure:', updateError);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}