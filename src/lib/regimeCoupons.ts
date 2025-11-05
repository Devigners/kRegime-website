import { stripe } from './stripe';

export type SubscriptionType = 'one-time' | '3-months' | '6-months';

interface RegimeCouponData {
  regimeId: string;
  regimeName: string;
  subscriptionType: SubscriptionType;
  discount: number;
  discountReason?: string | null;
}

/**
 * Create or update a Stripe coupon for regime-specific discounts
 */
export async function createOrUpdateRegimeCoupon(
  data: RegimeCouponData,
  existingCouponId?: string | null
): Promise<string | null> {
  const { regimeId, regimeName, subscriptionType, discount, discountReason } = data;

  // If no discount, return null (no coupon needed)
  if (!discount || discount <= 0) {
    return null;
  }

  // Generate coupon name: e.g., "TRIBOX_ONE_TIME_10"
  const couponName = `${regimeName.toUpperCase().replace(/\s+/g, '_')}_${subscriptionType.toUpperCase().replace(/-/g, '_')}_${discount}`;

  try {
    // If existing coupon, delete it first (Stripe coupons are immutable)
    if (existingCouponId) {
      try {
        await stripe.coupons.del(existingCouponId);
      } catch (error) {
        console.error('Error deleting existing regime coupon:', error);
        // Continue even if deletion fails
      }
    }

    // Create new Stripe coupon
    const couponConfig: {
      name: string;
      percent_off: number;
      duration: 'forever';
      currency: string;
      metadata: {
        source: string;
        regime_id: string;
        regime_name: string;
        subscription_type: string;
        discount_reason?: string;
      };
    } = {
      name: couponName,
      percent_off: discount,
      duration: 'forever',
      currency: 'aed',
      metadata: {
        source: 'kregime_regime_discount',
        regime_id: regimeId,
        regime_name: regimeName,
        subscription_type: subscriptionType,
      }
    };

    if (discountReason) {
      couponConfig.metadata.discount_reason = discountReason;
    }

    const stripeCoupon = await stripe.coupons.create(couponConfig);
    return stripeCoupon.id;
  } catch (error) {
    console.error('Error creating regime Stripe coupon:', error);
    throw error;
  }
}

/**
 * Delete a Stripe coupon for regime discount
 */
export async function deleteRegimeCoupon(couponId: string): Promise<void> {
  try {
    await stripe.coupons.del(couponId);
  } catch (error) {
    console.error('Error deleting regime Stripe coupon:', error);
    // Don't throw - allow the operation to continue
  }
}

/**
 * Get the appropriate coupon ID based on regime and subscription type
 */
export function getRegimeCouponId(
  regime: {
    stripeCouponIdOneTime?: string | null;
    stripeCouponId3Months?: string | null;
    stripeCouponId6Months?: string | null;
  },
  subscriptionType: SubscriptionType
): string | null {
  switch (subscriptionType) {
    case 'one-time':
      return regime.stripeCouponIdOneTime || null;
    case '3-months':
      return regime.stripeCouponId3Months || null;
    case '6-months':
      return regime.stripeCouponId6Months || null;
    default:
      return null;
  }
}
