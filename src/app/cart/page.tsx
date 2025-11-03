'use client';

import DirhamIcon from '@/components/icons/DirhamIcon';
import PricingSwitcher from '@/components/PricingSwitcher';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { calculatePrice, applyDiscountCode, hasRegimeDiscount, DiscountCodeInfo } from '@/lib/pricing';
import { Regime } from '@/models/database';
import { SubscriptionType } from '@/types';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit, Tag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CartData {
  regimeId: string;
  regime: Regime;
  formData: Record<string, string | string[]>;
  subscriptionType: SubscriptionType;
  totalAmount: number;
  finalAmount: number;
  discountCode?: DiscountCodeInfo;
}

export default function Cart() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<DiscountCodeInfo | null>(null);
  const [discountCodeError, setDiscountCodeError] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  useEffect(() => {
    const loadCartData = () => {
      const data = localStorageUtils.getCartData();
      if (data) {
        // Set default subscription type if not present
        if (!data.subscriptionType) {
          data.subscriptionType = 'one-time';
        }
        // Load discount code if present
        if (data.discountCode) {
          setAppliedDiscountCode(data.discountCode);
        }
        setCartData(data);
      }
    };

    loadCartData();
  }, []);

  const handleApplyDiscountCode = async () => {
    if (!discountCodeInput.trim()) {
      setDiscountCodeError('Please enter a discount code');
      return;
    }

    // Check if regime already has a discount
    if (cartData && hasRegimeDiscount(cartData.regime, cartData.subscriptionType)) {
      const discountPercentage = currentPriceInfo?.discount || 0;
      setDiscountCodeError(`Discount codes cannot be combined with regime discounts. You're already getting ${discountPercentage}% off!`);
      return;
    }

    setIsValidatingCode(true);
    setDiscountCodeError('');

    try {
      const response = await fetch('/api/discount-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: discountCodeInput.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        const discountCode: DiscountCodeInfo = result.discountCode;
        setAppliedDiscountCode(discountCode);
        setDiscountCodeInput('');

        // Update cart data with discount code
        if (cartData) {
          const priceInfo = calculatePrice(cartData.regime, cartData.subscriptionType);
          const priceWithCode = applyDiscountCode(priceInfo, discountCode);

          const updatedCartData = {
            ...cartData,
            discountCode,
            totalAmount: priceInfo.discountedPrice,
            finalAmount: priceWithCode.finalPriceWithCode || priceInfo.discountedPrice,
          };

          setCartData(updatedCartData);
          localStorageUtils.saveCartData(updatedCartData);
        }
      } else {
        setDiscountCodeError(result.error || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountCodeError('Failed to validate discount code');
    } finally {
      setIsValidatingCode(false);
    }
  };

  const handleRemoveDiscountCode = () => {
    setAppliedDiscountCode(null);
    setDiscountCodeError('');

    if (cartData) {
      const priceInfo = calculatePrice(cartData.regime, cartData.subscriptionType);

      const updatedCartData = {
        ...cartData,
        discountCode: undefined,
        totalAmount: priceInfo.discountedPrice,
        finalAmount: priceInfo.discountedPrice,
      };

      setCartData(updatedCartData);
      localStorageUtils.saveCartData(updatedCartData);
    }
  };

  const updateSubscriptionType = (newSubscriptionType: SubscriptionType) => {
    if (!cartData) return;

    // Clear discount code when changing subscription type
    setAppliedDiscountCode(null);
    setDiscountCodeError('');

    const priceInfo = calculatePrice(cartData.regime, newSubscriptionType);
    const newPrice = priceInfo.discountedPrice;

    const updatedCartData = {
      ...cartData,
      subscriptionType: newSubscriptionType,
      discountCode: undefined,
      totalAmount: newPrice,
      finalAmount: newPrice,
    };

    setCartData(updatedCartData);
    localStorageUtils.saveCartData(updatedCartData);
  };

  // Get current price info for display
  const currentPriceInfo = cartData ? calculatePrice(cartData.regime, cartData.subscriptionType) : null;

  // Helper function to format answers for display
  const getQuestionLabel = (key: string): string => {
    const labels: Record<string, string> = {
      age: 'Age Range',
      gender: 'Gender',
      skinType: 'Skin Type',
      skinConcerns: 'Primary Skin Concerns',
      complexion: 'Complexion',
      allergies: 'Allergies/Sensitivities',
      skincareSteps: 'Skincare Steps',
      skincareGoal: 'Skincare Goals',
      koreanSkincareExperience: 'Korean Skincare Experience',
      koreanSkincareAttraction: 'What Attracts You to Korean Skincare',
      dailyProductCount: 'Daily Product Count',
      routineRegularity: 'Routine Regularity',
      purchaseLocation: 'Purchase Location',
      budget: 'Monthly Budget',
      brandsUsed: 'Brands Used',
      additionalComments: 'Additional Comments',
    };
    return labels[key] || key;
  };

  // Map form field keys to their corresponding step numbers in the form
  const getQuestionStep = (key: string): number => {
    const stepMap: Record<string, number> = {
      age: 1,
      gender: 2,
      skinType: 3,
      skinConcerns: 4,
      complexion: 5,
      allergies: 6,
      skincareSteps: 7,
      skincareGoal: 8,
      koreanSkincareExperience: 9,
      koreanSkincareAttraction: 10,
      dailyProductCount: 11,
      routineRegularity: 12,
      purchaseLocation: 13,
      budget: 14,
      brandsUsed: 15,
      additionalComments: 16,
    };
    return stepMap[key] || 1;
  };

  const formatAnswer = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not answered';
    }
    return value || 'Not answered';
  };

  const handleEditAnswers = () => {
    if (!cartData) return;
    
    // Navigate back to regime-form with the product ID and subscription type
    router.push(`/regime-form?product=${cartData.regimeId}&subscription=${cartData.subscriptionType}`);
  };

  const handleEditSpecificAnswer = (key: string) => {
    if (!cartData) return;
    
    const step = getQuestionStep(key);
    // Save the target step to localStorage so the form knows where to navigate
    localStorage.setItem(`currentStep_${cartData.regimeId}`, step.toString());
    
    // Navigate back to regime-form with the product ID and subscription type
    router.push(`/regime-form?product=${cartData.regimeId}&subscription=${cartData.subscriptionType}`);
  };

  if (!cartData) {
    return (
      <div className="container section-padding py-40 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-black mb-8">
          Looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link href="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container section-padding py-40">
      <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex flex-col items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                {cartData.regime.images && cartData.regime.images.length > 0 ? (
                  <Image
                    src={cartData.regime.images[0]}
                    alt={cartData.regime.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-neutral-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {cartData.regime.name}
                </h3>
                <p className="text-black text-sm mb-3">
                  {cartData.regime.description}
                </p>

                {/* Subscription Type Switcher */}
                <div className="mt-6 flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-black">Purchase Option:</h4>
                  <PricingSwitcher
                    selectedType={cartData.subscriptionType}
                    onTypeChange={updateSubscriptionType}
                    className="!w-fit !px-0 !mx-0 scale-85 shadow-none transform origin-left"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Answers Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Your Regime Answers</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditAnswers}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                >
                  <Edit size={16} />
                  <span>Edit Answers</span>
                </button>
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <span>{showAnswers ? 'Hide' : 'View'} Answers</span>
                  {showAnswers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {showAnswers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4 pt-4 border-t border-gray-200"
              >
                {Object.entries(cartData.formData).map(([key, value]) => {
                  const answer = formatAnswer(value);
                  if (answer === 'Not answered') return null;
                  
                  return (
                    <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0 group">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-black mb-1">
                            {getQuestionLabel(key)}
                          </h4>
                          <p className="text-sm text-gray-700">{answer}</p>
                        </div>
                        <button
                          onClick={() => handleEditSpecificAnswer(key)}
                          className="flex-shrink-0 cursor-pointer p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all opacity-0 group-hover:opacity-100"
                          title="Edit this answer"
                        >
                          <Edit size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {currentPriceInfo && currentPriceInfo.hasDiscount && !appliedDiscountCode && (
                <div className="border-2 border-primary rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">Original Price</span>
                    <span className="text-sm line-through flex items-center gap-1">
                      <DirhamIcon size={12} />
                      {currentPriceInfo.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{currentPriceInfo.discountReason} {currentPriceInfo.discount}% Off</span>
                    <span className="text-sm font-bold  flex items-center gap-1">
                      - <DirhamIcon size={12} />
                      {currentPriceInfo.savingsAmount}
                    </span>
                  </div>
                </div>
              )}

              {/* Discount Code Section - Show by default unless code is already applied */}
              {!appliedDiscountCode && (
                <div className=" border-gray-300 rounded-lg">
                  <label className="block text-sm font-semibold text-black mb-2">
                    Have a discount code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscountCode()}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-sm focus:outline-none"
                      disabled={isValidatingCode}
                    />
                    <button
                      onClick={handleApplyDiscountCode}
                      disabled={isValidatingCode}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidatingCode ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {discountCodeError && (
                    <p className="text-xs text-red-600 mt-2">{discountCodeError}</p>
                  )}
                </div>
              )}

              {/* Applied Discount Code */}
              {appliedDiscountCode && (
                <div className="border-2 border-primary rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      <span className="text-sm font-bold">Code {appliedDiscountCode.code} Applied</span>
                    </div>
                    <button
                      onClick={handleRemoveDiscountCode}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Remove discount code"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-black">Subtotal</span>
                <span className="text-black flex items-center gap-1">
                  <DirhamIcon size={12} className="text-black" />
                  {cartData.totalAmount}
                </span>
              </div>
              {appliedDiscountCode && (
                <div className="flex justify-between ">
                  <span className="font-semibold">Discount ({appliedDiscountCode.percentageOff}%)</span>
                  <span className="font-semibold flex items-center gap-1">
                    - <DirhamIcon size={12} className="" />
                    {(() => {
                      const priceInfo = calculatePrice(cartData.regime, cartData.subscriptionType);
                      const priceWithCode = applyDiscountCode(priceInfo, appliedDiscountCode);
                      return priceWithCode.additionalSavingsFromCode;
                    })()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black">Shipping</span>
                <span className="text-black">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
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
            <Link
              href="/payment"
              className="w-full btn-primary text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
