import React from 'react';
import Image from 'next/image';
import { Review } from '../types';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <motion.div
      className="card-modern p-8 relative group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="w-12 h-12 text-primary" />
      </div>

      {/* Stars */}
      <div className="flex items-center mb-6">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Star
              size={18}
              className={
                i < review.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-neutral-300'
              }
            />
          </motion.div>
        ))}
        <span className="ml-3 text-sm font-medium text-neutral-600">
          {review.rating}.0
        </span>
      </div>

      {/* Review Text */}
      <p className="text-neutral-700 leading-relaxed mb-6 relative z-10">
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-2xl mr-4 relative overflow-hidden ring-2 ring-primary/20">
          <Image
            src={`/static/${
              review.id === '1'
                ? 4
                : review.id === '2'
                ? 5
                : review.id === '3'
                ? 6
                : 7
            }.jpg`}
            alt={`${review.name} avatar`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <span className="font-semibold text-neutral-900 block">
            {review.name}
          </span>
          <span className="text-sm text-neutral-500">Verified Customer</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-primary/20 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 left-2 w-2 h-2 bg-secondary/30 rounded-full opacity-40"></div>
    </motion.div>
  );
};

export default ReviewCard;
