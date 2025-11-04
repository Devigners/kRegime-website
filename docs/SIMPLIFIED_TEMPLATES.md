# Simplified Email Templates

All email templates have been simplified to match the structure of `template.html`.

## Template Structure

Each email now follows this simple structure:

1. **Title** - Page title (in `<title>` tag)
2. **Heading** - Main headline text
3. **Subheading** - Description text below the heading
4. **CTA Button** - Call-to-action button (optional)
5. **Footer Note** - Subtitle text at the bottom (optional)

## Template Files

### 1. Order Received Email
**File:** `src/emails/templates/orderReceivedTemplate.ts`

**Structure:**
- Title: "Order Confirmation"
- Heading: "Thank you for your order, {customerName}! 🎉"
- Subheading: Confirmation message about order being prepared
- CTA Button: "Track Your Order"
- Footer Note: Thank you message

### 2. New Order Admin Email
**File:** `src/emails/templates/newOrderAdminTemplate.ts`

**Structure:**
- Title: "New Order #{orderId} received"
- Heading: "Order #{orderId} Received"
- Subheading: "A new order has been placed and requires processing."
- CTA Button: "View Order in Admin Panel"
- Footer Note: Automated notification message

### 3. Order Status Update Email
**File:** `src/emails/templates/orderStatusUpdateTemplate.ts`

**Structure:**
- Title: "Order #{orderId} - {status}"
- Heading: "Hi {customerName}, {statusTitle}"
- Subheading: Status-specific message (processing/shipped/completed/cancelled)
- CTA Button: "Track Your Order"
- Footer Note: Support contact information

### 4. Gift Notification Email
**File:** `src/emails/templates/giftNotificationTemplate.ts`

**Structure:**
- Title: "{senderName} sent you a special skincare gift! 🎁"
- Heading: "Hi {recipientName}! 👋"
- Subheading: Gift message from sender
- CTA Button: "🎁 Claim Your Gift Now"
- Footer Note: Unique link notice and support contact

## Base Template

**File:** `src/emails/templates/emailTemplate.ts`

The base template generator accepts:

```typescript
interface EmailTemplateOptions {
  title: string;           // Page title
  heading: string;         // Main heading
  subheading: string;      // Description text
  contentSections: string; // Empty string (for future custom content)
  ctaButton: {            // Optional CTA button
    text: string;
    url: string;
  };
  footerNote?: string;     // Optional footer text
}
```

## What Was Removed

- ❌ Badge sections (colored badges with text)
- ❌ Order details sections
- ❌ Regime information sections
- ❌ Shipping information sections
- ❌ Timeline/progress indicators
- ❌ Customer information sections
- ❌ Order breakdown tables
- ❌ Gift details and instructions
- ❌ All complex HTML content sections

## What Remains

✅ Clean, simple structure matching template.html
✅ Logo header
✅ Title text (heading)
✅ Description text (subheading)
✅ CTA button (optional)
✅ Subtitle text (footer note, optional)
✅ Branded footer with social links
✅ Responsive design
✅ Email client compatibility

## Usage

All templates work the same way - they generate clean HTML emails with just the essential elements:

```typescript
// Example: Order Received Email
const html = generateOrderReceivedEmail({
  order,
  customerName: 'John Doe',
});

// Generates email with:
// - Title: "Order Confirmation"
// - Heading: "Thank you for your order, John Doe! 🎉"
// - Subheading: Confirmation message
// - Button: "Track Your Order"
// - Footer: Thank you note
```

## Design Consistency

All templates use the same:
- KREGIME branding
- DM Sans font family
- Color scheme (#ef7e71 primary, #ffe066 accent)
- 600px max width
- Responsive breakpoint at 480px
- Inline CSS for email compatibility
