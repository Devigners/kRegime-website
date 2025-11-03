'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ContinueFormCard from '@/components/ContinueFormCard';
import { useIncompleteForm } from '@/hooks/useIncompleteForm';

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { incompleteForm, loading, dismissIncompleteForm } =
    useIncompleteForm();

  return (
    <section className="relative overflow-hidden pt-20">
      {/* Video Section - 40vh height */}
      <div className="relative h-[50vh] w-full">
        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/static/banner-video.mp4" type="video/mp4" />
        </video>

        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source src="/static/banner-video-mobile.mp4" type="video/mp4" />
        </video>

        {/* Animated Background Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 z-10"
          style={{ opacity }}
        >
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float"
              style={{ animationDelay: '-3s' }}
            ></div>
          </div>
        </motion.div>

        {/* Desktop: Text Overlay on Video */}
        <div className="hidden md:flex absolute inset-0 z-20 items-center justify-center">
          <div className="text-center text-white space-y-4 px-6">
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-4 drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              GLOW STARTS HERE
            </motion.h1>
            <motion.p
              className="text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed drop-shadow-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Personalized Korean Skincare Regime Boxes Delivered to You
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Below Video */}
      <div className="relative z-20 text-center text-neutral-900 section-padding max-w-6xl mx-auto pt-12 md:pt-16">
        {/* Mobile: Show titles below video */}
        <motion.div
          className="md:hidden gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h1
            className="heading-xl gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            GLOW STARTS HERE
          </motion.h1>
          <motion.p
            className="text-2xl text-neutral-700 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Personalized Korean Skincare Regime Boxes Delivered to You
          </motion.p>
        </motion.div>

        {/* Description - Shows on both desktop and mobile */}
        <motion.p
          className="text-lg md:text-xl text-black max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Discover your perfect skincare routine with our expertly curated 3,
          5, or 7 steps regime boxes featuring premium Korean products
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <a href="#regimes" className="btn-primary text-lg px-12 py-5 group">
            FIND YOUR REGIME
            <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#how-it-works" className="btn-secondary text-lg px-12 py-5">
            Learn More
          </a>
        </motion.div>

        {/* Continue Form Card */}
        {!loading && incompleteForm && (
          <motion.div
            className="mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="px-4">
              <ContinueFormCard
                regimeId={incompleteForm.regimeId}
                regimeName={incompleteForm.regimeName}
                onClose={dismissIncompleteForm}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
