import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createSupabaseAdmin();

    // Define the 10 dummy orders
    const dummyOrders = [
      {
        id: 'dummy-order-001',
        regime_id: 'tribox',
        user_details: {
          age: '28',
          gender: 'female',
          skin_type: 'oily',
          skin_concerns: ['acne', 'large pores'],
          complexion: 'fair',
          allergies: 'None',
          skincare_steps: ['cleanser', 'toner', 'moisturizer'],
          korean_skincare_experience: 'beginner',
          korean_skincare_attraction: ['natural ingredients'],
          skincare_goal: ['clear skin'],
          daily_product_count: '3-5',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '200-400',
          customized_recommendations: 'yes',
          brands_used: 'Cerave, Neutrogena',
          additional_comments: 'Looking for oil-control products'
        },
        contact_info: {
          email: 'sarah.johnson@example.com',
          phone_number: '+971501234001'
        },
        shipping_address: {
          first_name: 'Sarah',
          last_name: 'Johnson',
          address: 'Building 12, Palm Jumeirah',
          city: 'Dubai',
          postal_code: '12001'
        },
        quantity: 1,
        total_amount: 299,
        final_amount: 299,
        subscription_type: 'one-time',
        status: 'pending'
      },
      {
        id: 'dummy-order-002',
        regime_id: 'pentabox',
        user_details: {
          age: '32',
          gender: 'male',
          skin_type: 'dry',
          skin_concerns: ['dryness', 'fine lines'],
          complexion: 'medium',
          allergies: 'Fragrance',
          skincare_steps: ['cleanser', 'moisturizer'],
          korean_skincare_experience: 'intermediate',
          korean_skincare_attraction: ['anti-aging', 'hydration'],
          skincare_goal: ['hydration', 'anti-aging'],
          daily_product_count: '3-5',
          routine_regularity: 'most days',
          purchase_location: 'both',
          budget: '400-600',
          customized_recommendations: 'yes',
          brands_used: "Kiehl's, La Roche-Posay",
          additional_comments: 'Prefer fragrance-free products'
        },
        contact_info: {
          email: 'ahmed.hassan@example.com',
          phone_number: '+971501234002'
        },
        shipping_address: {
          first_name: 'Ahmed',
          last_name: 'Hassan',
          address: 'Marina Heights Tower, Dubai Marina',
          city: 'Dubai',
          postal_code: '12002'
        },
        quantity: 1,
        total_amount: 449,
        final_amount: 449,
        subscription_type: '3-months',
        status: 'processing'
      },
      {
        id: 'dummy-order-003',
        regime_id: 'septabox',
        user_details: {
          age: '35',
          gender: 'female',
          skin_type: 'combination',
          skin_concerns: ['pigmentation', 'dullness'],
          complexion: 'dark',
          allergies: 'None',
          skincare_steps: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'advanced',
          korean_skincare_attraction: ['glass skin', 'brightening'],
          skincare_goal: ['brightening', 'even tone'],
          daily_product_count: '7+',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '600+',
          customized_recommendations: 'yes',
          brands_used: 'SK-II, Sulwhasoo, Innisfree',
          additional_comments: 'Looking for brightening and anti-pigmentation products'
        },
        contact_info: {
          email: 'fatima.ali@example.com',
          phone_number: '+971501234003'
        },
        shipping_address: {
          first_name: 'Fatima',
          last_name: 'Ali',
          address: 'Emirates Hills Villa 45',
          city: 'Dubai',
          postal_code: '12003'
        },
        quantity: 2,
        total_amount: 1198,
        final_amount: 1198,
        subscription_type: '6-months',
        status: 'completed'
      },
      {
        id: 'dummy-order-004',
        regime_id: 'tribox',
        user_details: {
          age: '22',
          gender: 'female',
          skin_type: 'sensitive',
          skin_concerns: ['redness', 'sensitivity'],
          complexion: 'fair',
          allergies: 'Alcohol, Essential oils',
          skincare_steps: ['cleanser', 'moisturizer'],
          korean_skincare_experience: 'beginner',
          korean_skincare_attraction: ['gentle products'],
          skincare_goal: ['calm skin', 'hydration'],
          daily_product_count: '3-5',
          routine_regularity: 'daily',
          purchase_location: 'retail',
          budget: '200-400',
          customized_recommendations: 'yes',
          brands_used: 'Avene, Bioderma',
          additional_comments: 'Very sensitive skin, need hypoallergenic products'
        },
        contact_info: {
          email: 'emma.white@example.com',
          phone_number: '+971501234004'
        },
        shipping_address: {
          first_name: 'Emma',
          last_name: 'White',
          address: 'JBR Sadaf Tower 5, Apt 1201',
          city: 'Dubai',
          postal_code: '12004'
        },
        quantity: 1,
        total_amount: 269,
        final_amount: 269,
        subscription_type: '3-months',
        status: 'cancelled'
      },
      {
        id: 'dummy-order-005',
        regime_id: 'pentabox',
        user_details: {
          age: '29',
          gender: 'female',
          skin_type: 'normal',
          skin_concerns: ['prevention', 'maintenance'],
          complexion: 'medium',
          allergies: 'None',
          skincare_steps: ['cleanser', 'toner', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'intermediate',
          korean_skincare_attraction: ['glass skin', 'dewy look'],
          skincare_goal: ['maintain healthy skin', 'glow'],
          daily_product_count: '5-7',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '400-600',
          customized_recommendations: 'yes',
          brands_used: 'Cosrx, Etude House',
          additional_comments: 'Love Korean skincare!'
        },
        contact_info: {
          email: 'maryam.khan@example.com',
          phone_number: '+971501234005'
        },
        shipping_address: {
          first_name: 'Maryam',
          last_name: 'Khan',
          address: 'Downtown Dubai, Boulevard Plaza',
          city: 'Dubai',
          postal_code: '12005'
        },
        quantity: 1,
        total_amount: 479,
        final_amount: 479,
        subscription_type: 'one-time',
        status: 'pending'
      },
      {
        id: 'dummy-order-006',
        regime_id: 'septabox',
        user_details: {
          age: '40',
          gender: 'female',
          skin_type: 'dry',
          skin_concerns: ['wrinkles', 'fine lines', 'sagging'],
          complexion: 'fair',
          allergies: 'None',
          skincare_steps: ['cleanser', 'toner', 'essence', 'serum', 'eye cream', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'advanced',
          korean_skincare_attraction: ['anti-aging', 'luxury ingredients'],
          skincare_goal: ['anti-aging', 'firmness'],
          daily_product_count: '7+',
          routine_regularity: 'daily',
          purchase_location: 'both',
          budget: '600+',
          customized_recommendations: 'yes',
          brands_used: 'Sulwhasoo, The History of Whoo',
          additional_comments: 'Interested in premium anti-aging products'
        },
        contact_info: {
          email: 'lisa.anderson@example.com',
          phone_number: '+971501234006'
        },
        shipping_address: {
          first_name: 'Lisa',
          last_name: 'Anderson',
          address: 'Arabian Ranches Villa 202',
          city: 'Dubai',
          postal_code: '12006'
        },
        quantity: 1,
        total_amount: 619,
        final_amount: 619,
        subscription_type: '3-months',
        status: 'processing'
      },
      {
        id: 'dummy-order-007',
        regime_id: 'tribox',
        user_details: {
          age: '24',
          gender: 'male',
          skin_type: 'oily',
          skin_concerns: ['acne', 'blackheads'],
          complexion: 'medium',
          allergies: 'None',
          skincare_steps: ['cleanser', 'moisturizer'],
          korean_skincare_experience: 'beginner',
          korean_skincare_attraction: ['simple routine'],
          skincare_goal: ['clear skin'],
          daily_product_count: '1-3',
          routine_regularity: 'most days',
          purchase_location: 'retail',
          budget: '200-400',
          customized_recommendations: 'yes',
          brands_used: 'None - New to skincare',
          additional_comments: 'First time trying a skincare routine'
        },
        contact_info: {
          email: 'omar.malik@example.com',
          phone_number: '+971501234007'
        },
        shipping_address: {
          first_name: 'Omar',
          last_name: 'Malik',
          address: 'Business Bay Executive Tower B',
          city: 'Dubai',
          postal_code: '12007'
        },
        quantity: 1,
        total_amount: 299,
        final_amount: 299,
        subscription_type: 'one-time',
        status: 'completed'
      },
      {
        id: 'dummy-order-008',
        regime_id: 'pentabox',
        user_details: {
          age: '31',
          gender: 'female',
          skin_type: 'combination',
          skin_concerns: ['uneven texture', 'enlarged pores'],
          complexion: 'medium',
          allergies: 'None',
          skincare_steps: ['cleanser', 'exfoliant', 'toner', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'intermediate',
          korean_skincare_attraction: ['texture improvement', 'pore care'],
          skincare_goal: ['smooth skin', 'minimize pores'],
          daily_product_count: '5-7',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '400-600',
          customized_recommendations: 'yes',
          brands_used: "Paula's Choice, Some By Mi",
          additional_comments: 'Interested in products with AHA/BHA'
        },
        contact_info: {
          email: 'priya.sharma@example.com',
          phone_number: '+971501234008'
        },
        shipping_address: {
          first_name: 'Priya',
          last_name: 'Sharma',
          address: 'Jumeirah Beach Residence Walk',
          city: 'Dubai',
          postal_code: '12008'
        },
        quantity: 1,
        total_amount: 419,
        final_amount: 419,
        subscription_type: '6-months',
        status: 'completed'
      },
      {
        id: 'dummy-order-009',
        regime_id: 'septabox',
        user_details: {
          age: '36',
          gender: 'female',
          skin_type: 'sensitive',
          skin_concerns: ['rosacea', 'redness', 'dryness'],
          complexion: 'fair',
          allergies: 'Retinol, Strong acids',
          skincare_steps: ['gentle cleanser', 'calming toner', 'serum', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'advanced',
          korean_skincare_attraction: ['soothing ingredients', 'barrier repair'],
          skincare_goal: ['calm redness', 'strengthen barrier'],
          daily_product_count: '5-7',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '600+',
          customized_recommendations: 'yes',
          brands_used: 'Dr. Jart+, Klairs',
          additional_comments: 'Need products for rosacea-prone skin'
        },
        contact_info: {
          email: 'natalie.brown@example.com',
          phone_number: '+971501234009'
        },
        shipping_address: {
          first_name: 'Natalie',
          last_name: 'Brown',
          address: 'Dubai Hills Estate, Villa 78',
          city: 'Dubai',
          postal_code: '12009'
        },
        quantity: 1,
        total_amount: 649,
        final_amount: 649,
        subscription_type: 'one-time',
        status: 'pending'
      },
      {
        id: 'dummy-order-010',
        regime_id: 'tribox',
        user_details: {
          age: '27',
          gender: 'male',
          skin_type: 'normal',
          skin_concerns: ['sun damage prevention'],
          complexion: 'medium',
          allergies: 'None',
          skincare_steps: ['cleanser', 'moisturizer', 'sunscreen'],
          korean_skincare_experience: 'beginner',
          korean_skincare_attraction: ['sun protection'],
          skincare_goal: ['prevent aging', 'sun protection'],
          daily_product_count: '3-5',
          routine_regularity: 'daily',
          purchase_location: 'online',
          budget: '200-400',
          customized_recommendations: 'yes',
          brands_used: 'Eucerin',
          additional_comments: 'Work outdoors, need good sun protection'
        },
        contact_info: {
          email: 'michael.chen@example.com',
          phone_number: '+971501234010'
        },
        shipping_address: {
          first_name: 'Michael',
          last_name: 'Chen',
          address: 'Mirdif City Center Apartments',
          city: 'Dubai',
          postal_code: '12010'
        },
        quantity: 1,
        total_amount: 249,
        final_amount: 249,
        subscription_type: '6-months',
        status: 'processing'
      }
    ];

    // Insert all orders
    const { error } = await supabase
      .from('orders')
      .insert(dummyOrders);

    if (error) {
      console.error('Error inserting orders:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '10 dummy orders created successfully',
      count: dummyOrders.length
    });

  } catch (error) {
    console.error('Error in seed-orders API:', error);
    return NextResponse.json(
      { error: 'Failed to seed orders' },
      { status: 500 }
    );
  }
}
