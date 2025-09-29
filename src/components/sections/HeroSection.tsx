'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ContinueFormCard from '@/components/ContinueFormCard';
import { useIncompleteForm } from '@/hooks/useIncompleteForm';

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { incompleteForm, loading, dismissIncompleteForm } =
    useIncompleteForm();

  return (
    <section className="relative min-h-screen flex pt-40 md:pt-0 items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/static/16.webp"
          alt="Korean Skincare Hero"
          fill
          className="object-cover opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80"></div>
      </div>

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 z-10"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '-3s' }}
          ></div>
        </div>
      </motion.div>

      <div className="relative z-20 text-center text-neutral-900 space-y-8 section-padding max-w-6xl mx-auto">
        <motion.div
          className="space-y-6"
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
            className="text-2xl md:text-3xl text-neutral-700 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Personalized Korean Skincare Regime Boxes Delivered to You
          </motion.p>
          <motion.p
            className="text-lg md:text-xl text-black max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover your perfect skincare routine with our expertly curated 3,
            5, or 7 steps regime boxes featuring premium Korean products
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
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
            className="mt-16 max-w-4xl mx-auto"
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
