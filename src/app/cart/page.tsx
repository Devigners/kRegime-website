'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { Regime } from '@/models/database';
import DirhamIcon from '@/components/icons/DirhamIcon';

interface CartData {
  regimeId: string;
  regime: Regime;
  formData: Record<string, string | string[]>;
  quantity: number;
  totalAmount: number;
  finalAmount: number;
}

export default function Cart() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [, setQuantity] = useState(1);

  useEffect(() => {
    const loadCartData = () => {
      const data = localStorageUtils.getCartData();
      if (data) {
        setCartData(data);
        setQuantity(data.quantity || 1);
      }
    };

    loadCartData();
  }, []);

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1 || !cartData) return;

    setQuantity(newQuantity);

    const updatedCartData = {
      ...cartData,
      quantity: newQuantity,
      totalAmount: cartData.regime.price * newQuantity,
      finalAmount: cartData.regime.price * newQuantity,
    };

    setCartData(updatedCartData);
    localStorageUtils.saveCartData(updatedCartData);
  };

  const removeItem = () => {
    localStorageUtils.clearCartData();
    setCartData(null);
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
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  src={cartData.regime.image}
                  alt={cartData.regime.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {cartData.regime.name}
                </h3>
                <p className="text-black text-sm mb-3">
                  {cartData.regime.description}
                </p>

                <div className="text-sm text-black mb-3">
                  <p>
                    Skin Type: {cartData.formData.skinType || 'Not specified'}
                  </p>
                  {cartData.formData.skinConcerns &&
                    Array.isArray(cartData.formData.skinConcerns) &&
                    cartData.formData.skinConcerns.length > 0 && (
                      <p>
                        Concerns: {cartData.formData.skinConcerns.join(', ')}
                      </p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(cartData.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">{cartData.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartData.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-black flex items-center gap-2 justify-end">
                      <DirhamIcon size={16} className="text-black" />
                      {cartData.totalAmount}
                    </p>
                    <button
                      onClick={removeItem}
                      className="text-red-500 hover:text-red-700 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
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
            <Link
              href="/"
              className="w-full text-center text-primary hover:text-primary-dark mt-4 block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
