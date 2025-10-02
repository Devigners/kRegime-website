import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import { Database } from '@/types/database';

// Use proper types from the generated database types
type SubscriberRow = Database['public']['Tables']['subscribers']['Row'];
type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert'];

interface Subscriber {
  id: string;
  email: string;
  source: 'footer' | 'coming_soon' | 'checkout' | 'manual';
  isActive: boolean;
  subscribedAt: Date;
  updatedAt: Date;
}

function convertSubscriberRowToSubscriber(row: SubscriberRow): Subscriber {
  return {
    id: row.id,
    email: row.email,
    source: row.source as 'footer' | 'coming_soon' | 'checkout' | 'manual',
    isActive: row.is_active,
    subscribedAt: new Date(row.subscribed_at),
    updatedAt: new Date(row.updated_at),
  };
}

// GET: Fetch all subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source');
    const isActive = searchParams.get('is_active');
    
    const offset = (page - 1) * limit;

    // Use any for now until we regenerate types
    let query = supabase
      .from('subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (source) {
      query = query.eq('source', source);
    }
    
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    const subscribers = data?.map((row: SubscriberRow) => convertSubscriberRowToSubscriber(row)) || [];

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add a new subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400 }
      );
    }

    if (!source || !['footer', 'coming_soon', 'checkout', 'manual'].includes(source)) {
      return NextResponse.json(
        { error: 'Valid source is required (footer, coming_soon, checkout, manual)' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      // If subscriber exists but is inactive, reactivate them
      if (!existingSubscriber.is_active) {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ 
            is_active: true,
            source: source as SubscriberInsert['source'], // Update source to latest
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('Error reactivating subscriber:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscriber' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { 
            message: 'Successfully reactivated subscription!',
            subscriber: { 
              id: existingSubscriber.id, 
              email: email.toLowerCase(),
              source,
              isActive: true
            }
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'Email is already subscribed!' },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriberInsert: SubscriberInsert = {
      id: nanoid(),
      email: email.toLowerCase(),
      source: source as SubscriberInsert['source'],
      is_active: true,
    };

    const { data, error } = await supabase
      .from('subscribers')
      .insert(subscriberInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating subscriber:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe email' },
        { status: 500 }
      );
    }

    const newSubscriber = convertSubscriberRowToSubscriber(data);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed!',
        subscriber: newSubscriber
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/subscribers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}