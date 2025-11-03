'use client';

import React from 'react';
import { SubscriptionType } from '@/types';

interface PricingSwitcherProps {
  selectedType: SubscriptionType;
  onTypeChange: (type: SubscriptionType) => void;
  className?: string;
}

const PricingSwitcher: React.FC<PricingSwitcherProps> = ({
  selectedType,
  onTypeChange,
  className = '',
}) => {
  const subscriptionOptions = [
    {
      value: 'one-time' as SubscriptionType,
      label: 'One-time',
      description: 'Single purchase',
    },
    {
      value: '3-months' as SubscriptionType,
      label: '3 Months',
      description: 'Monthly subscription',
    },
    {
      value: '6-months' as SubscriptionType,
      label: '6 Months',
      description: 'Monthly subscription',
    },
  ];

  return (
      <div className={`mx-auto w-full md:w-fit overflow-x-auto rounded-full border border-white/60 bg-white/80 backdrop-blur-xl md:overflow-x-visible shadow-none md:shadow-lg ${className}`}>
        <div className="flex items-center justify-center p-2 w-fit mx-auto">
          <div className="flex space-x-1">
            {subscriptionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTypeChange(option.value)}
                className={`relative px-8 py-3 rounded-full cursor-pointer font-bold text-sm transition-all duration-300 ${
                  selectedType === option.value
                    ? 'bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white shadow-none md:shadow-lg'
                    : 'text-neutral-700 hover:bg-white/70'
                }`}
              >
                <div className="text-center flex flex-col gap-1">
                  <div className="font-black text-md text-nowrap">{option.label}</div>
                  <div className={`text-xs font-semibold text-nowrap ${
                    selectedType === option.value ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default PricingSwitcher;