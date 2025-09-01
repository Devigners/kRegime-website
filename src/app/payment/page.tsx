'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Payment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      router.push('/confirmation');
    }, 2000);
  };

  const orderTotal = 254; // Example total

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="container section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="flex items-center text-gray-600 hover:text-primary mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange('postalCode', e.target.value)
                    }
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <CreditCard size={24} className="text-primary mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Information
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={(e) =>
                      handleInputChange('nameOnCard', e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange('cardNumber', e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange('expiryDate', e.target.value)
                      }
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mt-4">
                    <Lock size={16} className="mr-2" />
                    Your payment information is secure and encrypted
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Product</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">TRIBOX</h3>
                      <p className="text-sm text-gray-600">
                        3-step Korean skincare routine
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        AED 229
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">AED 229</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">AED 25</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          AED {orderTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Complete Order - AED ${orderTotal}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By completing your order, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
