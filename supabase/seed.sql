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
  '/static/1.jpg',
  3,
  true
),
(
  'pentabox',
  'PENTABOX',
  'Go deeper with a well-rounded 5 steps routine tailored just for you. Whether you''re focused on glow, hydration, or texture, we''ll customize every product in your box.',
  379,
  ARRAY['Cleanser', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
  '/static/2.jpg',
  5,
  true
),
(
  'septabox',
  'SEPTABOX',
  'Our full skincare journey in one luxurious box. The 7 steps Korean skincare ritual is designed to deep-cleanse, treat, and protect, giving you radiant, long-term results. Perfect for skincare lovers and advanced users.',
  529,
  ARRAY['Cleansing oil', 'Cleanser', 'Mask', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
  '/static/3.jpg',
  7,
  true
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