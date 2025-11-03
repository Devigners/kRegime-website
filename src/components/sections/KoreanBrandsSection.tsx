'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { brands } from '@/data';

export default function KoreanBrandsSection() {
  return (
    <section id="brands" className="py-20 md:py-32 bg-gradient-to-b from-secondary/5 to-accent/5">
      <div className="container section-padding text-center">
        <motion.div
          className="space-y-8 mb-12 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900">
            Trusted <span className="gradient-text">Korean Brands</span>
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
            We partner with the most respected Korean beauty brands to bring you
            authentic, high-quality products that deliver real results
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center md:flex-none md:grid md:grid-cols-4 lg:grid-cols-5  gap-3">
          {brands.map((brand, index) => (
            <div key={index} className="group aspect-square md:aspect-auto w-26 md:w-full">
              <div className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 border border-primary/20 hover:border-primary">
                <div className="h-24 relative rounded-lg overflow-hidden bg-white">
                  <Image
                    src={`/brands/${brand.file}`}
                    alt={`${brand.name} Korean Beauty Brand`}
                    fill
                    className="object-contain !bg-white group-hover:brightness-100 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
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
            And many more premium Korean skin care brands
          </p>
        </motion.div>
      </div>
    </section>
  );
}
