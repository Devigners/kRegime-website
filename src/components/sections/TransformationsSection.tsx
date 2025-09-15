'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TransformationsSection() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="container section-padding">
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6">
            Transformation <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto leading-relaxed px-4">
            See the amazing results our customers have achieved with their
            personalized Korean skincare routines
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-6 sm:left-8 md:left-1/2 md:transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary-dark"></div>

          {/* Timeline Items */}
          <div className="space-y-12 sm:space-y-16">
            {[
              {
                time: '7 days',
                title: 'Brighter complexion',
                imageNum: 12,
                description:
                  'Initial glow and improved skin texture become visible',
              },
              {
                time: '14 days',
                title: 'Clearer skin',
                imageNum: 13,
                description: 'Reduction in breakouts and more even skin tone',
              },
              {
                time: '30 days',
                title: 'Visible reduction in skin concerns',
                imageNum: 14,
                description:
                  'Significant improvement in problem areas and overall skin health',
              },
              {
                time: '3 months',
                title: 'Healthy Skin',
                imageNum: 15,
                description:
                  'Complete transformation with radiant, healthy-looking skin',
              },
            ].map((milestone, index) => (
              <motion.div
                key={milestone.time}
                className={`flex flex-col md:flex-row md:items-center gap-6 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-5 sm:left-8 md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white border-3 sm:border-4 border-primary rounded-full shadow-lg"></div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 ml-16 sm:ml-20 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8 lg:pr-16' : 'md:pl-8 lg:pl-16'
                  }`}
                >
                  <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                        {milestone.time}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 leading-tight">
                      {milestone.title}
                    </h3>
                    <p className="text-sm sm:text-base text-black mb-4 sm:mb-6 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div
                  className={`flex-1 ml-16 sm:ml-20 md:ml-0 ${
                    index % 2 === 0 ? 'md:pl-8 lg:pl-16' : 'md:pr-8 lg:pr-16'
                  }`}
                >
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3] relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={`/static/${milestone.imageNum}.jpg`}
                        alt={`${milestone.title} transformation`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline End Decoration */}
          <motion.div
            className="absolute left-4 sm:left-8 md:left-1/2 md:transform md:-translate-x-1/2 bottom-0 z-10"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
