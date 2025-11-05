import { supabase, supabaseClient } from '@/lib/supabase';
import {
  convertOrderRowToOrder,
  convertOrderToOrderInsert,
  convertRegimeRowToRegime,
  type Order,
} from '@/models/database';
import { sendOrderReceivedEmail, sendNewOrderAdminEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    const convertedOrders = orders.map(convertOrderRowToOrder);

    return NextResponse.json({ success: true, data: convertedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> =
      await request.json();

    // Function to generate 8-digit unique order ID
    // Generates a random number between 10000000 and 99999999
    // Checks database to ensure uniqueness before returning
    const generateOrderId = async (): Promise<string> => {
      let orderId: string;
      let isUnique = false;

      while (!isUnique) {
        // Generate 8-digit random number (10000000 to 99999999)
        orderId = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Check if this ID already exists
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('id', orderId)
          .single();

        isUnique = !existingOrder;
      }

      return orderId!;
    };

    const orderId = await generateOrderId();

    const newOrder: Omit<Order, 'createdAt' | 'updatedAt'> = {
      ...orderData,
      id: orderId,
      status: 'pending',
    };

    const orderInsert = convertOrderToOrderInsert(newOrder);

    const { data, error } = await supabaseClient
      .from('orders')
      .insert([orderInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create order' },
        { status: 500 }
      );
    }

    const convertedOrder = convertOrderRowToOrder(data);

    // Handle discount code usage tracking
    if (convertedOrder.discountCodeId) {
      try {
        // Fetch the discount code
        const { data: discountCodeData, error: dcError } = await supabaseClient
          .from('discount_codes')
          .select('*')
          .eq('id', convertedOrder.discountCodeId)
          .single();

        if (!dcError && discountCodeData) {
          // Increment usage count
          const newUsageCount = (discountCodeData.usage_count || 0) + 1;
          
          // For one-time codes, also set is_active to false after first use
          const updateData: { usage_count: number; is_active?: boolean } = {
            usage_count: newUsageCount
          };
          
          if (!discountCodeData.is_recurring && newUsageCount >= 1) {
            updateData.is_active = false;
          }

          // Update the discount code
          await supabaseClient
            .from('discount_codes')
            .update(updateData)
            .eq('id', convertedOrder.discountCodeId);
        }
      } catch (dcUpdateError) {
        console.error('Error updating discount code usage:', dcUpdateError);
        // Don't fail the order creation if discount code update fails
      }
    }

    // Send order completion email immediately after order creation
    try {
      // Fetch regime details for the email
      let regime = undefined;
      if (convertedOrder.regimeId) {
        const { data: regimeData } = await supabase
          .from('regimes')
          .select('*')
          .eq('id', convertedOrder.regimeId)
          .single();

        if (regimeData) {
          regime = convertRegimeRowToRegime(regimeData);
        }
      }

      // Send the completion email to customer
      const emailResult = await sendOrderReceivedEmail({
        order: convertedOrder,
        regime,
      });

      if (!emailResult.success) {
        console.error('Failed to send order completion email:', emailResult.error);
        // Don't fail the order creation if email fails, just log it
      } else {
        console.log('Order completion email sent successfully:', emailResult.id);
      }

      // Send notification email to admin
      const adminEmailResult = await sendNewOrderAdminEmail({
        order: convertedOrder,
        regime,
      });

      if (!adminEmailResult.success) {
        console.error('Failed to send admin order notification email:', adminEmailResult.error);
        // Don't fail the order creation if email fails, just log it
      } else {
        console.log('Admin order notification email sent successfully:', adminEmailResult.id);
      }
    } catch (emailError) {
      console.error('Error sending order completion email:', emailError);
      // Don't fail the order creation if email fails, just log it
    }

    // Add customer email to subscribers (non-blocking)
    // Use direct database call instead of HTTP fetch to avoid blocking
    try {
      const customerEmail = convertedOrder.contactInfo.email;
      if (customerEmail) {
        // Generate a unique ID for the subscriber (using timestamp + random string)
        const subscriberId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Direct database insert (will ignore if email already exists due to unique constraint)
        const { error: subscriberError } = await supabaseClient
          .from('subscribers')
          .insert([{
            id: subscriberId,
            email: customerEmail,
            source: 'checkout',
            is_active: true
          }])
          .select()
          .single();

        if (subscriberError) {
          // Check if it's a duplicate email error (unique constraint violation)
          if (subscriberError.code === '23505') {
            console.log('Customer email already exists in subscribers');
          } else {
            console.error('Error adding customer to subscribers:', subscriberError);
          }
        } else {
          console.log('Customer email added to subscribers successfully');
        }
      }
    } catch (subscriberError) {
      console.error('Error adding customer to subscribers:', subscriberError);
      // Don't fail the order creation if subscriber addition fails
    }

    return NextResponse.json({
      success: true,
      data: convertedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
