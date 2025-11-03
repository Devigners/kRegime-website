'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import PricingSwitcher from '@/components/PricingSwitcher';
import { regimeApi } from '@/lib/api';
import { Regime } from '@/models/database';
import { SubscriptionType } from '@/types';

export default function ProductsSection() {
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionType>('one-time');

  useEffect(() => {
    const fetchRegimes = async () => {
      try {
        setLoading(true);
        const data = await regimeApi.getAll();
        
        // Sort regimes in specific order: Tribox, Pentabox, Septabox
        const sortOrder = ['tribox', 'pentabox', 'septabox'];
        data.sort((a, b) => {
          const aIndex = sortOrder.indexOf(a.name.toLowerCase());
          const bIndex = sortOrder.indexOf(b.name.toLowerCase());
          
          // If both are in the sort order, sort by their position
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          // If only a is in the sort order, it comes first
          if (aIndex !== -1) return -1;
          // If only b is in the sort order, it comes first
          if (bIndex !== -1) return 1;
          // If neither are in the sort order, maintain original order
          return 0;
        });
        
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
        className="py-20 md:py-32 bg-gradient-to-b from-secondary/5 to-accent/5"
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
        className="py-20 md:py-32 bg-gradient-to-b from-secondary/5 to-accent/5"
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
      className="py-20 md:py-32 bg-gradient-to-b from-secondary/5 to-accent/5"
    >
      <div className="container ">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className='px-6 sm:px-8 lg:px-12'>
            <h2 className="heading-lg text-neutral-900 mb-6">
              Choose Your <span className="gradient-text">Regime</span>
            </h2>
            <p className="text-lg text-black max-w-4xl mx-auto leading-relaxed mb-12">
              Pick your preferred 3, 5 & 7 steps and we&apos;ll fill them with
              expertly matched Korean beauty products made for your unique skin
            </p>
          </div>
          
          {/* Pricing Switcher */}
          <PricingSwitcher
            selectedType={selectedSubscription}
            onTypeChange={setSelectedSubscription}
          />
        </motion.div>

        <div className="-mx-4 px-4 lg:px-8">
          <div className="flex lg:grid px-8 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto lg:overflow-x-visible py-4 lg:py-0 snap-x snap-mandatory lg:snap-none">
            {regimes.map((regime, index) => (
              <motion.div
                key={`${regime.id}-${selectedSubscription}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center"
              >
                <ProductCard
                  product={{
                    id: regime.id,
                    name: regime.name,
                    description: regime.description,
                    priceOneTime: regime.priceOneTime,
                    price3Months: regime.price3Months,
                    price6Months: regime.price6Months,
                    discountOneTime: regime.discountOneTime,
                    discount3Months: regime.discount3Months,
                    discount6Months: regime.discount6Months,
                    discountReasonOneTime: regime.discountReasonOneTime,
                    discountReason3Months: regime.discountReason3Months,
                    discountReason6Months: regime.discountReason6Months,
                    steps: regime.steps,
                    images: regime.images,
                    stepCount: regime.stepCount,
                  }}
                  selectedSubscription={selectedSubscription}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
