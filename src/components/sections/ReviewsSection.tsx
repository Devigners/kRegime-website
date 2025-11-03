'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { reviewApi } from '@/lib/api';
import { Review } from '@/models/database';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewApi.getAll();
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section
        id="reviews"
        className="py-20 md:py-32 bg-white"
      >
        <div className="container section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-black">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="reviews"
        className="py-20 md:py-32 bg-white"
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
      id="reviews"
      className="py-20 md:py-32 bg-white"
    >
      <div className="container">
        <motion.div
          className="text-center mb-12 md:mb-20 section-padding"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg text-neutral-900 mb-6">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have transformed their
            skin with <br /> our personalized K-beauty routines
          </p>
        </motion.div>

        <div className="px-8 sm:px-8 lg:px-12 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto overflow-y-hidden md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] md:min-w-0 snap-center"
            >
              <ReviewCard
                review={{
                  id: review.id,
                  name: review.name,
                  rating: review.rating,
                  comment: review.comment,
                  avatar: review.avatar,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a href="#regimes" className="btn-primary text-lg px-12 py-5 group">
            Start Your Journey
            <ArrowRight className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
