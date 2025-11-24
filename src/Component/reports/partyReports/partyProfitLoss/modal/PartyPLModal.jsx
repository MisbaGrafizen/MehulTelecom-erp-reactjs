"use client"

import { motion } from "framer-motion"
import ProfitLossBadge from "../ProfitLossBadge"

export default function PartyPLModal({ partyData, isOpen, onClose }) {
  if (!isOpen) return null

  const profit = partyData.sales - partyData.purchases
  const isProfit = profit >= 0

  // Sample invoice data
  const invoices = [
    {
      id: 1,
      invoiceNo: "INV-001",
      date: "2024-11-15",
      salePrice: 50000,
      purchasePrice: 35000,
      items: [{ name: "iPhone 15", imei: "123456789", qty: 2, rate: 25000, total: 50000 }],
    },
    {
      id: 2,
      invoiceNo: "INV-002",
      date: "2024-11-14",
      salePrice: 75000,
      purchasePrice: 55000,
      items: [{ name: "Samsung S24", imei: "987654321", qty: 3, rate: 25000, total: 75000 }],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{partyData.name}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Summary */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-600 text-sm mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-slate-900">₹{partyData.sales.toLocaleString()}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-slate-600 text-sm mb-1">Total Purchase</p>
              <p className="text-2xl font-bold text-slate-900">₹{partyData.purchases.toLocaleString()}</p>
            </div>

            <div
              className={`bg-gradient-to-br ${isProfit ? "from-green-50 to-emerald-50" : "from-red-50 to-pink-50"} rounded-xl p-4 border ${isProfit ? "border-green-200" : "border-red-200"}`}
            >
              <p className={`text-sm mb-1 ${isProfit ? "text-green-700" : "text-red-700"}`}>Total Profit/Loss</p>
              <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {isProfit ? "+" : "-"}₹{Math.abs(profit).toLocaleString()}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-blue-700 text-sm mb-1">Status</p>
              <p className="text-lg font-semibold text-blue-900">{isProfit ? "Profitable" : "Loss"}</p>
            </div>
          </div>

          {/* Right Column - Detailed Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Detailed Breakdown</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-slate-900">{invoice.invoiceNo}</p>
                      <p className="text-xs text-slate-500">{invoice.date}</p>
                    </div>
                    <ProfitLossBadge
                      value={invoice.salePrice - invoice.purchasePrice}
                      isProfit={invoice.salePrice >= invoice.purchasePrice}
                    />
                  </div>

                  {/* Items Table */}
                  <div className="text-xs space-y-1 border-t border-slate-200 pt-2">
                    <div className="grid grid-cols-5 gap-1 font-medium text-slate-600 pb-1">
                      <div>Product</div>
                      <div>IMEI</div>
                      <div className="text-right">Qty</div>
                      <div className="text-right">Rate</div>
                      <div className="text-right">Total</div>
                    </div>
                    {invoice.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-1 text-slate-700">
                        <div>{item.name}</div>
                        <div>{item.imei}</div>
                        <div className="text-right">{item.qty}</div>
                        <div className="text-right">₹{item.rate}</div>
                        <div className="text-right font-medium">₹{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-between items-center">
          <span className="text-slate-600 font-medium">Grand Total</span>
          <span className={`text-xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : "-"}₹{Math.abs(profit).toLocaleString()}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
