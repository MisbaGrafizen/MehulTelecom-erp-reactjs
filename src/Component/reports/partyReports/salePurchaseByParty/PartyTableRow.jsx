import React from 'react'

"use client"

const ViewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

export default function PartyTableRow({ party, onViewClick }) {
  const netBalance = party.totalSale - party.totalPurchase

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md hover:bg-slate-50 transition-all">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div>
          <p className="text-sm text-slate-600">Party Name</p>
          <p className="font-semibold text-slate-900">{party.name}</p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Sale Amount</p>
          <p className="font-semibold text-green-600">₹{party.totalSale.toLocaleString("en-IN")}</p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Purchase Amount</p>
          <p className="font-semibold text-red-600">₹{party.totalPurchase.toLocaleString("en-IN")}</p>
        </div>

        <div>
          <p className="text-sm text-slate-600">Net Balance</p>
          <p className={`font-semibold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{Math.abs(netBalance).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onViewClick(party)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors hover:scale-110 transform"
            title="View Details"
          >
            <ViewIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

