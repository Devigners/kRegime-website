import { Database } from '@/types/database';

// Supabase database types
export type RegimeRow = Database['public']['Tables']['regimes']['Row'];
export type RegimeInsert = Database['public']['Tables']['regimes']['Insert'];
export type RegimeUpdate = Database['public']['Tables']['regimes']['Update'];

export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type ReviewRow = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export type SubscriberRow = Database['public']['Tables']['subscribers']['Row'];
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert'];
export type SubscriberUpdate = Database['public']['Tables']['subscribers']['Update'];

export type DiscountCodeRow = Database['public']['Tables']['discount_codes']['Row'];
export type DiscountCodeInsert = Database['public']['Tables']['discount_codes']['Insert'];
export type DiscountCodeUpdate = Database['public']['Tables']['discount_codes']['Update'];

// Frontend compatible interfaces
export interface Regime {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
  discountOneTime: number;
  discount3Months: number;
  discount6Months: number;
  discountReasonOneTime: string | null;
  discountReason3Months: string | null;
  discountReason6Months: string | null;
  steps: string[];
  images: string[];
  stepCount: 3 | 5 | 7;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  regimeId: string;
  userDetails?: {
    age: string;
    gender: string;
    skinType: string;
    skinConcerns: string[];
    complexion: string;
    allergies: string;
    skincareSteps: string[];
    koreanSkincareExperience: string;
    koreanSkincareAttraction: string[];
    skincareGoal: string[];
    dailyProductCount: string;
    routineRegularity: string;
    purchaseLocation: string;
    budget: string;
    customizedRecommendations: string;
    brandsUsed: string;
    additionalComments: string;
  };
  contactInfo: {
    email: string;
    phoneNumber?: string;
  };
  shippingAddress?: {
    firstName: string;
    lastName?: string;
    address: string;
    city: string;
    postalCode: string;
  };
  quantity: number;
  totalAmount: number;
  finalAmount: number;
  subscriptionType: 'one-time' | '3-months' | '6-months';
  stripeSessionId?: string | null;
  discountCodeId?: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  isGift?: boolean;
  giftToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountCode {
  id: string;
  code: string;
  percentageOff: number;
  isActive: boolean;
  isRecurring: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  source: 'footer' | 'coming_soon' | 'checkout' | 'manual';
  isActive: boolean;
  subscribedAt: Date;
  updatedAt: Date;
}

// Helper functions to convert between Supabase row format and frontend format
export function convertRegimeRowToRegime(row: RegimeRow): Regime {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceOneTime: row.price_one_time,
    price3Months: row.price_3_months,
    price6Months: row.price_6_months,
    discountOneTime: row.discount_one_time || 0,
    discount3Months: row.discount_3_months || 0,
    discount6Months: row.discount_6_months || 0,
    discountReasonOneTime: row.discount_reason_one_time || null,
    discountReason3Months: row.discount_reason_3_months || null,
    discountReason6Months: row.discount_reason_6_months || null,
    steps: row.steps,
    images: Array.isArray(row.image) ? row.image : (row.image ? [row.image] : []),
    stepCount: row.step_count as 3 | 5 | 7,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function convertRegimeToRegimeInsert(
  regime: Omit<Regime, 'createdAt' | 'updatedAt'>
): RegimeInsert {
  return {
    id: regime.id,
    name: regime.name,
    description: regime.description,
    price: regime.priceOneTime, // Use one-time price for legacy compatibility
    price_one_time: regime.priceOneTime,
    price_3_months: regime.price3Months,
    price_6_months: regime.price6Months,
    discount_one_time: regime.discountOneTime || 0,
    discount_3_months: regime.discount3Months || 0,
    discount_6_months: regime.discount6Months || 0,
    discount_reason_one_time: regime.discountReasonOneTime || null,
    discount_reason_3_months: regime.discountReason3Months || null,
    discount_reason_6_months: regime.discountReason6Months || null,
    steps: regime.steps,
    image: regime.images,
    step_count: regime.stepCount,
    is_active: regime.isActive,
  };
}

export function convertOrderRowToOrder(row: OrderRow): Order {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userDetails = row.user_details as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contactInfo = row.contact_info as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingAddress = row.shipping_address as any;
  
  return {
    id: row.id,
    regimeId: row.regime_id,
    userDetails: {
      age: userDetails?.age || '',
      gender: userDetails?.gender || '',
      skinType: userDetails?.skin_type || '',
      skinConcerns: userDetails?.skin_concerns || [],
      complexion: userDetails?.complexion || '',
      allergies: userDetails?.allergies || '',
      skincareSteps: userDetails?.skincare_steps || [],
      koreanSkincareExperience: userDetails?.korean_skincare_experience || '',
      koreanSkincareAttraction: userDetails?.korean_skincare_attraction || [],
      skincareGoal: userDetails?.skincare_goal || [],
      dailyProductCount: userDetails?.daily_product_count || '',
      routineRegularity: userDetails?.routine_regularity || '',
      purchaseLocation: userDetails?.purchase_location || '',
      budget: userDetails?.budget || '',
      customizedRecommendations: userDetails?.customized_recommendations || '',
      brandsUsed: userDetails?.brands_used || '',
      additionalComments: userDetails?.additional_comments || '',
    },
    contactInfo: {
      email: contactInfo?.email || '',
      phoneNumber: contactInfo?.phone_number,
    },
    shippingAddress: {
      firstName: shippingAddress?.first_name || '',
      lastName: shippingAddress?.last_name,
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      postalCode: shippingAddress?.postal_code || '',
    },
    quantity: row.quantity,
    totalAmount: row.total_amount,
    finalAmount: row.final_amount,
    subscriptionType: (row.subscription_type || 'one-time') as 'one-time' | '3-months' | '6-months',
    stripeSessionId: row.stripe_session_id,
    discountCodeId: row.discount_code_id,
    status: row.status as 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled',
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function convertOrderToOrderInsert(
  order: Omit<Order, 'createdAt' | 'updatedAt'>
): OrderInsert {
  return {
    id: order.id,
    regime_id: order.regimeId,
    user_details: {
      age: order.userDetails?.age || '',
      gender: order.userDetails?.gender || '',
      skin_type: order.userDetails?.skinType || '',
      skin_concerns: order.userDetails?.skinConcerns || [],
      complexion: order.userDetails?.complexion || '',
      allergies: order.userDetails?.allergies || '',
      skincare_steps: order.userDetails?.skincareSteps || [],
      korean_skincare_experience: order.userDetails?.koreanSkincareExperience || '',
      korean_skincare_attraction: order.userDetails?.koreanSkincareAttraction || [],
      skincare_goal: order.userDetails?.skincareGoal || [],
      daily_product_count: order.userDetails?.dailyProductCount || '',
      routine_regularity: order.userDetails?.routineRegularity || '',
      purchase_location: order.userDetails?.purchaseLocation || '',
      budget: order.userDetails?.budget || '',
      customized_recommendations: order.userDetails?.customizedRecommendations || '',
      brands_used: order.userDetails?.brandsUsed || '',
      additional_comments: order.userDetails?.additionalComments || '',
    },
    contact_info: {
      email: order.contactInfo.email,
      phone_number: order.contactInfo.phoneNumber,
    },
    shipping_address: {
      first_name: order.shippingAddress?.firstName || '',
      last_name: order.shippingAddress?.lastName,
      address: order.shippingAddress?.address || '',
      city: order.shippingAddress?.city || '',
      postal_code: order.shippingAddress?.postalCode || '',
    },
    quantity: order.quantity,
    total_amount: order.totalAmount,
    final_amount: order.finalAmount,
    subscription_type: order.subscriptionType,
    stripe_session_id: order.stripeSessionId,
    discount_code_id: order.discountCodeId,
    status: order.status,
  };
}

export function convertReviewRowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    avatar: row.avatar || undefined,
    isApproved: row.is_approved,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function convertReviewToReviewInsert(
  review: Omit<Review, 'createdAt' | 'updatedAt'>
): ReviewInsert {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    avatar: review.avatar,
    is_approved: review.isApproved,
  };
}

export function convertSubscriberRowToSubscriber(row: SubscriberRow): Subscriber {
  return {
    id: row.id,
    email: row.email,
    source: row.source as 'footer' | 'coming_soon' | 'checkout' | 'manual',
    isActive: row.is_active,
    subscribedAt: new Date(row.subscribed_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function convertSubscriberToSubscriberInsert(
  subscriber: Omit<Subscriber, 'subscribedAt' | 'updatedAt'>
): SubscriberInsert {
  return {
    id: subscriber.id,
    email: subscriber.email,
    source: subscriber.source,
    is_active: subscriber.isActive,
  };
}

export function convertDiscountCodeRowToDiscountCode(row: DiscountCodeRow): DiscountCode {
  return {
    id: row.id,
    code: row.code,
    percentageOff: row.percentage_off,
    isActive: row.is_active,
    isRecurring: row.is_recurring,
    usageCount: row.usage_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function convertDiscountCodeToDiscountCodeInsert(
  discountCode: Omit<DiscountCode, 'createdAt' | 'updatedAt'>
): DiscountCodeInsert {
  return {
    id: discountCode.id,
    code: discountCode.code,
    percentage_off: discountCode.percentageOff,
    is_active: discountCode.isActive,
    is_recurring: discountCode.isRecurring,
    usage_count: discountCode.usageCount,
  };
}
