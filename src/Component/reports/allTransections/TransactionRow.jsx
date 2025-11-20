'use client'

import { Eye } from 'lucide-react'
import Badge from './Badge'

export default function TransactionRow({ transaction, onSelect }) {
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const amountColor = transaction.type === 'Purchase' ? 'text-red-600' : 'text-green-600'
  const amountSign = transaction.type === 'Purchase' ? '-' : '+'

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:bg-slate-50 transition">
      <div className="flex items-center justify-between gap-4">
        {/* Date & Time */}
        <div className="min-w-fit">
          <p className="text-sm font-medium text-slate-900">{formattedDate}</p>
          <p className="text-xs text-slate-500">{transaction.time}</p>
        </div>

        {/* Party Name */}
        <div className="flex-1 min-w-fit">
          <p className="text-sm font-medium text-slate-900 truncate">{transaction.partyName}</p>
          <p className="text-xs text-slate-500">{transaction.invoiceNo}</p>
        </div>

        {/* Type Badge */}
        <div className="min-w-fit">
          <Badge type={transaction.type} />
        </div>

        {/* Amount */}
        <div className="text-right min-w-fit">
          <p className={`text-sm font-semibold ${amountColor}`}>
            {amountSign}₹{transaction.amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* View Button */}
        <button
          onClick={onSelect}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-blue-600 flex-shrink-0"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
