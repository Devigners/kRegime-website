export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  steps: string[];
  image: string;
  stepCount: 3 | 5 | 7;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    skinType: string;
    skinConcerns: string[];
    preferences: Record<string, string | number | boolean>;
  };
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
  customizedRecommendations: string;
  brandsUsed: string;
  additionalComments: string;
}
