'use client';

import { motion } from 'framer-motion';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SalesmanListRow({ transaction, onView }) {
  const totalProfit = transaction.profitLoss * transaction.qty;

  return (
    <motion.div
      whileHover={{ shadow: 'md', backgroundColor: '#f8fafc' }}
      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {/* Product Name */}
        <div>
          <p className="text-sm text-slate-500">Product</p>
          <p className="font-semibold text-slate-900">{transaction.productName}</p>
        </div>

        {/* IMEI */}
        <div>
          <p className="text-sm text-slate-500">IMEI / Serial</p>
          <p className="font-mono text-sm text-slate-700">{transaction.imei}</p>
        </div>

        {/* Qty */}
        <div>
          <p className="text-sm text-slate-500">Qty</p>
          <p className="font-semibold text-slate-900">{transaction.qty}</p>
        </div>

        {/* Purchase Price */}
        <div>
          <p className="text-sm text-slate-500">Purchase Price</p>
          <p className="font-semibold text-slate-900">
            {formatCurrency(transaction.purchasePrice)}
          </p>
        </div>

        {/* Sale Price */}
        <div>
          <p className="text-sm text-slate-500">Sale Price</p>
          <p className="font-semibold text-slate-900">
            {formatCurrency(transaction.salePrice)}
          </p>
        </div>

        {/* Profit/Loss Badge */}
        <div>
          <p className="text-sm text-slate-500">Profit/Loss</p>
          <div
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${
              transaction.isProfit
                ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                : 'bg-gradient-to-r from-red-500 to-orange-600'
            }`}
          >
            {transaction.isProfit ? '+' : '−'}
            {formatCurrency(Math.abs(totalProfit))}
          </div>
        </div>

        {/* View Button */}
        <div className="flex justify-end md:justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
