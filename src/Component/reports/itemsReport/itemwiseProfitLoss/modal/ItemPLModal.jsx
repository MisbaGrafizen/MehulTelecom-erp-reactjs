"use client"

import { motion } from "framer-motion"
import ProfitLossBadge from "../ProfitLossBadge"

export default function ItemPLModal({ item, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-sm opacity-90">
              {item.model} • {item.color} • {item.spec}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Item Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Item Details</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Name:</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Model:</span>
                  <span className="text-sm font-medium">{item.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Color:</span>
                  <span className="text-sm font-medium">{item.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Specification:</span>
                  <span className="text-sm font-medium">{item.spec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Category:</span>
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Purchases:</span>
                  <span className="text-lg font-bold text-red-600">₹{item.totalPurchase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Sales:</span>
                  <span className="text-lg font-bold text-green-600">₹{item.totalSale.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Profit / Loss:</span>
                    <ProfitLossBadge amount={item.profit} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales List */}
        <div className="px-6 py-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Sales Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Invoice No</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Qty</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">IMEI/Serial</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Rate</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {item.sales.map((sale, idx) => (
                  <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-900">{sale.invoiceNo}</td>
                    <td className="px-3 py-2 text-slate-600">{sale.date}</td>
                    <td className="px-3 py-2 text-center text-slate-600">{sale.qty}</td>
                    <td className="px-3 py-2 text-slate-600 text-xs">{sale.imei.join(", ")}</td>
                    <td className="px-3 py-2 text-right text-slate-600">₹{sale.rate.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">
                      ₹{sale.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase List */}
        <div className="px-6 py-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Purchase Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Bill No</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Rate</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {item.purchases.map((purchase, idx) => (
                  <tr key={idx} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-900">{purchase.billNo}</td>
                    <td className="px-3 py-2 text-slate-600">{purchase.date}</td>
                    <td className="px-3 py-2 text-center text-slate-600">{purchase.qty}</td>
                    <td className="px-3 py-2 text-right text-slate-600">₹{purchase.rate.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold text-red-600">
                      ₹{purchase.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 flex justify-end">
          <div className="text-right space-y-2">
            <p className="text-sm text-slate-600">Grand Profit / Loss:</p>
            <ProfitLossBadge amount={item.profit} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
