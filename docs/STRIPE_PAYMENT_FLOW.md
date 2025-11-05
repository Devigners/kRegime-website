# Stripe Payment Flow

## Overview
The payment flow is now streamlined to redirect users directly from Stripe to the confirmation page, eliminating the intermediate success page from the URL.

## Payment Flow Steps

### 1. User Selects Regime & Fills Form
- User selects a regime (TRIBOX, PENTABOX, or SEPTABOX)
- User fills out the regime questionnaire
- User proceeds to payment page

### 2. Payment Page (`/payment`)
**File**: `src/app/payment/page.tsx`

- User enters shipping & contact information
- System generates unique `checkoutSessionKey` (timestamp + random string)
- Complete order data stored in localStorage with this key
- User clicks "Proceed to Payment"
- System calls `/api/stripe/checkout` with only the key (not full data)

### 3. Stripe Checkout API (`/api/stripe/checkout`)
**File**: `src/app/api/stripe/checkout/route.ts`

- Creates Stripe Checkout Session
- Stores minimal metadata:
  - `checkoutSessionKey` (reference to localStorage data)
  - `regimeId`
  - `subscriptionType`
  - `quantity`
  - `customerEmail`
  - Basic shipping info
- Sets success URL: `{NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
- Redirects user to Stripe hosted checkout page

### 4. User Completes Payment on Stripe
- User enters payment information on Stripe's secure checkout page
- Stripe processes the payment
- On success, Stripe redirects to success URL

### 5. Success Page Processing (`/payment/success`)
**File**: `src/app/payment/success/page.tsx`

**This page is only visible for a split second** - it handles:
- Retrieves `session_id` from URL
- Calls `/api/stripe/verify-session` to verify payment
- Retrieves full order data from localStorage using `checkoutSessionKey`
- Creates order in database via `/api/orders`
- Clears cart and checkout data from localStorage
- **Immediately redirects** to `/confirmation?orderId={ORDER_ID}`

**User Experience**: 
```
Stripe → /payment/success?session_id=... → /confirmation?orderId=...
         (Loading screen, < 2 seconds)
```

### 6. Confirmation Page (`/confirmation`)
**File**: `src/app/confirmation/page.tsx`

- Shows complete order details
- Displays order ID, items, shipping info
- Provides order tracking information
- Final destination for the user

## URL Flow

### What User Sees:
```
/payment → Stripe Checkout → /confirmation?orderId=abc123
```

### What Actually Happens:
```
/payment → Stripe Checkout → /payment/success?session_id=xyz789 → /confirmation?orderId=abc123
                                    (Processing, auto-redirect)
```

## Key Benefits

1. **Clean URLs**: User only sees `/confirmation` in final URL
2. **Secure**: Sensitive data stored in localStorage, only keys passed to Stripe
3. **Fast**: Automatic redirect happens in < 2 seconds
4. **Reliable**: Server-side payment verification before order creation
5. **User-Friendly**: No confusing intermediate pages or URLs

## Data Flow

### Data Storage Strategy
```
localStorage (Client) ←→ Stripe Metadata (Reference Key) ←→ Server (Order Creation)
```

1. **Before Payment**: Full data in localStorage
2. **During Payment**: Only key in Stripe metadata
3. **After Payment**: Data retrieved, order created, localStorage cleared

### Why This Approach?
- **Stripe Metadata Limit**: 500 characters per value
- **Solution**: Store reference key instead of full data
- **Benefit**: Can store unlimited data in localStorage

## Error Handling

### Payment Verification Fails
- User sees error message
- Prompted to contact support
- No order created in database

### Order Creation Fails
- Payment already processed
- User still sees success (payment went through)
- Admin can manually create order from Stripe dashboard

### Session Not Found
- User redirected back to payment page
- Error message displayed
- Cart data preserved

## Webhook Backup (Optional)

**File**: `src/app/api/stripe/webhook/route.ts`

Stripe webhooks serve as backup for:
- Logging payment events
- Handling edge cases
- Recovery if client-side order creation fails

**Note**: Primary order creation happens client-side for immediate feedback.

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Testing

### Test the Flow:
1. Select a regime and fill form
2. Go to payment page
3. Enter shipping info
4. Click "Proceed to Payment"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete payment
7. **Verify**: Automatically redirected to `/confirmation?orderId=...`
8. **Check**: URL bar shows only confirmation page (no `/success` in URL)

### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3DS: `4000 0025 0000 3155`

## Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Switch to live Stripe keys
- [ ] Set up Stripe webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Add webhook secret to environment variables
- [ ] Test complete flow with real payment
- [ ] Monitor webhook events in Stripe Dashboard

## Maintenance

### Environment Configuration:
The application now supports environment-based Stripe configuration:
- **Test/Staging**: Uses test Stripe products and prices
- **Production**: Uses production Stripe products and prices

See `docs/STRIPE_ENVIRONMENT_CONFIG.md` for complete documentation.

To switch environments, set the `NEXT_PUBLIC_STRIPE_ENV` environment variable:
- `test` → Uses test products (default)
- `production` → Uses production products

### Adding New Regimes:
1. Create product in Stripe Dashboard (both test and production)
2. Create prices for each subscription type (one-time, 3-months, 6-months)
3. Update product/price configurations in `src/lib/stripeProducts.ts`:
   - Add to `TEST_CONFIG` (test product/price IDs)
   - Add to `PRODUCTION_CONFIG` (production product/price IDs)
4. Rebuild and deploy

**Note**: Previously, you would update `REGIME_TO_PRODUCT_MAP` and `PRICE_MAP` in the checkout route. These are now generated dynamically from `stripeProducts.ts`.

### Changing Success Flow:
- Modify redirect logic in `/payment/success/page.tsx`
- Update success URL in `/api/stripe/checkout/route.ts`

### Debugging:
- Check browser console for client-side errors
- Check server logs for API errors
- Check Stripe Dashboard for payment events
- Verify localStorage data with browser DevTools
- Verify correct environment with: `console.log(process.env.NEXT_PUBLIC_STRIPE_ENV)`
- Check product IDs in network requests (test: `prod_TM6...`, production: `prod_TM9...`)
