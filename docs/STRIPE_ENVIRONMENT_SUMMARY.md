# Stripe Environment Configuration - Summary

## Quick Start

### 1. Add Environment Variable

Add to your `.env.local`:

**For Staging/Testing:**
```bash
NEXT_PUBLIC_STRIPE_ENV=test
```

**For Production:**
```bash
NEXT_PUBLIC_STRIPE_ENV=production
```

### 2. Verify Setup

The system will automatically use the correct Stripe products and prices based on this variable.

## Files Modified

1. ✅ **Created**: `src/lib/stripeProducts.ts` - Central configuration for all Stripe product/price IDs
2. ✅ **Updated**: `src/app/api/stripe/checkout/route.ts` - Now uses dynamic configuration
3. ✅ **Updated**: `.env.example` - Added `NEXT_PUBLIC_STRIPE_ENV` documentation

## Documentation Created

1. 📄 `docs/STRIPE_ENVIRONMENT_CONFIG.md` - Complete guide to the configuration system
2. 📄 `docs/STRIPE_ENVIRONMENT_MIGRATION.md` - Migration guide for existing deployments

## Product IDs Configured

### Test Products (NEXT_PUBLIC_STRIPE_ENV=test)
- Tribox: `prod_TM6BuovMVYmvOi`
- Pentabox: `prod_TM6Ewd4IodwK7K`
- Septabox: `prod_TM6FUZBVFo0n6E`

### Production Products (NEXT_PUBLIC_STRIPE_ENV=production)
- Tribox: `prod_TM9wgCfSL48Jcj`
- Pentabox: `prod_TM9wyhIJJTBgOU`
- Septabox: `prod_TM9w4ihHR06Spv`

## Environment Setup Examples

### Staging
```bash
# Test Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Use test products
NEXT_PUBLIC_STRIPE_ENV=test
```

### Production
```bash
# Live Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# Use production products
NEXT_PUBLIC_STRIPE_ENV=production
```

## How It Works

The `src/lib/stripeProducts.ts` module:
1. Contains separate configurations for test and production
2. Checks `NEXT_PUBLIC_STRIPE_ENV` (or falls back to `NODE_ENV`)
3. Returns appropriate product/price IDs via helper functions
4. Used by the checkout API to create Stripe sessions

## Testing

### Verify Environment
```javascript
// In browser console
console.log(process.env.NEXT_PUBLIC_STRIPE_ENV);
```

### Check Product IDs
When creating a checkout:
- Look at network requests in browser DevTools
- Test products have IDs like `prod_TM6...`
- Production products have IDs like `prod_TM9...`

## Important Notes

1. ⚠️ **Rebuild required** after changing `NEXT_PUBLIC_STRIPE_ENV`
2. ⚠️ **Match API keys** - Use test keys with test products, live keys with live products
3. ⚠️ **Separate webhooks** - Configure different webhooks for test and production
4. ✅ **Default behavior** - If not set, defaults to test products (safe default)

## Next Steps

1. **For Staging**: Add `NEXT_PUBLIC_STRIPE_ENV=test` to your staging environment variables
2. **For Production**: Add `NEXT_PUBLIC_STRIPE_ENV=production` to your production environment variables
3. **Rebuild**: After adding the variable, rebuild your application
4. **Test**: Verify checkout uses correct product IDs

## Support Documentation

- Full configuration guide: `docs/STRIPE_ENVIRONMENT_CONFIG.md`
- Migration instructions: `docs/STRIPE_ENVIRONMENT_MIGRATION.md`
