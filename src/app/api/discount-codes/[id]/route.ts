import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

// PUT /api/discount-codes/[id] - Update a discount code
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { code, percentageOff, isActive, isRecurring } = body;
    const { id } = await params;

    // Get current discount code to access stripe_coupon_id
    const { data: currentCode, error: fetchError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentCode) {
      return NextResponse.json(
        { success: false, error: 'Discount code not found' },
        { status: 404 }
      );
    }

    const updateData: {
      code?: string;
      percentage_off?: number;
      is_active?: boolean;
      is_recurring?: boolean;
      stripe_coupon_id?: string;
      updated_at?: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    let needsStripeCouponUpdate = false;

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
      needsStripeCouponUpdate = true;
    }

    if (percentageOff !== undefined) {
      if (percentageOff < 1 || percentageOff > 100) {
        return NextResponse.json(
          { success: false, error: 'Percentage off must be between 1 and 100' },
          { status: 400 }
        );
      }
      updateData.percentage_off = parseInt(percentageOff);
      needsStripeCouponUpdate = true;
    }

    if (isActive !== undefined) {
      updateData.is_active = isActive;
    }

    if (isRecurring !== undefined) {
      updateData.is_recurring = isRecurring;
      // If isRecurring changes, we need to recreate the coupon to update max_redemptions
      needsStripeCouponUpdate = true;
    }

    // If code, percentage, or isRecurring changed, we need to recreate the Stripe coupon
    if (needsStripeCouponUpdate && currentCode.stripe_coupon_id) {
      try {
        // Delete old Stripe coupon
        await stripe.coupons.del(currentCode.stripe_coupon_id);

        // Determine final isRecurring value
        const finalIsRecurring = updateData.is_recurring !== undefined 
          ? updateData.is_recurring 
          : currentCode.is_recurring;

        // Create new Stripe coupon config
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
          name: updateData.code || currentCode.code,
          percent_off: updateData.percentage_off || currentCode.percentage_off,
          duration: 'forever',
          currency: 'aed',
          metadata: {
            source: 'kregime_admin',
            is_recurring: finalIsRecurring.toString(),
          }
        };

        // For one-time codes, add max_redemptions limit
        if (!finalIsRecurring) {
          couponConfig.max_redemptions = 1;
        }

        const newStripeCoupon = await stripe.coupons.create(couponConfig);

        updateData.stripe_coupon_id = newStripeCoupon.id;
      } catch (stripeError) {
        console.error('Error updating Stripe coupon:', stripeError);
        return NextResponse.json(
          { success: false, error: 'Failed to update Stripe coupon' },
          { status: 500 }
        );
      }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the discount code to access stripe_coupon_id
    const { data: discountCode, error: fetchError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !discountCode) {
      return NextResponse.json(
        { success: false, error: 'Discount code not found' },
        { status: 404 }
      );
    }

    // Delete Stripe coupon if it exists
    if (discountCode.stripe_coupon_id) {
      try {
        await stripe.coupons.del(discountCode.stripe_coupon_id);
      } catch (stripeError) {
        console.error('Error deleting Stripe coupon:', stripeError);
        // Continue with database deletion even if Stripe deletion fails
      }
    }

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
