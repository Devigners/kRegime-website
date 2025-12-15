import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend } from '@/lib/resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { title, htmlContent, sources } = await request.json();

    if (!title || !htmlContent || !sources || sources.length === 0) {
      return NextResponse.json(
        { error: 'Title, HTML content, and at least one source are required' },
        { status: 400 }
      );
    }

    // Get active subscribers from selected sources
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('email')
      .in('source', sources)
      .eq('is_active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found for selected sources' },
        { status: 400 }
      );
    }

    // Create newsletter record
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .insert({
        title,
        html_content: htmlContent,
        sources,
        recipient_count: subscribers.length,
        status: 'sending',
      })
      .select()
      .single();

    if (newsletterError) {
      console.error('Error creating newsletter:', newsletterError);
      return NextResponse.json(
        { error: 'Failed to create newsletter record' },
        { status: 500 }
      );
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 100;
    let sentCount = 0;
    let failedCount = 0;

    // Get app URL for variable replacement
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Function to replace variables in template
    const replaceVariables = (template: string, email: string): string => {
      return template
        .replace(/\{\{\s*email\s*\}\}/g, email)
        .replace(/\{\{\s*app-url\s*\}\}/g, appUrl);
    };

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      try {
        await Promise.all(
          batch.map(async (subscriber) => {
            try {
              // Replace variables in the HTML content for this specific subscriber
              let personalizedContent = replaceVariables(
                htmlContent,
                subscriber.email
              );

              // Add unsubscribe link to the email if not already present
              const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

              // Only add default unsubscribe footer if the template doesn't already include unsubscribe functionality
              if (!personalizedContent.includes('/unsubscribe')) {
                const emailWithUnsubscribe = personalizedContent.includes(
                  '</body>'
                )
                  ? personalizedContent.replace(
                      '</body>',
                      `<div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
                        <p>Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #EF7E71; text-decoration: underline;">Unsubscribe</a></p>
                      </div></body>`
                    )
                  : `${personalizedContent}<div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
                      <p>Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #EF7E71; text-decoration: underline;">Unsubscribe</a></p>
                    </div>`;
                personalizedContent = emailWithUnsubscribe;
              }

              await resend.emails.send({
                from: 'KREGIME <noreply@kregime.com>',
                to: subscriber.email,
                subject: title,
                html: personalizedContent,
              });
              sentCount++;
            } catch (error) {
              console.error(`Failed to send to ${subscriber.email}:`, error);
              failedCount++;
            }
          })
        );
      } catch (error) {
        console.error('Batch send error:', error);
        failedCount += batch.length;
      }

      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Update newsletter status
    const finalStatus = failedCount === subscribers.length ? 'failed' : 'sent';
    await supabase
      .from('newsletters')
      .update({
        status: finalStatus,
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString(),
      })
      .eq('id', newsletter.id);

    return NextResponse.json({
      success: true,
      newsletter: {
        ...newsletter,
        sent_count: sentCount,
        failed_count: failedCount,
        status: finalStatus,
      },
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from('newsletters')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting newsletters:', countError);
      return NextResponse.json(
        { error: 'Failed to count newsletters' },
        { status: 500 }
      );
    }

    // Get newsletters
    const { data: newsletters, error: newslettersError } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (newslettersError) {
      console.error('Error fetching newsletters:', newslettersError);
      return NextResponse.json(
        { error: 'Failed to fetch newsletters' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      newsletters: newsletters || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
}
