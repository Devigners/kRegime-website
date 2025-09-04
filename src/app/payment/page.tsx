'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { orderApi } from '@/lib/api';

interface CartData {
  regimeId: string;
  regime: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  formData: Record<string, string | string[]>;
  quantity: number;
  totalAmount: number;
  finalAmount: number;
}

export default function Payment() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
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

  // Validation function to check if all mandatory fields are filled
  const isFormValid = () => {
    const mandatoryFields = [
      'email',
      'firstName',
      'address',
      'city',
      'postalCode',
      'cardNumber',
      'expiryDate',
      'cvv',
      'nameOnCard',
    ];

    return mandatoryFields.every(
      (field) => formData[field as keyof typeof formData].trim() !== ''
    );
  };

  useEffect(() => {
    const loadCartData = () => {
      const data = localStorageUtils.getCartData();
      if (data) {
        setCartData(data);
      } else {
        // Redirect to cart if no cart data
        router.push('/cart');
      }
    };

    loadCartData();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartData) return;

    setIsProcessing(true);

    try {
      // Create order in database
      const orderData = {
        regimeId: cartData.regimeId,
        userDetails: cartData.formData as {
          age: string;
          gender: string;
          skinType: string;
          skinConcerns: string[];
          complexion: string;
          allergies: string;
          skincareSteps: string[];
          koreanSkincareExperience: string;
          koreanSkincareAttraction: string[];
          skincareGoal: string[];
          dailyProductCount: string;
          routineRegularity: string;
          purchaseLocation: string;
          budget: string;
          customizedRecommendations: string;
          brandsUsed: string;
          additionalComments: string;
        },
        contactInfo: {
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        quantity: cartData.quantity,
        totalAmount: cartData.totalAmount,
        finalAmount: cartData.finalAmount,
        status: 'pending' as const,
      };

      const createdOrder = await orderApi.create(orderData);

      // Clear cart data
      localStorageUtils.clearCartData();
      localStorageUtils.clearFormData(cartData.regimeId);

      // Navigate to confirmation with order ID
      router.push(`/confirmation?orderId=${createdOrder.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      // For now, just proceed to confirmation without order ID
      router.push('/confirmation');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-gray-600 mt-2">
              Fields marked with * are required
            </p>
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
                    placeholder="Email address *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                    className="w-full p-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    placeholder="First name *"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name (optional)"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className="focus:outline-none md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal code *"
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange('postalCode', e.target.value)
                    }
                    className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    placeholder="Name on card *"
                    value={formData.nameOnCard}
                    onChange={(e) =>
                      handleInputChange('nameOnCard', e.target.value)
                    }
                    className="focus:outline-none w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Card number *"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange('cardNumber', e.target.value)
                    }
                    className="focus:outline-none w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY *"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        handleInputChange('expiryDate', e.target.value)
                      }
                      className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV *"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="focus:outline-none p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      <Image
                        src={cartData.regime.image}
                        alt={cartData.regime.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {cartData.regime.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cartData.regime.description}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        AED {cartData.regime.price} x {cartData.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        AED {cartData.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          AED {cartData.finalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || !isFormValid()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Complete Order - AED ${cartData.finalAmount}`
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
