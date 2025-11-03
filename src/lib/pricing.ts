import { Regime } from '@/models/database';
import { Product, SubscriptionType } from '@/types';

export interface PriceInfo {
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  discountReason: string | null;
  hasDiscount: boolean;
  savingsAmount: number;
}

export interface DiscountCodeInfo {
  id: string;
  code: string;
  percentageOff: number;
}

export interface PriceWithDiscountCode extends PriceInfo {
  discountCodeApplied: boolean;
  discountCodePercentage?: number;
  finalPriceWithCode?: number;
  additionalSavingsFromCode?: number;
}

/**
 * Calculate the discounted price for a regime or product based on subscription type
 */
export function calculatePrice(item: Regime | Product, subscriptionType: SubscriptionType): PriceInfo {
  let originalPrice: number;
  let discount: number;
  let discountReason: string | null;

  switch (subscriptionType) {
    case '3-months':
      originalPrice = item.price3Months;
      discount = item.discount3Months || 0;
      discountReason = item.discountReason3Months || null;
      break;
    case '6-months':
      originalPrice = item.price6Months;
      discount = item.discount6Months || 0;
      discountReason = item.discountReason6Months || null;
      break;
    default:
      originalPrice = item.priceOneTime;
      discount = item.discountOneTime || 0;
      discountReason = item.discountReasonOneTime || null;
  }

  const hasDiscount = discount > 0;
  const savingsAmount = hasDiscount ? (originalPrice * discount) / 100 : 0;
  const discountedPrice = hasDiscount ? originalPrice - savingsAmount : originalPrice;

  return {
    originalPrice,
    discountedPrice: Math.round(discountedPrice * 100) / 100, // Round to 2 decimal places
    discount,
    discountReason,
    hasDiscount,
    savingsAmount: Math.round(savingsAmount * 100) / 100, // Round to 2 decimal places
  };
}

/**
 * Format price for display with AED currency
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Get all pricing information for all subscription types
 */
export function getAllPricing(item: Regime | Product) {
  return {
    oneTime: calculatePrice(item, 'one-time'),
    threeMonths: calculatePrice(item, '3-months'),
    sixMonths: calculatePrice(item, '6-months'),
  };
}

/**
 * Apply discount code to a price
 * Note: Discount codes cannot be stacked with regime discounts
 */
export function applyDiscountCode(
  priceInfo: PriceInfo,
  discountCode?: DiscountCodeInfo
): PriceWithDiscountCode {
  // If there's already a regime discount, don't apply discount code
  if (priceInfo.hasDiscount) {
    return {
      ...priceInfo,
      discountCodeApplied: false,
    };
  }

  // If no discount code provided, return original price info
  if (!discountCode) {
    return {
      ...priceInfo,
      discountCodeApplied: false,
    };
  }

  // Apply discount code
  const additionalSavingsFromCode = (priceInfo.originalPrice * discountCode.percentageOff) / 100;
  const finalPriceWithCode = priceInfo.originalPrice - additionalSavingsFromCode;

  return {
    ...priceInfo,
    discountCodeApplied: true,
    discountCodePercentage: discountCode.percentageOff,
    finalPriceWithCode: Math.round(finalPriceWithCode * 100) / 100,
    additionalSavingsFromCode: Math.round(additionalSavingsFromCode * 100) / 100,
    hasDiscount: true,
    discount: discountCode.percentageOff,
    discountReason: `Discount Code: ${discountCode.code}`,
    savingsAmount: Math.round(additionalSavingsFromCode * 100) / 100,
    discountedPrice: Math.round(finalPriceWithCode * 100) / 100,
  };
}

/**
 * Check if a regime/product has any active discounts
 */
export function hasRegimeDiscount(item: Regime | Product, subscriptionType: SubscriptionType): boolean {
  const priceInfo = calculatePrice(item, subscriptionType);
  return priceInfo.hasDiscount;
}
