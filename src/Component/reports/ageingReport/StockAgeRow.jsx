'use client';

import { Eye } from 'lucide-react';
import { AgeBadge } from './AgeBadge';
import { motion } from 'framer-motion';

export function StockAgeRow({ item, onViewClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <p className="font-semibold text-slate-900">{item.product}</p>
          <p className="text-xs text-slate-500 mt-1">{item.imei}</p>
        </div>

        <div className="text-sm text-slate-600 min-w-20">
          <p className="font-medium text-slate-900">{item.quantity}</p>
          <p className="text-xs text-slate-500">Quantity</p>
        </div>

        <div className="text-sm text-slate-600 min-w-28">
          <p className="font-medium text-slate-900">{item.purchaseDate}</p>
          <p className="text-xs text-slate-500">Purchase Date</p>
        </div>

        <AgeBadge ageDays={item.ageDays} />

        <button
          onClick={() => onViewClick(item)}
          className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all hover:scale-105"
        >
          <Eye size={18} className="text-blue-600" />
        </button>
      </div>
    </motion.div>
  );
}
