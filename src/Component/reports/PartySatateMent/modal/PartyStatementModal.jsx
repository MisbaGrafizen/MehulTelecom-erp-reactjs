"use client";

import { motion } from "framer-motion";

export default function PartyStatementModal({ type, data, party, onClose }) {
  if (!data) return null;

  const isDetailModal = type === "detail";
  const isSales = data.type === "Sale";

  const transactionList = isDetailModal ? [data] : data;

  return (
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
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isSales ? "Sales Details" : "Purchase Details"}
            </h2>
            {party && (
              <p className="text-sm text-slate-500 mt-1">
                {party.partyName}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {transactionList.map((transaction, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {transaction.date?.substring(0, 10)} • {transaction.time}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    {transaction.invoiceNo}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.type === "Sale"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-slate-50 rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-5 gap-2 p-3 bg-slate-100 text-xs font-semibold text-slate-700">
                  <div>Product</div>
                  <div>IMEI/Serial</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Total</div>
                </div>

                {transaction.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="grid grid-cols-5 gap-2 p-3 border-t border-slate-200 text-sm"
                  >
                    {/* Product Name */}
                    <div className="font-medium text-slate-900">
                      {item.itemName}
                    </div>

                    {/* IMEI / Serial Numbers */}
                    <div className="text-slate-600">
                      {Array.isArray(item.serialNumbers)
                        ? item.serialNumbers
                            .map((sn) =>
                              typeof sn === "string" ? sn : sn.number
                            )
                            .join(", ")
                        : "-"}
                    </div>

                    {/* Qty */}
                    <div className="text-right text-slate-600">
                      {item.qty ?? item.unit}
                    </div>

                    {/* Rate */}
                    <div className="text-right text-slate-600">
                      ₹{(item.pricePerUnit ?? 0).toLocaleString()}
                    </div>

                    {/* Total */}
                    <div className="text-right font-semibold text-slate-900">
                      ₹{(item.amount ?? 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Payment Mode</p>
                  <p className="font-medium text-slate-900">
                    {transaction.paymentMode}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Status</p>
                  <p className="font-medium text-slate-900">
                    {transaction.status}
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Total Amount</p>

                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "Sale" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "Sale" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
