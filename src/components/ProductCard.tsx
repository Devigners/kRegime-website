import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isPopular = product.id === 'pentabox';

  return (
    <motion.div
      className={`relative card-modern overflow-hidden group ${
        isPopular ? 'ring-2 ring-primary/30 shadow-glow' : ''
      }`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-1 -right-1 z-10">
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-1"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Most Popular</span>
          </motion.div>
        </div>
      )}

      {/* Product Image Area */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-glow">
              <span className="text-white font-bold text-2xl">
                {product.stepCount}
              </span>
            </div>
            <span className="text-white/90 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {product.stepCount} Steps Routine
            </span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full animate-float opacity-60"></div>
        <div
          className="absolute bottom-6 right-6 w-6 h-6 bg-white/40 rounded-full animate-float opacity-50"
          style={{ animationDelay: '-2s' }}
        ></div>
      </div>

      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-neutral-900 group-hover:gradient-text transition-all duration-300">
            {product.name}
          </h3>
          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900 flex items-center">
            <CheckCircle className="w-5 h-5 text-secondary mr-2" />
            Included Steps:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {product.steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center text-neutral-600 py-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-sm font-medium">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="pt-6 border-t border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-neutral-900">
                AED {product.price}
              </div>
              <div className="text-sm text-neutral-500">One-time purchase</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-500 mb-1">Starting from</div>
              <div className="text-lg font-semibold text-primary">
                AED {Math.round(product.price / product.stepCount)}/step
              </div>
            </div>
          </div>

          <Link
            href={`/regime-form?product=${product.id}`}
            className="btn-primary w-full text-center group flex items-center justify-center"
          >
            Select This Regime
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="text-center">
            <span className="text-xs text-neutral-500">
              ✨ Free shipping • 30-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
