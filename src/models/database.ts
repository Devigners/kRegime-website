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

// Frontend compatible interfaces
export interface Regime {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
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
  userDetails: {
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
  shippingAddress: {
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
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
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
    steps: row.steps,
    images: Array.isArray(row.image) ? row.image : (row.image ? [row.image] : []),
    stepCount: row.step_count,
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
    steps: regime.steps,
    image: regime.images,
    step_count: regime.stepCount,
    is_active: regime.isActive,
  };
}

export function convertOrderRowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    regimeId: row.regime_id,
    userDetails: {
      age: row.user_details.age,
      gender: row.user_details.gender,
      skinType: row.user_details.skin_type,
      skinConcerns: row.user_details.skin_concerns,
      complexion: row.user_details.complexion,
      allergies: row.user_details.allergies,
      skincareSteps: row.user_details.skincare_steps,
      koreanSkincareExperience: row.user_details.korean_skincare_experience,
      koreanSkincareAttraction: row.user_details.korean_skincare_attraction,
      skincareGoal: row.user_details.skincare_goal,
      dailyProductCount: row.user_details.daily_product_count,
      routineRegularity: row.user_details.routine_regularity,
      purchaseLocation: row.user_details.purchase_location,
      budget: row.user_details.budget,
      customizedRecommendations: row.user_details.customized_recommendations,
      brandsUsed: row.user_details.brands_used,
      additionalComments: row.user_details.additional_comments,
    },
    contactInfo: {
      email: row.contact_info.email,
      phoneNumber: row.contact_info.phone_number,
    },
    shippingAddress: {
      firstName: row.shipping_address.first_name,
      lastName: row.shipping_address.last_name,
      address: row.shipping_address.address,
      city: row.shipping_address.city,
      postalCode: row.shipping_address.postal_code,
    },
    quantity: row.quantity,
    totalAmount: row.total_amount,
    finalAmount: row.final_amount,
    subscriptionType: row.subscription_type || 'one-time',
    status: row.status,
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
      age: order.userDetails.age,
      gender: order.userDetails.gender,
      skin_type: order.userDetails.skinType,
      skin_concerns: order.userDetails.skinConcerns,
      complexion: order.userDetails.complexion,
      allergies: order.userDetails.allergies,
      skincare_steps: order.userDetails.skincareSteps,
      korean_skincare_experience: order.userDetails.koreanSkincareExperience,
      korean_skincare_attraction: order.userDetails.koreanSkincareAttraction,
      skincare_goal: order.userDetails.skincareGoal,
      daily_product_count: order.userDetails.dailyProductCount,
      routine_regularity: order.userDetails.routineRegularity,
      purchase_location: order.userDetails.purchaseLocation,
      budget: order.userDetails.budget,
      customized_recommendations: order.userDetails.customizedRecommendations,
      brands_used: order.userDetails.brandsUsed,
      additional_comments: order.userDetails.additionalComments,
    },
    contact_info: {
      email: order.contactInfo.email,
      phone_number: order.contactInfo.phoneNumber,
    },
    shipping_address: {
      first_name: order.shippingAddress.firstName,
      last_name: order.shippingAddress.lastName,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      postal_code: order.shippingAddress.postalCode,
    },
    quantity: order.quantity,
    total_amount: order.totalAmount,
    final_amount: order.finalAmount,
    subscription_type: order.subscriptionType,
    status: order.status,
  };
}

export function convertReviewRowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    avatar: row.avatar,
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
    source: row.source,
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
