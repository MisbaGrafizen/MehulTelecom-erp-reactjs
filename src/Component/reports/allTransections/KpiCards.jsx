'use client'

import { motion } from 'framer-motion'
import { List, IndianRupee, Calendar } from 'lucide-react'

export default function KpiCards({ totalTransactions, totalAmount, todayTransactions }) {
  const cards = [
    {
      title: 'Total Transactions',
      value: totalTransactions,
      subtitle: 'All Transactions',
      icon: List,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
    },
    {
      title: 'Total Amount',
      value: `₹${totalAmount.toLocaleString('en-IN')}`,
      subtitle: 'Sale + Purchase',
      icon: IndianRupee,
      gradient: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)',
    },
    {
      title: "Today's Count",
      value: todayTransactions,
      subtitle: 'Transactions Today',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 100%)',
    },
  ]

  const KPICard = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl p-6 shadow-lg overflow-hidden text-white`}
      style={{
        background: gradient,
      }}
    >
      {/* Soft circular glow in the corner */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 bg-white" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-medium opacity-90">{subtitle}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white bg-opacity-20">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs opacity-75">{title}</p>
      </div>
    </motion.div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <KPICard key={index} {...card} />
      ))}
    </div>
  )
}
