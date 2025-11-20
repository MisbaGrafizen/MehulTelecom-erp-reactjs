'use client'

import { motion } from 'framer-motion'
import { IndianRupee, ShoppingCart, TrendingUp } from 'lucide-react'

const kpiData = [
  {
    title: 'Total Sales',
    value: '₹45,62,000',
    icon: IndianRupee,
    gradient: 'from-green-500 to-teal-500',
    icon_bg: 'bg-green-100',
    trend: '+12.5%',
    trendIcon: '↑',
    trendColor: 'text-green-600',
  },
  {
    title: 'Total Purchase Cost',
    value: '₹28,50,000',
    icon: ShoppingCart,
    gradient: 'from-red-500 to-orange-500',
    icon_bg: 'bg-red-100',
    trend: '-8.3%',
    trendIcon: '↓',
    trendColor: 'text-red-600',
  },
  {
    title: 'Net Profit',
    value: '₹17,12,000',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-indigo-500',
    icon_bg: 'bg-blue-100',
    trend: '+15.2%',
    trendIcon: '↑',
    trendColor: 'text-blue-600',
  },
]

export default function KpiCards() {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiData.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg p-6 text-white overflow-hidden relative`}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-white/80 text-sm mb-2">{card.title}</p>
                <h3 className="text-3xl font-bold">{card.value}</h3>
              </div>
              <div className={`${card.icon_bg} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${card.trendColor}`}>
                {card.trendIcon} {card.trend}
              </span>
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          </motion.div>
        )
      })}
    </div>
  )
}
