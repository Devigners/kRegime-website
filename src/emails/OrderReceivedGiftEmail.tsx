import {
  Button,
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { BaseEmailLayout } from './components/BaseEmailLayout';
import { Order, Regime } from '@/models/database';

interface OrderReceivedGiftEmailProps {
  order: Order;
  regime?: Regime;
  giftGiverName: string;
  giftLink: string;
}

export function OrderReceivedGiftEmail({
  order,
  regime,
  giftGiverName,
  giftLink,
}: OrderReceivedGiftEmailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  return (
    <BaseEmailLayout preview={`Gift Order #${order.id} - Share the gift of beautiful skin!`}>
      {/* Welcome Message */}
      <Section className="text-center mb-8">
        <div 
          className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-2 rounded-full"
          style={{ padding: '8px 24px', marginBottom: '16px' }}
        >
          <Text className="text-white text-sm font-semibold mb-0 mobile-text-sm">
            🎁 Thanks for your order!
          </Text>
        </div>
        <Heading 
          className="text-2xl font-bold text-neutral-900 mt-6 mb-4 mobile-text-xl"
          style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '16px' }}
        >
          Hey {giftGiverName},
        </Heading>
        <Text 
          className="text-neutral-600 text-base leading-6 mobile-text-base"
          style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}
        >
          We have received a gift order from you for your loved ones. 
          Please do not forget to share the gift link with them so they can claim the gift.
        </Text>
      </Section>

      {/* Order Details */}
      <Section className="mb-8">
        <div 
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200"
          style={{ padding: '24px', marginBottom: '32px' }}
        >
          <Row>
            <Column className="w-1/2 mobile-full-width mobile-mb-4">
              <Text className="text-lg font-semibold text-neutral-900 mb-1 mobile-text-lg">
                Gift Order Number
              </Text>
              <Text className="text-neutral-700 text-base font-mono mb-0 mobile-text-base">
                #{order.id}
              </Text>
            </Column>
            <Column className="w-1/2 text-right mobile-full-width mobile-center">
              <Text className="text-lg font-semibold text-neutral-900 mb-1 mobile-text-lg">
                Purchase Date
              </Text>
              <Text className="text-neutral-700 text-base mb-0 mobile-text-base">
                {formatDate(order.createdAt)}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Gift Details */}
      {regime && (
        <Section className="mb-8">
          <Heading 
            className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
            style={{ fontSize: '20px', marginBottom: '16px' }}
          >
            Gift Details
          </Heading>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg overflow-hidden">
            <div className="p-6" style={{ padding: '24px' }}>
              <Row>
                <Column className="w-2/3 mobile-full-width mobile-mb-4">
                  <div 
                    style={{ 
                      display: 'inline-block',
                      backgroundColor: '#9333ea',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '12px'
                    }}
                  >
                    🎁 GIFT
                  </div>
                  <Text 
                    className="text-xl font-bold text-neutral-900 mb-2 mobile-text-lg"
                    style={{ fontSize: '22px', marginBottom: '8px' }}
                  >
                    {regime.name}
                  </Text>
                  <Text 
                    className="text-neutral-600 text-sm leading-5 mb-4 mobile-text-sm"
                    style={{ marginBottom: '16px' }}
                  >
                    {regime.description}
                  </Text>
                  <div className="mb-4">
                    <Text 
                      className="text-sm font-semibold text-neutral-900 mb-2 mobile-text-sm"
                      style={{ marginBottom: '8px' }}
                    >
                      {regime.stepCount}-Step Routine Included:
                    </Text>
                    {regime.steps.slice(0, 3).map((step, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '8px' 
                        }}
                      >
                        <div 
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#9333ea',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            minWidth: '24px',
                            textAlign: 'center',
                            lineHeight: '24px',
                          }}
                        >
                          <Text 
                            className="text-white text-xs font-bold mb-0"
                            style={{ 
                              color: 'white', 
                              fontSize: '12px', 
                              margin: '0',
                              fontWeight: 'bold',
                              width: '100%',
                              textAlign: 'center',
                              lineHeight: '24px',
                              display: 'block',
                            }}
                          >
                            {index + 1}
                          </Text>
                        </div>
                        <Text 
                          className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                          style={{ margin: '0', flex: '1' }}
                        >
                          {step}
                        </Text>
                      </div>
                    ))}
                    {regime.steps.length > 3 && (
                      <Text 
                        className="text-neutral-500 text-xs mt-2 mb-0 mobile-text-sm"
                        style={{ marginTop: '8px', fontStyle: 'italic' }}
                      >
                        ...and {regime.steps.length - 3} more steps!
                      </Text>
                    )}
                  </div>
                </Column>
                <Column className="w-1/3 text-right mobile-full-width mobile-center">
                  <Text 
                    className="text-2xl font-bold mobile-text-xl"
                    style={{ 
                      fontSize: '28px', 
                      color: '#9333ea',
                      margin: '0',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(order.finalAmount)}
                  </Text>
                  <Text 
                    className="text-sm text-neutral-600 mt-2 mb-0 mobile-text-sm"
                    style={{ marginTop: '8px', fontSize: '12px' }}
                  >
                    Paid in full
                  </Text>
                </Column>
              </Row>
            </div>
          </div>
        </Section>
      )}

      {/* Share Your Gift */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Share Your Gift
        </Heading>
        <div 
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-300"
          style={{ padding: '24px' }}
        >
          <Text 
            className="text-neutral-900 font-semibold mb-3 text-base mobile-text-base"
            style={{ marginBottom: '12px' }}
          >
            Your recipient will use this link to:
          </Text>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
              <Text style={{ fontSize: '18px', marginRight: '8px', marginTop: '0', marginBottom: '0' }}>✨</Text>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0', flex: '1', paddingTop: '2px' }}
              >
                Complete their personalized skincare profile
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
              <Text style={{ fontSize: '18px', marginRight: '8px', marginTop: '0', marginBottom: '0' }}>📋</Text>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0', flex: '1', paddingTop: '2px' }}
              >
                Provide their shipping address
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: '18px', marginRight: '8px', marginTop: '0', marginBottom: '0' }}>🎉</Text>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0', flex: '1', paddingTop: '2px' }}
              >
                Receive their customized Korean skincare regime
              </Text>
            </div>
          </div>
          
          <div 
            style={{ 
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '1px solid #d8b4fe'
            }}
          >
            <Text 
              className="text-xs text-neutral-600 mb-2 mobile-text-sm"
              style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}
            >
              Gift Link:
            </Text>
            <Text 
              className="text-sm font-mono text-purple-700 mb-0 mobile-text-sm"
              style={{ 
                margin: '0',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}
            >
              {giftLink}
            </Text>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              href={giftLink}
              className="inline-block text-white px-8 py-3 rounded-lg font-semibold text-base mobile-text-base"
              style={{
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                textDecoration: 'none',
                display: 'inline-block',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '12px'
              }}
            >
              View Gift Link
            </Button>
          </div>

          <Text 
            className="text-xs text-neutral-600 text-center mt-4 mb-0 mobile-text-sm"
            style={{ marginTop: '16px', fontSize: '12px', textAlign: 'center' }}
          >
            💡 You can also view this link and share options on your order confirmation page
          </Text>
        </div>
      </Section>

      {/* What Happens Next */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          What happens next?
        </Heading>
        <div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: '16px' 
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#9333ea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px',
              }}
            >
              <Text 
                className="text-white text-sm font-bold mb-0"
                style={{ 
                  color: 'white', 
                  fontSize: '14px', 
                  margin: '0',
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '32px',
                  display: 'block',
                }}
              >
                1
              </Text>
            </div>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Share the Gift Link
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Send the gift link to your recipient via email, WhatsApp, or any messaging app. 
                They can claim it anytime!
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
            <div 
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#9333ea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px',
              }}
            >
              <Text 
                className="text-white text-sm font-bold mb-0"
                style={{ 
                  color: 'white', 
                  fontSize: '14px', 
                  margin: '0',
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '32px',
                  display: 'block',
                }}
              >
                2
              </Text>
            </div>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Recipient Claims Gift
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Your recipient will complete their skincare profile and provide their shipping 
                address. No payment required!
              </Text>
            </div>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start' 
            }}
          >
            <div 
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#9333ea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px',
              }}
            >
              <Text 
                className="text-white text-sm font-bold mb-0"
                style={{ 
                  color: 'white', 
                  fontSize: '14px', 
                  margin: '0',
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '32px',
                  display: 'block',
                }}
              >
                3
              </Text>
            </div>
            <div style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                We Process & Ship
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Once claimed, we&apos;ll curate and ship the personalized regime to your 
                recipient&apos;s address within 1-2 business days.
              </Text>
            </div>
          </div>
        </div>
      </Section>

      <Hr className="border-neutral-200 my-8" />

      {/* Support & CTA */}
      <Section className="text-center">
        <Text 
          className="text-neutral-600 text-sm mb-6 mobile-text-sm"
          style={{ marginBottom: '24px' }}
        >
          Questions about your gift order? We&apos;re here to help!
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`}
          className="inline-block text-white px-8 py-3 rounded-lg font-semibold text-base mobile-text-base"
          style={{
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            textDecoration: 'none',
            display: 'inline-block',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px'
          }}
        >
          Track Your Gift
        </Button>
        <Text 
          className="text-xs text-neutral-500 mt-4 mb-0 mobile-text-sm"
          style={{ margin: '0', fontSize: '12px' }}
        >
          Or contact us at{' '}
          <a 
            href="mailto:care@kregime.com" 
            style={{ color: '#9333ea', textDecoration: 'none' }}
          >
            care@kregime.com
          </a>
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}
