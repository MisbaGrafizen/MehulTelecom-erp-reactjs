"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartyListRow from "./PartyListRow"
import PartyReportModal from "../alllParty/modal/PartyReportModal"

export default function PartyList({ parties = [] }) {
  const [selectedParty, setSelectedParty] = useState(null)

  // 🎯 Normalize backend data
  const normalizedParties = parties.map(p => ({
    id: p._id || p.id,
    name: p.partyName || p.name,
    contact: p.contactNumber || p.contact || "",
    address: p.address || "",
    creditLimit: p.creditLimit || 0,
    openingBalance: p.openingBalance || 0,
    raw: p // send original to modal
  }))

  return (
    <>
      <div className="space-y-3">

        {/* Header Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 uppercase">S.No</div>
          <div className="text-xs font-semibold text-slate-600 uppercase">Name</div>
          <div className="hidden sm:block text-xs font-semibold text-slate-600 uppercase">Contact</div>
          <div className="hidden lg:block text-xs font-semibold text-slate-600 uppercase">Address</div>
          <div className="hidden lg:block text-xs font-semibold text-slate-600 uppercase">Credit Limit</div>
          <div className="text-xs font-semibold text-slate-600 uppercase text-right">Actions</div>
        </div>

        {/* Party Rows */}
        <div className="space-y-2">
          {normalizedParties.map((party, idx) => (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <PartyListRow
                party={party}
                index={idx + 1}
                onView={() => setSelectedParty(party.raw)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedParty && (
        <PartyReportModal
          party={selectedParty}
          onClose={() => setSelectedParty(null)}
        />
      )}
    </>
  )
}
