import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { convertOrderToOrderInsert, type Order } from '@/models/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// POST - Create order with bank transfer payment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      regimeId,
      subscriptionType,
      quantity = 1,
      contactInfo,
      totalAmount,
      finalAmount,
      discountCodeId,
      isGift = false,
      paymentMethod,
      bankReferenceId,
      userDetails,
      shippingAddress,
      giftGiverInfo,
    } = body;

    // Validate required fields
    if (!regimeId || !subscriptionType || !contactInfo || !paymentMethod || !bankReferenceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (paymentMethod !== 'bank_transfer') {
      return NextResponse.json({ error: 'Invalid payment method for this endpoint' }, { status: 400 });
    }

    // Get regime details
    const { data: regime, error: regimeError } = await supabase
      .from('regimes')
      .select('*')
      .eq('id', regimeId)
      .single();

    if (regimeError || !regime) {
      console.error('Error fetching regime:', regimeError);
      return NextResponse.json({ error: 'Regime not found' }, { status: 404 });
    }

    // Use bank reference ID as the order ID for bank transfer orders
    const orderId = bankReferenceId;

    console.log('Creating bank transfer order with ID:', orderId);
    console.log('Bank Reference ID:', bankReferenceId);

    // Build the order object using the proper Order type structure
    const order: Omit<Order, 'createdAt' | 'updatedAt'> = {
      id: orderId,
      regimeId,
      subscriptionType,
      quantity,
      contactInfo: {
        email: contactInfo.email,
        phoneNumber: contactInfo.phoneNumber,
      },
      totalAmount,
      finalAmount,
      discountCodeId: discountCodeId || undefined,
      status: 'pending',
      paymentMethod: 'bank_transfer',
      bankReferenceId,
      userDetails: isGift ? undefined : userDetails,
      shippingAddress: isGift ? undefined : shippingAddress,
      isGift,
      giftGiverName: isGift ? `${giftGiverInfo?.firstName}${giftGiverInfo?.lastName ? ` ${giftGiverInfo.lastName}` : ''}` : undefined,
      giftGiverEmail: isGift ? giftGiverInfo?.email : undefined,
      giftGiverPhone: isGift ? giftGiverInfo?.phoneNumber : undefined,
    };

    // Convert to database format using the proper conversion function
    const orderInsert = convertOrderToOrderInsert(order);

    const { data: insertedData, error: insertError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating order:', insertError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    console.log('Bank transfer order created successfully. Inserted data:', insertedData);
    console.log(`Order ID in database: ${insertedData.id}`);
    console.log(`Bank Reference ID in database: ${insertedData.bank_reference_id}`);

    // Note: Email notification can be added later
    console.log(`Bank transfer order created: ${orderId}, Reference ID: ${bankReferenceId}`);

    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Order created successfully. Please complete the bank transfer using the provided reference ID.'
    });
  } catch (error) {
    console.error('Error in POST /api/orders/bank-transfer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
