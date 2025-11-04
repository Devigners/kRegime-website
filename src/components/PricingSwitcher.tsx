'use client';

import React from 'react';
import { SubscriptionType } from '@/types';

interface PricingSwitcherProps {
  selectedType: SubscriptionType;
  onTypeChange: (type: SubscriptionType) => void;
  className?: string;
  verticalOnMobile?: boolean;
}

const PricingSwitcher: React.FC<PricingSwitcherProps> = ({
  selectedType,
  onTypeChange,
  className = '',
  verticalOnMobile = false,
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
      <div className={`w-full border border-white/60 bg-white/80 backdrop-blur-xl shadow-none md:shadow-lg ${verticalOnMobile ? 'rounded-lg md:rounded-full w-full md:!w-fit' : 'rounded-full md:w-fit overflow-x-auto md:overflow-x-visible mx-auto'} ${className}`}>
        <div className="flex items-center justify-center p-2 w-full">
          <div className={`flex ${verticalOnMobile ? 'w-full md:w-fit flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-1' : 'w-fit space-x-1'}`}>
            {subscriptionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onTypeChange(option.value)}
                className={`relative py-3 cursor-pointer font-bold text-sm transition-all duration-300 ${verticalOnMobile ? 'px-4 md:px-8 w-full md:w-auto rounded-lg md:rounded-full' : 'px-8 w-fit rounded-full'} ${
                  selectedType === option.value
                    ? 'bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white shadow-none md:shadow-lg'
                    : 'text-neutral-700 hover:bg-white/70'
                }`}
              >
                <div className="text-center flex flex-col gap-1">
                  <div className={`flex flex-col gap-1 ${verticalOnMobile ? 'text-left md:text-center' : 'text-center'}`}>
                    <div className="font-black text-md text-nowrap">{option.label}</div>
                    <div
                      className={`text-xs font-semibold text-nowrap ${
                        selectedType === option.value ? 'text-white/80' : 'text-neutral-500'
                      }`}
                    >
                      {option.description}
                    </div>
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