import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// GET - Fetch bank account details for payment
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('account_holder_name, bank_name, account_number, iban')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching bank details:', error);
      return NextResponse.json({ error: 'Failed to fetch bank details' }, { status: 500 });
    }

    // If no settings exist or all fields are empty, return unavailable
    if (!data || (!data.account_holder_name && !data.bank_name && !data.account_number && !data.iban)) {
      return NextResponse.json({ 
        available: false,
        message: 'Bank transfer option is currently unavailable'
      });
    }

    return NextResponse.json({
      available: true,
      bankDetails: {
        accountHolderName: data.account_holder_name,
        bankName: data.bank_name,
        accountNumber: data.account_number,
        iban: data.iban
      }
    });
  } catch (error) {
    console.error('Error in GET /api/bank-details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
