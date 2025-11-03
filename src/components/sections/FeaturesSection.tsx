'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { features } from '@/data';

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
      <div className="container section-padding relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            The Handpicked <span className="gradient-text">Regime</span>
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
            We handpick Korean skincare products carefully based on individual skin needs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-1 divide-primary/20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-5 text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-full flex items-center justify-center mb-6">
                <feature.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-4">
                {feature.title}
              </h3>
              <p className="hidden md:block text-black leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
