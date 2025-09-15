import { supabase, supabaseClient } from '@/lib/supabase';
import {
  convertRegimeRowToRegime,
  convertRegimeToRegimeInsert,
  type Regime,
} from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: regimes, error } = await supabase
      .from('regimes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch regimes' },
        { status: 500 }
      );
    }

    const convertedRegimes = regimes.map(convertRegimeRowToRegime);

    return NextResponse.json({ success: true, data: convertedRegimes });
  } catch (error) {
    console.error('Error fetching regimes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch regimes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const regime: Omit<Regime, 'createdAt' | 'updatedAt'> =
      await request.json();

    const regimeInsert = convertRegimeToRegimeInsert(regime);

    const { data, error } = await supabaseClient
      .from('regimes')
      .insert([regimeInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create regime' },
        { status: 500 }
      );
    }

    const convertedRegime = convertRegimeRowToRegime(data);

    return NextResponse.json({
      success: true,
      data: convertedRegime,
    });
  } catch (error) {
    console.error('Error creating regime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create regime' },
      { status: 500 }
    );
  }
}
