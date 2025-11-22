import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

type UpdateData = {
  account_holder_name?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  iban?: string | null;
  password_hash?: string;
  updated_at: string;
};

// GET - Fetch admin settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('id, account_holder_name, bank_name, account_number, iban, updated_at')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // If no settings exist, return empty object
    if (!data) {
      return NextResponse.json({ 
        account_holder_name: null,
        bank_name: null,
        account_number: null,
        iban: null
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update admin settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      account_holder_name,
      bank_name,
      account_number,
      iban,
      current_password,
      new_password,
      confirm_password
    } = body;

    // Get the first (and should be only) settings record
    const { data: existingSettings, error: fetchError } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing settings:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch existing settings' }, { status: 500 });
    }

    const updateData: UpdateData = {
      account_holder_name,
      bank_name,
      account_number,
      iban,
      updated_at: new Date().toISOString()
    };

    // Handle password change if provided
    if (new_password) {
      // Validate password fields
      if (!current_password) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      if (new_password !== confirm_password) {
        return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
      }

      if (new_password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
      }

      // Verify current password if one exists
      if (existingSettings?.password_hash) {
        const isValid = await bcrypt.compare(current_password, existingSettings.password_hash);
        if (!isValid) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updateData.password_hash = hashedPassword;
    }

    let result;
    
    if (existingSettings) {
      // Update existing record
      const { data, error } = await supabase
        .from('admin_settings')
        .update(updateData)
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
      }
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('admin_settings')
        .insert(updateData)
        .select()
        .single();

      if (error) {
        console.error('Error creating settings:', error);
        return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 });
      }
      result = data;
    }

    // Return data without password_hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...safeData } = result;

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      data: safeData 
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
