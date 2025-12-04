'use client';

import { motion } from 'framer-motion';

export default function TotalStockStrip({ kpi }) {
  // Safely format total stock value
  const totalValue = kpi?.totalStockValue
    ? `₹${kpi.totalStockValue.toLocaleString("en-IN")}`
    : "₹0";

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bottom-0 left-0 right-0 bg-white border-t border-slate-200 w-[100%] rounded-lg mx-auto shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-slate-600 font-medium">Total Stock Value:</p>
        <p className="text-3xl font-bold text-green-600">{totalValue}</p>
      </div>
    </motion.div>
  );
}
