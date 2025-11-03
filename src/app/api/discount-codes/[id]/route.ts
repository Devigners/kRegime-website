import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

// PUT /api/discount-codes/[id] - Update a discount code
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { code, percentageOff, isActive } = body;
    const { id } = params;

    const updateData: {
      code?: string;
      percentage_off?: number;
      is_active?: boolean;
      updated_at?: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (code !== undefined) {
      // Check if code already exists (excluding current record)
      const { data: existingCode } = await supabaseClient
        .from('discount_codes')
        .select('id')
        .eq('code', code.toUpperCase())
        .neq('id', id)
        .single();

      if (existingCode) {
        return NextResponse.json(
          { success: false, error: 'Discount code already exists' },
          { status: 409 }
        );
      }

      updateData.code = code.toUpperCase();
    }

    if (percentageOff !== undefined) {
      if (percentageOff < 1 || percentageOff > 100) {
        return NextResponse.json(
          { success: false, error: 'Percentage off must be between 1 and 100' },
          { status: 400 }
        );
      }
      updateData.percentage_off = parseInt(percentageOff);
    }

    if (isActive !== undefined) {
      updateData.is_active = isActive;
    }

    const { error } = await supabaseClient
      .from('discount_codes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating discount code:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/discount-codes/[id] - Delete a discount code
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabaseClient
      .from('discount_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting discount code:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete discount code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
