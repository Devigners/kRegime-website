# Newsletter Feature Implementation

## Overview

The newsletter feature allows administrators to create and send HTML email newsletters to subscribers based on their subscription source. All emails automatically include an unsubscribe link for compliance and user preference management.

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
4. **Automatically adds unsubscribe link to each email**
5. Sends emails in batches of 100 (to avoid rate limits)
6. Tracks sent/failed counts
7. Updates newsletter status

### 4. Unsubscribe Functionality

#### Automatic Unsubscribe Link

Every newsletter email automatically includes an unsubscribe link at the bottom with KREGIME branding:

- Text: "Don't want to receive these emails? Unsubscribe"
- Color: `#EF7E71` (KREGIME brand color)
- Styled consistently with brand guidelines

#### Unsubscribe URL Format

```
${NEXT_PUBLIC_APP_URL}/unsubscribe?email=${subscriberEmail}
```

**Example**: `https://kregime.com/unsubscribe?email=user@example.com`

#### Unsubscribe Page Features (`/unsubscribe`)

- **Brand-consistent design** with KREGIME color palette
- Displays subscriber's email address
- Shows current subscription status
- One-click unsubscribe button
- Confirmation message after unsubscribing
- Option to return to homepage
- Handles edge cases:
  - Already unsubscribed users
  - Invalid/missing email parameter
  - Subscriber not found

#### Unsubscribe API (`/api/unsubscribe`)

- **POST**: Unsubscribe a user (sets `is_active` to `false`)
- **GET**: Check subscription status
- Returns appropriate error messages
- Updates `updated_at` timestamp

### 5. Newsletter History

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

**Note**: Unsubscribe link is automatically appended to all emails.

### GET /api/newsletters

Fetch newsletters with pagination

```typescript
Query params:
- page: number (default: 1)
- limit: number (default: 10)
```

### POST /api/unsubscribe

Unsubscribe a user from the mailing list

```typescript
{
  email: string;
}
```

### GET /api/unsubscribe

Check subscription status

```typescript
Query params:
- email: string
```

## Email Service

Uses Resend API for sending emails:

- From address: `KREGIME <noreply@kregime.com>`
- Subject: Newsletter title
- HTML body: Newsletter HTML content + **automatic unsubscribe link**
- Batch processing: 100 emails per batch with 1-second delay
- Error handling: Tracks individual send failures
- **Unsubscribe link**: Automatically appended to every email using `NEXT_PUBLIC_APP_URL`

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

Ensure these variables are configured in `.env.local`:

```
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important**: The `NEXT_PUBLIC_APP_URL` is used to construct unsubscribe links in emails.

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
        route.ts              # Newsletter API endpoints
      unsubscribe/
        route.ts              # Unsubscribe API endpoints
    unsubscribe/
      page.tsx                # Brand-consistent unsubscribe page
  types/
    database.ts               # Updated with newsletters type
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

**Note**: Unsubscribe link will be automatically added to all emails.

### Viewing Newsletter History

1. Navigate to Admin → Email
2. Switch to "Newsletters" tab
3. View all sent newsletters with statistics
4. Click eye icon to preview newsletter content

### Email Template Best Practices

When creating HTML email templates, you don't need to add an unsubscribe link manually. The system automatically appends:

```html
<div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
  <p>
    Don't want to receive these emails?
    <a
      href="[UNSUBSCRIBE_URL]"
      style="color: #EF7E71; text-decoration: underline;"
      >Unsubscribe</a
    >
  </p>
</div>
```

However, if you want to include your own unsubscribe link in your template, use:

```
{{UNSUBSCRIBE_URL}}
```

This will be replaced with the actual unsubscribe URL for each recipient.

## Best Practices

### HTML Email Content

- Use inline CSS for styling
- Test emails in multiple clients
- **Unsubscribe links are added automatically** - no need to include them manually
- Use responsive design
- Keep file size reasonable
- Use KREGIME brand colors for consistency

### Sending Strategy

- Test with small subscriber groups first
- Monitor sent/failed counts
- Review newsletter history for patterns
- Consider time zones for optimal open rates

## Security Considerations

- Admin authentication required
- RLS policies enabled on newsletters table
- API validates all inputs
- Unsubscribe links are secure and user-specific
- Email addresses are URL-encoded in unsubscribe links
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
