'use client';

import { motion } from 'framer-motion';

export default function TotalStockStrip() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="\ bottom-0 left-0 right-0 bg-white border rounded-[10px] mt-[10px] border-slate-200 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <p className="text-slate-600 font-medium">Total Stock Value:</p>
        <p className="text-3xl font-bold text-green-600">₹1,29,99,993</p>
      </div>
    </motion.div>
  );
}
