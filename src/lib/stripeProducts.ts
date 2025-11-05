import { SubscriptionType } from '@/types';

/**
 * Stripe Product and Price Configuration
 * 
 * This configuration supports both test (staging) and production environments.
 * The appropriate IDs are selected based on the NODE_ENV or a custom environment variable.
 */

interface ProductConfig {
  productId: string;
  prices: Record<SubscriptionType, string>;
}

interface StripeProductConfig {
  tribox: ProductConfig;
  pentabox: ProductConfig;
  septabox: ProductConfig;
}

// Test/Staging Products and Prices
const TEST_CONFIG: StripeProductConfig = {
  tribox: {
    productId: 'prod_TM6BuovMVYmvOi',
    prices: {
      'one-time': 'price_1SPNylPHcfaTMcXVYNdZmwyr',
      '3-months': 'price_1SPNylPHcfaTMcXVuBDzNisv',
      '6-months': 'price_1SPNylPHcfaTMcXVjwG96huA',
    },
  },
  pentabox: {
    productId: 'prod_TM6Ewd4IodwK7K',
    prices: {
      'one-time': 'price_1SPO1rPHcfaTMcXVED4Qh7Ke',
      '3-months': 'price_1SPO1rPHcfaTMcXV2beAl1mz',
      '6-months': 'price_1SPO1rPHcfaTMcXVRln9vxEb',
    },
  },
  septabox: {
    productId: 'prod_TM6FUZBVFo0n6E',
    prices: {
      'one-time': 'price_1SPO34PHcfaTMcXVLcVfXEOB',
      '3-months': 'price_1SPO34PHcfaTMcXV94kgC5mV',
      '6-months': 'price_1SPO34PHcfaTMcXVMmsLx6rM',
    },
  },
};

// Production Products and Prices
// Note: These are monthly recurring subscriptions in Stripe
// The prices correspond to different commitment periods:
// - 3-months: Higher monthly price (shorter commitment)
// - 6-months: Lower monthly price (longer commitment)
const PRODUCTION_CONFIG: StripeProductConfig = {
  tribox: {
    productId: 'prod_TM9wgCfSL48Jcj',
    prices: {
      'one-time': 'price_1SPRcoPHcfaTMcXV1HGoq256', // 349.00 AED one-time
      '3-months': 'price_1SPRcoPHcfaTMcXVpGTDHowZ', // 319.00 AED/month (3-month commitment)
      '6-months': 'price_1SPRcoPHcfaTMcXVLjhUj2FL', // 299.00 AED/month (6-month commitment)
    },
  },
  pentabox: {
    productId: 'prod_TM9wyhIJJTBgOU',
    prices: {
      'one-time': 'price_1SPRcmPHcfaTMcXVwGVCXcHd', // 549.00 AED one-time
      '3-months': 'price_1SPRcmPHcfaTMcXVN6PKQkIT', // 519.00 AED/month (3-month commitment)
      '6-months': 'price_1SPRcmPHcfaTMcXVYmbw6pW8', // 499.00 AED/month (6-month commitment)
    },
  },
  septabox: {
    productId: 'prod_TM9w4ihHR06Spv',
    prices: {
      'one-time': 'price_1SPRchPHcfaTMcXV9Dd9J5PR', // 749.00 AED one-time
      '3-months': 'price_1SPRchPHcfaTMcXVm9uH7qtk', // 719.00 AED/month (3-month commitment)
      '6-months': 'price_1SPRchPHcfaTMcXV4mpb5FFO', // 699.00 AED/month (6-month commitment)
    },
  },
};

/**
 * Determine if we're in production environment
 * You can customize this logic based on your deployment setup
 */
function isProduction(): boolean {
  // Use a custom environment variable (recommended)
  // This allows you to have production builds in staging
  if (process.env.NEXT_PUBLIC_STRIPE_ENV === 'production') {
    return true;
  }
  
  return false;
}

/**
 * Get the current Stripe configuration based on environment
 */
function getStripeConfig(): StripeProductConfig {
  return isProduction() ? PRODUCTION_CONFIG : TEST_CONFIG;
}

/**
 * Get Stripe product ID for a regime
 */
export function getStripeProductId(regimeId: string): string | null {
  const config = getStripeConfig();
  const regime = config[regimeId as keyof StripeProductConfig];
  return regime?.productId || null;
}

/**
 * Get Stripe price ID for a regime and subscription type
 */
export function getStripePriceId(
  regimeId: string,
  subscriptionType: SubscriptionType
): string | null {
  const config = getStripeConfig();
  const regime = config[regimeId as keyof StripeProductConfig];
  return regime?.prices[subscriptionType] || null;
}

/**
 * Get all product IDs mapped by regime ID
 */
export function getProductMap(): Record<string, string> {
  const config = getStripeConfig();
  return {
    tribox: config.tribox.productId,
    pentabox: config.pentabox.productId,
    septabox: config.septabox.productId,
  };
}

/**
 * Get all price IDs mapped by regime ID and subscription type
 */
export function getPriceMap(): Record<string, Record<SubscriptionType, string>> {
  const config = getStripeConfig();
  return {
    tribox: config.tribox.prices,
    pentabox: config.pentabox.prices,
    septabox: config.septabox.prices,
  };
}

/**
 * Get current environment info for debugging
 */
export function getStripeEnvironmentInfo() {
  return {
    isProduction: isProduction(),
    nodeEnv: process.env.NODE_ENV,
    stripeEnv: process.env.NEXT_PUBLIC_STRIPE_ENV,
    config: isProduction() ? 'PRODUCTION' : 'TEST',
  };
}
