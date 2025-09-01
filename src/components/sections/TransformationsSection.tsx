'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TransformationsSection() {
  return (
    <section className="py-32 bg-white">
      <div className="container section-padding">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            Real <span className="gradient-text">Transformations</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            See the amazing results our customers have achieved with their
            personalized Korean skincare routines
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[12, 13, 14, 15, 16, 1].map((imageNum, index) => (
            <motion.div
              key={imageNum}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-soft">
                <Image
                  src={`/static/${imageNum}.jpg`}
                  alt={`Transformation ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm w-fit font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                    {index % 2 === 0 ? 'After 30 days' : 'After 14 days'}
                  </div>
                  <p className="text-lg font-semibold">
                    {index % 3 === 0
                      ? 'Clearer skin'
                      : index % 3 === 1
                      ? 'Brighter complexion'
                      : 'Reduced fine lines'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
