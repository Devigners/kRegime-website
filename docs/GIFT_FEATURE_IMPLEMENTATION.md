# Gift Functionality Implementation Guide

## Overview
This document outlines the implementation of the "Give as Gift" feature for kRegime.

## ✅ Completed Components

### 1. Database Migration
**File:** `supabase/migrations/20250103_add_gift_functionality.sql`
- Added gift-related columns to orders table
- Created indexes for performance
- Fields: is_gift, gift_token, gift_giver_*, gift_claimed, gift_recipient_*

### 2. TypeScript Types
**Files:** 
- `src/types/database.ts` - Updated orders table types
- `src/types/index.ts` - Added Order interface with gift fields

### 3. ProductCard Component  
**File:** `src/components/ProductCard.tsx`
- Added "Give as Gift" button
- Routes to cart with `?gift=true&product={id}&subscription={type}`

### 4. Cart Page
**File:** `src/app/cart/page.tsx`
- Detects gift orders from URL parameters
- Shows gift giver information form
- Validates gift giver details
- Saves gift data to localStorage separately
- Hides regime form answers for gift orders

## 🔨 Implementation Needed

### 5. API Endpoints

#### a. GET `/api/regimes/[id]/route.ts`
```typescript
// Fetch single regime by ID for gift orders
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('regimes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return Response.json({ error: 'Regime not found' }, { status: 404 });
  }

  return Response.json(data);
}
```

#### b. POST `/api/gifts/send/route.ts`
```typescript
// Send gift email or generate shareable link
export async function POST(request: Request) {
  const { giftToken, method, recipientEmail } = await request.json();
  
  if (method === 'email') {
    // Send email with gift link
  }
  
  return Response.json({
    success: true,
    giftLink: `${process.env.NEXT_PUBLIC_SITE_URL}/gift/${giftToken}`
  });
}
```

#### c. GET `/api/gifts/[token]/route.ts`
```typescript
// Validate gift token and get gift order details
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  // Fetch order with gift_token
  // Check if not claimed
  // Return order details + regime info
}
```

#### d. POST `/api/gifts/[token]/claim/route.ts`
```typescript
// Claim a gift (fill form + provide shipping address)
export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  // Update order with:
  // - user_details (form data)
  // - shipping_address
  // - gift_claimed = true
  // - gift_claimed_at = now
  // - gift_recipient_name, gift_recipient_email
}
```

### 6. Payment Page Updates
**File:** `src/app/payment/page.tsx`

**Changes Needed:**
- Detect `?gift=true` from URL
- Load gift cart data from localStorage
- Load gift giver info
- Show only name, email, phone (no shipping address)
- Create Stripe session with gift metadata
- After payment, redirect to success page with gift flag

**Key Code:**
```typescript
// In payment page
const isGiftOrder = searchParams.get('gift') === 'true';

if (isGiftOrder) {
  const giftCartData = JSON.parse(localStorage.getItem('giftCartData') || '{}');
  const giftGiverInfo = JSON.parse(localStorage.getItem('giftGiverInfo') || '{}');
  // ... handle gift payment flow
}
```

### 7. Payment Success Page
**File:** `src/app/payment/success/page.tsx`

**Changes Needed:**
- Detect if order is a gift
- Show gift sharing options:
  - Copy link button
  - Send via email (input email + send button)
- Display gift token/link
- Provide instructions for sharing

**UI Components:**
```tsx
{order.is_gift && !order.gift_claimed && (
  <div className="gift-sharing-section">
    <h2>Share Your Gift</h2>
    <div className="gift-link">
      <input value={`${siteUrl}/gift/${order.gift_token}`} readOnly />
      <button onClick={copyToClipboard}>Copy Link</button>
    </div>
    <div className="email-sharing">
      <input type="email" placeholder="Recipient's email" />
      <button onClick={sendGiftEmail}>Send via Email</button>
    </div>
  </div>
)}
```

### 8. Gift Redemption Page
**File:** `src/app/gift/[token]/page.tsx` (NEW)

**Purpose:** Recipient lands here to claim their gift

**Features:**
- Display gift giver name
- Show regime details
- "Claim Gift" button → redirects to regime form with token
- Check if already claimed

**Sample Structure:**
```tsx
export default function GiftRedemptionPage({ params }: { params: { token: string } }) {
  // Fetch gift details using token
  // Check if claimed
  
  return (
    <div className="gift-redemption">
      <h1>🎁 You've Received a Gift!</h1>
      <p>From: {giftGiverName}</p>
      <div className="regime-preview">
        {/* Show regime details */}
      </div>
      {!giftClaimed ? (
        <Link href={`/regime-form?giftToken=${token}`}>
          Claim Your Gift
        </Link>
      ) : (
        <p>This gift has already been claimed</p>
      )}
    </div>
  );
}
```

### 9. Regime Form Updates
**File:** `src/app/regime-form/page.tsx`

**Changes Needed:**
- Detect `giftToken` from URL parameters
- If present, load gift order details
- After form completion, don't create new order
- Update existing gift order with form data
- Redirect to cart with `?giftToken={token}` (shows $0 total)

