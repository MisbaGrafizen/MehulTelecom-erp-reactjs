
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Eye, Printer, Download, Search, TrendingUp, TrendingDown, ChevronDown, X, MoreVertical, Plus, MapPin, Package, Smartphone } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const Header = () => (
  <div className="mb-8 animate-fade-in-up">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <span>Reports</span>
      <span>/</span>
      <span className="text-foreground font-medium">Stock Transfer</span>
    </div>
    <h1 className="text-4xl font-bold text-foreground">Stock Transfer</h1>
  </div>
)

const DateRangePickerMUI = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <DatePicker
            value={value}
            onChange={onChange}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'var(--secondary)',
                    },
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '0.625rem 0.75rem',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  },
                  '& .MuiPickersDay-root': {
                    color: 'var(--foreground)',
                    '&:hover': {
                      backgroundColor: 'var(--secondary)',
                    },
                  },
                  '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  },
                },
              },
            }}
          />
        </motion.div>
      </LocalizationProvider>
    </div>
  )
}

const AnimatedDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <motion.div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <span className="truncate">{value}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0, y: isOpen ? 2 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="py-2 max-h-48 overflow-y-auto">
                {options.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                    }}
                    whileHover={{ backgroundColor: "var(--color-secondary)" }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      value === option
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const KPICard = ({ title, amount, icon: IconComponent, bgColor, lightBgColor, trend }) => {
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    const target = Number.parseFloat(amount.replace(/[^0-9.]/g, ""))
    const increment = target / 60
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayAmount(target)
        clearInterval(timer)
      } else {
        setDisplayAmount(Math.floor(current))
      }
    }, 15)

    return () => clearInterval(timer)
  }, [amount])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
      className={`relative overflow-hidden rounded-xl p-6 shadow-lg transition-all duration-300 cursor-default border border-border`}
      style={{ background: `linear-gradient(135deg, ${lightBgColor} 0%, var(--background) 100%)` }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-3">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl md:text-4xl font-bold" style={{ color: bgColor }}>
              ₹{displayAmount.toLocaleString("en-IN")}
            </h3>
            {trend && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${
                  trend > 0
                    ? "bg-green-light text-green-paid"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(trend)}%
              </motion.span>
            )}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
          style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${lightBgColor} 100%)` }}
        >
          <IconComponent size={28} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}

const TransferTable = ({ onViewTransfer, currentPage, setCurrentPage, itemsPerPage }) => {
  const [selectedRow, setSelectedRow] = useState(null)

  const allTableData = [
    {
      id: 1,
      date: "2024-01-15",
      transferNo: "TRN-00001",
      company: "ABC Mobile Store",
      from: "Delhi Branch",
      to: "Mumbai Branch",
      items: 5,
      total: "₹2,45,000",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-14",
      transferNo: "TRN-00002",
      company: "XYZ Electronics",
      from: "Mumbai Branch",
      to: "Bangalore Branch",
      items: 8,
      total: "₹3,67,500",
      status: "pending",
    },
    {
      id: 3,
      date: "2024-01-13",
      transferNo: "TRN-00003",
      company: "Tech Hub",
      from: "Bangalore Branch",
      to: "Chennai Branch",
      items: 3,
      total: "₹1,23,400",
      status: "completed",
    },
    {
      id: 4,
      date: "2024-01-12",
      transferNo: "TRN-00004",
      company: "Digital World",
      from: "Chennai Branch",
      to: "Hyderabad Branch",
      items: 12,
      total: "₹5,67,800",
      status: "pending",
    },
    {
      id: 5,
      date: "2024-01-11",
      transferNo: "TRN-00005",
      company: "Mobile Hub",
      from: "Hyderabad Branch",
      to: "Delhi Branch",
      items: 6,
      total: "₹2,89,500",
      status: "completed",
    },
    {
      id: 6,
      date: "2024-01-10",
      transferNo: "TRN-00006",
      company: "Premium Devices",
      from: "Delhi Branch",
      to: "Pune Branch",
      items: 4,
      total: "₹1,78,900",
      status: "failed",
    },
    {
      id: 7,
      date: "2024-01-09",
      transferNo: "TRN-00007",
      company: "Smart Mobiles",
      from: "Pune Branch",
      to: "Ahmedabad Branch",
      items: 7,
      total: "₹3,45,600",
      status: "completed",
    },
    {
      id: 8,
      date: "2024-01-08",
      transferNo: "TRN-00008",
      company: "Tech Paradise",
      from: "Ahmedabad Branch",
      to: "Kolkata Branch",
      items: 9,
      total: "₹4,12,300",
      status: "pending",
    },
    {
      id: 9,
      date: "2024-01-07",
      transferNo: "TRN-00009",
      company: "Mobile Zone",
      from: "Kolkata Branch",
      to: "Delhi Branch",
      items: 5,
      total: "₹2,34,700",
      status: "completed",
    },
    {
      id: 10,
      date: "2024-01-06",
      transferNo: "TRN-00010",
      company: "Gadget Hub",
      from: "Delhi Branch",
      to: "Mumbai Branch",
      items: 11,
      total: "₹5,89,400",
      status: "completed",
    },
  ]

  const totalPages = Math.ceil(allTableData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const tableData = allTableData.slice(startIndex, endIndex)

  const getStatusBadgeClass = (status) => {
    const badges = {
      completed: "bg-green-light text-green-paid",
      pending: "bg-blue-light text-blue-unpaid",
      failed: "bg-destructive/10 text-destructive",
    }
    return badges[status] || "bg-secondary text-foreground"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card border border-border rounded-xl shadow-md overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gradient-to-r from-blue-unpaid/10 to-green-paid/10">
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Transfer No.
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                From
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                To
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <motion.tr
                key={idx}
                onMouseEnter={() => setSelectedRow(idx)}
                onMouseLeave={() => setSelectedRow(null)}
                animate={selectedRow === idx ? { backgroundColor: "var(--color-secondary)" } : {}}
                transition={{ duration: 0.2 }}
                className="border-b border-border hover:bg-secondary transition-colors"
              >
                <td className="px-6 py-4 text-sm text-foreground">{row.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.transferNo}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.company}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.from}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.to}</td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.items}</td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.total}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onViewTransfer(row)}
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary">
        <span className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, allTableData.length)} of {allTableData.length} entries
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
                if (pageNum === currentPage - 2) {
                  return <span key="dots-before" className="px-2 text-muted-foreground">...</span>
                }
                if (pageNum === currentPage + 2) {
                  return <span key="dots-after" className="px-2 text-muted-foreground">...</span>
                }
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

const TransferDetailsModal = ({ transfer, onClose }) => {
  if (!transfer) return null

  const itemsTransferred = [
    {
      name: "iPhone 14 Pro",
      color: "Space Black",
      spec: "256GB",
      condition: "Excellent",
      serial: "6343848843848347834",
      unit: "pcs",
      price: "₹40,000",
      total: "₹40,000",
      qty: 1,
    },
    {
      name: "Samsung S24",
      color: "White",
      spec: "512GB",
      condition: "Good",
      serial: "SN001-SN002",
      unit: "pcs",
      price: "₹35,000",
      total: "₹70,000",
      qty: 2,
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
        className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-unpaid/5 to-green-paid/5">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{transfer.transferNo}</h2>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-light text-blue-unpaid">
                Transfer
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                transfer.status === 'completed' ? 'bg-green-light text-green-paid' :
                transfer.status === 'pending' ? 'bg-blue-light text-blue-unpaid' :
                'bg-destructive/10 text-destructive'
              }`}>
                {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-light text-orange-total flex items-center gap-1">
                <Calendar size={12} />
                {transfer.date}
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
          {/* Transfer & Company Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transfer Info Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Package size={16} className="text-primary" />
                Transfer Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer No.</span>
                  <span className="font-semibold text-foreground">{transfer.transferNo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Type</span>
                  <span className="font-semibold text-foreground">Transfer</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Count</span>
                  <span className="font-bold text-primary text-base">{transfer.items}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-bold text-green-paid text-base">{transfer.total}</span>
                </div>
              </div>
            </motion.div>

            {/* Company & Branch Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground">Company & Branch</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Company</p>
                  <p className="font-semibold text-foreground">{transfer.company}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">From Branch</p>
                  <p className="font-semibold text-foreground flex items-center gap-2"><MapPin size={14} /> {transfer.from}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">To Branch</p>
                  <p className="font-semibold text-foreground flex items-center gap-2"><MapPin size={14} /> {transfer.to}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Items Transferred Section */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              Items Transferred
            </h3>
            <div className="space-y-3">
              {itemsTransferred.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="border border-border rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Top Row */}
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
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex-shrink-0">
                      Qty: {item.qty}
                    </span>
                  </div>

                  {/* Details Grid */}
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

                  {/* Serial/IMEI */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Serial No.</p>
                    <div className="bg-input border border-border rounded-lg p-3">
                      <p className="font-mono text-xs text-foreground break-all">{item.serial}</p>
                    </div>
                  </div>

                  {/* Price & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Unit Price</p>
                      <p className="font-semibold text-foreground">{item.price}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-muted-foreground text-xs mb-1">Total Amount</p>
                      <p className="font-bold text-green-paid text-base">{item.total}</p>
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
              className="bg-gradient-to-br from-green-light to-green-light/50 border border-green-paid/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Items</p>
              <p className="text-2xl font-bold text-green-paid">{transfer.items}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-blue-light to-blue-light/50 border border-blue-unpaid/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">From</p>
              <p className="text-sm font-bold text-blue-unpaid text-center">{transfer.from}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-light to-orange-light/50 border border-orange-total/20 rounded-xl p-4 text-center"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total</p>
              <p className="text-lg font-bold text-orange-total">{transfer.total}</p>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between p-4 bg-secondary border border-border rounded-xl"
          >
            <span className="text-xs text-muted-foreground">
              Generated preview from live transaction data.
            </span>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-unpaid to-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
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

export default function StockTransferReport() {
  const [filters, setFilters] = useState({
    dateRange: "This Month",
    company: "All Companies",
    branch: "All Branches",
    status: "All Status",
    fromDate: dayjs("2024-01-01"),
    toDate: dayjs("2024-12-31"),
  })
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-6 bg-card border border-border rounded-xl shadow-md"
        >
          <div className="space-y-5">
            {/* Quick Date Filters */}
            <div className="flex gap-3 pb-3 overflow-x-auto scrollbar-hide">
              {["Today", "This Week", "This Month", "Custom"].map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ ...filters, dateRange: option })}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    filters.dateRange === option
                      ? "bg-gradient-to-r from-blue-unpaid to-green-paid text-white shadow-lg"
                      : "bg-secondary text-foreground hover:bg-border"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <DateRangePickerMUI
                label="From Date"
                value={filters.fromDate}
                onChange={(date) => setFilters({ ...filters, fromDate: date })}
              />
              <DateRangePickerMUI
                label="To Date"
                value={filters.toDate}
                onChange={(date) => setFilters({ ...filters, toDate: date })}
              />
              <AnimatedDropdown
                label="Companies"
                options={["All Companies", "ABC Mobile Store", "XYZ Electronics", "Tech Hub"]}
                value={filters.company}
                onChange={(company) => setFilters({ ...filters, company })}
              />
              <AnimatedDropdown
                label="Branch"
                options={["All Branches", "Delhi Branch", "Mumbai Branch", "Bangalore Branch"]}
                value={filters.branch}
                onChange={(branch) => setFilters({ ...filters, branch })}
              />
              <AnimatedDropdown
                label="Status"
                options={["All Status", "Completed", "Pending", "Failed"]}
                value={filters.status}
                onChange={(status) => setFilters({ ...filters, status })}
              />
            </div>

            {/* Search & Create */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
                  Search
                </label>
                <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 py-2.5">
                  <Search size={16} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search transfer no, serial no, branch…"
                    className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-unpaid to-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity font-medium text-sm whitespace-nowrap shadow-lg"
                >
                  <Plus size={18} />
                  Create Transfer
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Transferred"
            amount="₹15,67,200"
            icon={Package}
            bgColor="var(--green-paid)"
            lightBgColor="var(--green-light)"
            trend={12}
          />
          <KPICard
            title="Pending"
            amount="₹5,23,400"
            icon={MapPin}
            bgColor="var(--blue-unpaid)"
            lightBgColor="var(--blue-light)"
            trend={-3}
          />
          <KPICard
            title="Total"
            amount="₹20,90,600"
            icon={Package}
            bgColor="var(--orange-total)"
            lightBgColor="var(--orange-light)"
            trend={8}
          />
        </div>

        {/* Transfer Table */}
        <TransferTable
          onViewTransfer={setSelectedTransfer}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />

        {/* Transfer Details Modal */}
        <AnimatePresence>
          {selectedTransfer && (
            <TransferDetailsModal
              transfer={selectedTransfer}
              onClose={() => setSelectedTransfer(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
