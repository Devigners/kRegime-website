import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { SubscriptionType } from '@/types';
import { getProductMap, getStripePriceId } from '@/lib/stripeProducts';

interface CheckoutRequestBody {
  regimeId: string;
  subscriptionType: SubscriptionType;
  quantity: number;
  customerEmail: string;
  customerName: string;
  shippingAddress?: {
    firstName: string;
    lastName?: string;
    address: string;
    city: string;
    postalCode: string;
  };
  checkoutSessionKey: string; // Key to retrieve data from localStorage
  discountCodeId?: string; // Optional discount code ID
  stripeCouponId?: string; // Stripe coupon ID to apply discount
  isGift?: boolean; // Whether this is a gift order
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const {
      regimeId,
      subscriptionType,
      quantity,
      customerEmail,
      shippingAddress,
      checkoutSessionKey,
      discountCodeId,
      stripeCouponId,
      isGift,
    } = body;

    // Validate regime ID
    const REGIME_TO_PRODUCT_MAP = getProductMap();
    if (!REGIME_TO_PRODUCT_MAP[regimeId]) {
      return NextResponse.json(
        { error: 'Invalid regime ID' },
        { status: 400 }
      );
    }

    // Fetch regime data to get regime discount coupon
    const { supabaseClient } = await import('@/lib/supabase');
    const { data: regimeData } = await supabaseClient
      .from('regimes')
      .select('stripe_coupon_id_one_time, stripe_coupon_id_3_months, stripe_coupon_id_6_months')
      .eq('id', regimeId)
      .single();

    // Determine regime discount coupon based on subscription type
    let regimeCouponId: string | null = null;
    if (regimeData) {
      switch (subscriptionType) {
        case 'one-time':
          regimeCouponId = regimeData.stripe_coupon_id_one_time;
          break;
        case '3-months':
          regimeCouponId = regimeData.stripe_coupon_id_3_months;
          break;
        case '6-months':
          regimeCouponId = regimeData.stripe_coupon_id_6_months;
          break;
      }
    }

    // Get the price ID for this regime and subscription type
    const priceId = getStripePriceId(regimeId, subscriptionType);
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid subscription type for this regime' },
        { status: 400 }
      );
    }

    // Determine if this is a subscription or one-time payment
    const isSubscription = subscriptionType !== 'one-time';

    // Base session configuration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionConfig: any = {
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      customer_email: customerEmail,
      billing_address_collection: 'auto',
      // phone_number_collection: {
      //   enabled: true,
      // },
      metadata: {
        regimeId,
        subscriptionType,
        quantity: quantity.toString(),
        customerEmail: customerEmail,
        checkoutSessionKey, // Store key to retrieve data from localStorage
        discountCodeId: discountCodeId || '', // Store discount code ID if present
        isGift: isGift ? 'true' : 'false',
        // Only include shipping info for non-gift orders
        ...(shippingAddress && !isGift ? {
          firstName: shippingAddress.firstName,
          city: shippingAddress.city,
        } : {}),
      },
      // Use client_reference_id for easy order tracking
      client_reference_id: checkoutSessionKey,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cancelled=true`,
    };

    // Apply Stripe coupons: prioritize discount code, then regime discount
    const appliedCouponId = stripeCouponId || regimeCouponId;
    
    if (appliedCouponId) {
      sessionConfig.discounts = [
        {
          coupon: appliedCouponId,
        },
      ];
    } else {
      // Only set allow_promotion_codes when NOT using discounts array
      sessionConfig.allow_promotion_codes = false;
    }

    // Only add shipping_options for one-time payments (payment mode)
    if (!isSubscription) {
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping
              currency: 'aed',
            },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
      ];
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
