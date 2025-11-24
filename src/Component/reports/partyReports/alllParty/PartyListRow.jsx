"use client"

import { motion } from "framer-motion"

export default function PartyListRow({ party, index, onView }) {

  const name = party?.name || "Unknown"
  const contact = party?.contact || "N/A"
  const address = party?.address || "N/A"
  const creditLimit = party?.creditLimit ?? 0

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">

        {/* Serial Number */}
        <div className="text-sm font-medium text-slate-900">{index}</div>

        {/* Party Name + contact (mobile only) */}
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500 sm:hidden">{contact}</p>
        </div>

        {/* Contact (desktop visible) */}
        <div className="hidden sm:block">
          <p className="text-sm text-slate-700">{contact}</p>
        </div>

        {/* Address */}
        <div className="hidden lg:block">
          <p className="text-sm text-slate-600 truncate">{address}</p>
        </div>

        {/* Credit Limit */}
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-slate-900">
            ₹{Number(creditLimit).toLocaleString()}
          </p>
        </div>

        {/* View Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </motion.button>
        </div>

      </div>
    </motion.div>
  )
}
