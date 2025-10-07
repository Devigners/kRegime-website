# Stripe Payment Integration Guide

This document explains how the Stripe payment integration works for the kRegime website and how to set it up.

## Overview

The payment flow uses **Stripe Checkout**, a fully hosted payment page that:
- Handles all payment details securely
- Supports one-time payments and subscriptions
- Provides built-in fraud protection
- Is PCI compliant
- Supports multiple payment methods (cards, Apple Pay, Google Pay, etc.)

## Products & Prices in Stripe

Three regime products have been created in Stripe with multiple pricing options:

### 1. TRIBOX (3-step routine)
- **Product ID**: `prod_TAFj5WaxDovV3W`
- **Prices**:
  - One-time: 229 AED (`price_1SDvELIY1QU1SXfhRQR0gVkf`)
  - 3-month subscription: 199 AED/month (`price_1SDvEUIY1QU1SXfhdRZP7PWE`)
  - 6-month subscription: 179 AED/month (`price_1SDvEWIY1QU1SXfhPkPPvtuZ`)

### 2. PENTABOX (5-step routine)
- **Product ID**: `prod_TAFkM2idRQLyfH`
- **Prices**:
  - One-time: 379 AED (`price_1SDvF7IY1QU1SXfhkTwgilG8`)
  - 3-month subscription: 329 AED/month (`price_1SDvF8IY1QU1SXfh5HBM0Pha`)
  - 6-month subscription: 299 AED/month (`price_1SDvF9IY1QU1SXfhlmbp8wsv`)

### 3. SEPTABOX (7-step routine)
- **Product ID**: `prod_TAFkQg1qDjATvK`
- **Prices**:
  - One-time: 529 AED (`price_1SDvFnIY1QU1SXfhstZvA8oi`)
  - 3-month subscription: 459 AED/month (`price_1SDvFoIY1QU1SXfhFDTooecT`)
  - 6-month subscription: 419 AED/month (`price_1SDvFpIY1QU1SXfhybfabRur`)

## Payment Flow

1. **User fills out regime form** → Selects skin type, concerns, preferences
2. **Adds to cart** → Cart stores regime selection and subscription type
3. **Goes to payment page** → Enters contact and shipping information
4. **Clicks "Complete Order"** → Creates Stripe Checkout session
5. **Redirected to Stripe** → User enters payment details on Stripe's secure page
6. **Payment processed** → Stripe handles the payment
7. **Redirected back** → User returns to success page
8. **Order created** → System creates order in database
9. **Confirmation** → User receives order confirmation

## Setup Instructions

### 1. Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (get after creating webhook)
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Set Up Stripe Webhook (for production)

1. Go to [Stripe Webhooks Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the "Signing secret" and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 3. Testing with Stripe CLI (for development)

For local testing, you can use the Stripe CLI to forward webhook events:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will give you a webhook signing secret (starts with whsec_)
# Add this to your .env.local as STRIPE_WEBHOOK_SECRET
```

### 4. Test Payment Cards

Use these test cards in Stripe's test mode:

- **Successful payment**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined card**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9995`

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

## API Routes

### POST `/api/stripe/checkout`
Creates a Stripe Checkout session for the selected regime and subscription type.

**Request Body**:
```json
{
  "regimeId": "tribox",
  "subscriptionType": "one-time",
  "quantity": 1,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Dubai",
    "postalCode": "12345"
  },
  "userDetails": { /* form responses */ },
  "contactInfo": { /* contact info */ }
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### POST `/api/stripe/webhook`
Handles Stripe webhook events (payment completion, subscription updates, etc.)

This endpoint is called by Stripe when events occur. It:
- Verifies the webhook signature
- Creates orders in the database when payments are completed
- Handles subscription lifecycle events

### GET `/api/stripe/verify-session?session_id=cs_test_...`
Verifies a Stripe Checkout session and creates the order if payment was successful.

**Response**:
```json
{
  "success": true,
  "orderId": "order_123",
  "alreadyProcessed": false
}
```

## Pages

### `/payment`
The checkout page where users enter their contact and shipping information before being redirected to Stripe Checkout.

**Key Features**:
- Validates required fields (email, name, address, city, postal code)
- Stores cart data in localStorage before redirect
- Creates Stripe Checkout session
- Redirects to Stripe's hosted checkout page

### `/payment/success`
The success page that users return to after completing payment on Stripe.

**Key Features**:
- Verifies payment status with Stripe
- Creates order in database
- Displays order confirmation
- Provides link to order details
- Clears cart data

## Subscription Handling

For subscription orders (3-month or 6-month):
- Stripe automatically charges the customer monthly
- The initial charge happens immediately
- Subsequent charges occur on the same day each month
- Customers can manage their subscription in the Stripe Customer Portal
- Webhook events notify the system of subscription changes

## Testing the Integration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Select a regime** and add to cart

3. **Go to checkout** and fill in the form

4. **Click "Complete Order"** - you'll be redirected to Stripe

5. **Use a test card** (4242 4242 4242 4242)

6. **Complete payment** - you'll be redirected back to the success page

7. **Check the database** - order should be created with status "processing"

## Troubleshooting

### "Failed to create checkout session"
- Check that your Stripe secret key is correct
- Verify that the regime ID and subscription type are valid
- Check the browser console for detailed error messages

### "Payment not completed"
- Ensure you're using a valid test card
- Check if the card requires authentication (3D Secure)
- Verify webhook is receiving events (check Stripe dashboard)

### Order not created after payment
- Check webhook is set up correctly
- Verify webhook secret is correct
- Check server logs for errors
- Ensure Supabase connection is working

### Webhook signature verification failed
- Make sure `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret
- For local development, use the Stripe CLI forwarding
- For production, use the webhook secret from Stripe Dashboard

## Security Notes

- All payment details are handled by Stripe - never stored on our servers
- Stripe Checkout is PCI DSS compliant
- Webhook signatures are verified to prevent tampering
- Sensitive data is never logged
- HTTPS is required for production webhooks

## Next Steps

To enable subscriptions in production:
1. Set up a customer portal for subscription management
2. Implement subscription pause/resume functionality
3. Add email notifications for payment failures
4. Set up automatic retries for failed payments
5. Implement proration for subscription upgrades/downgrades

## Support

For Stripe-related issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For application issues:
- Check the server logs
- Review the browser console
- Contact the development team
