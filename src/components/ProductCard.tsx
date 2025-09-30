import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Product, SubscriptionType } from '../types';
import DirhamIcon from './icons/DirhamIcon';

interface ProductCardProps {
  product: Product;
  selectedSubscription?: SubscriptionType;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  selectedSubscription = 'one-time' 
}) => {
  const isPopular = product.id === 'pentabox';

  // Get price based on subscription type
  const getPrice = () => {
    switch (selectedSubscription) {
      case '3-months':
        return product.price3Months || 0;
      case '6-months':
        return product.price6Months || 0;
      default:
        return product.priceOneTime || 0;
    }
  };

  const getPriceDescription = () => {
    switch (selectedSubscription) {
      case '3-months':
        return 'Monthly for 3 months';
      case '6-months':
        return 'Monthly for 6 months';
      default:
        return 'One-time purchase';
    }
  };

  // Get the next better subscription option and calculate savings
  const getNextSubscriptionComparison = () => {
    const currentPrice = getPrice();
    
    switch (selectedSubscription) {
      case 'one-time':
        if (product.price3Months) {
          const savings = currentPrice - product.price3Months;
          const savingsPercentage = Math.round((savings / currentPrice) * 100);
          return {
            nextType: '3-month subscription',
            nextPrice: product.price3Months,
            savings,
            savingsPercentage,
            message: `Save ${savings} AED (${savingsPercentage}%) with 3-month plan`
          };
        }
        break;
      case '3-months':
        if (product.price6Months) {
          const savings = currentPrice - product.price6Months;
          const savingsPercentage = Math.round((savings / currentPrice) * 100);
          return {
            nextType: '6-month subscription',
            nextPrice: product.price6Months,
            savings,
            savingsPercentage,
            message: `Save ${savings} AED (${savingsPercentage}%) with 6-month plan`
          };
        }
        break;
      default:
        return null;
    }
    return null;
  };

  const getCurrentPrice = getPrice();
  const priceDescription = getPriceDescription();
  const nextSubscriptionInfo = getNextSubscriptionComparison();

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
            className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Most Popular</span>
          </motion.div>
        </div>
      )}

      {/* Product Image Area */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <span className="text-neutral-600 font-medium text-sm">No Image Available</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="text-white">
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
          <p className="text-black md:h-40 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900 flex items-center">
            <CheckCircle className="w-5 h-5 text-secondary mr-2" />
            Suggested Steps:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {product.steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center text-black py-1"
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
              <div className="text-3xl font-bold text-neutral-900 flex items-center gap-2">
                <DirhamIcon size={20} className="text-neutral-900" />
                {getCurrentPrice}
              </div>
              <div className="text-sm text-black">{priceDescription}</div>
              
              {/* Show comparison with next subscription type */}
              {nextSubscriptionInfo && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Save {nextSubscriptionInfo.savings} AED with {nextSubscriptionInfo.nextType.replace(' subscription', '')} subscription</span>
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/regime-form?product=${product.id}&subscription=${selectedSubscription}`}
            className="btn-primary w-full text-center group flex items-center justify-center"
          >
            Select This Regime
          </Link>

          <div className="text-center">
            <span className="text-sm text-black">✨ Free shipping</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
