import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { SubscriptionType } from '@/types';

// Map regime IDs to Stripe product IDs
const REGIME_TO_PRODUCT_MAP: Record<string, string> = {
  tribox: 'prod_TAFj5WaxDovV3W',
  pentabox: 'prod_TAFkM2idRQLyfH',
  septabox: 'prod_TAFkQg1qDjATvK',
};

// Map subscription types to price IDs for each regime
const PRICE_MAP: Record<string, Record<SubscriptionType, string>> = {
  tribox: {
    'one-time': 'price_1SDvELIY1QU1SXfhRQR0gVkf',
    '3-months': 'price_1SDvEUIY1QU1SXfhdRZP7PWE',
    '6-months': 'price_1SDvEWIY1QU1SXfhPkPPvtuZ',
  },
  pentabox: {
    'one-time': 'price_1SDvF7IY1QU1SXfhkTwgilG8',
    '3-months': 'price_1SDvF8IY1QU1SXfh5HBM0Pha',
    '6-months': 'price_1SDvF9IY1QU1SXfhlmbp8wsv',
  },
  septabox: {
    'one-time': 'price_1SDvFnIY1QU1SXfhstZvA8oi',
    '3-months': 'price_1SDvFoIY1QU1SXfhFDTooecT',
    '6-months': 'price_1SDvFpIY1QU1SXfhybfabRur',
  },
};

interface CheckoutRequestBody {
  regimeId: string;
  subscriptionType: SubscriptionType;
  quantity: number;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    address: string;
    city: string;
    postalCode: string;
  };
  checkoutSessionKey: string; // Key to retrieve data from localStorage
  discountCodeId?: string; // Optional discount code ID
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
    } = body;

    // Validate regime ID
    if (!REGIME_TO_PRODUCT_MAP[regimeId]) {
      return NextResponse.json(
        { error: 'Invalid regime ID' },
        { status: 400 }
      );
    }

    // Get the price ID for this regime and subscription type
    const priceId = PRICE_MAP[regimeId]?.[subscriptionType];
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
      shipping_address_collection: {
        allowed_countries: ['AE'], // United Arab Emirates
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        regimeId,
        subscriptionType,
        quantity: quantity.toString(),
        customerEmail: customerEmail,
        checkoutSessionKey, // Store key to retrieve data from localStorage
        firstName: shippingAddress.firstName,
        city: shippingAddress.city,
        discountCodeId: discountCodeId || '', // Store discount code ID if present
      },
      // Use client_reference_id for easy order tracking
      client_reference_id: checkoutSessionKey,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cancelled=true`,
      allow_promotion_codes: true,
    };

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
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
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
