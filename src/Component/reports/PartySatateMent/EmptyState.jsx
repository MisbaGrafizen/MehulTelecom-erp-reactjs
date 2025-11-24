import React from 'react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a Party</h3>
      <p className="text-slate-600 text-center max-w-sm">
        Please select a party from the dropdown to view their statement and transaction history.
      </p>
    </div>
  )
}

