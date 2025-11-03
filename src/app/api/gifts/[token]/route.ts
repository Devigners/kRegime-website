import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch gift order with regime details
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        regimes (
          id,
          name,
          description,
          image,
          steps,
          step_count,
          price_one_time,
          price_3_months,
          price_6_months,
          discount_one_time,
          discount_3_months,
          discount_6_months,
          discount_reason_one_time,
          discount_reason_3_months,
          discount_reason_6_months
        )
      `)
      .eq('gift_token', token)
      .eq('is_gift', true)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    // Transform regime data to match frontend interface
    const regime = order.regimes ? {
      id: order.regimes.id,
      name: order.regimes.name,
      description: order.regimes.description,
      images: order.regimes.image || [],
      steps: order.regimes.steps || [],
      stepCount: order.regimes.step_count,
      priceOneTime: order.regimes.price_one_time,
      price3Months: order.regimes.price_3_months,
      price6Months: order.regimes.price_6_months,
      discountOneTime: order.regimes.discount_one_time,
      discount3Months: order.regimes.discount_3_months,
      discount6Months: order.regimes.discount_6_months,
      discountReasonOneTime: order.regimes.discount_reason_one_time,
      discountReason3Months: order.regimes.discount_reason_3_months,
      discountReason6Months: order.regimes.discount_reason_6_months,
    } : null;

    return NextResponse.json({
      orderId: order.id,
      giftGiverName: order.gift_giver_name,
      giftGiverEmail: order.gift_giver_email,
      giftClaimed: order.gift_claimed,
      giftClaimedAt: order.gift_claimed_at,
      subscriptionType: order.subscription_type,
      regime,
    });
  } catch (error) {
    console.error('Error fetching gift:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
