"use client"

import { motion } from "framer-motion"
import ProfitLossBadge from "./ProfitLossBadge"

export default function ItemTableRow({ item, index, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center px-4 py-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="text-sm font-medium text-slate-900">{index}</div>
      <div className="text-sm">
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="text-xs text-slate-500">{item.model}</p>
      </div>
      <div className="text-sm font-semibold text-green-600 text-right">₹{item.totalSale.toLocaleString()}</div>
      <div className="text-sm font-semibold text-red-600 text-right">₹{item.totalPurchase.toLocaleString()}</div>
      <div className="text-right">
        <ProfitLossBadge amount={item.profit} />
      </div>
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onView}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}
