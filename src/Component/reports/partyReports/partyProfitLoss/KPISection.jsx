"use client"

import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function KPISection({ selectedParty }) {
  if (!selectedParty) return null

  const totalProfit = selectedParty.sales - selectedParty.purchases
  const isProfit = totalProfit >= 0

  const kpis = [
    {
      label: "Total Sales",
      value: `₹${selectedParty.sales.toLocaleString()}`,
      gradient: "from-emerald-400 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      icon: "trending-up",
    },
    {
      label: "Total Purchase Cost",
      value: `₹${selectedParty.purchases.toLocaleString()}`,
      gradient: "from-orange-400 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      icon: "trending-down",
    },
    {
      label: "Profit / Loss",
      value: `${isProfit ? "+" : ""}₹${Math.abs(totalProfit).toLocaleString()}`,
      gradient: isProfit ? "from-indigo-400 to-blue-600" : "from-red-400 to-pink-600",
      bgGradient: isProfit ? "from-indigo-50 to-blue-50" : "from-red-50 to-pink-50",
      textColor: isProfit ? "text-green-600" : "text-red-600",
      icon: "wallet",
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          className={`bg-gradient-to-br ${kpi.bgGradient} rounded-xl p-6 shadow-lg border border-slate-200 relative overflow-hidden`}
        >
          {/* Background Icon */}
          <div className="absolute top-2 right-2 opacity-10">
            <svg className="w-20 h-20 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <div className="relative w-[100%]  justify-between flex  z-10">
            <div className={`inline-block p-3 bg-gradient-to-br ${kpi.gradient} rounded-lg mb-4`}>
              {kpi.icon === "trending-up" && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L7 17" />
                </svg>
              )}
              {kpi.icon === "trending-down" && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8L7 7" />
                </svg>
              )}
              {kpi.icon === "wallet" && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div>


              <p className="text-slate-600 text-sm font-medium mb-1">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.textColor || "text-slate-900"}`}>{kpi.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
