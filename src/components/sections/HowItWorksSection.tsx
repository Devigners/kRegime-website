'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ClipboardList, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Choose Your Regime',
      description:
        'Select from our 3, 5, or 7 steps Korean skincare regime boxes based on your preferences and unique skin goals',
    },
    {
      icon: ClipboardList,
      title: 'Complete Our Quiz',
      description:
        'Tell us about your skin type, concerns, and preferences so our skincare experts can personalize your box perfectly',
    },
    {
      icon: Sparkles,
      title: 'Receive & Glow',
      description:
        'Get your curated skincare routine delivered and start seeing visible results within 7-14 days of consistent use',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-primary text-white">
      <div className="container section-padding">
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg mb-6">How It Works</h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed">
            Get a fully personalized Korean skincare routine in three simple
            steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              className="relative text-center space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connecting Line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-white/20 transform translate-x-8"></div>
              )}

              <div className="relative">
                <motion.div
                  className="w-16 md:w-20 h-16 md:h-20 bg-white rounded-lg flex items-center justify-center mx-auto mb-6 shadow-glow relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-primary font-bold text-sm">
                    <item.icon className="w-8 h-8" />
                  </span>
                </motion.div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold">{item.title}</h3>
              <p className="hidden md:block leading-relaxed max-w-sm mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
