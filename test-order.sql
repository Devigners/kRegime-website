-- Insert a test order to verify the regime relationship
INSERT INTO orders (
  id,
  regime_id,
  user_details,
  contact_info,
  shipping_address,
  quantity,
  total_amount,
  final_amount,
  status
) VALUES (
  'test-order-1',
  'tribox',
  '{
    "age": "25",
    "gender": "female",
    "skin_type": "combination",
    "skin_concerns": ["acne", "dullness"],
    "complexion": "medium",
    "allergies": "None",
    "skincare_steps": ["cleanser", "moisturizer", "sunscreen"],
    "korean_skincare_experience": "beginner",
    "korean_skincare_attraction": ["natural ingredients", "glass skin"],
    "skincare_goal": ["clear skin", "hydration"],
    "daily_product_count": "3-5",
    "routine_regularity": "daily",
    "purchase_location": "online",
    "budget": "200-400",
    "customized_recommendations": "yes",
    "brands_used": "The Ordinary, Cerave",
    "additional_comments": "Looking for gentle products for sensitive skin"
  }',
  '{
    "email": "test@example.com",
    "phone_number": "+971501234567"
  }',
  '{
    "first_name": "Test",
    "last_name": "User",
    "apartment_number": "Apt 101",
    "address": "123 Test Street",
    "city": "Dubai"
  }',
  1,
  229,
  229,
  'pending'
);