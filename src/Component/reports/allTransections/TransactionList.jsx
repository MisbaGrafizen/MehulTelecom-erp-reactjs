'use client'

import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import Badge from './Badge'

export default function TransactionList({ transactions, onSelectTransaction }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead className="bg-slate-200 text-slate-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left w-[100px]">Sr. No</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-center w-[90px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => {
                const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
                const amountColor =
                  transaction.type === 'Purchase' ? 'text-red-600' : 'text-green-600'
                const amountSign = transaction.type === 'Purchase' ? '-' : '+'

                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{formattedDate}</td>
                    <td className="py-2 px-4 font-medium text-slate-900">
                      {transaction.partyName}
                    </td>
                    <td className="py-2 px-4">
                      <Badge type={transaction.type} />
                    </td>
                    <td className={`py-2 px-4 text-right font-semibold ${amountColor}`}>
                      {amountSign}₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => onSelectTransaction(transaction)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
