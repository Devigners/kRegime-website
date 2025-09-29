-- Seed data for kRegime website
-- This file will be automatically executed when running `supabase db reset`

-- Clear existing data (optional, since db reset already clears data)
-- DELETE FROM reviews WHERE id IS NOT NULL;
-- DELETE FROM regimes WHERE id IS NOT NULL;

-- Insert regimes
INSERT INTO regimes (id, name, description, price, steps, image, step_count, is_active) VALUES
(
  'tribox',
  'TRIBOX',
  'Start with the essentials. This 3 steps Korean skincare routine is designed to cleanse, hydrate and protect, or switch it up based on your needs. Just tell us your skin type and we''ll curate the perfect set.',
  229,
  ARRAY['Cleanser', 'Moisturiser', 'Sunscreen'],
  ARRAY['/static/1.jpg', '/static/4.jpg'],
  3,
  true
),
(
  'pentabox',
  'PENTABOX',
  'Go deeper with a well-rounded 5 steps routine tailored just for you. Whether you''re focused on glow, hydration, or texture, we''ll customize every product in your box.',
  379,
  ARRAY['Cleanser', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
  ARRAY['/static/2.jpg', '/static/5.jpg', '/static/6.jpg'],
  5,
  true
),
(
  'septabox',
  'SEPTABOX',
  'Our full skincare journey in one luxurious box. The 7 steps Korean skincare ritual is designed to deep-cleanse, treat, and protect, giving you radiant, long-term results. Perfect for skincare lovers and advanced users.',
  529,
  ARRAY['Cleansing oil', 'Cleanser', 'Mask', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
  ARRAY['/static/3.jpg', '/static/7.jpg', '/static/8.jpg', '/static/9.jpg'],
  7,
  true
);

-- Insert a test order
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
    "address": "123 Test Street",
    "city": "Dubai",
    "postal_code": "12345"
  }',
  1,
  229,
  229,
  'pending'
);

-- Insert reviews
INSERT INTO reviews (id, name, rating, comment, is_approved) VALUES
(
  '1',
  'Harriet Rojas',
  5,
  'Absolutely love this product! It has transformed my skincare routine and given me glowing skin. The recommendations are spot on and the quality is top-notch. Highly recommend to anyone looking to elevate their skincare game.',
  true
),
(
  '2',
  'Ava Bentley',
  5,
  'I am extremely satisfied with this product! It exceeded my expectations with its quality and performance. The customer service was excellent, and delivery was prompt. I highly recommend this to everyone.',
  true
),
(
  '3',
  'Sarah Page',
  5,
  'The Korean skincare products are amazing! My skin has never looked better. The personalized approach really works and the packaging is beautiful.',
  true
),
(
  '4',
  'Amanda Lowery',
  5,
  'Finally found a skincare routine that works for my sensitive skin. The AI curation is spot-on and the results speak for themselves.',
  true
);