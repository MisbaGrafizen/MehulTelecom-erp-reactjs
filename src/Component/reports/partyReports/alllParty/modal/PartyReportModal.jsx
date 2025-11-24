"use client"

import { motion } from "framer-motion"

export default function PartyReportModal({ party, onClose }) {
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Sale",
      invoiceNo: "INV-001",
      amount: 50000,
      mode: "Credit",
      items: [{ name: "iPhone 15 Pro", imei: "123456789012345", qty: 2, rate: 25000, total: 50000 }],
    },
    {
      id: 2,
      date: "2024-01-18",
      type: "Purchase",
      invoiceNo: "PO-001",
      amount: 35000,
      mode: "Cash",
      items: [{ name: "Samsung Galaxy S24", imei: "987654321098765", qty: 1, rate: 35000, total: 35000 }],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{party.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                <p className="text-sm text-slate-900 font-medium mt-1">{party.name}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Phone Number</label>
                <p className="text-sm text-slate-900 font-medium mt-1">{party.contact}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                <p className="text-sm text-slate-900 font-medium mt-1">
                  info@{party.name.toLowerCase().replace(/ /g, "")}.com
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Address</label>
                <p className="text-sm text-slate-900 font-medium mt-1">{party.address}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Credit Limit</label>
                <p className="text-sm text-slate-900 font-medium mt-1">₹{party.creditLimit.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Opening Balance</label>
                <p
                  className={`text-sm font-medium mt-1 ${party.openingBalance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ₹{party.openingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900">Totals Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Sale Amount</span>
                  <span className="text-sm font-semibold text-green-600">₹50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Purchase Amount</span>
                  <span className="text-sm font-semibold text-slate-900">₹35,000</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Net Balance</span>
                  <span className="text-sm font-bold text-blue-600">₹15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Paid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Transaction History</h3>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600">Date & Time</p>
                      <p className="text-sm font-medium text-slate-900">{transaction.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Type</p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${transaction.type === "Sale" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Invoice No</p>
                      <p className="text-sm font-medium text-slate-900">{transaction.invoiceNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Amount</p>
                      <p className="text-sm font-bold text-slate-900">₹{transaction.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="bg-slate-50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Product</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">IMEI</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">Qty</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Rate</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                            <td className="px-3 py-2 text-slate-900">{item.name}</td>
                            <td className="px-3 py-2 text-slate-600 font-mono text-xs">{item.imei}</td>
                            <td className="px-3 py-2 text-center text-slate-900">{item.qty}</td>
                            <td className="px-3 py-2 text-right text-slate-900">₹{item.rate.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right font-semibold text-slate-900">
                              ₹{item.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                    <span className="text-sm text-slate-600">
                      Payment Mode: <span className="font-medium text-slate-900">{transaction.mode}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-2xl flex justify-between items-center">
          <div className="text-sm">
            <span className="text-slate-600">Grand Total Balance: </span>
            <span className="font-bold text-lg text-green-600">₹15,000</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
