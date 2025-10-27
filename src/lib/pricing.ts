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
