export interface Product {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
  discountOneTime?: number;
  discount3Months?: number;
  discount6Months?: number;
  discountReasonOneTime?: string | null;
  discountReason3Months?: string | null;
  discountReason6Months?: string | null;
  steps: string[];
  images: string[];
  stepCount: 3 | 5 | 7;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subscriptionType?: 'one-time' | '3-months' | '6-months';
  customization?: {
    skinType: string;
    skinConcerns: string[];
    preferences: Record<string, string | number | boolean>;
  };
}

export type SubscriptionType = 'one-time' | '3-months' | '6-months';

export interface SubscriptionPricing {
  oneTime: number;
  threeMonths: number;
  sixMonths: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface FormData {
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
  brandsUsed: string;
  additionalComments: string;
}

export interface Order {
  id: string;
  regime_id: string;
  quantity: number;
  total_amount: number;
  final_amount: number;
  status: string;
  subscription_type: string | null;
  contact_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  user_details: FormData;
  stripe_session_id: string | null;
  discount_code_id: string | null;
  is_gift: boolean | null;
  gift_giver_name: string | null;
  gift_giver_email: string | null;
  gift_giver_phone: string | null;
  gift_token: string | null;
  gift_claimed: boolean | null;
  gift_claimed_at: string | null;
  gift_recipient_name: string | null;
  gift_recipient_email: string | null;
  created_at: string;
  updated_at: string;
}
