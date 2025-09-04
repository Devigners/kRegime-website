import { supabase, supabaseClient } from '@/lib/supabase';
import { convertOrderRowToOrder } from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    const convertedOrder = convertOrderRowToOrder(order);

    return NextResponse.json({ success: true, data: convertedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const updateData = await request.json();

    // Add updated_at timestamp
    const finalUpdateData = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    // Use raw supabase query without strict typing for update
    const { data, error } = await supabaseClient
      .from('orders')
      .update(finalUpdateData)
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    const convertedOrder = convertOrderRowToOrder(data);

    return NextResponse.json({ success: true, data: convertedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
