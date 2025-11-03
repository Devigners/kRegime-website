'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TransformationsSection() {
  const milestones = [
    {
      time: '7 days',
      title: 'Brighter Complexion',
      description: 'Initial glow and improved skin texture become visible',
    },
    {
      time: '14 days',
      title: 'Clearer Skin',
      description: 'Reduction in breakouts and more even skin tone',
    },
    {
      time: '30 days',
      title: 'Visible Reduction',
      description: 'Significant improvement in problem areas and overall skin health',
    },
    {
      time: '3 months',
      title: 'Healthy Skin',
      description: 'Complete transformation with radiant, healthy-looking skin',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-neutral-50">
      <div className="container">
        <motion.div
          className="text-center mb-8 md:mb-20 section-padding"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6">
            Transformation <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
            See the amazing results our customers have achieved with their
            personalized Korean skincare routines
          </p>
        </motion.div>
        {/* Mobile: Horizontal Scrollable Timeline */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto py-4 px-8 snap-x snap-mandatory">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.time}
                className="relative min-w-[280px] snap-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Content */}
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 h-full">
                  <div className="w-fit mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {milestone.time}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-black leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:grid grid-cols-4 gap-8 px-6 lg:px-10">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.time}
              className="relative text-center space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Connecting Line */}
              {index < milestones.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              )}

              <div className="relative">
                {/* Time Pill */}
                <motion.div
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full text-sm font-semibold inline-block shadow-glow mb-3"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {milestone.time}
                </motion.div>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-3">{milestone.title}</h3>
              <p className="text-black leading-relaxed max-w-sm mx-auto">
                {milestone.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
