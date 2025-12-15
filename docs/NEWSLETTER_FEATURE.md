# Newsletter Feature Implementation

## Overview

The newsletter feature allows administrators to create and send HTML email newsletters to subscribers based on their subscription source.

## Features

### 1. Email Management Page

- **Location**: `/admin/email`
- **Navigation**: Renamed "Subscribers" menu item to "Email" in admin navigation
- **Two Tabs**:
  - **Subscribers Tab**: Manage email subscribers
  - **Newsletters Tab**: View newsletter history

### 2. Subscribers Management

All existing subscriber management functionality is preserved:

- View all subscribers with pagination
- Filter by source (footer, coming soon, checkout, manual)
- Filter by status (active/inactive)
- Search by email
- Toggle subscriber status
- Delete subscribers
- Export to CSV
- Statistics dashboard

### 3. Newsletter Creation

A new "Create Newsletter" button opens a modal with:

#### Newsletter Form Fields

- **Title**: Text input for email subject line
- **HTML Content**:
  - Textarea for pasting HTML code
  - File upload button for `.html` files
- **Live Preview**: Real-time preview of HTML content
- **Source Selection**: Multi-select checkboxes for subscriber sources:
  - Footer Newsletter
  - Coming Soon
  - Checkout
  - Manual
- **Recipient Count**: Shows number of active subscribers that will receive the email

#### Send Process

1. Validates all required fields
2. Fetches active subscribers from selected sources
3. Creates newsletter record in database
4. Sends emails in batches of 100 (to avoid rate limits)
5. Tracks sent/failed counts
6. Updates newsletter status

### 4. Newsletter History

View all past newsletters with:

- Title and status (draft, sending, sent, failed)
- Sources used
- Recipient statistics (total, sent, failed)
- Sent date
- Preview button to view HTML content

## Database Schema

### newsletters Table

```sql
CREATE TABLE newsletters (
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
```

## API Endpoints

### POST /api/newsletters

Send a new newsletter

```typescript
{
  title: string;
  htmlContent: string;
  sources: string[];
}
```

### GET /api/newsletters

Fetch newsletters with pagination

```typescript
Query params:
- page: number (default: 1)
- limit: number (default: 10)
```

## Email Service

Uses Resend API for sending emails:

- From address: `KREGIME <noreply@kregime.com>`
- Subject: Newsletter title
- HTML body: Newsletter HTML content
- Batch processing: 100 emails per batch with 1-second delay
- Error handling: Tracks individual send failures

## Installation & Setup

### 1. Database Migration

Run the migration to create the newsletters table:

```bash
# Using Supabase CLI
supabase db push
```

Or manually apply the migration file:
`supabase/migrations/20241216000000_add_newsletters_table.sql`

### 2. Environment Variables

Ensure `RESEND_API_KEY` is configured in `.env.local`:

```
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Update Navigation

The AdminLayout has been updated to show "Email" instead of "Subscribers"

## File Structure

```
src/
  app/
    admin/
      email/
        page.tsx              # Main email management page with tabs
        SubscribersTab.tsx    # Subscribers management + newsletter creation
        NewslettersTab.tsx    # Newsletter history
    api/
      newsletters/
        route.ts             # Newsletter API endpoints
  types/
    database.ts              # Updated with newsletters type
supabase/
  migrations/
    20241216000000_add_newsletters_table.sql
```

## Usage

### Creating a Newsletter

1. Navigate to Admin → Email
2. Stay on "Subscribers" tab
3. Click "Create Newsletter" button
4. Enter newsletter title
5. Either:
   - Paste HTML content in textarea, OR
   - Upload an HTML file
6. Preview the HTML rendering
7. Select one or more subscriber sources
8. Review recipient count
9. Click "Send Newsletter"

### Viewing Newsletter History

1. Navigate to Admin → Email
2. Switch to "Newsletters" tab
3. View all sent newsletters with statistics
4. Click eye icon to preview newsletter content

## Best Practices

### HTML Email Content

- Use inline CSS for styling
- Test emails in multiple clients
- Include unsubscribe links
- Use responsive design
- Keep file size reasonable

### Sending Strategy

- Test with small subscriber groups first
- Monitor sent/failed counts
- Review newsletter history for patterns
- Consider time zones for optimal open rates

## Security Considerations

- Admin authentication required
- RLS policies enabled on newsletters table
- API validates all inputs
- HTML content is sanitized on preview
- Rate limiting through batch processing

## Future Enhancements

- Schedule newsletters for future sending
- Email templates library
- A/B testing capabilities
- Open/click tracking
- Unsubscribe link management
- Draft saving functionality
- Rich text editor integration
