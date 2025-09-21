'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContinueFormCardProps {
  onClose?: () => void;
  regimeId: string;
  regimeName: string;
}

export default function ContinueFormCard({
  onClose,
  regimeId,
  regimeName,
}: ContinueFormCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/regime-form?product=${regimeId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-sm border border-primary/30 rounded-lg p-6 shadow-xl relative"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 cursor-pointer bg-white rounded-full border border-gray-200 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-left">
          <h3 className="text-lg font-semibold text-black">
            Pick Up Where You Left Off
          </h3>
          <p className="text-sm text-gray-600">
            Complete your {regimeName} customization
          </p>
        </div>
        <motion.button
          onClick={handleContinue}
          className="btn-primary text-sm px-6 py-2 group flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
}
