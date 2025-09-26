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

interface OrderCompleteEmailProps {
  order: Order;
  regime?: Regime;
  customerName: string;
}

export function OrderCompleteEmail({
  order,
  regime,
  customerName,
}: OrderCompleteEmailProps) {
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
    <BaseEmailLayout preview={`Order #${order.id} - Your kRegime journey begins now!`}>
      {/* Welcome Message */}
      <Section className="text-center mb-8">
        <div 
          className="inline-block bg-gradient-to-r from-primary to-primary-light px-6 py-2 rounded-full"
          style={{ padding: '8px 24px', marginBottom: '16px' }}
        >
          <Text className="text-neutral-900 text-sm font-semibold mb-0 mobile-text-sm">
            🎉 Order Confirmed!
          </Text>
        </div>
        <Heading 
          className="text-2xl font-bold text-neutral-900 mt-6 mb-4 mobile-text-xl"
          style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '16px' }}
        >
          Welcome to your skincare journey, {customerName}!
        </Heading>
        <Text 
          className="text-neutral-600 text-base leading-6 mobile-text-base"
          style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}
        >
          Thank you for choosing kRegime. Your personalized Korean skincare routine
          is being prepared and will be with you soon. Get ready to transform your
          skin with authentic Korean beauty products curated just for you!
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
                Order Date
              </Text>
              <Text className="text-neutral-700 text-base mb-0 mobile-text-base">
                {formatDate(order.createdAt)}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Regime Details */}
      {regime && (
        <Section className="mb-8">
          <Heading 
            className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
            style={{ fontSize: '20px', marginBottom: '16px' }}
          >
            Your Selected Regime
          </Heading>
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
            <div className="p-6" style={{ padding: '24px' }}>
              <Row>
                <Column className="w-2/3 mobile-full-width mobile-mb-4">
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
                      Your {regime.stepCount}-Step Routine:
                    </Text>
                    {regime.steps.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex items-center mb-1"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          marginBottom: '8px' 
                        }}
                      >
                        <div 
                          className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#ef7e71',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            minWidth: '24px',
                            textAlign: 'center',
                            lineHeight: '24px', // Ensures vertical centering for single-line text
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
                              lineHeight: '24px', // Ensures vertical centering
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
                  </div>
                </Column>
                <Column className="w-1/3 text-right mobile-full-width mobile-center">
                  <Text 
                    className="text-sm text-neutral-600 mb-1 mobile-text-sm"
                    style={{ marginBottom: '8px' }}
                  >
                    Quantity: {order.quantity}
                  </Text>
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
                </Column>
              </Row>
            </div>
          </div>
        </Section>
      )}

      {/* Shipping Information */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Shipping Details
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px' }}
        >
          <Text 
            className="text-neutral-900 font-semibold mb-2 text-lg mobile-text-lg"
            style={{ marginBottom: '8px' }}
          >
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </Text>
          <Text 
            className="text-neutral-700 text-sm mb-1 mobile-text-sm"
            style={{ marginBottom: '4px' }}
          >
            {order.shippingAddress.address}
          </Text>
          <Text 
            className="text-neutral-700 text-sm mb-4 mobile-text-sm"
            style={{ marginBottom: '16px' }}
          >
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </Text>
          <div 
            className="inline-block bg-accent px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: '#ffe066',
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'inline-block'
            }}
          >
            <Text 
              className="text-neutral-900 text-xs font-semibold mb-0 mobile-text-sm"
              style={{ margin: '0', fontSize: '12px' }}
            >
              📦 Free shipping included
            </Text>
          </div>
        </div>
      </Section>

      {/* What's Next */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          What happens next?
        </Heading>
        <div>
          <div 
            className="flex items-start mb-4"
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: '16px' 
            }}
          >
            <div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ef7e71',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px', // Ensures vertical centering for single-line text
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
                lineHeight: '32px', // Ensures vertical centering
                display: 'block',
              }}
              >
              1
              </Text>
            </div>
            <div className="flex-1" style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Order Processing (1-2 days)
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Our skincare experts are carefully curating your products based on your
                skin profile and preferences.
              </Text>
            </div>
          </div>
          <div 
            className="flex items-start mb-4"
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: '16px' 
            }}
          >
            <div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ef7e71',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px', // Ensures vertical centering for single-line text
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
                  lineHeight: '32px', // Ensures vertical centering
                  display: 'block',
                }}
              >
                2
              </Text>
            </div>
            <div className="flex-1" style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Shipping (3-5 days)
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Your regime will be shipped with tracking information sent to your email.
              </Text>
            </div>
          </div>
          <div 
            className="flex items-start"
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start' 
            }}
          >
            <div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 mt-1"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#ef7e71',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                marginTop: '4px',
                minWidth: '32px',
                textAlign: 'center',
                lineHeight: '32px', // Ensures vertical centering for single-line text
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
                    lineHeight: '32px', // Ensures vertical centering
                    display: 'block',
                }}
              >
                3
              </Text>
            </div>
            <div className="flex-1" style={{ flex: '1' }}>
              <Text 
                className="text-neutral-900 font-semibold text-sm mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Start Your Journey
              </Text>
              <Text 
                className="text-neutral-600 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Follow your personalized routine guide and watch your skin transform!
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