'use client';

import React, { useState } from 'react';
import { Users, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import SubscribersTab from './SubscribersTab';
import NewslettersTab from './NewslettersTab';

type Tab = 'subscribers' | 'newsletters';

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState<Tab>('subscribers');

  const tabs = [
    { id: 'subscribers' as Tab, label: 'Subscribers', icon: Users },
    { id: 'newsletters' as Tab, label: 'Newsletters', icon: Send },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EF7E71]/10 via-[#D4654F]/8 to-[#FFE066]/10 rounded-xl p-6 border border-white/30 backdrop-blur-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#EF7E71]/20 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#D4654F]/20 to-transparent rounded-full translate-x-16 translate-y-16"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black bg-gradient-to-r from-[#EF7E71] via-[#D4654F] to-[#FFE066] bg-clip-text text-transparent leading-tight mb-2">
            Email Management
          </h1>
          <p className="text-neutral-600 text-base">
            Manage subscribers and send newsletters
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

        <div className="relative z-10 p-2">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'newsletters' && <NewslettersTab />}
      </div>
    </div>
  );
}
