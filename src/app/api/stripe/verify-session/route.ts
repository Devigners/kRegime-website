import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { orderApi } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session ID provided' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Check if order already exists for this session
    try {
      const existingOrders = await orderApi.getAll();
      const existingOrder = existingOrders.find(
        (order) => (order as { stripeSessionId?: string }).stripeSessionId === sessionId
      );

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          orderId: existingOrder.id,
          alreadyProcessed: true,
        });
      }
    } catch (error) {
      console.error('Error checking existing orders:', error);
    }

    // Return session details - order will be created on client side with localStorage data
    const metadata = session.metadata;
    if (!metadata) {
      return NextResponse.json(
        { success: false, error: 'No metadata in session' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      checkoutSessionKey: metadata.checkoutSessionKey,
      regimeId: metadata.regimeId,
      subscriptionType: metadata.subscriptionType,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      customerEmail: metadata.customerEmail,
      alreadyProcessed: false,
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
