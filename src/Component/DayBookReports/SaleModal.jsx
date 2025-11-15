"use client"

import { motion } from "framer-motion"
import { X, Printer, Download, Calendar, Package, Smartphone, User } from 'lucide-react'
import Badge from './Badge'

export default function SaleModal({ sale, onClose }) {
  if (!sale) return null

  const itemsSold = [
    {
      name: "iPhone 14 Pro",
      color: "Space Black",
      spec: "256GB",
      condition: "Excellent",
      serial: "6343848843848347834",
      unit: "pcs",
      price: "₹50,000",
      total: "₹50,000",
      qty: 1,
    },
    {
      name: "AirPods Pro",
      color: "White",
      spec: "2nd Gen",
      condition: "New",
      serial: "AP-654321",
      unit: "pcs",
      price: "₹24,500",
      total: "₹24,500",
      qty: 1,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white  border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-unpaid/10 to-blue-light/10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{sale.invoiceNo}</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge type="sale" text="Sale" />
              <Badge type="completed" text="Completed" />
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-light text-blue-unpaid flex items-center gap-1">
                <Calendar size={12} />
                {sale.time}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-border rounded-lg transition-colors"
          >
            <X size={24} className="text-foreground" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sale & Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sale Info Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-200  border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Package size={16} className="text-primary" />
                Sale Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoice No.</span>
                  <span className="font-semibold text-foreground">{sale.invoiceNo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Mode</span>
                  <Badge type={sale.paymentMode.toLowerCase()} text={sale.paymentMode} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Count</span>
                  <span className="font-bold text-primary text-base">{sale.details.items}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total Sale</span>
                  <span className="font-bold text-blue-unpaid text-base">{sale.amount}</span>
                </div>
              </div>
            </motion.div>

            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-200  border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <User size={16} className="text-primary" />
                Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Customer Name</p>
                  <p className="font-semibold text-foreground">{sale.details.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Salesman</p>
                  <p className="font-semibold text-foreground">{sale.details.salesman}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Remaining</p>
                  <p className="font-semibold text-destructive">₹{sale.details.remainingAmount}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Items Sold Section */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              Items Sold
            </h3>
            <div className="space-y-3">
              {itemsSold.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-unpaid to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Smartphone size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color} • {item.spec}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-light text-blue-unpaid text-xs font-bold flex-shrink-0">
                      Qty: {item.qty}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Condition</p>
                      <p className="font-semibold text-foreground">{item.condition}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Unit</p>
                      <p className="font-semibold text-foreground">{item.unit}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">IMEI/Serial</p>
                    <div className="bg-input border border-border rounded-lg p-3">
                      <p className="font-mono text-xs text-foreground break-all">{item.serial}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Unit Price</p>
                      <p className="font-semibold text-foreground">{item.price}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-muted-foreground text-xs mb-1">Total Amount</p>
                      <p className="font-bold text-blue-unpaid text-base">{item.total}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-light to-blue-light/50 border border-blue-unpaid/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Items</p>
              <p className="text-2xl font-bold text-blue-unpaid">{sale.details.items}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-orange-light to-orange-light/50 border border-orange-total/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Remaining</p>
              <p className="text-lg font-bold text-orange-total">₹{sale.details.remainingAmount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-light to-blue-light/50 border border-blue-unpaid/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total</p>
              <p className="text-lg font-bold text-blue-unpaid">{sale.amount}</p>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between p-4 bg-gray-200  border border-border rounded-xl"
          >
            <span className="text-xs text-muted-foreground">Generated preview from live transaction data.</span>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-input border border-border rounded-lg hover:bg-border transition-colors font-medium text-sm"
              >
                <Printer size={16} />
                Print
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-unpaid to-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
              >
                <Download size={16} />
                Download
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
