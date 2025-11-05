# Stripe Environment Configuration

This document explains how to configure Stripe products and prices for different environments (staging/test vs production).

## Overview

The kRegime website now supports environment-based Stripe configuration, allowing you to:
- Use **test products and prices** in staging/development environments
- Use **production products and prices** in production environments
- Switch between environments using a simple environment variable

## Configuration Files

### 1. `src/lib/stripeProducts.ts`

This is the central configuration file that contains:
- **TEST_CONFIG**: Test/staging Stripe product and price IDs
- **PRODUCTION_CONFIG**: Production Stripe product and price IDs
- Helper functions to retrieve the correct IDs based on environment

### 2. Environment Variable

Add the following to your `.env.local` or `.env.production` file:

```bash
# For staging/development (uses test products)
NEXT_PUBLIC_STRIPE_ENV=test

# For production (uses production products)
NEXT_PUBLIC_STRIPE_ENV=production
```

## How It Works

The system determines which Stripe configuration to use based on:

1. **Primary method**: `NEXT_PUBLIC_STRIPE_ENV` environment variable
   - `production` → Uses production products/prices
   - Any other value (or empty) → Uses test products/prices

2. **Fallback method**: `NODE_ENV` environment variable
   - `production` → Uses production products/prices (if `NEXT_PUBLIC_STRIPE_ENV` is not set)

**Recommendation**: Use `NEXT_PUBLIC_STRIPE_ENV` instead of relying on `NODE_ENV`. This allows you to have production builds (with `NODE_ENV=production`) running in a staging environment while still using test Stripe products.

## Product and Price IDs

### Test/Staging Products

**Tribox** (Product ID: `prod_TM6BuovMVYmvOi`)
- One-Time: `price_1SPNylPHcfaTMcXVYNdZmwyr`
- 3-Month: `price_1SPNylPHcfaTMcXVuBDzNisv`
- 6-Month: `price_1SPNylPHcfaTMcXVjwG96huA`

**Pentabox** (Product ID: `prod_TM6Ewd4IodwK7K`)
- One-Time: `price_1SPO1rPHcfaTMcXVED4Qh7Ke`
- 3-Month: `price_1SPO1rPHcfaTMcXV2beAl1mz`
- 6-Month: `price_1SPO1rPHcfaTMcXVRln9vxEb`

**Septabox** (Product ID: `prod_TM6FUZBVFo0n6E`)
- One-Time: `price_1SPO34PHcfaTMcXVLcVfXEOB`
- 3-Month: `price_1SPO34PHcfaTMcXV94kgC5mV`
- 6-Month: `price_1SPO34PHcfaTMcXVMmsLx6rM`

### Production Products

**Tribox** (Product ID: `prod_TM9wgCfSL48Jcj`)
- One-Time: `price_1SPRcoPHcfaTMcXV1HGoq256`
- 3-Month: `price_1SPRcoPHcfaTMcXVpGTDHowZ`
- 6-Month: `price_1SPRcoPHcfaTMcXVLjhUj2FL`

**Pentabox** (Product ID: `prod_TM9wyhIJJTBgOU`)
- One-Time: `price_1SPRcmPHcfaTMcXVwGVCXcHd`
- 3-Month: `price_1SPRcmPHcfaTMcXVN6PKQkIT`
- 6-Month: `price_1SPRcmPHcfaTMcXVYmbw6pW8`

**Septabox** (Product ID: `prod_TM9w4ihHR06Spv`)
- One-Time: `price_1SPRchPHcfaTMcXV9Dd9J5PR`
- 3-Month: `price_1SPRchPHcfaTMcXVm9uH7qtk`
- 6-Month: `price_1SPRchPHcfaTMcXV4mpb5FFO`

## Deployment Setup

### Staging Environment

1. Use test Stripe API keys:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_test_...
   ```

2. Set Stripe environment:
   ```bash
   NEXT_PUBLIC_STRIPE_ENV=test
   ```

### Production Environment

1. Use production Stripe API keys:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   ```

2. Set Stripe environment:
   ```bash
   NEXT_PUBLIC_STRIPE_ENV=production
   ```

## Usage in Code

### Get Product ID
```typescript
import { getStripeProductId } from '@/lib/stripeProducts';

const productId = getStripeProductId('tribox');
// Returns test or production product ID based on environment
```

### Get Price ID
```typescript
import { getStripePriceId } from '@/lib/stripeProducts';

const priceId = getStripePriceId('tribox', 'one-time');
// Returns test or production price ID based on environment
```

### Get All Product/Price Maps
```typescript
import { getProductMap, getPriceMap } from '@/lib/stripeProducts';

const products = getProductMap();
const prices = getPriceMap();
```

### Debug Environment Info
```typescript
import { getStripeEnvironmentInfo } from '@/lib/stripeProducts';

const info = getStripeEnvironmentInfo();
console.log(info);
// {
//   isProduction: false,
//   nodeEnv: 'development',
//   stripeEnv: 'test',
//   config: 'TEST'
// }
```

## Testing

### Verify Environment Configuration

1. Check which environment is active:
   ```typescript
   import { getStripeEnvironmentInfo } from '@/lib/stripeProducts';
   console.log(getStripeEnvironmentInfo());
   ```

2. Verify product IDs match expected environment:
   - Test mode: IDs start with `prod_TM6...` and `price_1SPN...` or `price_1SPO...`
   - Production mode: IDs start with `prod_TM9...` and `price_1SPRc...`

### Test Checkout Flow

1. **Staging**: Use Stripe test cards (e.g., `4242 4242 4242 4242`)
2. **Production**: Use real payment methods (will charge actual money)

## Updating Product IDs

If you need to update product or price IDs:

1. Edit `src/lib/stripeProducts.ts`
2. Update the appropriate configuration object (`TEST_CONFIG` or `PRODUCTION_CONFIG`)
3. Redeploy the application

```typescript
// Example: Update production Tribox price
const PRODUCTION_CONFIG: StripeProductConfig = {
  tribox: {
    productId: 'prod_NEW_ID',
    prices: {
      'one-time': 'price_NEW_ONE_TIME_ID',
      '3-months': 'price_NEW_3M_ID',
      '6-months': 'price_NEW_6M_ID',
    },
  },
  // ... other products
};
```

## Important Notes

1. **Environment Variable Prefix**: `NEXT_PUBLIC_STRIPE_ENV` is prefixed with `NEXT_PUBLIC_` because it needs to be accessible in both client and server code.

2. **Build Time vs Runtime**: Next.js bakes environment variables into the build. For different environments, ensure you rebuild with the correct environment variables.

3. **Webhook Configuration**: Remember to configure separate webhooks for test and production environments with their respective webhook secrets.

4. **API Keys**: Always use matching API keys and product IDs. Don't mix test API keys with production product IDs or vice versa.

## Troubleshooting

### Wrong Products Being Used

1. Check environment variables:
   ```bash
   echo $NEXT_PUBLIC_STRIPE_ENV
   ```

2. Verify in browser console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_STRIPE_ENV);
   ```

3. Clear `.next` directory and rebuild:
   ```bash
   rm -rf .next
   npm run build
   ```

### Invalid Product/Price IDs

- Verify IDs in Stripe Dashboard match those in `stripeProducts.ts`
- Ensure you're using the correct Stripe account (test vs live)
- Check that all price IDs belong to the correct product

## Security Considerations

- Never commit `.env.local` or `.env.production` files
- Keep production Stripe keys secure and restricted
- Use separate Stripe accounts or restricted API keys for different environments
- Regularly rotate webhook secrets
