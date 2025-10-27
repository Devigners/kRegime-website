-- Insert 10 dummy orders with diverse data
-- Run this SQL in your Supabase SQL Editor to populate test data

INSERT INTO orders (
  id,
  regime_id,
  user_details,
  contact_info,
  shipping_address,
  quantity,
  total_amount,
  final_amount,
  subscription_type,
  status
) VALUES 
-- Order 1: TRIBOX - Pending
(
  'dummy-order-001',
  'tribox',
  '{
    "age": "28",
    "gender": "female",
    "skin_type": "oily",
    "skin_concerns": ["acne", "large pores"],
    "complexion": "fair",
    "allergies": "None",
    "skincare_steps": ["cleanser", "toner", "moisturizer"],
    "korean_skincare_experience": "beginner",
    "korean_skincare_attraction": ["natural ingredients"],
    "skincare_goal": ["clear skin"],
    "daily_product_count": "3-5",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "200-400",
    "customized_recommendations": "yes",
    "brands_used": "Cerave, Neutrogena",
    "additional_comments": "Looking for oil-control products"
  }',
  '{
    "email": "sarah.johnson@example.com",
    "phone_number": "+971501234001"
  }',
  '{
    "first_name": "Sarah",
    "last_name": "Johnson",
    "address": "Building 12, Palm Jumeirah",
    "city": "Dubai",
    "postal_code": "12001"
  }',
  1,
  299,
  299,
  'one-time',
  'pending'
),
-- Order 2: PENTABOX - Processing
(
  'dummy-order-002',
  'pentabox',
  '{
    "age": "32",
    "gender": "male",
    "skin_type": "dry",
    "skin_concerns": ["dryness", "fine lines"],
    "complexion": "medium",
    "allergies": "Fragrance",
    "skincare_steps": ["cleanser", "moisturizer"],
    "korean_skincare_experience": "intermediate",
    "korean_skincare_attraction": ["anti-aging", "hydration"],
    "skincare_goal": ["hydration", "anti-aging"],
    "daily_product_count": "3-5",
    "routine_regularity": "most days",
    "purchase_location": "both",
    "budget": "400-600",
    "customized_recommendations": "yes",
    "brands_used": "Kiehl''s, La Roche-Posay",
    "additional_comments": "Prefer fragrance-free products"
  }',
  '{
    "email": "ahmed.hassan@example.com",
    "phone_number": "+971501234002"
  }',
  '{
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "address": "Marina Heights Tower, Dubai Marina",
    "city": "Dubai",
    "postal_code": "12002"
  }',
  1,
  449,
  449,
  '3-months',
  'processing'
),
-- Order 3: SEPTABOX - Completed
(
  'dummy-order-003',
  'septabox',
  '{
    "age": "35",
    "gender": "female",
    "skin_type": "combination",
    "skin_concerns": ["pigmentation", "dullness"],
    "complexion": "dark",
    "allergies": "None",
    "skincare_steps": ["cleanser", "toner", "serum", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "advanced",
    "korean_skincare_attraction": ["glass skin", "brightening"],
    "skincare_goal": ["brightening", "even tone"],
    "daily_product_count": "7+",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "600+",
    "customized_recommendations": "yes",
    "brands_used": "SK-II, Sulwhasoo, Innisfree",
    "additional_comments": "Looking for brightening and anti-pigmentation products"
  }',
  '{
    "email": "fatima.ali@example.com",
    "phone_number": "+971501234003"
  }',
  '{
    "first_name": "Fatima",
    "last_name": "Ali",
    "address": "Emirates Hills Villa 45",
    "city": "Dubai",
    "postal_code": "12003"
  }',
  2,
  1198,
  1198,
  '6-months',
  'completed'
),
-- Order 4: TRIBOX - Cancelled
(
  'dummy-order-004',
  'tribox',
  '{
    "age": "22",
    "gender": "female",
    "skin_type": "sensitive",
    "skin_concerns": ["redness", "sensitivity"],
    "complexion": "fair",
    "allergies": "Alcohol, Essential oils",
    "skincare_steps": ["cleanser", "moisturizer"],
    "korean_skincare_experience": "beginner",
    "korean_skincare_attraction": ["gentle products"],
    "skincare_goal": ["calm skin", "hydration"],
    "daily_product_count": "3-5",
    "routine_regularity": "daily",
    "purchase_location": "retail",
    "budget": "200-400",
    "customized_recommendations": "yes",
    "brands_used": "Avene, Bioderma",
    "additional_comments": "Very sensitive skin, need hypoallergenic products"
  }',
  '{
    "email": "emma.white@example.com",
    "phone_number": "+971501234004"
  }',
  '{
    "first_name": "Emma",
    "last_name": "White",
    "address": "JBR Sadaf Tower 5, Apt 1201",
    "city": "Dubai",
    "postal_code": "12004"
  }',
  1,
  269,
  269,
  '3-months',
  'cancelled'
),
-- Order 5: PENTABOX - Pending
(
  'dummy-order-005',
  'pentabox',
  '{
    "age": "29",
    "gender": "female",
    "skin_type": "normal",
    "skin_concerns": ["prevention", "maintenance"],
    "complexion": "medium",
    "allergies": "None",
    "skincare_steps": ["cleanser", "toner", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "intermediate",
    "korean_skincare_attraction": ["glass skin", "dewy look"],
    "skincare_goal": ["maintain healthy skin", "glow"],
    "daily_product_count": "5-7",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "400-600",
    "customized_recommendations": "yes",
    "brands_used": "Cosrx, Etude House",
    "additional_comments": "Love Korean skincare!"
  }',
  '{
    "email": "maryam.khan@example.com",
    "phone_number": "+971501234005"
  }',
  '{
    "first_name": "Maryam",
    "last_name": "Khan",
    "address": "Downtown Dubai, Boulevard Plaza",
    "city": "Dubai",
    "postal_code": "12005"
  }',
  1,
  479,
  479,
  'one-time',
  'pending'
),
-- Order 6: SEPTABOX - Processing
(
  'dummy-order-006',
  'septabox',
  '{
    "age": "40",
    "gender": "female",
    "skin_type": "dry",
    "skin_concerns": ["wrinkles", "fine lines", "sagging"],
    "complexion": "fair",
    "allergies": "None",
    "skincare_steps": ["cleanser", "toner", "essence", "serum", "eye cream", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "advanced",
    "korean_skincare_attraction": ["anti-aging", "luxury ingredients"],
    "skincare_goal": ["anti-aging", "firmness"],
    "daily_product_count": "7+",
    "routine_regularity": "daily",
    "purchase_location": "both",
    "budget": "600+",
    "customized_recommendations": "yes",
    "brands_used": "Sulwhasoo, The History of Whoo",
    "additional_comments": "Interested in premium anti-aging products"
  }',
  '{
    "email": "lisa.anderson@example.com",
    "phone_number": "+971501234006"
  }',
  '{
    "first_name": "Lisa",
    "last_name": "Anderson",
    "address": "Arabian Ranches Villa 202",
    "city": "Dubai",
    "postal_code": "12006"
  }',
  1,
  619,
  619,
  '3-months',
  'processing'
),
-- Order 7: TRIBOX - Completed
(
  'dummy-order-007',
  'tribox',
  '{
    "age": "24",
    "gender": "male",
    "skin_type": "oily",
    "skin_concerns": ["acne", "blackheads"],
    "complexion": "medium",
    "allergies": "None",
    "skincare_steps": ["cleanser", "moisturizer"],
    "korean_skincare_experience": "beginner",
    "korean_skincare_attraction": ["simple routine"],
    "skincare_goal": ["clear skin"],
    "daily_product_count": "1-3",
    "routine_regularity": "most days",
    "purchase_location": "retail",
    "budget": "200-400",
    "customized_recommendations": "yes",
    "brands_used": "None - New to skincare",
    "additional_comments": "First time trying a skincare routine"
  }',
  '{
    "email": "omar.malik@example.com",
    "phone_number": "+971501234007"
  }',
  '{
    "first_name": "Omar",
    "last_name": "Malik",
    "address": "Business Bay Executive Tower B",
    "city": "Dubai",
    "postal_code": "12007"
  }',
  1,
  299,
  299,
  'one-time',
  'completed'
),
-- Order 8: PENTABOX - Completed
(
  'dummy-order-008',
  'pentabox',
  '{
    "age": "31",
    "gender": "female",
    "skin_type": "combination",
    "skin_concerns": ["uneven texture", "enlarged pores"],
    "complexion": "medium",
    "allergies": "None",
    "skincare_steps": ["cleanser", "exfoliant", "toner", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "intermediate",
    "korean_skincare_attraction": ["texture improvement", "pore care"],
    "skincare_goal": ["smooth skin", "minimize pores"],
    "daily_product_count": "5-7",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "400-600",
    "customized_recommendations": "yes",
    "brands_used": "Paula''s Choice, Some By Mi",
    "additional_comments": "Interested in products with AHA/BHA"
  }',
  '{
    "email": "priya.sharma@example.com",
    "phone_number": "+971501234008"
  }',
  '{
    "first_name": "Priya",
    "last_name": "Sharma",
    "address": "Jumeirah Beach Residence Walk",
    "city": "Dubai",
    "postal_code": "12008"
  }',
  1,
  419,
  419,
  '6-months',
  'completed'
),
-- Order 9: SEPTABOX - Pending
(
  'dummy-order-009',
  'septabox',
  '{
    "age": "36",
    "gender": "female",
    "skin_type": "sensitive",
    "skin_concerns": ["rosacea", "redness", "dryness"],
    "complexion": "fair",
    "allergies": "Retinol, Strong acids",
    "skincare_steps": ["gentle cleanser", "calming toner", "serum", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "advanced",
    "korean_skincare_attraction": ["soothing ingredients", "barrier repair"],
    "skincare_goal": ["calm redness", "strengthen barrier"],
    "daily_product_count": "5-7",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "600+",
    "customized_recommendations": "yes",
    "brands_used": "Dr. Jart+, Klairs",
    "additional_comments": "Need products for rosacea-prone skin"
  }',
  '{
    "email": "natalie.brown@example.com",
    "phone_number": "+971501234009"
  }',
  '{
    "first_name": "Natalie",
    "last_name": "Brown",
    "address": "Dubai Hills Estate, Villa 78",
    "city": "Dubai",
    "postal_code": "12009"
  }',
  1,
  649,
  649,
  'one-time',
  'pending'
),
-- Order 10: TRIBOX - Processing
(
  'dummy-order-010',
  'tribox',
  '{
    "age": "27",
    "gender": "male",
    "skin_type": "normal",
    "skin_concerns": ["sun damage prevention"],
    "complexion": "medium",
    "allergies": "None",
    "skincare_steps": ["cleanser", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "beginner",
    "korean_skincare_attraction": ["sun protection"],
    "skincare_goal": ["prevent aging", "sun protection"],
    "daily_product_count": "3-5",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "200-400",
    "customized_recommendations": "yes",
    "brands_used": "Eucerin",
    "additional_comments": "Work outdoors, need good sun protection"
  }',
  '{
    "email": "michael.chen@example.com",
    "phone_number": "+971501234010"
  }',
  '{
    "first_name": "Michael",
    "last_name": "Chen",
    "address": "Mirdif City Center Apartments",
    "city": "Dubai",
    "postal_code": "12010"
  }',
  1,
  249,
  249,
  '6-months',
  'processing'
);
