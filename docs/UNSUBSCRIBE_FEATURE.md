# Unsubscribe Functionality

## Overview

The unsubscribe feature allows email subscribers to opt-out of receiving newsletters from KREGIME. It provides a branded, user-friendly interface and automatically appends unsubscribe links to all newsletter emails.

## Features

### 1. Unsubscribe Page

- **URL**: `/unsubscribe?email={subscriber_email}`
- **Branding**: Matches KREGIME design system with gradient backgrounds, logo, and brand colors
- **Functionality**:
  - Checks subscription status on load
  - Shows appropriate message if already unsubscribed
  - One-click unsubscribe button
  - Success confirmation message
  - Return to home link

### 2. API Endpoints

#### POST /api/unsubscribe

Unsubscribe an email address

```typescript
Request Body:
{
  email: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

#### GET /api/unsubscribe

Check subscription status

```typescript
Query Parameters:
- email: string

Response:
{
  email: string;
  isActive: boolean;
  source: string;
}
```

### 3. Automatic Unsubscribe Links

All newsletter emails automatically include an unsubscribe link at the bottom:

- Appended to HTML content before sending
- Styled to match email design
- Personalized for each recipient

## Unsubscribe URL Format

### For Email Templates

Add this URL to your email templates:

```
https://yourdomain.com/unsubscribe?email={{EMAIL}}
```

Replace `{{EMAIL}}` with the actual subscriber email when sending.

### Direct Link Example

```
https://kregime.com/unsubscribe?email=subscriber@example.com
```

### In Newsletter API

The system automatically generates and appends the unsubscribe link:

```html
<div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
  <p>
    Don't want to receive these emails?
    <a
      href="https://yourdomain.com/unsubscribe?email=subscriber@example.com"
      style="color: #EF7E71; text-decoration: underline;"
      >Unsubscribe</a
    >
  </p>
</div>
```

## Page Design

### Visual Elements

- **Background**: Gradient from #FFF5F3 → white → #FFF9E6
- **Decorative Blurs**: Coral and yellow gradient orbs
- **Card**: White backdrop with blur effect and border
- **Header**: Gradient bar with brand colors
- **Icons**: Lucide icons with brand colors
- **Buttons**: Gradient buttons matching brand

### States

#### 1. Loading State

- Spinning loader with brand color
- Shown while checking subscription status

#### 2. Active Subscription

- Email address display
- Unsubscribe button (red gradient)
- Warning message
- Loading state during unsubscribe action

#### 3. Already Unsubscribed

- Success checkmark icon
- Confirmation message
- Return to home button

#### 4. Success State

- Large green checkmark
- Success message
- Email confirmation
- Return to home button

#### 5. Error State

- Error icon and message
- Return to home button (if invalid link)
- Retry option (if API error)

## User Flow

### Unsubscribe Journey

1. User clicks unsubscribe link in email
2. Lands on branded unsubscribe page
3. Page checks subscription status
4. If active:
   - Shows email and unsubscribe button
   - User clicks "Unsubscribe"
   - Loading indicator appears
   - Success message shown
5. If already unsubscribed:
   - Shows confirmation message
   - Offers return to home

### Resubscribe Process

Users who wish to resubscribe can:

1. Visit the main website
2. Use footer newsletter signup
3. Or subscribe during checkout

## Technical Implementation

### Database Update

When unsubscribing:

```sql
UPDATE subscribers
SET is_active = false,
    updated_at = NOW()
WHERE email = ?
```

### Email Integration

The newsletter API automatically:

1. Generates personalized unsubscribe URLs
2. Appends unsubscribe link to HTML content
3. Injects before `</body>` tag or at end
4. Maintains existing email styling

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=https://kregime.com
```

This is used to generate absolute unsubscribe URLs in emails.

## Email Template Guidelines

### Option 1: Manual Unsubscribe Link

If creating custom email templates, add this HTML at the bottom:

```html
<div
  style="text-align: center; padding: 20px; font-size: 12px; color: #666; font-family: Arial, sans-serif;"
>
  <p style="margin: 0;">
    Don't want to receive these emails?
    <a
      href="https://kregime.com/unsubscribe?email={{EMAIL}}"
      style="color: #EF7E71; text-decoration: underline;"
    >
      Unsubscribe
    </a>
  </p>
</div>
```

### Option 2: Automatic (Recommended)

The system automatically adds the unsubscribe link, so you can:

- Focus on email content
- System handles compliance
- Consistent unsubscribe experience

## Compliance Notes

### Best Practices

- ✅ Unsubscribe link in every email
- ✅ One-click unsubscribe (no login required)
- ✅ Immediate processing
- ✅ Confirmation message
- ✅ Privacy-friendly (uses email from URL)

### Legal Requirements

- CAN-SPAM Act compliant
- GDPR compliant (provides easy opt-out)
- CCPA compliant
- No additional barriers to unsubscribe

## Testing

### Test Unsubscribe Flow

1. Create a test subscriber
2. Send a test newsletter
3. Click unsubscribe link in email
4. Verify unsubscribe page loads
5. Complete unsubscribe
6. Verify subscriber marked inactive
7. Test that no future emails are sent

### Test Edge Cases

- Invalid email parameter
- Already unsubscribed user
- Malformed URLs
- Network errors
- Database failures

### Direct URL Testing

```bash
# Test with valid email
http://localhost:3000/unsubscribe?email=test@example.com

# Test without email
http://localhost:3000/unsubscribe

# Test with invalid email
http://localhost:3000/unsubscribe?email=notindb@example.com
```

## Troubleshooting

### Unsubscribe Link Not Working

1. Check `NEXT_PUBLIC_APP_URL` is set
2. Verify email parameter is URL encoded
3. Check API logs for errors
4. Verify database connection

### User Still Receiving Emails

1. Check subscriber `is_active` status in database
2. Verify newsletter API respects `is_active = true` filter
3. Check for multiple subscriber records with same email
4. Review email sending logs

### Page Not Loading

1. Verify route file exists: `/app/unsubscribe/page.tsx`
2. Check for build errors
3. Verify Suspense boundary is working
4. Check browser console for errors

## Security Considerations

### Email Privacy

- Email passed via URL parameter (not sensitive data)
- No authentication required (user-friendly)
- No account access granted
- Rate limiting recommended for API

### Database Security

- Uses service role key for admin operations
- Updates only `is_active` field
- No data deletion (for record keeping)
- Audit trail via `updated_at` timestamp

## Future Enhancements

### Potential Features

- Subscription preferences (choose email types)
- Resubscribe button on unsubscribe page
- Feedback form (why unsubscribing?)
- Email frequency options
- Category-specific unsubscribe
- Temporary pause instead of full unsubscribe
- Unsubscribe analytics dashboard

## File Structure

```
src/
  app/
    unsubscribe/
      page.tsx                    # Unsubscribe page UI
    api/
      unsubscribe/
        route.ts                  # Unsubscribe API
  types/
    database.ts                   # Subscriber types
```

## Related Documentation

- `NEWSLETTER_FEATURE.md` - Newsletter creation and management
- `NEWSLETTER_QUICK_START.md` - Setup and testing guide
- `SEO_IMPLEMENTATION.md` - For meta tags on unsubscribe page
