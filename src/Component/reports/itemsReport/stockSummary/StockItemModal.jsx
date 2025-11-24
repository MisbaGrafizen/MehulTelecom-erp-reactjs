'use client';

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
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* HEADER */}
          <div className="sticky top-0 flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* SUMMARY SECTION */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Sale Price</p>
                <p className="text-lg font-bold text-green-600">{item.salePrice || '₹28,000'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Purchase Price</p>
                <p className="text-lg font-bold text-red-600">{item.purchasePrice || '₹26,000'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">In Stock</p>
                <p className="text-lg font-bold text-emerald-600">{item.quantity ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Stock Value</p>
                <p className="text-lg font-bold text-slate-800">{item.stockValue || '₹0'}</p>
              </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 font-semibold text-slate-700">
                Stock Transactions
              </div>

              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Transactions</th>
                    <th className="px-4 py-3 text-center font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right font-medium">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">Sale</p>
                      <p className="text-xs text-slate-500">19/11/2025</p>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-800 font-medium">1.0</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">₹28,000</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">Purchase</p>
                      <p className="text-xs text-slate-500">05/11/2025</p>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-800 font-medium">1.0</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-600">₹26,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADDITIONAL INFO */}
            <div className="space-y-3 mt-6">
              <div>
                <p className="text-sm text-slate-500">IMEI / Serial Number</p>
                <p className="font-mono bg-slate-50 px-3 py-2 rounded-lg text-slate-800">
                  {item.imei}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Specifications</p>
                <p className="text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">
                  {item.specs}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          {/* <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium hover:bg-slate-100"
            >
              Close
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
            >
              Edit Item
            </motion.button>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
