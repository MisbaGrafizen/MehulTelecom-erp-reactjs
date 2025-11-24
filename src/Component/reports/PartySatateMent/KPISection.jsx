"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function KPISection({ totalSales, totalPurchases, balance }) {
  const data = [
    {
      id: 1,
      title: "Total Sales",
      amount: totalSales,
      trend: 8, // positive %
      bgColor: "#16a34a",
      lightBgColor: "#dcfce7",
      gradient: "from-green-100 to-emerald-100",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0v1m0-1c-1.11 0-2.08-.4-2.6-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total Purchases",
      amount: totalPurchases,
      trend: -5,
      bgColor: "#dc2626",
      lightBgColor: "#fee2e2",
      gradient: "from-red-100 to-orange-100",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0v1m0-1c-1.11 0-2.08-.4-2.6-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Net Balance",
      amount: balance,
      trend: balance >= 0 ? 3 : -2,
      bgColor: balance >= 0 ? "#2563eb" : "#dc2626",
      lightBgColor: balance >= 0 ? "#dbeafe" : "#fee2e2",
      gradient: "from-blue-100 to-indigo-100",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10M7 20h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {data.map((kpi, index) => (
        <AnimatedKPI key={kpi.id} kpi={kpi} index={index} />
      ))}
    </div>
  )
}

function AnimatedKPI({ kpi, index }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const target = Number(kpi.amount)
    const increment = target / 50
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayValue(target)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [kpi.amount])

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
      className="relative overflow-hidden rounded-xl p-6 shadow-lg bg-white border border-slate-200 cursor-default"
    >
      {/* background circular accent */}
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${kpi.gradient} rounded-full -mr-10 -mt-10 opacity-40`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            {kpi.title}
          </p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold text-slate-900">
              ₹{displayValue.toLocaleString("en-IN")}
            </h3>

            {kpi.trend !== undefined && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${
                  kpi.trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {kpi.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(kpi.trend)}%
              </motion.span>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${kpi.bgColor} 0%, ${kpi.lightBgColor} 100%)`,
          }}
        >
          {kpi.icon}
        </motion.div>
      </div>
    </motion.div>
  )
}
