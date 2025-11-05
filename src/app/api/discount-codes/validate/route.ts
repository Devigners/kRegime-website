import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { convertDiscountCodeRowToDiscountCode, DiscountCodeRow } from '@/models/database';

// POST /api/discount-codes/validate - Validate a discount code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Discount code is required' },
        { status: 400 }
      );
    }

    // Fetch discount code from database
    const { data, error } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    const discountCode = convertDiscountCodeRowToDiscountCode(data as DiscountCodeRow);

    // Check if discount code is active
    if (!discountCode.isActive) {
      return NextResponse.json(
        { success: false, error: 'This discount code is no longer active' },
        { status: 400 }
      );
    }

    // For one-time codes, check if already used
    if (!discountCode.isRecurring && discountCode.usageCount > 0) {
      return NextResponse.json(
        { success: false, error: 'This discount code has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discountCode: {
        id: discountCode.id,
        code: discountCode.code,
        percentageOff: discountCode.percentageOff,
        isRecurring: discountCode.isRecurring,
        stripeCouponId: discountCode.stripeCouponId,
      },
    });
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
