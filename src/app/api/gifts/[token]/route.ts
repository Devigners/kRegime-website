import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    console.log('Fetching gift with token:', token);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, fetch the gift order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('gift_token', token)
      .eq('is_gift', true)
      .single();

    console.log('Order query result:', { order, orderError });

    if (orderError || !order) {
      console.error('Gift not found error:', orderError);
      return NextResponse.json(
        { error: 'Gift not found', details: orderError?.message },
        { status: 404 }
      );
    }

    // Then fetch the regime separately
    const { data: regimeData, error: regimeError } = await supabase
      .from('regimes')
      .select('*')
      .eq('id', order.regime_id)
      .single();

    console.log('Regime query result:', { regimeData, regimeError });

    // Transform regime data to match frontend interface
    const regime = regimeData ? {
      id: regimeData.id,
      name: regimeData.name,
      description: regimeData.description,
      images: regimeData.image || [],
      steps: regimeData.steps || [],
      stepCount: regimeData.step_count,
      priceOneTime: regimeData.price_one_time,
      price3Months: regimeData.price_3_months,
      price6Months: regimeData.price_6_months,
      discountOneTime: regimeData.discount_one_time,
      discount3Months: regimeData.discount_3_months,
      discount6Months: regimeData.discount_6_months,
      discountReasonOneTime: regimeData.discount_reason_one_time,
      discountReason3Months: regimeData.discount_reason_3_months,
      discountReason6Months: regimeData.discount_reason_6_months,
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
