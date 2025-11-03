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

interface NewOrderAdminEmailProps {
  order: Order;
  regime?: Regime;
}

export function NewOrderAdminEmail({
  order,
  regime,
}: NewOrderAdminEmailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  return (
    <BaseEmailLayout preview={`New Order #${order.id} received`}>
      {/* Alert Header */}
      <Section className="text-center mb-8">
        <div 
          className="inline-block bg-accent px-6 py-2 rounded-full"
          style={{ 
            backgroundColor: '#ffe066',
            padding: '8px 24px', 
            marginBottom: '16px' 
          }}
        >
          <Text className="text-neutral-900 text-sm font-semibold mb-0 mobile-text-sm">
            🔔 New Order Alert
          </Text>
        </div>
        <Heading 
          className="text-2xl font-bold text-neutral-900 mt-6 mb-4 mobile-text-xl"
          style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '16px' }}
        >
          Order #${order.id} Received
        </Heading>
        <Text 
          className="text-neutral-600 text-base leading-6 mobile-text-base"
          style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}
        >
          A new order has been placed and requires processing.
        </Text>
      </Section>

      {/* Order Summary */}
      <Section className="mb-8">
        <div 
          className="bg-primary rounded-lg p-6"
          style={{ 
            backgroundColor: '#ef7e71',
            padding: '24px', 
            marginBottom: '32px' 
          }}
        >
          <Row>
            <Column className="w-1/2 mobile-full-width mobile-mb-4">
              <Text 
                className="text-white text-lg font-semibold mb-1 mobile-text-lg"
                style={{ color: 'white', marginBottom: '4px' }}
              >
                Order Number
              </Text>
              <Text 
                className="text-white text-base font-mono mb-0 mobile-text-base"
                style={{ color: 'white', margin: '0' }}
              >
                #{order.id}
              </Text>
            </Column>
            <Column className="w-1/2 text-right mobile-full-width mobile-center">
              <Text 
                className="text-white text-lg font-semibold mb-1 mobile-text-lg"
                style={{ color: 'white', marginBottom: '4px' }}
              >
                Total Amount
              </Text>
              <Text 
                className="text-white text-2xl font-bold mb-0 mobile-text-xl"
                style={{ 
                  color: 'white', 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0' 
                }}
              >
                {formatCurrency(order.finalAmount)}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      {/* Order Details */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Order Details
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px', marginBottom: '16px' }}
        >
          <Row className="mb-4" style={{ marginBottom: '16px' }}>
            <Column className="w-1/3 mobile-full-width mobile-mb-2">
              <Text 
                className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Order Date
              </Text>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                {formatDate(order.createdAt)}
              </Text>
            </Column>
            <Column className="w-1/3 mobile-full-width mobile-mb-2">
              <Text 
                className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Status
              </Text>
              <div 
                className="inline-block px-3 py-1 rounded-full"
                style={{
                  backgroundColor: '#ffe066',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}
              >
                <Text 
                  className="text-neutral-900 text-xs font-semibold mb-0 mobile-text-sm"
                  style={{ 
                    margin: '0', 
                    fontSize: '12px',
                    textTransform: 'capitalize' 
                  }}
                >
                  {order.status}
                </Text>
              </div>
            </Column>
            <Column className="w-1/3 mobile-full-width">
              <Text 
                className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Subscription Type
              </Text>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0', textTransform: 'capitalize' }}
              >
                {order.subscriptionType.replace('-', ' ')}
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
            Selected Regime
          </Heading>
          <div 
            className="bg-neutral-50 border border-neutral-200 rounded-lg p-6"
            style={{ padding: '24px' }}
          >
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
            <Text 
              className="text-sm font-semibold text-neutral-900 mb-2 mobile-text-sm"
              style={{ marginBottom: '8px' }}
            >
              {regime.stepCount}-Step Routine:
            </Text>
            {regime.steps.map((step, index) => (
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
                    backgroundColor: '#ef7e71',
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
            <Hr className="border-neutral-200 my-4" style={{ margin: '16px 0' }} />
            <Row>
              <Column className="w-1/3 mobile-full-width mobile-mb-2">
                <Text 
                  className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                  style={{ marginBottom: '4px' }}
                >
                  One-Time Price
                </Text>
                <Text 
                  className="text-neutral-700 text-base mb-0 mobile-text-base"
                  style={{ margin: '0' }}
                >
                  {formatCurrency(regime.priceOneTime)}
                </Text>
              </Column>
              <Column className="w-1/3 mobile-full-width mobile-mb-2">
                <Text 
                  className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                  style={{ marginBottom: '4px' }}
                >
                  3-Month Price
                </Text>
                <Text 
                  className="text-neutral-700 text-base mb-0 mobile-text-base"
                  style={{ margin: '0' }}
                >
                  {formatCurrency(regime.price3Months)}
                </Text>
              </Column>
              <Column className="w-1/3 mobile-full-width">
                <Text 
                  className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                  style={{ marginBottom: '4px' }}
                >
                  6-Month Price
                </Text>
                <Text 
                  className="text-neutral-700 text-base mb-0 mobile-text-base"
                  style={{ margin: '0' }}
                >
                  {formatCurrency(regime.price6Months)}
                </Text>
              </Column>
            </Row>
          </div>
        </Section>
      )}

      {/* Customer Information */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Customer Information
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px', marginBottom: '16px' }}
        >
          <Row className="mb-4" style={{ marginBottom: '16px' }}>
            <Column>
              <Text 
                className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Name
              </Text>
              <Text 
                className="text-neutral-700 text-base mb-0 mobile-text-base"
                style={{ margin: '0' }}
              >
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </Text>
            </Column>
          </Row>
          <Row className="mb-4" style={{ marginBottom: '16px' }}>
            <Column>
              <Text 
                className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                style={{ marginBottom: '4px' }}
              >
                Email
              </Text>
              <Text 
                className="text-neutral-700 text-base mb-0 mobile-text-base"
                style={{ margin: '0' }}
              >
                <a 
                  href={`mailto:${order.contactInfo.email}`}
                  style={{ color: '#ef7e71', textDecoration: 'none' }}
                >
                  {order.contactInfo.email}
                </a>
              </Text>
            </Column>
          </Row>
          {order.contactInfo.phoneNumber && (
            <Row>
              <Column>
                <Text 
                  className="text-sm font-semibold text-neutral-900 mb-1 mobile-text-sm"
                  style={{ marginBottom: '4px' }}
                >
                  Phone
                </Text>
                <Text 
                  className="text-neutral-700 text-base mb-0 mobile-text-base"
                  style={{ margin: '0' }}
                >
                  <a 
                    href={`tel:${order.contactInfo.phoneNumber}`}
                    style={{ color: '#ef7e71', textDecoration: 'none' }}
                  >
                    {order.contactInfo.phoneNumber}
                  </a>
                </Text>
              </Column>
            </Row>
          )}
        </div>
      </Section>

      {/* Shipping Information */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Shipping Address
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px' }}
        >
          <Text 
            className="text-neutral-900 font-semibold mb-2 text-base mobile-text-base"
            style={{ marginBottom: '8px' }}
          >
            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
          </Text>
          <Text 
            className="text-neutral-700 text-sm mb-1 mobile-text-sm"
            style={{ marginBottom: '4px' }}
          >
            {order.shippingAddress?.address}
          </Text>
          <Text 
            className="text-neutral-700 text-sm mb-1 mobile-text-sm"
            style={{ marginBottom: '4px' }}
          >
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </Text>
        </div>
      </Section>

      {/* Order Breakdown */}
      <Section className="mb-8">
        <Heading 
          className="text-lg font-semibold text-neutral-900 mb-4 mobile-text-lg"
          style={{ fontSize: '20px', marginBottom: '16px' }}
        >
          Order Breakdown
        </Heading>
        <div 
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-200"
          style={{ padding: '24px' }}
        >
          <Row className="mb-3" style={{ marginBottom: '12px' }}>
            <Column>
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                Subtotal
              </Text>
            </Column>
            <Column className="text-right">
              <Text 
                className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                style={{ margin: '0' }}
              >
                {formatCurrency(order.totalAmount)}
              </Text>
            </Column>
          </Row>
          {order.totalAmount !== order.finalAmount && (
            <Row className="mb-3" style={{ marginBottom: '12px' }}>
              <Column>
                <Text 
                  className="text-neutral-700 text-sm mb-0 mobile-text-sm"
                  style={{ margin: '0' }}
                >
                  Discount
                </Text>
              </Column>
              <Column className="text-right">
                <Text 
                  className="text-primary text-sm mb-0 mobile-text-sm"
                  style={{ margin: '0', color: '#ef7e71' }}
                >
                  -{formatCurrency(order.totalAmount - order.finalAmount)}
                </Text>
              </Column>
            </Row>
          )}
          <Hr className="border-neutral-200 my-3" style={{ margin: '12px 0' }} />
          <Row>
            <Column>
              <Text 
                className="text-neutral-900 font-semibold text-base mb-0 mobile-text-base"
                style={{ margin: '0' }}
              >
                Total
              </Text>
            </Column>
            <Column className="text-right">
              <Text 
                className="text-neutral-900 font-bold text-xl mb-0 mobile-text-lg"
                style={{ 
                  margin: '0', 
                  fontSize: '20px',
                  fontWeight: 'bold' 
                }}
              >
                {formatCurrency(order.finalAmount)}
              </Text>
            </Column>
          </Row>
        </div>
      </Section>

      <Hr className="border-neutral-200 my-8" />

      {/* Action Button */}
      <Section className="text-center">
        <Button
          href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`}
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
          View Order in Admin Panel
        </Button>
        <Text 
          className="text-xs text-neutral-500 mt-4 mb-0 mobile-text-sm"
          style={{ margin: '0', fontSize: '12px' }}
        >
          This is an automated notification from your KREGIME store.
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}
