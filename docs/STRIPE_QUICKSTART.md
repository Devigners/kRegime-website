# Quick Start: Testing Stripe Payments Locally

## Prerequisites
- Node.js installed
- Stripe account (test mode)
- Stripe CLI installed (optional, for webhooks)

## Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## Step 2: Update Your Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Start Your Development Server

```bash
npm run dev
```

## Step 4: Test the Payment Flow

1. **Open your app**: http://localhost:3000
2. **Select a regime**: Choose TRIBOX, PENTABOX, or SEPTABOX
3. **Choose subscription type**: One-time, 3-month, or 6-month
4. **Fill the form**: Answer all the skincare questions
5. **Add to cart**: Review your selection
6. **Go to checkout**: Click "Proceed to Checkout"
7. **Enter shipping info**: Fill in your details
8. **Click "Complete Order"**: You'll be redirected to Stripe

## Step 5: Use Test Card

On the Stripe checkout page, use this test card:

```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
Name: Any name
```

## Step 6: Complete Payment

After clicking "Pay", you'll be redirected back to the success page where your order will be created automatically.

## Testing Webhooks (Optional)

For webhook testing in development:

### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
# Download from https://github.com/stripe/stripe-cli/releases
```

### Forward Webhooks to Local Server
```bash
# Login to Stripe
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook secret (starts with `whsec_`). Add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

## Troubleshooting

### "Failed to create checkout session"
- Double-check your `STRIPE_SECRET_KEY` in `.env.local`
- Make sure you've restarted the dev server after adding env variables
- Check the browser console for detailed errors

### "Payment verification failed"
- This usually happens if webhooks aren't working
- The order will still be created when you return to the success page
- For production, you must set up webhooks properly

### Order not appearing in database
- Check your Supabase connection
- Verify the order API is working: http://localhost:3000/api/orders
- Check the browser console and server logs for errors

## What's Next?

After testing locally:

1. **Deploy to production** (Vercel, Netlify, etc.)
2. **Set up production webhooks** in Stripe Dashboard
3. **Update environment variables** with production values
4. **Test with real cards** (or keep in test mode)

## Need Help?

- Check `STRIPE_INTEGRATION.md` for detailed documentation
- Review the Stripe Dashboard for payment logs
- Check server logs for errors
- Visit https://stripe.com/docs for Stripe documentation
