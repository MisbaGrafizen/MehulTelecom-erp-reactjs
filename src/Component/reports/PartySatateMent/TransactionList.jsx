"use client"

import TransactionRow from "./TransactionRow"

export default function TransactionList({ transactions, searchQuery, onViewClick }) {
  const filteredTransactions = transactions.filter((t) => {
    const query = searchQuery.toLowerCase()
    return (
      t.invoiceNo.toLowerCase().includes(query) ||
      t.items.some((item) => item.name.toLowerCase().includes(query) || item.imei.includes(query))
    )
  })

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Transaction History</h2>
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} onViewClick={onViewClick} />
        ))}
      </div>
    </div>
  )
}
