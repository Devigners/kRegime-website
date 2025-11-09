import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const DEFAULT_PASSWORD = '3WC08Wyu01';
const ADMIN_USERNAME = 'admin@kregime.com';

// POST - Admin login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username matches
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get admin settings from database
    const { data: settings, error: fetchError } = await supabase
      .from('admin_settings')
      .select('password_hash')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching admin settings:', fetchError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    let isPasswordValid = false;

    if (!settings || !settings.password_hash) {
      // No password set in database, use default password
      isPasswordValid = password === DEFAULT_PASSWORD;

      // If login successful with default password, hash and save it
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        
        const { error: updateError } = await supabase
          .from('admin_settings')
          .upsert({
            password_hash: hashedPassword,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error('Error saving default password:', updateError);
        }
      }
    } else {
      // Password exists in database, compare with bcrypt
      isPasswordValid = await bcrypt.compare(password, settings.password_hash);
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json({
      success: true,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error in POST /api/admin/login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
