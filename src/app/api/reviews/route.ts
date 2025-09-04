import { supabase, supabaseClient } from '@/lib/supabase';
import {
  convertReviewRowToReview,
  convertReviewToReviewInsert,
  type Review,
} from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    const convertedReviews = reviews.map(convertReviewRowToReview);

    return NextResponse.json({ success: true, data: convertedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData: Omit<
      Review,
      'id' | 'isApproved' | 'createdAt' | 'updatedAt'
    > = await request.json();

    // Generate a unique review ID
    const reviewId = `review_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newReview: Omit<Review, 'createdAt' | 'updatedAt'> = {
      ...reviewData,
      id: reviewId,
      isApproved: false, // Reviews need to be approved before showing
    };

    const reviewInsert = convertReviewToReviewInsert(newReview);

    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([reviewInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create review' },
        { status: 500 }
      );
    }

    const convertedReview = convertReviewRowToReview(data);

    return NextResponse.json({
      success: true,
      data: convertedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
