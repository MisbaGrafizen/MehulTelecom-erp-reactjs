"use client"

import { useState, useEffect ,useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, Eye, Printer, Download, Search, TrendingUp, TrendingDown, ChevronDown, X, MoreVertical, DollarSign, Smartphone, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import SideBar from "../../Component/sidebar/SideBar"
import Header from "../../Component/header/Header"


const DateRangePicker = ({ label, defaultValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(defaultValue)

  const handleDateChange = (date) => {
    setSelectedDate(date)
    onChange?.(date)
    setIsOpen(false)
  }

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
          className="w-full flex items-center gap-2 bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-gray-200 transition-colors"
        >
          <Calendar size={16} className="text-primary flex-shrink-0" />
          <span className="flex-1 text-left">{selectedDate}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown size={14} className="text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50"
            >
              <div className="p-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const DateRangePickerMUI = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <motion.div className=" border rounded-[10px]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
          className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-gray-200 transition-colors"
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
                        : "text-foreground hover:bg-gray-200"
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

const FilterSection = ({ filters, setFilters }) => {
  const dateRangeOptions = ["Today", "This Week", "This Month", "Custom"]
  const firmOptions = ["All Firms", "Firm 1", "Firm 2", "Firm 3"]
  const userOptions = ["All Users", "User 1", "User 2", "User 3"]
  const paymentOptions = ["All", "Cash", "Online", "Card", "UPI"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 p-6 bg-card border border-border rounded-xl shadow-md overflow-x-auto"
    >
      <div className="space-y-5">
        {/* Quick Date Filters */}
        <div className="flex gap-3 pb-3 overflow-x-auto scrollbar-hide">
          {dateRangeOptions.map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilters({ ...filters, dateRange: option })}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                filters.dateRange === option
                  ? "bg-gradient-to-r from-blue-unpaid to-accent text-white shadow-lg"
                  : "bg-gray-200 text-foreground hover:bg-border"
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Date Range, Dropdowns & Search */}
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
            label="Firms"
            options={firmOptions}
            value={filters.firm}
            onChange={(firm) => setFilters({ ...filters, firm })}
          />
          <AnimatedDropdown
            label="Users"
            options={userOptions}
            value={filters.user}
            onChange={(user) => setFilters({ ...filters, user })}
          />
          <AnimatedDropdown
            label="Payment Type"
            options={paymentOptions}
            value={filters.payment}
            onChange={(payment) => setFilters({ ...filters, payment })}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
            Search
          </label>
          <div className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 py-2.5">
            <Search size={16} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search invoice, party, serial no…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>
      </div>
    </motion.div>
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
      className={`${lightBgColor} border border-border rounded-xl p-6 shadow-lg transition-all duration-300 cursor-default`}
    >
      <div className="flex items-start justify-between">
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
          style={{ backgroundColor: bgColor }}
        >
          <IconComponent size={28} className="text-white" />
        </motion.div>
      </div>
    </motion.div>
  )
}

const SalesTable = ({ onViewInvoice, currentPage, setCurrentPage, itemsPerPage }) => {
  const [selectedRow, setSelectedRow] = useState(null)

  const allTableData = [
    {
      id: 1,
      date: "2024-01-15",
      invoice: "BILL-1762927239037",
      party: "ABC Electronics",
      transaction: "Sale",
      payment: "Online",
      amount: "₹ 45,000",
      balance: "₹ 0",
    },
    {
      id: 2,
      date: "2024-01-14",
      invoice: "BILL-1762927239036",
      party: "XYZ Retail",
      transaction: "Sale",
      payment: "Cash",
      amount: "₹ 32,500",
      balance: "₹ 8,000",
    },
    {
      id: 3,
      date: "2024-01-13",
      invoice: "BILL-1762927239035",
      party: "Mobile Hub",
      transaction: "Sale",
      payment: "UPI",
      amount: "₹ 67,200",
      balance: "₹ 0",
    },
    {
      id: 4,
      date: "2024-01-12",
      invoice: "BILL-1762927239034",
      party: "Tech Store",
      transaction: "Sale",
      payment: "Card",
      amount: "₹ 28,900",
      balance: "₹ 28,900",
    },
    {
      id: 5,
      date: "2024-01-11",
      invoice: "BILL-1762927239033",
      party: "Digital World",
      transaction: "Sale",
      payment: "Online",
      amount: "₹ 55,300",
      balance: "₹ 0",
    },
    {
      id: 6,
      date: "2024-01-10",
      invoice: "BILL-1762927239032",
      party: "Premium Mobiles",
      transaction: "Sale",
      payment: "Card",
      amount: "₹ 38,500",
      balance: "₹ 15,000",
    },
    {
      id: 7,
      date: "2024-01-09",
      invoice: "BILL-1762927239031",
      party: "Smart Devices",
      transaction: "Sale",
      payment: "Online",
      amount: "₹ 52,000",
      balance: "₹ 0",
    },
    {
      id: 8,
      date: "2024-01-08",
      invoice: "BILL-1762927239030",
      party: "Tech Paradise",
      transaction: "Sale",
      payment: "UPI",
      amount: "₹ 41,300",
      balance: "₹ 10,000",
    },
    {
      id: 9,
      date: "2024-01-07",
      invoice: "BILL-1762927239029",
      party: "Mobile Zone",
      transaction: "Sale",
      payment: "Cash",
      amount: "₹ 29,700",
      balance: "₹ 0",
    },
    {
      id: 10,
      date: "2024-01-06",
      invoice: "BILL-1762927239028",
      party: "Gadget Hub",
      transaction: "Sale",
      payment: "Online",
      amount: "₹ 48,500",
      balance: "₹ 20,000",
    },
  ]

  const totalPages = Math.ceil(allTableData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const tableData = allTableData.slice(startIndex, endIndex)

  const getPaymentBadgeClass = (type) => {
    const badges = {
      Online: "bg-blue-light text-blue-unpaid",
      Cash: "bg-green-light text-green-paid",
      UPI: "bg-orange-light text-orange-total",
      Card: "bg-purple-100 text-purple-700",
    }
    return badges[type] || "bg-gray-200 text-foreground"
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
            <tr className="border-b border-border bg-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Invoice No.
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Party Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wide">
                Balance
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
                className="border-b border-border hover:bg-gray-200 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-foreground">{row.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.invoice}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.party}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-light text-blue-unpaid">
                    {row.transaction}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeClass(row.payment)}`}>
                    {row.payment}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.amount}</td>
                <td className="px-6 py-4 text-sm text-foreground">{row.balance}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onViewInvoice(row)}
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

      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-200">
        <span className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, allTableData.length)} of {allTableData.length} entries
        </span>
        <div className="flex gap-2 items-center">
          {/* Previous Button */}
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
            <ChevronLeft size={18} />
          </motion.button>

          {/* Page Numbers */}
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

          {/* Next Button */}
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
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const SellInvoiceDetails = ({ invoice, onClose }) => {
  if (!invoice) return null

  const itemsSold = [
    {
      icon: "📱",
      name: "IPHONE14PRO",
      model: "Space Black",
      qty: "1",
      serial: "6343848843848347834",
      rate: "₹40,000.00",
      total: "₹40,000.00",
    },
    {
      icon: "📱",
      name: "SAMSUNG S24",
      model: "White",
      qty: "2",
      serial: "SN001-SN002",
      rate: "₹35,000.00",
      total: "₹70,000.00",
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
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">{invoice.invoice}</h2>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-light text-blue-unpaid">
                Sale
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-light text-green-paid">
                {invoice.payment}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                Balance
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CalendarIcon size={16} />
                {invoice.date}
              </p>
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
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction & Party Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-200 border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" />
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoice No.</span>
                  <span className="font-semibold text-foreground">{invoice.invoice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold text-foreground">{invoice.payment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-green-paid text-base">{invoice.amount}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-bold text-destructive text-base">{invoice.balance}</span>
                </div>
              </div>
            </motion.div>

            {/* Party Details Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-200 border border-border rounded-xl p-6 space-y-4"
            >
              <h3 className="font-bold text-foreground">Party Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Party Name</p>
                  <p className="font-semibold text-foreground">{invoice.party}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Address</p>
                  <p className="font-semibold text-foreground">123 Main Street, New Delhi - 110001</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Contact</p>
                  <p className="font-semibold text-foreground">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-foreground">party@example.com</p>
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
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  {/* Top Row - Product Name & Qty */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-unpaid to-blue-500 flex items-center justify-center flex-shrink-0 text-lg">
                        📱
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.model}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex-shrink-0">
                      Qty: {item.qty}
                    </span>
                  </div>

                  {/* Serial/IMEI */}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">IMEI</p>
                    <div className="bg-input border border-border rounded-lg p-3">
                      <p className="font-mono text-xs text-foreground break-all">{item.serial}</p>
                    </div>
                  </div>

                  {/* Rate & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Rate</p>
                      <p className="font-semibold text-foreground">{item.rate}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-muted-foreground text-xs mb-1">Total</p>
                      <p className="font-bold text-green-paid text-base">{item.total}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <p className="text-right text-xs text-muted-foreground font-medium">
                {itemsSold.length} item(s)
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between p-4 bg-gray-200 border border-border rounded-xl"
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
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
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

export default function SalesReport() {
  const [filters, setFilters] = useState({
    dateRange: "This Month",
    firm: "All Firms",
    user: "All Users",
    payment: "All",
    fromDate: dayjs("2024-01-01").toDate(),
    toDate: dayjs("2024-12-31").toDate(),
  });

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 📅 Local States
  const [fromDate, setFromDate] = useState(filters.fromDate);
  const [toDate, setToDate] = useState(filters.toDate);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const fromCalendarRef = useRef(null);
  const toCalendarRef = useRef(null);

  const formatDate = (d) =>
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromCalendarRef.current && !fromCalendarRef.current.contains(e.target))
        setShowFromCalendar(false);
      if (toCalendarRef.current && !toCalendarRef.current.contains(e.target))
        setShowToCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
      <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
        <Header pageName="Sales Report" />
        <div className="flex gap-[10px] w-full h-full">
          <SideBar />
          <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
            <main className="w-full">
              <div className="w-full">
                {/* 🔹 Filter Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 p-6 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg overflow-x-auto"
                >
                  <div className="space-y-6">
                    {/* Quick Date Filters */}
                    <div className="flex gap-3 pb-3 overflow-x-auto scrollbar-hide">
                      {["Today", "This Week", "This Month", "Custom"].map(
                        (option) => (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setFilters({ ...filters, dateRange: option })
                            }
                            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                              filters.dateRange === option
                                ? "bg-gradient-to-r from-[#0044ff] to-[#ff70b0] text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {option}
                          </motion.button>
                        )
                      )}
                    </div>

                    {/* Date Filters + Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
         


                      <DateRangePickerMUI
                label="From Date"
                value={fromDate.from}
                onChange={(date) => setFromDate({ ...dateRange, from: date })}
              />


              <DateRangePickerMUI
                label="To Date"
                value={toDate.to}
                onChange={(date) => setToDate({ ...toDate, to: date })}
              />

                      <AnimatedDropdown
                        label="Firm"
                        options={["All Firms", "Firm 1", "Firm 2", "Firm 3"]}
                        value={filters.firm}
                        onChange={(firm) =>
                          setFilters({ ...filters, firm })
                        }
                      />
                      <AnimatedDropdown
                        label="User"
                        options={["All Users", "User 1", "User 2", "User 3"]}
                        value={filters.user}
                        onChange={(user) =>
                          setFilters({ ...filters, user })
                        }
                      />
                      <AnimatedDropdown
                        label="Payment Type"
                        options={["All", "Cash", "Online", "UPI", "Card"]}
                        value={filters.payment}
                        onChange={(payment) =>
                          setFilters({ ...filters, payment })
                        }
                      />
                    </div>

                    {/* Search Bar */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-2 block uppercase tracking-wider">
                        Search
                      </label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#0044ff] transition">
                        <Search
                          size={16}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Search invoice, party, or ID..."
                          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <KPICard
                    title="Paid"
                    amount="₹2,44,500"
                    icon={DollarSign}
                    bgColor="var(--green-paid)"
                    lightBgColor="var(--green-light)"
                    trend={12}
                  />
                  <KPICard
                    title="Unpaid"
                    amount="₹1,36,900"
                    icon={AlertCircle}
                    bgColor="var(--blue-unpaid)"
                    lightBgColor="var(--blue-light)"
                    trend={-5}
                  />
                  <KPICard
                    title="Total"
                    amount="₹3,81,400"
                    icon={DollarSign}
                    bgColor="var(--orange-total)"
                    lightBgColor="var(--orange-light)"
                    trend={8}
                  />
                </div>

                {/* Sales Table */}
                <SalesTable
                  onViewInvoice={setSelectedInvoice}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                />

                {/* Invoice Modal */}
                <AnimatePresence>
                  {selectedInvoice && (
                    <SellInvoiceDetails
                      invoice={selectedInvoice}
                      onClose={() => setSelectedInvoice(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}