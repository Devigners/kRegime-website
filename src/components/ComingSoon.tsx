'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { toast } from 'sonner';

const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'coming_soon'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Successfully subscribed! We\'ll notify you when we launch.');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Coming soon subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen pt-24 md:pt-0 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 relative overflow-hidden">
      {/* Background decoration - responsive positioning and sizes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-4 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-primary to-secondary rounded-lg blur-3xl"></div>
        <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-secondary to-primary rounded-lg blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-primary to-secondary rounded-lg blur-3xl"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Main Title - Enhanced responsive typography */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-800 mb-4 sm:mb-6 leading-tight px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Coming Soon
            </span>{' '}
          </motion.h1>

          {/* Subtitle - Better responsive text sizing and spacing */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We&apos;re crafting something beautiful for your Korean skincare
            journey.{' '}
            <span className="text-primary font-semibold">
              Handpicked regimes
            </span>{' '}
            are coming your way.
          </motion.p>

          {/* Features preview - Enhanced responsive grid and spacing */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12 px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              {
                title: 'Curated Regimes',
                description: 'Expert-selected Korean skincare routines',
                icon: '✨',
              },
              {
                title: 'Premium Brands',
                description: 'Top K-beauty brands in one box',
                icon: '🌸',
              },
              {
                title: 'Personalized',
                description: 'Tailored to your skin needs',
                icon: '💫',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-4 w-full sm:p-6 lg:p-8 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 shadow-soft hover:shadow-lg transition-all duration-300 mx-auto max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to action - Enhanced responsive design */}
          <motion.div
            className="space-y-4 sm:space-y-6 px-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <p className="text-neutral-700 text-base sm:text-lg lg:text-xl">
              Be the first to know when we launch
            </p>

            {/* Email signup form - Enhanced responsive form */}
            <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-none md:max-w-lg">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-lg border border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Subscribing...' : 'Notify Me'}
              </button>
            </form>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed px-2">
              We&apos;ll notify you as soon as we&apos;re ready to transform
              your skincare routine
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
