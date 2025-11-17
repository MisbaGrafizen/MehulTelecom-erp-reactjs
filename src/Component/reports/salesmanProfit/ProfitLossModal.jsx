'use client';

import { motion, AnimatePresence } from 'framer-motion';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ProfitLossModal({ transaction, onClose }) {
  const totalProfitLoss = transaction.profitLoss * transaction.qty;
  const isProfit = totalProfitLoss > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div
            className={`p-6 text-white ${
              isProfit
                ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                : 'bg-gradient-to-r from-red-500 to-orange-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{transaction.productName}</h2>
                <p className="text-sm opacity-90 mt-1">
                  Transaction Details & Profit/Loss Breakdown
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Salesman Name
                  </p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {transaction.salesmanName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Condition
                  </p>
                  <div className="mt-1 inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                    {transaction.condition}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    IMEI Number
                  </p>
                  <p className="font-mono text-sm text-slate-900 mt-1 break-all">
                    {transaction.imei}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Quantity
                  </p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {transaction.qty} unit{transaction.qty > 1 ? 's' : ''}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Purchase Date
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {new Date(transaction.purchaseDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Purchase Price (per unit)
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(transaction.purchasePrice)}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Sale Price (per unit)
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {formatCurrency(transaction.salePrice)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Category / Brand
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {transaction.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {transaction.brand}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Profit per Unit
                  </p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {formatCurrency(transaction.profitLoss)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Summary */}
            <div
              className={`mt-8 p-6 rounded-xl text-white ${
                isProfit
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                  : 'bg-gradient-to-r from-red-500 to-orange-600'
              }`}
            >
              <p className="text-sm opacity-90 mb-2">Total Profit/Loss Summary</p>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl md:text-3xl font-bold">
                  {isProfit ? '+' : '−'}
                  {formatCurrency(Math.abs(totalProfitLoss))}
                </p>
                <p className="text-xs opacity-75">
                  {transaction.qty} {transaction.qty > 1 ? 'units' : 'unit'} × {formatCurrency(transaction.profitLoss)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
