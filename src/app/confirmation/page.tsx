'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail, Package, Truck } from 'lucide-react';
import Link from 'next/link';

export default function Confirmation() {
  const orderNumber = 'KR6I2R6AUE';

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase. Your Korean skincare journey begins
              now!
            </p>
            <p className="text-primary font-semibold">Order #{orderNumber}</p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Product</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">TRIBOX</h3>
                  <p className="text-sm text-gray-600">
                    3-step Korean skincare routine
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Customized for Combination skin
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Quantity: 1</span>
                    <span className="font-semibold text-gray-900">AED 229</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">AED 229</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">AED 25</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">AED 254</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What&apos;s Next?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Confirmation Email
                  </h3>
                  <p className="text-gray-600 text-sm">
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
                  <h3 className="font-semibold text-gray-900">
                    Order Processing
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our skincare experts will curate your personalized products
                    within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Shipping & Delivery
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your Korean skincare regime box will be delivered within 5-7
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
            <p className="text-gray-600">
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
