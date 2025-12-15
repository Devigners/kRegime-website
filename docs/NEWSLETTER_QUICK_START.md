# Newsletter Feature - Quick Start Guide

## 1. Run Database Migration

Apply the newsletter table migration to your Supabase database:

### Option A: Using Supabase CLI (Recommended)

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open and run the migration file:
   `supabase/migrations/20241216000000_add_newsletters_table.sql`

### Option C: Manual SQL Execution

Copy and paste this SQL into your Supabase SQL editor:

```sql
-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sources TEXT[] NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX idx_newsletters_status ON newsletters(status);
CREATE INDEX idx_newsletters_created_at ON newsletters(created_at DESC);

-- Enable RLS
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Add RLS policy
CREATE POLICY "Enable all access for newsletters" ON newsletters
  FOR ALL USING (true);
```

## 2. Verify Environment Variables

Ensure your `.env.local` file has the Resend API key configured:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

## 3. Restart Development Server

If you're running the dev server, restart it to pick up the new changes:

```bash
npm run dev
```

## 4. Access the Feature

1. Navigate to `/admin` and login
2. Click on "Email" in the admin navigation
3. You'll see two tabs:
   - **Subscribers**: Manage subscribers + Create newsletters
   - **Newsletters**: View newsletter history

## 5. Test Newsletter Creation

1. Go to the Subscribers tab
2. Click "Create Newsletter"
3. Enter a title like "Test Newsletter"
4. Paste or upload HTML content
5. Select subscriber sources
6. Review recipient count
7. Click "Send Newsletter"

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors for the tab components:

1. Restart your IDE/editor
2. Run `npm run build` to check for actual errors
3. The errors should resolve after TypeScript server restarts

### Migration Issues

If the migration fails:

1. Check if the newsletters table already exists
2. Verify you have proper database permissions
3. Check Supabase logs for specific errors

### Email Sending Issues

If emails aren't sending:

1. Verify RESEND_API_KEY is set correctly
2. Check Resend dashboard for API limits
3. Review newsletter status in the Newsletters tab
4. Check browser console and server logs for errors

## Configuration Notes

- **From Address**: Update `noreply@kregime.com` in `/api/newsletters/route.ts` if needed
- **Batch Size**: Currently set to 100 emails per batch (line 53 in API route)
- **Delay**: 1-second delay between batches (line 83 in API route)

## Next Steps

After successful setup:

1. Test with a small subscriber group first
2. Create HTML email templates
3. Monitor the Newsletters tab for send statistics
4. Export subscriber lists as needed from the Subscribers tab
