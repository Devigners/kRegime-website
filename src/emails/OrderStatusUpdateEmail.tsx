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

interface OrderStatusUpdateEmailProps {
  order: Order;
  regime?: Regime;
  customerName: string;
  previousStatus?: Order['status'];
  trackingNumber?: string;
}

export function OrderStatusUpdateEmail({
  order,
  regime,
  customerName,
  trackingNumber,
}: OrderStatusUpdateEmailProps) {
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

  // Status configuration for email content
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return {
          emoji: '⚡',
          title: 'Your order is being processed!',
          description: 'Our skincare experts are carefully curating your products based on your skin profile.',
          color: '#f59e0b', // amber
          timeline: 'We\'re selecting the perfect products for your skin type and preparing your personalized regime.',
          nextStep: 'Your order will be shipped within 1-2 business days.',
        };
      case 'shipped':
        return {
          emoji: '🚚',
          title: 'Your order is on its way!',
          description: 'Your kRegime package has been shipped and is heading to your doorstep.',
          color: '#3b82f6', // blue
          timeline: 'Your skincare journey is traveling to you right now!',
          nextStep: 'You should receive your package within 3-5 business days.',
        };
      case 'completed':
        return {
          emoji: '✨',
          title: 'Your order has been delivered!',
          description: 'Welcome to your new skincare routine! Time to start your transformation.',
          color: '#10b981', // green
          timeline: 'Your kRegime package has arrived and your skincare journey begins now.',
          nextStep: 'Follow your personalized routine guide for the best results.',
        };
      case 'cancelled':
        return {
          emoji: '❌',
          title: 'Your order has been cancelled',
          description: 'We\'ve processed the cancellation of your order and will refund you shortly.',
          color: '#E8B4B4', // red
          timeline: 'Your order has been successfully cancelled.',
          nextStep: 'If you have any questions, please contact our support team.',
        };
      default:
        return {
          emoji: '📦',
          title: 'Order status updated',
          description: 'There\'s been an update to your order status.',
          color: '#6b7280', // gray
          timeline: 'Your order status has been updated.',
          nextStep: 'We\'ll keep you informed of any further changes.',
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const statusTitle = `Order #${order.id} - ${statusConfig.title}`;

  return (
    <BaseEmailLayout preview={statusTitle}>
      {/* Status Update Banner */}
      <Section className="text-center mb-8">
        <div 
          className="inline-block px-6 py-2 rounded-full w-fit"
          style={{ 
            backgroundColor: statusConfig.color,
            padding: '8px 24px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <Text
            className="text-white text-sm font-semibold mb-0 mobile-text-sm w-fit"
            style={{ margin: 0, width: 'fit-content' }}
          >
            {statusConfig.emoji} Status Update
          </Text>
        </div>
        <Heading 
          className="text-2xl font-bold text-neutral-900 mt-6 mb-4 mobile-text-xl"
          style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '16px' }}
        >
          Hi {customerName}, {statusConfig.title}
        </Heading>
        <Text 
          className="text-neutral-600 text-base leading-6 mobile-text-base"
          style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}
        >
          {statusConfig.description}
        </Text>
      </Section>

      {/* Order Details */}
      <Section className="mb-8">
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px', marginBottom: '32px' }}
        >
          <Row>
            <Column className="w-1/2 mobile-full-width mobile-mb-4">
              <Text className="text-lg font-semibold text-neutral-900 mb-1 mobile-text-lg">
                Order Number
              </Text>
              <Text className="text-neutral-700 text-base font-mono mb-0 mobile-text-base">
                #{order.id}
              </Text>
            </Column>
            <Column className="w-1/2 text-right mobile-full-width mobile-center">
              <Text className="text-lg font-semibold text-neutral-900 mb-1 mobile-text-lg">
                Status Updated
              </Text>
              <Text className="text-neutral-700 text-base mb-0 mobile-text-base">
                {formatDate(new Date(order.updatedAt))}
              </Text>
            </Column>
          </Row>
          {trackingNumber && (
            <Row className="mt-4">
              <Column>
                <Text className="text-lg font-semibold text-neutral-900 mb-1 mobile-text-lg">
                  Tracking Number
                </Text>
                <Text 
                  className="text-neutral-700 text-base font-mono mb-0 mobile-text-base"
                  style={{ 
                    backgroundColor: '#f3f4f6',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}
                >
                  {trackingNumber}
                </Text>
              </Column>
            </Row>
          )}
        </div>
      </Section>

      {/* Status Timeline */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Order Progress
        </Heading>
        <Text 
          className="text-neutral-600 text-base mb-6 mobile-text-base"
          style={{ marginBottom: '24px' }}
        >
          {statusConfig.timeline}
        </Text>
        
        {/* Progress Steps */}
        <div style={{ display: 'block' }}>
          {['pending', 'processing', 'shipped', 'completed'].map((stepStatus, index) => {
            const isCurrentStatus = stepStatus === order.status;
            const isPastStatus = ['pending', 'processing', 'shipped', 'completed'].indexOf(order.status) > index;
            const isFutureStatus = !isCurrentStatus && !isPastStatus;
            
            let stepConfig;
            switch (stepStatus) {
              case 'pending':
            stepConfig = { emoji: '📝', title: 'Order Received', description: 'Your order has been confirmed' };
            break;
              case 'processing':
            stepConfig = { emoji: '⚡', title: 'Processing', description: 'Curating your skincare regime' };
            break;
              case 'shipped':
            stepConfig = { emoji: '🚚', title: 'Shipped', description: 'On its way to you' };
            break;
              case 'completed':
            stepConfig = { emoji: '✨', title: 'Delivered', description: 'Ready to transform your skin' };
            break;
              default:
            stepConfig = { emoji: '📦', title: stepStatus, description: '' };
            }

            return (
              <div 
                key={stepStatus}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '16px',
                    opacity: isFutureStatus ? 0.4 : 1,
                    width: '100%',
                }}
              >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            backgroundColor: isCurrentStatus ? statusConfig.color : (isPastStatus ? '#10b981' : '#e5e7eb'),
                            border: isCurrentStatus ? `2px solid ${statusConfig.color}` : 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            textAlign: 'center',
                        }}
                    >
                        <span
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                width: '100%',
                                textAlign: 'center',
                                lineHeight: '40px',
                                display: 'block',
                                fontWeight: 'bold',
                            }}
                        >
                        {isPastStatus ? '✓' : stepConfig.emoji}
                        </span>
                    </div>
                    <div style={{ flex: '1' }}>
                        <Text 
                            className="font-semibold text-neutral-900 mb-1 mobile-text-lg"
                            style={{ 
                                marginBottom: '4px',
                                fontWeight: isCurrentStatus ? 'bold' : 'semibold'
                            }}
                        >
                            {stepConfig.title}
                        </Text>
                        <Text 
                            className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                            style={{ margin: '0' }}
                        >
                            {stepConfig.description}
                        </Text>
                    </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* What's Next */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          What&apos;s next?
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px' }}
        >
          <Text 
            className="text-neutral-900 text-base mb-0 mobile-text-base"
            style={{ margin: '0' }}
          >
            {statusConfig.nextStep}
          </Text>
        </div>
      </Section>

      {/* Regime Summary (if available) */}
      {regime && (
        <Section className="mb-8">
          <Heading 
            className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
            style={{ fontSize: '20px', marginBottom: '16px' }}
          >
            Your Regime
          </Heading>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
            <div className="p-6" style={{ padding: '24px' }}>
                <Row>
                    <Text 
                        className="text-xl font-bold text-neutral-900 mb-2 mobile-text-lg"
                        style={{ fontSize: '22px', marginBottom: '8px' }}
                    >
                        {regime.name}
                    </Text>
                    <Text 
                        className="text-neutral-600 text-sm leading-5 mb-0 mobile-text-sm"
                        style={{ margin: '0' }}
                    >
                        {regime.stepCount}-step routine • {regime.description}
                    </Text>
                </Row>
                <Row className='mt-4' style={{ marginTop: '16px' }}>
                    <Text 
                    className="text-2xl font-bold text-primary mb-0 mobile-text-xl"
                    style={{ 
                        fontSize: '28px', 
                        color: '#ef7e71',
                        margin: '0',
                        fontWeight: 'bold'
                    }}
                    >
                    {formatCurrency(order.finalAmount)}
                    </Text>
                </Row>
            </div>
          </div>
        </Section>
      )}

      <Hr className="border-neutral-200 my-8" />

      {/* CTA & Support */}
      <Section className="text-center">
        <Text 
          className="text-neutral-600 text-sm mb-6 mobile-text-sm"
          style={{ marginBottom: '24px' }}
        >
          Questions about your order? Our skincare experts are here to help!
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`}
          className="inline-block text-white px-8 py-3 rounded-lg font-semibold text-base mobile-text-base"
          style={{
            background: 'linear-gradient(to right, #ef7e71, #f29287)',
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
          Track Your Order
        </Button>
        <Text 
          className="text-xs text-neutral-500 mt-4 mb-0 mobile-text-sm"
          style={{ margin: '0', fontSize: '12px' }}
        >
          Or contact us at{' '}
          <a 
            href="mailto:care@kregime.com" 
            style={{ color: '#ef7e71', textDecoration: 'none' }}
          >
            care@kregime.com
          </a>
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}