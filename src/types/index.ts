export interface Product {
  id: string;
  name: string;
  description: string;
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
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
