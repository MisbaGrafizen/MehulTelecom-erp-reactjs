"use client"

import { motion } from "framer-motion"
import ProfitLossBadge from "./ProfitLossBadge"

export default function PartyPLRow({ serial, party, onView }) {
  const profit = party.sales - party.purchases
  const isProfit = profit >= 0

  return (
    <motion.div
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="px-6 py-4 grid grid-cols-4 gap-4 items-center border-slate-200 cursor-pointer transition"
      onClick={onView}
    >
      <div className="text-slate-600 text-sm">{serial}</div>

      <div className="font-semibold text-slate-900">{party.name}</div>

      <div className="text-right text-slate-900 font-medium">₹{party.sales.toLocaleString()}</div>

      <div className="text-right">
        <ProfitLossBadge value={profit} isProfit={isProfit} />
      </div>
    </motion.div>
  )
}
