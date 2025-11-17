'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ModernTransactionTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className=" flex gap-2">
      {[
        { id: 'moneyIn', label: 'Money In', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
        { id: 'moneyOut', label: 'Money Out', icon: TrendingDown, color: 'from-red-500 to-rose-500' },
      ].map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-2 py-2 rounded-[10px] font-semibold transition-all duration-300 flex items-center gap-2 ${
              isActive
                ? 'bg-white shadow-sm border border-gray-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
          >
            <div
              className={`p-2 rounded-lg transition-all ${
                isActive
                  ? `bg-gradient-to-br ${tab.color}`
                  : 'bg-slate-100'
              }`}
            >
              <IconComponent
                size={16}
                className={isActive ? 'text-white' : 'text-slate-600'}
              />
            </div>
            <span className={isActive ? 'text-slate-900' : ''}>{tab.label}</span>
{/* 
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )} */}
          </motion.button>
        );
      })}
    </div>
  );
};

export default ModernTransactionTabs;
