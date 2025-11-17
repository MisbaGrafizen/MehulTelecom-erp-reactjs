"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Printer, Download, MoreVertical, ChevronDown } from 'lucide-react'
import Badge from '../DayBookReports/Badge'

export default function DayBookTable({ data, currentPage, setCurrentPage, itemsPerPage, onViewTransaction }) {
    if (!Array.isArray(data)) data = []

  const [selectedRow, setSelectedRow] = useState(null)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const tableData = data.slice(startIndex, endIndex)

  const getRowBgClass = (type) => {
    const backgrounds = {
      purchase: "bg-white",
      sale: "bg-white",
      transfer: "bg-white",
    }
    return backgrounds[type] || "bg-white hover:bg-gray-200 "
  }

  const getAmountColor = (type) => {
    return {
      purchase: "text-red-600 font-semibold",
      sale: "text-blue-600 font-semibold",
      transfer: "text-orange-600 font-semibold",
    }[type] || "text-foreground"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white  border border-border rounded-xl shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b  border-border   bg-gray-100">
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground font-[] uppercase tracking-wide">Time</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Type</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Invoice No.</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Party/Branch</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Payment Mode</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Amount</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-[600] text-foreground uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <motion.tr
                key={row.id}
                onMouseEnter={() => setSelectedRow(idx)}
                onMouseLeave={() => setSelectedRow(null)}
                className={`border-b border-border transition-all duration-200 ${getRowBgClass(row.type)}`}
              >
                <td className="px-5 py-3 text-sm text-foreground">{row.time}</td>
                <td className="px-5 py-3 text-sm">
                  <Badge type={row.type} text={row.type.charAt(0).toUpperCase() + row.type.slice(1)} />
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">{row.invoiceNo}</td>
                <td className="px-5 py-3 text-sm text-foreground">{row.party}</td>
                <td className="px-5 py-3 text-sm">
                  <Badge type={row.paymentMode.toLowerCase()} text={row.paymentMode} />
                </td>
                <td className={`px-5 py-3 text-sm ${getAmountColor(row.type)}`}>{row.amount}</td>
                <td className="px-5 py-3 text-sm">
                  <Badge type={row.status.toLowerCase()} text={row.status} />
                </td>
                <td className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onViewTransaction(row)}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={16} className="text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title="Print"
                    >
                      <Printer size={16} className="text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={16} className="text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                      title="More"
                    >
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-200 ">
        <span className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </span>
        <div className="flex gap-2 items-center">
          <motion.button
            whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? "text-muted-foreground opacity-50 cursor-not-allowed"
                : "text-foreground hover:bg-border"
            }`}
          >
            <ChevronDown size={18} className="rotate-90" />
          </motion.button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1
              const isActive = pageNum === currentPage
              const isVisible = Math.abs(pageNum - currentPage) <= 1 || pageNum === 1 || pageNum === totalPages

              if (!isVisible) {
                if (pageNum === currentPage - 2) return <span key="dots-before" className="px-2 text-muted-foreground">...</span>
                if (pageNum === currentPage + 2) return <span key="dots-after" className="px-2 text-muted-foreground">...</span>
                return null
              }

              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(pageNum)}
                  initial={isActive ? { scale: 1.15 } : {}}
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "border border-border text-foreground hover:bg-border"
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            })}
          </div>

          <motion.button
            whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? "text-muted-foreground opacity-50 cursor-not-allowed"
                : "text-foreground hover:bg-border"
            }`}
          >
            <ChevronDown size={18} className="-rotate-90" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
