import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { BaseEmailLayout } from './components/BaseEmailLayout';

interface GiftNotificationEmailProps {
  recipientName: string;
  senderName: string;
  giftMessage?: string;
  giftUrl: string;
}

export function GiftNotificationEmail({
  recipientName,
  senderName,
  giftMessage,
  giftUrl,
}: GiftNotificationEmailProps) {
  return (
    <BaseEmailLayout preview={`${senderName} sent you a special skincare gift! 🎁`}>
      {/* Welcome Message */}
      <Section className="text-center mb-8">
        <div 
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full"
          style={{ 
            padding: '8px 24px', 
            marginBottom: '16px',
            background: 'linear-gradient(to right, #9333ea, #ec4899)'
          }}
        >
          <Text className="text-white text-sm font-semibold mb-0 mobile-text-sm">
            🎁 You&apos;ve Received a Gift!
          </Text>
        </div>
        <Heading 
          className="text-2xl font-bold text-neutral-900 mt-6 mb-4 mobile-text-xl"
          style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '16px' }}
        >
          Hi {recipientName}! 👋
        </Heading>
        <Text 
          className="text-neutral-600 text-base leading-6 mobile-text-base"
          style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}
        >
          <strong>{senderName}</strong> has gifted you a personalized Korean skincare regime from KREGIME!
        </Text>
      </Section>

      {/* Gift Icon */}
      <Section className="text-center mb-8">
        <div 
          style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #9333ea, #ec4899)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text 
            style={{ 
              fontSize: '64px', 
              margin: '0',
              lineHeight: '1'
            }}
          >
            🎁
          </Text>
        </div>
      </Section>

      {/* Personal Message */}
      {giftMessage && (
        <Section className="mb-8">
          <div 
            className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200"
            style={{ 
              padding: '24px',
              backgroundColor: '#f3e8ff',
              borderRadius: '12px',
              border: '2px solid #e9d5ff'
            }}
          >
            <Text 
              className="text-sm font-semibold text-purple-900 mb-2 mobile-text-sm"
              style={{ marginBottom: '8px', color: '#581c87' }}
            >
              Personal Message from {senderName}:
            </Text>
            <Text 
              className="text-neutral-700 text-base leading-6 mb-0 mobile-text-base italic"
              style={{ 
                fontSize: '16px', 
                lineHeight: '1.6',
                margin: '0',
                fontStyle: 'italic'
              }}
            >
              &quot;{giftMessage}&quot;
            </Text>
          </div>
        </Section>
      )}

      {/* What's Included */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          What&apos;s included in your gift?
        </Heading>
        <div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: '16px' 
            }}
          >
            <Text 
              style={{ 
                fontSize: '24px', 
                marginRight: '12px',
                lineHeight: '1'
              }}
            >
              ✨
            </Text>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Personalized Skincare Consultation
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Complete a quick questionnaire to customize your Korean skincare routine
              </Text>
            </div>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: '16px' 
            }}
          >
            <Text 
              style={{ 
                fontSize: '24px', 
                marginRight: '12px',
                lineHeight: '1'
              }}
            >
              📦
            </Text>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Premium Korean Skincare Products
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Authentic products curated specifically for your skin type and concerns
              </Text>
            </div>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start'
            }}
          >
            <Text 
              style={{ 
                fontSize: '24px', 
                marginRight: '12px',
                lineHeight: '1'
              }}
            >
              🚚
            </Text>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Free Delivery to Your Door
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Your regime will be delivered right to your doorstep - all paid for!
              </Text>
            </div>
          </div>
        </div>
      </Section>

      {/* How to Redeem */}
      <Section className="mb-8">
        <div 
          className="bg-blue-50 rounded-lg p-6 border border-blue-200"
          style={{ 
            padding: '24px',
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}
        >
          <Heading 
            className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
            style={{ fontSize: '18px', marginBottom: '16px' }}
          >
            How to claim your gift:
          </Heading>
          <ol style={{ paddingLeft: '20px', margin: '0' }}>
            <li style={{ marginBottom: '12px' }}>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Click the &quot;Claim Your Gift&quot; button below
              </Text>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Complete a quick skincare questionnaire (takes 3-5 minutes)
              </Text>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Provide your shipping address for delivery
              </Text>
            </li>
            <li>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Receive your personalized Korean skincare regime!
              </Text>
            </li>
          </ol>
        </div>
      </Section>

      {/* CTA Button */}
      <Section className="text-center mb-8">
        <Button
          href={giftUrl}
          className="inline-block text-white px-8 py-4 rounded-lg font-semibold text-lg mobile-text-base"
          style={{
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            textDecoration: 'none',
            display: 'inline-block',
            padding: '16px 48px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px'
          }}
        >
          Claim Your Gift Now
        </Button>
        <Text 
          className="text-xs text-neutral-500 mt-4 mb-0 mobile-text-sm"
          style={{ margin: '0', fontSize: '12px' }}
        >
          This link is unique to your gift and can only be used once
        </Text>
      </Section>

      <Hr className="border-neutral-200 my-8" />

      {/* Footer Message */}
      <Section className="text-center">
        <Text 
          className="text-neutral-600 text-sm mb-4 mobile-text-sm"
          style={{ marginBottom: '16px' }}
        >
          This gift is completely paid for - you just need to personalize it and provide your shipping details!
        </Text>
        <Text 
          className="text-xs text-neutral-500 mb-0 mobile-text-sm"
          style={{ margin: '0', fontSize: '12px' }}
        >
          Questions about your gift?{' '}
          <a 
            href="mailto:care@kregime.com" 
            style={{ textDecoration: 'none' }}
          >
            Contact us at care@kregime.com
          </a>
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}

export async function sendGiftNotificationEmail({
  recipientEmail,
  recipientName,
  senderName,
  giftMessage,
  giftUrl,
}: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  giftMessage?: string;
  giftUrl: string;
}) {
  const { resend } = await import('@/lib/resend');
  const { generateGiftNotificationEmail } = await import('./templates');
  
  try {
    // Generate the email HTML
    const emailHtml = generateGiftNotificationEmail({
      recipientName,
      senderName,
      giftMessage,
      giftUrl,
    });

    await resend.emails.send({
      from: 'KREGIME <no-reply@kregime.com>',
      to: recipientEmail,
      subject: `${senderName} sent you a special skincare gift! 🎁`,
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending gift notification email:', error);
    throw error;
  }
}
