"use client"

import { motion } from "framer-motion"

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[500px]"
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center max-w-md">
        {/* User Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">Please select a party</h3>
        <p className="text-slate-600 text-sm">Please select a party to view profit & loss statement.</p>
      </div>
    </motion.div>
  )
}