### 10. Orders API Updates
**File:** `src/app/api/orders/route.ts`

**Changes Needed:**

**POST endpoint:**
- Handle gift order creation
- Generate unique gift_token (use crypto.randomUUID())
- Save gift giver information
- Set is_gift = true
- Don't require shipping_address or user_details initially

**Example:**
```typescript
if (isGiftOrder) {
  const giftToken = crypto.randomUUID();
  
  await supabase.from('orders').insert({
    id: crypto.randomUUID(),
    regime_id: regimeId,
    subscription_type: subscriptionType,
    total_amount: amount,
    final_amount: finalAmount,
    is_gift: true,
    gift_token: giftToken,
    gift_giver_name: `${giverInfo.firstName} ${giverInfo.lastName}`,
    gift_giver_email: giverInfo.email,
    gift_giver_phone: giverInfo.phone,
    gift_claimed: false,
    status: 'pending',
    // Empty values for recipient data
    contact_info: {},
    shipping_address: {},
    user_details: {}
  });
}
```

### 11. Gift Email Templates
**Files:** 
- `src/emails/GiftNotificationEmail.tsx` (NEW)
- `src/emails/GiftClaimedNotificationEmail.tsx` (NEW)

**GiftNotificationEmail** - Sent to recipient:
```tsx
<Email>
  <h1>You've Received a Gift! 🎁</h1>
  <p>From: {giverName}</p>
  <p>You've been gifted a personalized skincare regime!</p>
  <Button href={giftClaimUrl}>Claim Your Gift</Button>
</Email>
```

**GiftClaimedNotificationEmail** - Sent to giver:
```tsx
<Email>
  <h1>Your Gift Has Been Claimed! 🎉</h1>
  <p>Great news! Your gift to {recipientName} has been claimed.</p>
  <p>They're now enjoying their personalized skincare regime.</p>
</Email>
```

### 12. Admin Orders Page Updates
**File:** `src/app/admin/orders/page.tsx`

**Changes Needed:**
- Add "Gift" indicator badge
- Show gift status: "Paid - Awaiting Claim" or "Paid - Claimed"
- Display giver and recipient information
- Add filters for gift orders
- Show gift claim date

**UI Additions:**
```tsx
{order.is_gift && (
  <div className="gift-info">
    <Badge>🎁 Gift Order</Badge>
    <div>
      <strong>Giver:</strong> {order.gift_giver_name} ({order.gift_giver_email})
    </div>
    {order.gift_claimed ? (
      <>
        <div><strong>Recipient:</strong> {order.gift_recipient_name}</div>
        <div><strong>Claimed:</strong> {formatDate(order.gift_claimed_at)}</div>
        <Badge variant="success">Claimed</Badge>
      </>
    ) : (
      <Badge variant="warning">Awaiting Claim</Badge>
    )}
  </div>
)}
```

## 🔄 User Flow Diagrams

### Gift Giver Flow:
1. Browse products → Click "Give as Gift"
2. Cart page: Select subscription, enter giver info
3. Payment page: Enter payment details (no shipping)
4. Payment success: Get gift link + share options
5. Share link/email with recipient

### Gift Recipient Flow:
1. Receive gift link/email
2. Click link → Gift redemption page
3. Click "Claim Gift" → Regime form
4. Complete regime form
5. Cart page (shows $0 total)
6. Checkout: Enter email, phone, shipping address
7. Complete order (no payment required)

## 🔐 Security Considerations

1. **Gift Token:**
   - Use crypto.randomUUID() for unpredictable tokens
   - Index gift_token column for fast lookups
   - Check token validity and claim status

2. **One-time Claim:**
   - Validate gift_claimed === false before allowing claim
   - Update gift_claimed_at timestamp
   - Prevent double claims

3. **Email Validation:**
   - Verify email format for gift giver and recipient
   - Rate limit gift email sending

## 🧪 Testing Checklist

- [ ] Gift order creation with valid giver info
- [ ] Gift link generation and uniqueness
- [ ] Gift redemption page loads correctly
- [ ] Regime form submission with gift token
- [ ] Cart shows $0 for recipient
- [ ] Checkout without payment for recipient
- [ ] Gift claimed status updates
- [ ] Admin can view gift orders correctly
- [ ] Email notifications sent properly
- [ ] Gift token cannot be claimed twice
- [ ] Invalid/expired gift tokens handled gracefully

## 📝 Environment Variables Needed

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
RESEND_API_KEY=your_resend_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Deployment Steps

1. Run database migration
2. Deploy updated code
3. Test gift flow end-to-end
4. Monitor admin dashboard for gift orders
5. Set up email templates in Resend

## 📞 Support

For issues or questions about gift orders:
- Check admin dashboard for gift status
- Verify gift token in database
- Check email delivery logs
- Review Stripe payment metadata

---

**Note:** This is a comprehensive feature. Implement and test each component thoroughly before moving to the next.
