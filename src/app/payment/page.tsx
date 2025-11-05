'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Tag, Gift } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { SubscriptionType } from '@/types';
import DirhamIcon from '@/components/icons/DirhamIcon';
import { calculatePrice } from '@/lib/pricing';

interface CartData {
  regimeId: string;
  regime: {
    id: string;
    name: string;
    description: string;
    price: number;
    priceOneTime?: number;
    price3Months?: number;
    price6Months?: number;
    discountOneTime?: number;
    discount3Months?: number;
    discount6Months?: number;
    discountReasonOneTime?: string | null;
    discountReason3Months?: string | null;
    discountReason6Months?: string | null;
    images: string[];
    steps?: string[];
    stepCount?: 3 | 5 | 7;
  };
  formData: Record<string, string | string[]>;
  quantity: number;
  subscriptionType: SubscriptionType;
  totalAmount: number;
  finalAmount: number;
  discountCode?: {
    id: string;
    code: string;
    percentageOff: number;
    stripeCouponId?: string;
  };
  isGift?: boolean;
  giftRecipient?: boolean;
  giftToken?: string;
}

function PaymentContent() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [isGiftRecipient, setIsGiftRecipient] = useState(false);
  const [giftToken, setGiftToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '+971',
    firstName: '',
    lastName: '',
    apartmentNumber: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate current price info with discounts

  const currentPriceInfo = cartData
    ? calculatePrice(
        cartData.regime as Parameters<typeof calculatePrice>[0],
        cartData.subscriptionType
      )
    : null;

  // Validation function to check if all mandatory fields are filled
  const isFormValid = () => {
    // For gift givers (not recipients), only require contact info (no shipping address needed)
    if (isGiftOrder && !isGiftRecipient) {
      const giftMandatoryFields = ['email', 'phoneNumber', 'firstName'];
      return (
        giftMandatoryFields.every(
          (field) => formData[field as keyof typeof formData].trim() !== ''
        ) && formData.phoneNumber.length > 4
      );
    }

    // For regular orders AND gift recipients, require all fields including shipping
    const mandatoryFields = [
      'email',
      'phoneNumber',
      'firstName',
      'apartmentNumber',
      'address',
      'city',
    ];

    return (
      mandatoryFields.every(
        (field) => formData[field as keyof typeof formData].trim() !== ''
      ) && formData.phoneNumber.length > 4
    ); // Ensure phone number has more than just +971
  };

  useEffect(() => {
    const loadCartData = () => {
      const data = localStorageUtils.getCartData();
      if (data) {
        // Check if this is a gift order from the data itself
        const isGift = data.isGift === true;
        const isRecipient = data.giftRecipient === true;
        const token = data.giftToken;
        
        setIsGiftOrder(isGift);
        setIsGiftRecipient(isRecipient);
        if (token) setGiftToken(token);
        
        // For gift orders or recipients, form data is not required
        if (isGift || isRecipient) {
          setCartData(data);
        } else if (data.formData && Object.keys(data.formData).length > 0) {
          // For regular orders, ensure form data exists
          setCartData(data);
        } else {
          // No form data for regular order, redirect to cart
          router.push('/cart');
        }
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
      // For gift recipients, directly create the order without Stripe payment
      if (isGiftRecipient && giftToken) {
        const orderPayload = {
          regimeId: cartData.regimeId,
          subscriptionType: cartData.subscriptionType,
          quantity: cartData.quantity,
          contactInfo: {
            email: formData.email,
            phoneNumber: formData.phoneNumber || undefined,
          },
          userDetails: cartData.formData,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName || undefined,
            apartmentNumber: formData.apartmentNumber,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          totalAmount: 0, // Gift is already paid
          finalAmount: 0,
          status: 'pending',
          giftToken: giftToken,
          isGift: true,
        };

        console.log('Submitting gift redemption:', orderPayload);

        const response = await fetch('/api/gifts/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderPayload),
        });

        console.log('Gift redemption response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Gift redemption error:', errorData);
          throw new Error(errorData.error || 'Failed to redeem gift');
        }

        const result = await response.json();
        console.log('Gift redemption successful:', result);

        // Clear cart and redirect to confirmation
        localStorageUtils.clearCartData();
        router.push(`/confirmation?orderId=${result.orderId}`);
        return;
      }

      // For regular orders and gift givers, proceed with Stripe
      // Generate a unique session key for this checkout
      const checkoutSessionKey = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save complete order data to localStorage before redirecting
      if (typeof window !== 'undefined') {
        const orderData = {
          regimeId: cartData.regimeId,
          subscriptionType: cartData.subscriptionType,
          quantity: cartData.quantity,
          contactInfo: {
            email: formData.email,
            phoneNumber: formData.phoneNumber || undefined,
          },
          totalAmount: cartData.totalAmount,
          finalAmount: cartData.finalAmount,
          discountCodeId: cartData.discountCode?.id,
          isGift: isGiftOrder,
          ...(isGiftOrder ? {
            giftGiverInfo: {
              firstName: formData.firstName,
              lastName: formData.lastName || undefined,
              email: formData.email,
              phoneNumber: formData.phoneNumber || undefined,
            }
          } : {
            userDetails: cartData.formData,
            shippingAddress: {
              firstName: formData.firstName,
              lastName: formData.lastName || undefined,
              apartmentNumber: formData.apartmentNumber,
              address: formData.address,
              city: formData.city,
            }
          })
        };

        localStorage.setItem(checkoutSessionKey, JSON.stringify(orderData));
      }

      // Create Stripe Checkout session
      const checkoutPayload = {
        regimeId: cartData.regimeId,
        subscriptionType: cartData.subscriptionType,
        quantity: cartData.quantity,
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        checkoutSessionKey,
        discountCodeId: cartData.discountCode?.id,
        stripeCouponId: cartData.discountCode?.stripeCouponId,
        isGift: isGiftOrder,
        ...(isGiftOrder ? {} : {
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName || undefined,
            apartmentNumber: formData.apartmentNumber,
            address: formData.address,
            city: formData.city,
          }
        })
      };

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error processing order:', error);
      const errorMessage = isGiftRecipient 
        ? 'Failed to complete your gift order. Please try again.' 
        : 'Failed to initiate payment. Please try again.';
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!cartData) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 md:py-32">
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 md:py-32">
      <div className="container section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/cart"
              className="flex items-center text-black hover:text-primary mb-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Cart
            </Link>
            {isGiftRecipient ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold text-black">Complete Your Gift Order</h1>
                </div>
                <p className="text-sm text-black mt-2">
                  Just provide your contact details and shipping address to complete your order. No payment required!
                </p>
              </>
            ) : isGiftOrder ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold text-black">Gift Checkout</h1>
                </div>
                <p className="text-sm text-black mt-2">
                  Enter your contact information to complete the gift purchase. The recipient will provide their details and shipping address later.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-black">Checkout</h1>
                <p className="text-sm text-black mt-2">
                  Fields marked with * are required
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-black mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
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
                </div>
                {isGiftOrder && !isGiftRecipient && (
                  <p className="text-sm text-gray-600 mt-4">
                    Your name will appear on the gift notification sent to the recipient.
                  </p>
                )}
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
                    placeholder="Phone number *"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ensure +971 prefix is always present
                      if (!value.startsWith('+971')) {
                        handleInputChange('phoneNumber', '+971');
                      } else {
                        handleInputChange('phoneNumber', value);
                      }
                    }}
                    className="w-full p-3 focus:outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </motion.div>

              {/* Shipping Address Section - Show for regular orders and gift recipients, hide for gift givers */}
              {!isGiftOrder || isGiftRecipient ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Apartment/Villa/House *"
                      value={formData.apartmentNumber}
                      onChange={(e) =>
                        handleInputChange('apartmentNumber', e.target.value)
                      }
                      className="focus:outline-none md:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address *"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      className="focus:outline-none md:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="focus:outline-none md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select City *</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      <option value="Fujairah">Fujairah</option>
                      <option value="Umm Al Quwain">Umm Al Quwain</option>
                      <option value="Al Ain">Al Ain</option>
                    </select>
                  </div>
                  {isGiftRecipient && (
                    <p className="text-sm text-primary mt-4 font-medium">
                      This is where we&apos;ll ship your gift!
                    </p>
                  )}
                </motion.div>
              ) : null}

              {/* Payment Information - Hide for gift recipients */}
              {!isGiftRecipient && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:block bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg shadow-md p-6 border-2 border-primary/20"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Lock size={24} className="text-primary mr-2" />
                    <h2 className="text-xl font-semibold text-black">
                      Secure Payment with Stripe
                    </h2>
                  </div>

                <div className="text-center space-y-3">
                  <p className="text-black">
                    You&apos;ll be redirected to Stripe&apos;s secure checkout
                    page to complete your payment.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                    <Lock size={14} />
                    <span>256-bit SSL encrypted</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                      alt="Visa"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                      alt="Mastercard"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg"
                      alt="Amex"
                      width={40}
                      height={25}
                    />
                  </div>
                </div>
              </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-black mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex flex-col items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {cartData.regime.images &&
                      cartData.regime.images.length > 0 ? (
                        <Image
                          src={cartData.regime.images[0]}
                          alt={cartData.regime.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-neutral-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">
                        {cartData.regime.name}
                      </h3>
                      <p className="text-sm text-black">
                        {cartData.regime.description}
                      </p>
                      <p className="text-xs text-neutral-600 mt-1">
                        {cartData.subscriptionType === 'one-time'
                          ? 'One-time purchase'
                          : cartData.subscriptionType === '3-months'
                            ? '3-month subscription (monthly payment)'
                            : '6-month subscription (monthly payment)'}
                      </p>

                      {/* Discount Badge */}
                      {currentPriceInfo &&
                        currentPriceInfo.hasDiscount &&
                        currentPriceInfo.discountReason && (
                          <div className="mt-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {currentPriceInfo.discountReason}{' '}
                                {currentPriceInfo.discount}% Off
                              </div>
                            </div>
                            <p className="text-xs text-green-700 font-semibold">
                              Save {currentPriceInfo.savingsAmount} AED!
                            </p>
                          </div>
                        )}

                      {/* Discount Code Badge */}
                      {cartData.discountCode && (
                        <div className="mt-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {cartData.discountCode.code} -{' '}
                              {cartData.discountCode.percentageOff}% Off
                            </div>
                          </div>
                          <p className="text-xs text-green-700 font-semibold">
                            Discount code applied!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentPriceInfo && currentPriceInfo.hasDiscount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-green-800">
                            Original Price
                          </span>
                          <span className="text-xs text-green-700 line-through flex items-center gap-1">
                            <DirhamIcon size={10} className="text-green-700" />
                            {currentPriceInfo.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-green-800">
                            Discount ({currentPriceInfo.discount}%)
                          </span>
                          <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                            -{' '}
                            <DirhamIcon size={10} className="text-green-700" />
                            {currentPriceInfo.savingsAmount}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-black">Subtotal</span>
                      <span className="text-black flex items-center gap-1">
                        <DirhamIcon size={12} className="text-black" />
                        {cartData.totalAmount}
                      </span>
                    </div>
                    {cartData.discountCode && (
                      <div className="flex justify-between">
                        <span className="text-black">
                          {cartData.discountCode.percentageOff}% Discount
                        </span>
                        <span className="text-black flex items-center gap-1">
                          - <DirhamIcon size={12} className="text-black" />
                          {Math.round(
                            cartData.totalAmount *
                              (cartData.discountCode.percentageOff / 100)
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-black">Shipping</span>
                      <span className="text-black">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-black">
                          Total
                        </span>
                        <span className="text-lg font-semibold text-black flex items-center gap-1">
                          <DirhamIcon size={14} className="text-black" />
                          {cartData.finalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || !isFormValid()}
                  className="cursor-pointer w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : isGiftRecipient ? (
                    <span className="flex items-center gap-1 justify-center">
                      <Gift className="w-5 h-5 mr-1" />
                      Complete Gift Order
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 justify-center">
                      Complete Order -{' '}
                      <DirhamIcon size={14} className="text-white" />{' '}
                      {cartData.finalAmount}
                    </span>
                  )}
                </button>

                <p className="text-xs text-black text-center mt-4">
                  By completing your order, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </motion.div>
              {!isGiftRecipient && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="block md:hidden bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg shadow-md p-6 border-2 border-primary/20"
                >
                  <div className="flex flex-col items-center justify-center gap-2 mb-4">
                    <Lock size={24} className="text-primary mr-2" />
                    <h2 className="text-xl font-semibold text-black">
                      Secure Payment with Stripe
                    </h2>
                  </div>

                <div className="text-center space-y-3">
                  <p className="text-black">
                    You&apos;ll be redirected to Stripe&apos;s secure checkout
                    page to complete your payment.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                    <Lock size={14} />
                    <span>256-bit SSL encrypted</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                      alt="Visa"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                      alt="Mastercard"
                      width={40}
                      height={25}
                    />
                    <Image
                      src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg"
                      alt="Amex"
                      width={40}
                      height={25}
                    />
                  </div>
                </div>
              </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment() {
  return <PaymentContent />;
}
