

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function StockItemModal({ item, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Category</p>
                <p className="text-lg font-semibold text-slate-900">{item.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-white ${
                  item.status === 'good' ? 'bg-green-500' :
                  item.status === 'lowstock' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}>
                  {item.statusBadge}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Stock & Quantity */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Stock Quantity</p>
                <p className={`text-2xl font-bold ${
                  item.status === 'good' ? 'text-green-600' :
                  item.status === 'lowstock' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {item.quantity}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Purchase Price</p>
                <p className="text-lg font-semibold text-slate-900">{item.purchasePrice}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Current Value</p>
                <p className="text-lg font-semibold text-slate-900">{item.currentStockValue}</p>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Specifications */}
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Specifications</p>
              <p className="text-base text-slate-900 bg-slate-50 p-3 rounded-lg">{item.specs}</p>
            </div>

            {/* IMEI/Serial */}
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">IMEI/Serial Number</p>
              <p className="text-base font-mono text-slate-900 bg-slate-50 p-3 rounded-lg">{item.imei}</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Purchase Date</p>
                <p className="text-base text-slate-900">{item.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Last Updated</p>
                <p className="text-base text-slate-900">Today</p>
              </div>
            </div>

            <div className="border-t border-slate-200" />

            {/* Total Value */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">Total Value of Item</p>
              <p className="text-3xl font-bold text-green-600">{item.currentStockValue}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-100 transition-colors"
            >
              Close
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Edit Item
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
