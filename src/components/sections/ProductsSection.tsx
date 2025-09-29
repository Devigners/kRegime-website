'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { regimeApi } from '@/lib/api';
import { Regime } from '@/models/database';

export default function ProductsSection() {
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegimes = async () => {
      try {
        setLoading(true);
        const data = await regimeApi.getAll();
        setRegimes(data);
      } catch (err) {
        console.error('Error fetching regimes:', err);
        setError('Failed to load regimes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegimes();
  }, []);

  if (loading) {
    return (
      <section
        id="regimes"
        className="py-32 bg-gradient-to-b from-neutral-50 to-white"
      >
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black">Loading regimes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="regimes"
        className="py-32 bg-gradient-to-b from-neutral-50 to-white"
      >
        <div className="container section-padding">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

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
            Choose Your <span className="gradient-text">Regime</span>
          </h2>
          <p className="text-xl text-black max-w-4xl mx-auto leading-relaxed">
            Pick your preferred 3, 5 & 7 steps and we&apos;ll fill them with
            expertly matched Korean beauty products made for your unique skin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {regimes.map((regime, index) => (
            <motion.div
              key={regime.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <ProductCard
                product={{
                  id: regime.id,
                  name: regime.name,
                  description: regime.description,
                  price: regime.price,
                  steps: regime.steps,
                  images: regime.images,
                  stepCount: regime.stepCount,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
