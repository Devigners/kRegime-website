'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        // Verify the payment session
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        
        if (data.success && data.checkoutSessionKey) {
          // Retrieve order data from localStorage
          const checkoutData = localStorage.getItem(data.checkoutSessionKey);
          
          if (!checkoutData) {
            console.error('No checkout data found in localStorage');
            setStatus('error');
            return;
          }

          const orderData = JSON.parse(checkoutData);
          
          // Create order in database
          try {
            const orderResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                regimeId: orderData.regimeId,
                userDetails: orderData.userDetails,
                contactInfo: orderData.contactInfo,
                shippingAddress: orderData.shippingAddress,
                quantity: orderData.quantity || 1,
                totalAmount: orderData.totalAmount,
                finalAmount: orderData.finalAmount,
                subscriptionType: orderData.subscriptionType,
                status: 'processing',
                stripeSessionId: sessionId,
              }),
            });

            if (!orderResponse.ok) {
              throw new Error('Failed to create order');
            }

            const orderResult = await orderResponse.json();
            
            if (orderResult.success) {
              setOrderId(orderResult.data.id);
              setStatus('success');
              
              // Clear cart and checkout data
              if (typeof window !== 'undefined') {
                localStorage.removeItem('kregime_cart');
                localStorage.removeItem(data.checkoutSessionKey);
              }
            } else {
              throw new Error('Order creation failed');
            }
          } catch (orderError) {
            console.error('Error creating order:', orderError);
            // Still show success since payment went through
            setStatus('success');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Processing Your Payment</h2>
          <p className="text-neutral-600">Please wait while we confirm your order...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-32 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-black mb-4">Payment Verification Failed</h2>
          <p className="text-neutral-600 mb-8">
            We couldn&apos;t verify your payment. If you were charged, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cart" className="btn-primary">
              Return to Cart
            </Link>
            <Link href="/" className="btn-secondary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container section-padding">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <h1 className="text-3xl font-bold text-black mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-neutral-600 mb-6">
              Thank you for your order. Your payment has been processed successfully.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-neutral-600 mb-1">Order ID</p>
                <p className="text-lg font-mono font-semibold text-black">{orderId}</p>
              </div>
            )}

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-black">Order Confirmed</p>
                  <p className="text-sm text-neutral-600">
                    We&apos;ve received your order and will start processing it right away.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-black">Email Confirmation</p>
                  <p className="text-sm text-neutral-600">
                    A confirmation email has been sent to your email address with order details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-black">Tracking Updates</p>
                  <p className="text-sm text-neutral-600">
                    You&apos;ll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {orderId && (
                <Link
                  href={`/confirmation?orderId=${orderId}`}
                  className="btn-primary"
                >
                  View Order Details
                </Link>
              )}
              <Link href="/" className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-neutral-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@kregime.com" className="text-primary hover:underline">
                support@kregime.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-32 flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
