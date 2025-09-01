'use client';

import { CartItem } from '@/types';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: {
        id: 'tribox',
        name: 'TRIBOX',
        description: '3-step Korean skincare routine',
        price: 229,
        steps: ['Cleanser', 'Moisturiser', 'Sunscreen'],
        image: '/images/tribox.jpg',
        stepCount: 3,
      },
      quantity: 1,
      customization: {
        skinType: 'Combination',
        skinConcerns: ['Acne', 'Large Pores'],
        preferences: {},
      },
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.product.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.product.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 25;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding py-40 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Product</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.product.description}
                  </p>

                  {item.customization && (
                    <div className="text-sm text-gray-500 mb-3">
                      <p>Skin Type: {item.customization.skinType}</p>
                      {item.customization.skinConcerns.length > 0 && (
                        <p>
                          Concerns: {item.customization.skinConcerns.join(', ')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        AED {item.product.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">AED {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">AED {shipping}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    AED {total}
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
