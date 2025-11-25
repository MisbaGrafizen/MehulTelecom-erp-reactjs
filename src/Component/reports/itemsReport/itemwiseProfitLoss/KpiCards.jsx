"use client"

import { motion } from "framer-motion"

export default function KpiCards({ totalSale, totalPurchase, totalProfit }) {
  const cards = [
    {
      title: "Total Sale Amount",
      value: `₹${totalSale.toLocaleString()}`,
      gradient: "from-emerald-400 to-green-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Total Purchase Cost",
      value: `₹${totalPurchase.toLocaleString()}`,
      gradient: "from-orange-400 to-red-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4" />
        </svg>
      ),
    },
    {
      title: "Total Profit / Loss",
      value: `₹${totalProfit.toLocaleString()}`,
      valueColor: totalProfit >= 0 ? "text-white" : "text-red-600",
      gradient: "from-indigo-400 to-blue-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
          className={`bg-gradient-to-br ${card.gradient} rounded-xl p-6 shadow-lg text-white`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium opacity-90">{card.title}</p>
              <p className={`text-2xl font-bold mt-2 ${card.valueColor || "text-white"}`}>{card.value}</p>
            </div>
            <div className="opacity-30">{card.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
