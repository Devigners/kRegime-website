# Migration Guide: Stripe Environment Configuration

## What Changed?

The application now supports environment-based Stripe product and price configuration. Previously, all environments used hardcoded test product IDs. Now you can configure the app to use either test or production Stripe products.

## Action Required

Add the following line to your `.env.local` or environment configuration:

### For Staging/Development/Testing
```bash
NEXT_PUBLIC_STRIPE_ENV=test
```

### For Production
```bash
NEXT_PUBLIC_STRIPE_ENV=production
```

## Complete Environment Setup Examples

### Staging Environment (`.env.local` or staging configuration)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_staging_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key

# Stripe - Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_STRIPE_ENV=test

# Resend
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://staging.yoursite.com
NEXT_PUBLIC_COMING_SOON=false
```

### Production Environment (`.env.production` or production configuration)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe - Live Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
NEXT_PUBLIC_STRIPE_ENV=production

# Resend
RESEND_API_KEY=your_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://yoursite.com
NEXT_PUBLIC_COMING_SOON=false
```

## Changes Made to Codebase

1. **New File**: `src/lib/stripeProducts.ts`
   - Contains test and production Stripe product/price configurations
   - Provides helper functions to get appropriate IDs based on environment

2. **Updated File**: `src/app/api/stripe/checkout/route.ts`
   - Removed hardcoded product and price IDs
   - Now uses `stripeProducts.ts` helper functions

3. **Updated File**: `.env.example`
   - Added `NEXT_PUBLIC_STRIPE_ENV` variable with documentation

4. **New Documentation**: `docs/STRIPE_ENVIRONMENT_CONFIG.md`
   - Comprehensive guide on the new configuration system

## Testing Your Setup

### 1. Check Environment Variable
```bash
# In your terminal
echo $NEXT_PUBLIC_STRIPE_ENV
```

### 2. Verify in Browser Console
Open browser dev tools and run:
```javascript
console.log('Stripe Environment:', process.env.NEXT_PUBLIC_STRIPE_ENV);
```

### 3. Test Checkout Flow
- **Staging/Test**: Use test credit card `4242 4242 4242 4242`
- **Production**: Real payments will be processed

### 4. Check Product IDs in Network Tab
- Look at the Stripe checkout session creation request
- Test products start with `prod_TM6...`
- Production products start with `prod_TM9...`

## Rollback (if needed)

If you need to rollback to the old behavior (always using test products):

1. Simply set or keep:
   ```bash
   NEXT_PUBLIC_STRIPE_ENV=test
   ```

2. Or remove the variable entirely (will default to test)

## Important Notes

1. **Rebuild Required**: After changing `NEXT_PUBLIC_STRIPE_ENV`, you must rebuild:
   ```bash
   npm run build
   ```

2. **Match API Keys**: Ensure your Stripe API keys match the environment:
   - Test products → use `pk_test_...` and `sk_test_...`
   - Production products → use `pk_live_...` and `sk_live_...`

3. **Webhook Endpoints**: Configure separate webhooks for test and production:
   - Test webhook → use test webhook secret
   - Production webhook → use production webhook secret

## Deployment Checklist

### Before Deploying to Staging
- [ ] Set `NEXT_PUBLIC_STRIPE_ENV=test`
- [ ] Use test Stripe API keys (`pk_test_...`, `sk_test_...`)
- [ ] Configure test webhook with test secret
- [ ] Test checkout with test card (4242...)

### Before Deploying to Production
- [ ] Set `NEXT_PUBLIC_STRIPE_ENV=production`
- [ ] Use live Stripe API keys (`pk_live_...`, `sk_live_...`)
- [ ] Configure production webhook with live secret
- [ ] Verify all product IDs in Stripe Dashboard
- [ ] Test checkout with a small real transaction
- [ ] Monitor Stripe Dashboard for incoming payments

## Support

For detailed information, see: `docs/STRIPE_ENVIRONMENT_CONFIG.md`

If you encounter issues:
1. Verify environment variables are set correctly
2. Check browser console for errors
3. Verify Stripe Dashboard shows correct API mode (test vs live)
4. Ensure product IDs exist in your Stripe account
