'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { features } from '@/data';

export default function FeaturesSection() {
  return (
    <section className="py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
      {/* Background decorative images */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full overflow-hidden">
          <Image src="/static/8.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full overflow-hidden">
          <Image src="/static/9.jpg" alt="" fill className="object-cover" />
        </div>
      </div>

      <div className="container section-padding relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            The Handpicked <span className="gradient-text">Regime</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We curate handpicked Korean skincare regimens, with products
            carefully selected by our experts based on individual skin needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card-modern p-6 text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
