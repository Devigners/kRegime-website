'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '1',
      title: 'Choose Your Regime Box',
      description:
        'Select from our 3, 5, or 7-step Korean skincare regime boxes based on your preferences and skin goals.',
      image: '/static/10.jpg',
    },
    {
      step: '2',
      title: 'Complete Our AI Quiz',
      description:
        'Tell us about your skin type, concerns, and preferences so our AI can personalize your box perfectly.',
      image: '/static/11.jpg',
    },
    {
      step: '3',
      title: 'Receive & Glow',
      description:
        'Get your curated routine delivered and start seeing results within 7-14 days of consistent use.',
      image: '/static/12.jpg',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white">
      <div className="container section-padding">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Get a fully personalized Korean skincare routine in three simple
            steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="relative text-center space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connecting Line */}
              {index < 2 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 transform translate-x-8"></div>
              )}

              <div className="relative">
                <motion.div
                  className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-medium">
                    <span className="text-primary font-bold text-sm">
                      {item.step}
                    </span>
                  </div>
                </motion.div>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
