'use client';

import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export function StockAgeModal({ data, onClose }) {
  const getStatusColor = (status) => {
    const colors = {
      'OK': 'bg-green-100 text-green-800',
      'Low': 'bg-yellow-100 text-yellow-800',
      'Old': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 flex items-start justify-between sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-white">{data.product}</h2>
            <p className="text-blue-100 text-sm mt-1">{data.imei}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Condition</p>
                <p className="font-semibold text-slate-900">{data.condition}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">IMEI Number</p>
                <p className="font-mono text-sm font-semibold text-slate-900">{data.imei}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Quantity</p>
                <p className="font-semibold text-slate-900">{data.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Specs</p>
                <p className="font-semibold text-slate-900">{data.specs}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Category</p>
                <p className="font-semibold text-slate-900">{data.category}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Purchase Date</p>
                <p className="font-semibold text-slate-900">{data.purchaseDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Stock Age</p>
                <p className="font-semibold text-slate-900">{data.ageDays} days</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Current Stock Value</p>
                <p className="font-semibold text-slate-900">₹{data.stockValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Total Stock Value</p>
            <p className="text-2xl font-bold text-green-600">₹{data.stockValue.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
              Print
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
