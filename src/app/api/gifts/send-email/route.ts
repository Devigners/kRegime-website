import { NextRequest, NextResponse } from 'next/server';
import { sendGiftNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftToken, recipientEmail, recipientName, giftMessage, senderName } = body;

    if (!giftToken || !recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Construct the gift redemption URL
    const giftUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/gift/${giftToken}`;

    // Send the gift notification email
    await sendGiftNotificationEmail({
      recipientEmail,
      recipientName,
      senderName,
      giftMessage: giftMessage || '',
      giftUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending gift email:', error);
    return NextResponse.json(
      { error: 'Failed to send gift email' },
      { status: 500 }
    );
  }
}
