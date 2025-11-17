'use client';

import { BoxIcon, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function KpiCards({ totalStock, highAgeingStock, oldStock }) {
  const cards = [
    {
      title: 'Total Available Stock',
      value: totalStock,
      icon: BoxIcon,
      gradient: 'from-blue-400 to-teal-500',
      bgGradient: 'from-blue-50 to-teal-50',
    },
    {
      title: 'High Ageing Stock (>30 days)',
      value: highAgeingStock,
      icon: AlertTriangle,
      gradient: 'from-red-400 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
    },
    {
      title: 'Older Than 1 Month',
      value: oldStock,
      icon: Clock,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all cursor-default`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">{card.title}</p>
                <p className="text-4xl font-bold text-slate-900">{card.value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
