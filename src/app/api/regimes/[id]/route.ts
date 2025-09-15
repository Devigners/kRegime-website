import { supabase } from '@/lib/supabase';
import { convertRegimeRowToRegime } from '@/models/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: regime, error } = await supabase
      .from('regimes')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Regime not found' },
          { status: 404 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch regime' },
        { status: 500 }
      );
    }

    const convertedRegime = convertRegimeRowToRegime(regime);

    return NextResponse.json({ success: true, data: convertedRegime });
  } catch (error) {
    console.error('Error fetching regime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch regime' },
      { status: 500 }
    );
  }
}
