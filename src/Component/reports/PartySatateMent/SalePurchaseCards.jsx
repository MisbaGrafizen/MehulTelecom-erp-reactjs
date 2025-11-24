"use client"

import { motion } from "framer-motion"

export default function SalePurchaseCards({
  totalSales,
  saleCount,
  totalPurchases,
  purchaseCount,
  onSaleClick,
  onPurchaseClick,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Sales Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onSaleClick}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Sales</h3>
            <p className="text-sm text-slate-500">{saleCount} invoices</p>
          </div>
          <div className="w-10 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</p>
          </div>
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </motion.div>

      {/* Purchase Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onPurchaseClick}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Purchases</h3>
            <p className="text-sm text-slate-500">{purchaseCount} bills</p>
          </div>
          <div className="w-10 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-slate-900">₹{totalPurchases.toLocaleString()}</p>
          </div>
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
