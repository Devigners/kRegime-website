import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a non-typed client for complex operations where types are too strict
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that need service role access
// Function to create admin client only when needed on server-side
export function createSupabaseAdmin() {
  // Check if we're on the server side
  if (typeof window !== 'undefined') {
    throw new Error('Admin client can only be created on server-side');
  }
  
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing Supabase service role key');
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
