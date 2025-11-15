"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KPICard({ title, amount, icon: IconComponent, bgColor, lightBgColor, trend }) {
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    const target = Number.parseFloat(amount.replace(/[^0-9.]/g, ""))
    const increment = target / 60
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayAmount(target)
        clearInterval(timer)
      } else {
        setDisplayAmount(Math.floor(current))
      }
    }, 15)

    return () => clearInterval(timer)
  }, [amount])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      className="relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 cursor-default border border-border"
      style={{ background: `linear-gradient(135deg, ${lightBgColor} 0%, var(--background) 100%)` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-3">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl md:text-4xl font-bold" style={{ color: bgColor }}>
              ₹{displayAmount.toLocaleString("en-IN")}
            </h3>
            {trend && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${
                  trend > 0
                    ? "bg-green-light text-green-paid"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(trend)}%
              </motion.span>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${lightBgColor} 100%)` }}
        >
          <IconComponent size={28} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}
