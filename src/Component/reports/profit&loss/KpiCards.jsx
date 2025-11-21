'use client'

import { motion } from 'framer-motion'
import { IndianRupee, ShoppingCart, TrendingUp } from 'lucide-react'

export default function KpiCards({ kpi }) {
  const kpiData = [
    {
      title: 'Total Sales',
      value: `₹${kpi?.totalProfit || 0}`,
      icon: IndianRupee,
      gradient: 'from-green-500 to-teal-500',
      icon_bg: 'bg-green-100',
    },
    {
      title: 'Total Purchase Cost',
      value: `₹${kpi?.totalLoss || 0}`,
      icon: ShoppingCart,
      gradient: 'from-red-500 to-orange-500',
      icon_bg: 'bg-red-100',
    },
    {
      title: 'Net Profit',
      value: `₹${kpi?.netPL || 0}`,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-indigo-500',
      icon_bg: 'bg-blue-100',
    },
  ]

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

            {/* Removed trend (not needed and causes errors) */}
            <div className="h-6"></div>

            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          </motion.div>
        )
      })}
    </div>
  )
}
 