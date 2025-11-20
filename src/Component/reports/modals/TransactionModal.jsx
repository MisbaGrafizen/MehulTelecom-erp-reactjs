'use client'

import { motion } from 'framer-motion'
import { X, Download, Printer } from 'lucide-react'

export default function TransactionModal({ transaction, onClose }) {
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const typeColors = {
    Sale: 'bg-blue-500',
    Purchase: 'bg-green-500',
    Transfer: 'bg-orange-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${typeColors[transaction.type] || 'bg-blue-500'} text-white p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Transaction Details</h2>
          <p className="text-sm opacity-90 mt-1">{transaction.type} Transaction</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Transaction Type</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.type}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Party Name</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.partyName}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Date & Time</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{formattedDate}, {transaction.time}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Invoice/Transaction No</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.invoiceNo}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Amount</p>
                <p className={`text-2xl font-bold mt-1 ${transaction.type === 'Purchase' ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Payment Mode</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.paymentMode}</p>
              </div>
              
              {transaction.salesman && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Salesman</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.salesman}</p>
                </div>
              )}
              
              {transaction.supplier && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Supplier</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{transaction.supplier}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Details */}
          {transaction.type === 'Transfer' && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">From Branch</p>
                  <p className="font-semibold text-slate-900">{transaction.fromBranch}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">To Branch</p>
                  <p className="font-semibold text-slate-900">{transaction.toBranch}</p>
                </div>
              </div>
            </div>
          )}

          {/* Item List */}
          {transaction.items && transaction.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase">Items</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transaction.items.map((item, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Product</p>
                        <p className="font-medium text-slate-900">{item.product}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">IMEI/Serial</p>
                        <p className="font-medium text-slate-900">{item.imei}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Qty</p>
                        <p className="font-medium text-slate-900">{item.qty}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Rate</p>
                        <p className="font-medium text-slate-900">₹{item.rate}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Total</p>
                        <p className="font-medium text-slate-900">₹{item.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
