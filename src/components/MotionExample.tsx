'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MotionExampleProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'scale' | 'slideLeft' | 'slideRight';
}

const MotionExample: React.FC<MotionExampleProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  animation = 'fadeUp',
}) => {
  const getAnimation = () => {
    switch (animation) {
      case 'fadeUp':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
        };
      case 'fadeIn':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
        };
      case 'slideRight':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
        };
      default:
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const animationProps = getAnimation();

  return (
    <motion.div
      className={className}
      initial={animationProps.initial}
      whileInView={animationProps.animate}
      viewport={{ once: true }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced scroll-triggered animations
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      {children}
    </motion.div>
  );
};

export default MotionExample;
