import React from 'react'



export default function TransactionRow({ transaction, onViewClick }) {
  const isPositive = transaction.type === "Sale"

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {transaction.date} • {transaction.time}
            </p>
            <p className="text-xs text-slate-500 mt-1">{transaction.invoiceNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {transaction.type}
          </div>

          <div className={`text-right font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : "-"}₹{transaction.amount.toLocaleString()}
          </div>

          <button
            onClick={() => onViewClick(transaction)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
