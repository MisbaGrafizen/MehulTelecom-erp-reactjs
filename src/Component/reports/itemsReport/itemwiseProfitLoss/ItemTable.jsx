"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ItemTableRow from "../itemwiseProfitLoss/ItemTableRow"
import ItemPLModal from "../itemwiseProfitLoss/modal/ItemPLModal"

export default function ItemTable({ items }) {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {/* Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4 py-3 bg-slate-200 rounded-lg text-sm font-semibold text-slate-700">
          <div>Serial No.</div>
          <div>Item Name</div>
          <div className="text-right">Sale (₹)</div>
          <div className="text-right">Purchase (₹)</div>
          <div className="text-right">Profit / Loss (₹)</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Data Rows */}
        {items.map((item, idx) => (
          <ItemTableRow key={item.id} item={item} index={idx + 1} onView={() => setSelectedItem(item)} />
        ))}
      </motion.div>

      {/* Modal */}
      {selectedItem && <ItemPLModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  )
}
