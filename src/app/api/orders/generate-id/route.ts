import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Generate a random 8-digit number
function generateOrderId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// POST - Generate a unique 8-digit order ID
export async function POST() {
  try {
    let orderId: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Try to generate a unique ID, with a maximum number of attempts
    while (!isUnique && attempts < maxAttempts) {
      orderId = generateOrderId();
      
      // Check if this ID already exists in the database
      const { data, error } = await supabase
        .from('orders')
        .select('bank_reference_id')
        .eq('bank_reference_id', orderId)
        .maybeSingle();

      if (error) {
        console.error('Error checking order ID uniqueness:', error);
        return NextResponse.json({ error: 'Failed to generate order ID' }, { status: 500 });
      }

      // If no existing order found, the ID is unique
      if (!data) {
        isUnique = true;
        return NextResponse.json({ orderId });
      }

      attempts++;
    }

    // If we couldn't generate a unique ID after max attempts
    if (!isUnique) {
      console.error('Failed to generate unique order ID after maximum attempts');
      return NextResponse.json({ error: 'Failed to generate unique order ID' }, { status: 500 });
    }

    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  } catch (error) {
    console.error('Error in POST /api/orders/generate-id:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
