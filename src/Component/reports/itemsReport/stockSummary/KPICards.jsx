'use client';

import { motion } from 'framer-motion';
import { Package, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';

export default function KPICards() {
  const cards = [
    {
      title: 'Total No. of Items',
      value: '799',
      subtitle: 'Updated live',
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      trend: null,
      badge: null,
    },
    {
      title: 'Low Stock Items',
      value: '585',
      subtitle: 'Units below threshold',
      icon: AlertCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      trend: null,
      badge: 'Critical',
      badgeColor: 'bg-red-500',
    },
    {
      title: 'Total Stock Value',
      value: '₹1.29 Cr',
      subtitle: 'Total inventory worth',
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      trend: '↑ 12%',
      badge: null,
    },
    {
      title: 'Out of Stock Items',
      value: '142',
      subtitle: 'Pending replenishment',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      trend: null,
      badge: null,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${card.bgGradient} shadow-sm hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />

            {/* Icon Circle Background */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white opacity-5 group-hover:opacity-10 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                  <IconComponent className={`w-5 h-5 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">{card.subtitle}</p>
                {card.trend && (
                  <span className="text-xs font-semibold text-green-600">{card.trend}</span>
                )}
                {card.badge && (
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
