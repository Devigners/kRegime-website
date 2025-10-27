'use client';

import DirhamIcon from '@/components/icons/DirhamIcon';
import PricingSwitcher from '@/components/PricingSwitcher';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { Regime } from '@/models/database';
import { SubscriptionType } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { Tag } from 'lucide-react';

interface CartData {
  regimeId: string;
  regime: Regime;
  formData: Record<string, string | string[]>;
  subscriptionType: SubscriptionType;
  totalAmount: number;
  finalAmount: number;
}

export default function Cart() {
  const [cartData, setCartData] = useState<CartData | null>(null);

  useEffect(() => {
    const loadCartData = () => {
      const data = localStorageUtils.getCartData();
      if (data) {
        // Set default subscription type if not present
        if (!data.subscriptionType) {
          data.subscriptionType = 'one-time';
        }
        setCartData(data);
      }
    };

    loadCartData();
  }, []);

  const getRegimePrice = (subscriptionType: SubscriptionType): number => {
    if (!cartData) return 0;
    
    const priceInfo = calculatePrice(cartData.regime, subscriptionType);
    return priceInfo.discountedPrice;
  };

  const updateSubscriptionType = (newSubscriptionType: SubscriptionType) => {
    if (!cartData) return;

    const newPrice = getRegimePrice(newSubscriptionType);
    const updatedCartData = {
      ...cartData,
      subscriptionType: newSubscriptionType,
      totalAmount: newPrice,
      finalAmount: newPrice,
    };

    setCartData(updatedCartData);
    localStorageUtils.saveCartData(updatedCartData);
  };

  // Get current price info for display
  const currentPriceInfo = cartData ? calculatePrice(cartData.regime, cartData.subscriptionType) : null;

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
            <div className="flex items-start space-x-4">
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

                {/* Discount Badge */}
                {currentPriceInfo && currentPriceInfo.hasDiscount && (
                  <div className="mb-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {currentPriceInfo.discount}% OFF
                      </div>
                      {currentPriceInfo.discountReason && (
                        <span className="text-xs font-semibold text-neutral-700 bg-yellow-100 px-2 py-1 rounded-full">
                          {currentPriceInfo.discountReason}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-green-700 font-semibold">
                      You save {currentPriceInfo.savingsAmount} AED on this purchase!
                    </p>
                  </div>
                )}

                {/* Subscription Type Switcher */}
                <div className="mt-6 flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-black">Purchase Option:</h4>
                  <PricingSwitcher
                    selectedType={cartData.subscriptionType}
                    onTypeChange={updateSubscriptionType}
                    className="!w-fit !mx-0 scale-85 shadow-none border !border-gray-200 transform origin-left"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {currentPriceInfo && currentPriceInfo.hasDiscount && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-green-800">Original Price</span>
                    <span className="text-sm text-green-700 line-through flex items-center gap-1">
                      <DirhamIcon size={12} className="text-green-700" />
                      {currentPriceInfo.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-green-800">Discount ({currentPriceInfo.discount}%)</span>
                    <span className="text-sm font-bold text-green-700 flex items-center gap-1">
                      - <DirhamIcon size={12} className="text-green-700" />
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
