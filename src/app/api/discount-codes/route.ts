import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { convertDiscountCodeRowToDiscountCode, convertDiscountCodeToDiscountCodeInsert, DiscountCodeRow } from '@/models/database';

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
    const { code, percentageOff } = body;

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

    const discountCode = {
      id: `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code: code.toUpperCase(),
      percentageOff: parseInt(percentageOff),
      isActive: true,
    };

    const discountCodeInsert = convertDiscountCodeToDiscountCodeInsert(discountCode);

    const { error } = await supabaseClient
      .from('discount_codes')
      .insert([discountCodeInsert]);

    if (error) {
      console.error('Error creating discount code:', error);
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
