'use client';

import { motion } from 'framer-motion';
import { Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

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
              const createdOrderId = orderResult.data.id;
              
              // Clear cart and checkout data
              if (typeof window !== 'undefined') {
                localStorage.removeItem('kregime_cart');
                localStorage.removeItem(data.checkoutSessionKey);
              }
              
              // Immediately redirect to confirmation page
              window.location.href = `/confirmation?orderId=${createdOrderId}`;
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

  // Show loading state while processing, or error if something went wrong
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-20 md:py-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Processing Your Order</h2>
          <p className="text-neutral-600">Please wait while we confirm your payment and create your order...</p>
          <p className="text-sm text-neutral-500 mt-4">You will be redirected automatically</p>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gray-50 py-20 md:py-32 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold text-black mb-4">Something Went Wrong</h2>
        <p className="text-neutral-600 mb-8">
          We encountered an issue processing your order. If you were charged, please contact our support team.
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

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-20 md:py-32 flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
