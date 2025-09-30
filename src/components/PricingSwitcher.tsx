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
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-white/60 shadow-lg">
        <div className="flex space-x-1">
          {subscriptionOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTypeChange(option.value)}
              className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedType === option.value
                  ? 'bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white shadow-lg'
                  : 'text-neutral-700 hover:bg-white/70'
              }`}
            >
              <div className="text-center">
                <div className="font-black">{option.label}</div>
                <div className={`text-xs ${
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