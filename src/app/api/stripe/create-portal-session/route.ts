import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, returnUrl } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch the order from the database to get the stripe_session_id
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('stripe_session_id')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData || !orderData.stripe_session_id) {
      return NextResponse.json(
        { error: 'No Stripe session found for this order' },
        { status: 404 }
      );
    }

    // Retrieve the checkout session to get the customer ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(orderData.stripe_session_id);

    if (!checkoutSession.customer) {
      return NextResponse.json(
        { error: 'No customer found for this session' },
        { status: 404 }
      );
    }

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${orderId}`,
    });

    return NextResponse.json({
      url: portalSession.url
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    );
  }
}
