import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { convertDiscountCodeRowToDiscountCode, convertDiscountCodeToDiscountCodeInsert, DiscountCodeRow } from '@/models/database';
import { stripe } from '@/lib/stripe';

// GET /api/discount-codes - List all discount codes
export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discount codes:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch discount codes' },
        { status: 500 }
      );
    }

    const discountCodes = data?.map((row: DiscountCodeRow) => convertDiscountCodeRowToDiscountCode(row)) || [];

    return NextResponse.json({ success: true, discountCodes });
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/discount-codes - Create a new discount code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, percentageOff, isRecurring } = body;

    if (!code || !percentageOff) {
      return NextResponse.json(
        { success: false, error: 'Code and percentage off are required' },
        { status: 400 }
      );
    }

    // Validate percentage
    if (percentageOff < 1 || percentageOff > 100) {
      return NextResponse.json(
        { success: false, error: 'Percentage off must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const { data: existingCode } = await supabaseClient
      .from('discount_codes')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'Discount code already exists' },
        { status: 409 }
      );
    }

    // Create Stripe coupon first
    let stripeCouponId: string | null = null;
    try {
      const couponConfig: {
        name: string;
        percent_off: number;
        duration: 'forever';
        currency: string;
        max_redemptions?: number;
        metadata: {
          source: string;
          is_recurring: string;
        };
      } = {
        name: code.toUpperCase(),
        percent_off: parseInt(percentageOff),
        duration: 'forever',
        currency: 'aed',
        metadata: {
          source: 'kregime_admin',
          is_recurring: isRecurring !== undefined ? isRecurring.toString() : 'true',
        }
      };

      // For one-time codes, add max_redemptions limit
      if (isRecurring === false) {
        couponConfig.max_redemptions = 1;
      }

      const stripeCoupon = await stripe.coupons.create(couponConfig);
      stripeCouponId = stripeCoupon.id;
    } catch (stripeError) {
      console.error('Error creating Stripe coupon:', stripeError);
      return NextResponse.json(
        { success: false, error: 'Failed to create Stripe coupon' },
        { status: 500 }
      );
    }

    const discountCode = {
      id: `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code: code.toUpperCase(),
      percentageOff: parseInt(percentageOff),
      isActive: true,
      isRecurring: isRecurring !== undefined ? isRecurring : true,
      usageCount: 0,
      stripeCouponId,
    };

    const discountCodeInsert = convertDiscountCodeToDiscountCodeInsert(discountCode);

    const { error } = await supabaseClient
      .from('discount_codes')
      .insert([discountCodeInsert]);

    if (error) {
      console.error('Error creating discount code:', error);
      // If database insert fails, delete the Stripe coupon
      try {
        await stripe.coupons.del(stripeCouponId);
      } catch (cleanupError) {
        console.error('Error cleaning up Stripe coupon:', cleanupError);
      }
      return NextResponse.json(
        { success: false, error: 'Failed to create discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      discountCode: {
        ...discountCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error creating discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
