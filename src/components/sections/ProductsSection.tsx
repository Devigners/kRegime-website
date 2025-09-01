'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data';

export default function ProductsSection() {
  return (
    <section
      id="regimes"
      className="py-32 bg-gradient-to-b from-neutral-50 to-white"
    >
      <div className="container section-padding">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            Choose Your <span className="gradient-text">Skincare Journey</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            Pick your preferred 3, 5 & 7 steps and we&apos;ll fill them with
            expertly matched Korean beauty products made for your unique skin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
