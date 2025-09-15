'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { brands } from '@/data';

export default function KoreanBrandsSection() {
  return (
    <section id="brands" className="py-32 bg-white">
      <div className="container section-padding text-center">
        <motion.div
          className="space-y-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900">
            Trusted <span className="gradient-text">Korean Brands</span>
          </h2>
          <p className="text-xl text-black max-w-4xl mx-auto leading-relaxed">
            We partner with the most respected Korean beauty brands to bring you
            authentic, high-quality products that deliver real results
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              className="group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.03 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
            >
              <div className="bg-white rounded-lg p-3 shadow-soft hover:shadow-medium transition-all duration-300 border border-neutral-200 hover:border-neutral-300">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-white">
                  <Image
                    src={`/brands/${brand.file}`}
                    alt={`${brand.name} Korean Beauty Brand`}
                    fill
                    className="object-contain p-2 !bg-white group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-black text-lg">
            And many more premium K-beauty brands curated for your skin
          </p>
        </motion.div>
      </div>
    </section>
  );
}
