import { supabase, supabaseClient } from '@/lib/supabase';
import {
  convertOrderRowToOrder,
  convertOrderToOrderInsert,
  type Order,
} from '@/models/database';
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
