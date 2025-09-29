import { supabase, supabaseClient } from '@/lib/supabase';
import {
  convertRegimeToRegimeInsert,
  convertReviewToReviewInsert,
  type Regime,
  type Review,
} from '@/models/database';
import { NextResponse } from 'next/server';

const initialRegimes: Omit<Regime, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'tribox',
    name: 'TRIBOX',
    description:
      "Start with the essentials. This 3 steps Korean skincare routine is designed to cleanse, hydrate and protect, or switch it up based on your needs. Just tell us your skin type and we'll curate the perfect set.",
    price: 229,
    steps: ['Cleanser', 'Moisturiser', 'Sunscreen'],
    images: ['/static/1.webp'],
    stepCount: 3,
    isActive: true,
  },
  {
    id: 'pentabox',
    name: 'PENTABOX',
    description:
      "Go deeper with a well-rounded 5 steps routine tailored just for you. Whether you're focused on glow, hydration, or texture, we'll customize every product in your box.",
    price: 379,
    steps: ['Cleanser', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
    images: ['/static/2.webp'],
    stepCount: 5,
    isActive: true,
  },
  {
    id: 'septabox',
    name: 'SEPTABOX',
    description:
      'Our full skincare journey in one luxurious box. The 7 steps Korean skincare ritual is designed to deep-cleanse, treat, and protect, giving you radiant, long-term results. Perfect for skincare lovers and advanced users.',
    price: 529,
    steps: [
      'Cleansing oil',
      'Cleanser',
      'Mask',
      'Toner',
      'Serum',
      'Moisturiser',
      'Sunscreen',
    ],
    images: ['/static/3.webp'],
    stepCount: 7,
    isActive: true,
  },
];

const initialReviews: Omit<Review, 'createdAt' | 'updatedAt'>[] = [
  {
    id: '1',
    name: 'Harriet Rojas',
    rating: 5,
    comment:
      'Absolutely love this product! It has transformed my skincare routine and given me glowing skin. The recommendations are spot on and the quality is top-notch. Highly recommend to anyone looking to elevate their skincare game.',
    isApproved: true,
  },
  {
    id: '2',
    name: 'Ava Bentley',
    rating: 5,
    comment:
      'I am extremely satisfied with this product! It exceeded my expectations with its quality and performance. The customer service was excellent, and delivery was prompt. I highly recommend this to everyone.',
    isApproved: true,
  },
  {
    id: '3',
    name: 'Sarah Page',
    rating: 5,
    comment:
      'The Korean skincare products are amazing! My skin has never looked better. The personalized approach really works and the packaging is beautiful.',
    isApproved: true,
  },
  {
    id: '4',
    name: 'Amanda Lowery',
    rating: 5,
    comment:
      'Finally found a skincare routine that works for my sensitive skin. The AI curation is spot-on and the results speak for themselves.',
    isApproved: true,
  },
];

export async function POST() {
  try {
    // Clear existing data
    await supabase.from('regimes').delete().neq('id', '');
    await supabase.from('reviews').delete().neq('id', '');

    // Insert regimes
    const regimesToInsert = initialRegimes.map(convertRegimeToRegimeInsert);
    const { error: regimesError } = await supabaseClient
      .from('regimes')
      .insert(regimesToInsert);

    if (regimesError) {
      console.error('Error inserting regimes:', regimesError);
      return NextResponse.json(
        { success: false, error: 'Failed to seed regimes' },
        { status: 500 }
      );
    }

    // Insert reviews
    const reviewsToInsert = initialReviews.map(convertReviewToReviewInsert);
    const { error: reviewsError } = await supabaseClient
      .from('reviews')
      .insert(reviewsToInsert);

    if (reviewsError) {
      console.error('Error inserting reviews:', reviewsError);
      return NextResponse.json(
        { success: false, error: 'Failed to seed reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        regimes: regimesToInsert.length,
        reviews: reviewsToInsert.length,
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
