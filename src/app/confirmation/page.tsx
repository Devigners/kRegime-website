'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { orderApi, regimeApi } from '@/lib/api';
import { Order, Regime } from '@/models/database';
import Image from 'next/image';
import DirhamIcon from '@/components/icons/DirhamIcon';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [regime, setRegime] = useState<Regime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderAndRegime = async () => {
      if (!orderId) {
        console.log('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching order:', orderId);
        const orderData = await orderApi.getById(orderId);
        console.log('Order data received:', orderData);
        setOrder(orderData);

        // Fetch regime data
        if (orderData.regimeId) {
          console.log('Fetching regime:', orderData.regimeId);
          const regimeData = await regimeApi.getById(orderData.regimeId);
          console.log('Regime data received:', regimeData);
          setRegime(regimeData);
        }
      } catch (err) {
        console.error('Error fetching order/regime:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndRegime();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-40">
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-40">
        <div className="container section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-black mb-2">
              Thank you for your purchase. Your Korean skincare journey begins
              now!
            </p>
            <p className="text-red-600 text-sm mb-8">
              {error} - but your order has been processed successfully.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-40">
      <div className="container section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-black mb-2">
              Thank you for your purchase. Your Korean skincare journey begins
              now!
            </p>
            <p className="text-primary font-semibold">
              Order #{order?.id || 'Processing...'}
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Details
            </h2>

            {order && regime ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={regime.image}
                      alt={regime.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">{regime.name}</h3>
                    <p className="text-sm text-black">{regime.description}</p>
                    <p className="text-sm text-black mt-1">
                      {regime.stepCount} steps routine • Customized for{' '}
                      {order.userDetails.skinType} skin
                      {order.userDetails.skinConcerns.length > 0 && (
                        <span>
                          {' '}
                          - {order.userDetails.skinConcerns.join(', ')}
                        </span>
                      )}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-black">
                        Quantity: {order.quantity}
                      </span>
                      <span className="font-semibold text-black flex items-center gap-1">
                        <DirhamIcon size={12} className="text-black" />
                        {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-black mb-3">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-black">Age:</span>
                      <span className="ml-2 text-black">
                        {order.userDetails.age}
                      </span>
                    </div>
                    <div>
                      <span className="text-black">Gender:</span>
                      <span className="ml-2 text-black">
                        {order.userDetails.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-black">Complexion:</span>
                      <span className="ml-2 text-black">
                        {order.userDetails.complexion}
                      </span>
                    </div>
                    <div>
                      <span className="text-black">Experience:</span>
                      <span className="ml-2 text-black">
                        {order.userDetails.koreanSkincareExperience}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : order && !regime ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-black text-xs">Regime</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      {order.regimeId.toUpperCase()}
                    </h3>
                    <p className="text-sm text-black">
                      Korean skincare routine
                    </p>
                    <p className="text-sm text-black mt-1">
                      Customized for {order.userDetails.skinType} skin
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-black">
                        Quantity: {order.quantity}
                      </span>
                      <span className="font-semibold text-black flex items-center gap-1">
                        <DirhamIcon size={12} className="text-black" />
                        {order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Subtotal</span>
                    <span className="text-black flex items-center gap-1">
                      <DirhamIcon size={12} className="text-black" />
                      {order.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Shipping</span>
                    <span className="text-black">Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-black">Total</span>
                      <span className="text-black flex items-center gap-1">
                        <DirhamIcon size={14} className="text-black" />
                        {order.finalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-black text-xs">Product</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">
                      Processing Order...
                    </h3>
                    <p className="text-sm text-black">
                      Your order is being processed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-black mb-6">
              What&apos;s Next?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">
                    Confirmation Email
                  </h3>
                  <p className="text-black text-sm">
                    We&apos;ll send you an order confirmation email with all the
                    details.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Order Processing</h3>
                  <p className="text-black text-sm">
                    Our skincare experts will curate your personalized regime
                    within 1 business day.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">
                    Shipping & Delivery
                  </h3>
                  <p className="text-black text-sm">
                    Your Korean skincare regime box will be delivered within 2-3
                    business days.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-4"
          >
            <Link href="/" className="btn-primary inline-block">
              Continue Shopping
            </Link>
            <p className="text-black">
              Questions about your order?{' '}
              <a
                href="mailto:care@kregime.com"
                className="text-primary hover:text-primary-dark"
              >
                Contact our support team
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Confirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-40">
          <div className="container section-padding">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-black">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
