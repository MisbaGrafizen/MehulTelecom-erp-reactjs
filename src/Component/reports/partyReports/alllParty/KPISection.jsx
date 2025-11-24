"use client"

import { motion } from "framer-motion"

export default function KPISection({ data }) {
  const kpiCards = [
    {
      title: "Total Parties",
      value: data.totalParties,
      icon: "users",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Sales",
      value: `₹${(data.totalSales / 100000).toFixed(1)}L`,
      icon: "trending-up",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Purchases",
      value: `₹${(data.totalPurchases / 100000).toFixed(1)}L`,
      icon: "package",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  const iconMap = {
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20h12a6 6 0 00-6-6 6 6 0 00-6 6z"
        />
      </svg>
    ),
    "trending-up": (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    package: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4"
        />
      </svg>
    ),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiCards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className={`${card.bgColor} rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{card.value}</h3>
            </div>
            <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>{iconMap[card.icon]}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
