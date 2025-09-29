export interface Database {
  public: {
    Tables: {
      regimes: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          steps: string[];
          image: string[];
          step_count: 3 | 5 | 7;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          price: number;
          steps: string[];
          image: string[];
          step_count: 3 | 5 | 7;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          steps?: string[];
          image?: string[];
          step_count?: 3 | 5 | 7;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          regime_id: string;
          user_details: {
            age: string;
            gender: string;
            skin_type: string;
            skin_concerns: string[];
            complexion: string;
            allergies: string;
            skincare_steps: string[];
            korean_skincare_experience: string;
            korean_skincare_attraction: string[];
            skincare_goal: string[];
            daily_product_count: string;
            routine_regularity: string;
            purchase_location: string;
            budget: string;
            customized_recommendations: string;
            brands_used: string;
            additional_comments: string;
          };
          contact_info: {
            email: string;
            phone_number?: string;
          };
          shipping_address: {
            first_name: string;
            last_name?: string;
            address: string;
            city: string;
            postal_code: string;
          };
          quantity: number;
          total_amount: number;
          final_amount: number;
          status: 'pending' | 'processing' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          regime_id: string;
          user_details: {
            age: string;
            gender: string;
            skin_type: string;
            skin_concerns: string[];
            complexion: string;
            allergies: string;
            skincare_steps: string[];
            korean_skincare_experience: string;
            korean_skincare_attraction: string[];
            skincare_goal: string[];
            daily_product_count: string;
            routine_regularity: string;
            purchase_location: string;
            budget: string;
            customized_recommendations: string;
            brands_used: string;
            additional_comments: string;
          };
          contact_info: {
            email: string;
            phone_number?: string;
          };
          shipping_address: {
            first_name: string;
            last_name?: string;
            address: string;
            city: string;
            postal_code: string;
          };
          quantity: number;
          total_amount: number;
          final_amount: number;
          status?: 'pending' | 'processing' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          regime_id?: string;
          user_details?: {
            age?: string;
            gender?: string;
            skin_type?: string;
            skin_concerns?: string[];
            complexion?: string;
            allergies?: string;
            skincare_steps?: string[];
            korean_skincare_experience?: string;
            korean_skincare_attraction?: string[];
            skincare_goal?: string[];
            daily_product_count?: string;
            routine_regularity?: string;
            purchase_location?: string;
            budget?: string;
            customized_recommendations?: string;
            brands_used?: string;
            additional_comments?: string;
          };
          contact_info?: {
            email?: string;
            phone_number?: string;
          };
          shipping_address?: {
            first_name?: string;
            last_name?: string;
            address?: string;
            city?: string;
            postal_code?: string;
          };
          quantity?: number;
          total_amount?: number;
          final_amount?: number;
          status?: 'pending' | 'processing' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          name: string;
          rating: number;
          comment: string;
          avatar?: string;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          rating: number;
          comment: string;
          avatar?: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rating?: number;
          comment?: string;
          avatar?: string;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
