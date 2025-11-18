import React from 'react'

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, Eye, Printer, Download, Search, TrendingUp, TrendingDown, ChevronDown, X } from "lucide-react"
import SideBar from '../../Component/sidebar/SideBar'
import Header from '../../Component/header/Header'
import { Calendar as ModernCalendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { ApiGet } from '../../helper/axios'





// Custom Date Picker Component
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
            <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
            <motion.div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-2 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground hover:bg-gray-200 transition-colors"
                >
                    <Calendar size={16} className="text-primary" />
                    <span>{selectedDate}</span>
                    <ChevronDown size={14} className="ml-auto text-muted-foreground" />
                </button>

                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 right-0 mt-2 bg-white  border border-border rounded-lg shadow-lg z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                        }`}
                >
                    <div className="p-4 space-y-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

// Custom Dropdown with Framer Motion
const AnimatedDropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>
            <motion.div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground hover:bg-gray-200 transition-colors"
                >
                    <span>{value}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-muted-foreground" />
                    </motion.div>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 right-0 mt-2 bg-white  border border-border rounded-lg shadow-lg z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                        }`}
                >
                    <div className="py-2 space-y-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option)
                                    setIsOpen(false)
                                }}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors ${value === option ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-gray-200"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

const FilterSection = ({ filters, setFilters, getRangeFromQuickFilter }) => {
    const [firms, setFirms] = useState([]);

    useEffect(() => {
    const fetchFirms = async () => {
        try {
            const res = await ApiGet("/admin/info");
            setFirms(res.data || []);
        } catch (err) {
            console.log("Firm Fetch Error:", err);
        }
    };

    fetchFirms();
}, []);

    const dateRangeOptions = ["Today", "This Week", "This Month"];
const firmOptions = [{ label: "All Firms", value: "all" }, ...firms.map(f => ({
    label: f.name,
    value: f._id
}))];
    const userOptions = ["All Users", "User 1", "User 2", "User 3"];

    const [isFirmOpen, setIsFirmOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [fromDate, setFromDate] = useState({
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});

const [toDate, setToDate] = useState({
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
});


    // const today = new Date();
    // const [fromDate, setFromDate] = useState({
    //     day: today.getDate(),
    //     month: today.getMonth() + 1,
    //     year: today.getFullYear(),
    // });
    // const [toDate, setToDate] = useState({
    //     day: today.getDate(),
    //     month: today.getMonth() + 1,
    //     year: today.getFullYear(),
    // });


    const formatDate = (d) => `${d.day}/${d.month}/${d.year}`;

    // 🔒 Refs for click-outside detection
    const firmRef = useRef(null);
    const userRef = useRef(null);
    const fromCalendarRef = useRef(null);
    const toCalendarRef = useRef(null);

    // 🧠 Close all dropdowns/calendars on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (firmRef.current && !firmRef.current.contains(event.target))
                setIsFirmOpen(false);
            if (userRef.current && !userRef.current.contains(event.target))
                setIsUserOpen(false);
            if (fromCalendarRef.current && !fromCalendarRef.current.contains(event.target))
                setShowFromCalendar(false);
            if (toCalendarRef.current && !toCalendarRef.current.contains(event.target))
                setShowToCalendar(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document?.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full mb-6 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg px-4 py-3 flex flex-wrap gap-3 items-center justify-start transition-all duration-300">

            {/* 🔹 Date Range Quick Buttons */}
            {dateRangeOptions.map((option) => (
                <motion.button
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const range = getRangeFromQuickFilter(option);  // ← NEW
                        setFilters((prev) => ({
                            ...prev,
                            dateRange: option,
                            fromDate: range.from,
                            toDate: range.to,
                        }));
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${filters.dateRange === option
                        ? "bg-gradient-to-r from-[#0044ff] to-[#ff70b0] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {option}
                </motion.button>
            ))}

            {/* 🔹 From Date Picker */}
            <div className="relative" ref={fromCalendarRef}>
                <button
                    onClick={() => {
                        setShowFromCalendar(!showFromCalendar);
                        setShowToCalendar(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 text-gray-700"
                >
                    <Calendar size={16} className="text-[#0044ff]" />
                    From: {filters.fromDate ? new Date(filters.fromDate).toLocaleDateString() : "Select"}
                </button>

                {showFromCalendar && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                    >
                      <ModernCalendar
  value={fromDate}
  onChange={(date) => {
    setFromDate(date);
    const jsDate = new Date(date.year, date.month - 1, date.day);
    setFilters(prev => ({ ...prev, fromDate: jsDate }));
  }}
  shouldHighlightWeekends
/>

                    </motion.div>
                )}
            </div>

            {/* 🔹 To Date Picker */}
            <div className="relative" ref={toCalendarRef}>
                <button
                    onClick={() => {
                        setShowToCalendar(!showToCalendar);
                        setShowFromCalendar(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 text-gray-700"
                >
                    <Calendar size={16} className="text-[#ff2688]" />
                    To: {filters.toDate ? new Date(filters.toDate).toLocaleDateString() : "Select"}
                </button>

                {showToCalendar && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                    >
                    <ModernCalendar
  value={toDate}
  onChange={(date) => {
    setToDate(date);
    const jsDate = new Date(date.year, date.month - 1, date.day);
    setFilters(prev => ({ ...prev, toDate: jsDate }));
  }}
  shouldHighlightWeekends
/>

                    </motion.div>
                )}
            </div>

            {/* 🔹 Firm Dropdown */}
           <div className="relative" ref={firmRef}>
    <button
        onClick={() => setIsFirmOpen(!isFirmOpen)}
        className="flex justify-between items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 min-w-[140px]"
    >
        {firmOptions.find(f => f.value === filters.firm)?.label || "All Firms"}
        <ChevronDown
            size={16}
            className={`transition-transform ${isFirmOpen ? "rotate-180" : "rotate-0"}`}
        />
    </button>

    {isFirmOpen && (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-md w-full mt-1"
        >
            {firmOptions.map((firm) => (
                <button
                    key={firm.value}
                    onClick={() => {
                        setFilters((prev) => ({ ...prev, firm: firm.value }));
                        setIsFirmOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                        filters.firm === firm.value
                            ? "bg-gradient-to-r from-[#0044ff] to-[#ff70b0] text-white"
                            : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                    {firm.label}
                </button>
            ))}
        </motion.div>
    )}
</div>


            {/* 🔹 User Dropdown */}
            <div className="relative" ref={userRef}>
                <button
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    className="flex justify-between items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 min-w-[140px]"
                >
                    {filters.user}
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${isUserOpen ? "rotate-180" : "rotate-0"
                            }`}
                    />
                </button>

                {isUserOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-md w-full mt-1"
                    >
                        {userOptions.map((user) => (
                            <button
                                key={user}
                                onClick={() => {
                                    setFilters((prev) => ({ ...prev, user }));
                                    setIsUserOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${filters.user === user
                                    ? "bg-gradient-to-r from-[#0044ff] to-[#ff70b0] text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {user}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* 🔹 Modern Search Bar */}
            <div className="relative w-[300px] ml-auto">
                <input
                    type="text"
                    placeholder="Search invoice, party, or ID..."
                    className="pl-12 py-2 border w-full border-gray-300 rounded-[10px] text-sm text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-[#0044ff]"
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 rounded-full"
                >
                    <Search size={16} />
                </motion.button>
            </div>
        </div>
    );
};


// KPI Card Component
const KPICard = ({ title, amount, icon: IconComponent, bgColor, lightBgColor, trend }) => {
    const [displayAmount, setDisplayAmount] = useState(0)

    useEffect(() => {
        const target = Number.parseFloat(amount.replace(/[^0-9.]/g, ""))
        const increment = target / 50
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
            whileHover={{ y: -5 }}
            className={`${lightBgColor} border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold animate-count-up" style={{ color: bgColor }}>
                            ₹ {displayAmount.toLocaleString("en-IN")}
                        </h3>
                        {trend && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`text-xs font-bold flex items-center gap-1 ${trend > 0 ? "text-green-paid" : "text-destructive"
                                    }`}
                            >
                                {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(trend)}%
                            </motion.span>
                        )}
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: bgColor }}
                >
                    <IconComponent size={24} className="text-white" />
                </motion.div>
            </div>
        </motion.div>
    )
}

// Purchase Table Component
const PurchaseTable = ({ onViewInvoice, rows }) => {
    const [selectedRow, setSelectedRow] = useState(null)

    const tableData = rows.map((r) => ({
        id: r._id,
        date: new Date(r.billDate).toISOString().split("T")[0],
        invoice: r.billNumber,
        party: r.partyId?.name || r.partyId?.partyName,
        paymentType: r.paymentType,
        amount: `₹ ${r.totalAmount}`,
        balance: `₹ ${r.unpaidAmount}`,
        fullRow: r,
    }));


    const getPaymentColor = (type) => {
        const colors = {
            Online: "bg-blue-light text-blue-unpaid",
            Cash: "bg-green-light text-green-paid",
            UPI: "bg-orange-light text-orange-total",
            Transfer: "bg-muted text-muted-foreground",
        }
        return colors[type] || "bg-gray-200"
    }

    return (
        <div className="bg-white  border border-border rounded-xl shadow-md overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice No.</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Party Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Balance</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, idx) => (
                            <motion.tr
                                key={idx}
                                onMouseEnter={() => setSelectedRow(idx)}
                                onMouseLeave={() => setSelectedRow(null)}
                                animate={selectedRow === idx ? { backgroundColor: "var(--color-secondary)" } : {}}
                                className={`border-b border-border transition-all duration-200 ${selectedRow === idx ? "shadow-md" : "hover:bg-gray-200"
                                    }`}
                            >
                                <td className="px-6 py-4 text-sm text-foreground">{row.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-foreground">{row.invoice}</td>
                                <td className="px-6 py-4 text-sm text-foreground">{row.party}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(
                                            row.paymentType,
                                        )}`}
                                    >
                                        {row.paymentType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.amount}</td>
                                <td className="px-6 py-4 text-sm text-foreground">{row.balance}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onViewInvoice(row.fullRow)}
                                            className="p-2 hover:bg-border rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye size={16} className="text-muted-foreground" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 hover:bg-border rounded-lg transition-colors"
                                            title="Print"
                                        >
                                            <Printer size={16} className="text-muted-foreground" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-2 hover:bg-border rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download size={16} className="text-muted-foreground" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-200">
                <span className="text-sm text-muted-foreground">Showing 1 to 5 of 50 entries</span>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-border transition-colors"
                    >
                        Previous
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
                    >
                        1
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-border transition-colors"
                    >
                        2
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-border transition-colors"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

// Invoice Details Modal Component
const InvoiceDetails = ({ invoice, onClose }) => {
    if (!invoice) return null

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
                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white ">
                    <h2 className="text-2xl font-bold text-foreground">Invoice Details</h2>
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
                    {/* Two Column Layout */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Transaction Details */}
                        <div className="bg-gray-200 border border-border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-foreground mb-4">Transaction Details</h3>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Invoice No.</span>
                                <span className="font-medium text-foreground">{invoice.invoice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Invoice Date</span>
                                <span className="font-medium text-foreground">{invoice.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium text-foreground">{invoice.paymentType}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-bold text-green-paid">{invoice.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Balance</span>
                                <span className="font-bold text-destructive">{invoice.balance}</span>
                            </div>
                        </div>

                        {/* Party Details */}
                        <div className="bg-gray-200 border border-border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-foreground mb-4">Party Details</h3>
                            <div>
                                <span className="text-muted-foreground text-sm">Party Name</span>
                                <p className="font-medium text-foreground">{invoice.party}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-sm">Address</span>
                                <p className="font-medium text-foreground">123 Main Street, New Delhi - 110001</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-sm">Contact</span>
                                <p className="font-medium text-foreground">+91 98765 43210</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground text-sm">Email</span>
                                <p className="font-medium text-foreground">party@example.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Purchased */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Items Purchased</h3>
                        <div className="space-y-3">
                            {/* {[
                                {
                                    name: "iPhone 15 Pro",
                                    color: "Space Black",
                                    spec: "256GB",
                                    condition: "New",
                                    serial: "SN001",
                                    unit: "1",
                                    price: "₹ 79,999",
                                    total: "₹ 79,999",
                                },
                                {
                                    name: "Samsung Galaxy S24",
                                    color: "White",
                                    spec: "128GB",
                                    condition: "New",
                                    serial: "SN002",
                                    unit: "2",
                                    price: "₹ 45,999",
                                    total: "₹ 91,998",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-gray-200 border border-border rounded-lg">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-unpaid to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Product Name</p>
                                            <p className="font-medium text-foreground">{item.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Color</p>
                                            <p className="font-medium text-foreground">{item.color}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Specification</p>
                                            <p className="font-medium text-foreground">{item.spec}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Price/Unit</p>
                                            <p className="font-medium text-foreground">{item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))} */}
                            {invoice.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-gray-200 border border-border rounded-lg">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-unpaid to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Product Name</p>
                                            <p className="font-medium">{item.itemName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Color</p>
                                            <p className="font-medium">{item.color}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Specification</p>
                                            <p className="font-medium">{item.specification}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Price/Unit</p>
                                            <p className="font-medium">₹ {item.pricePerUnit}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between p-4 bg-gray-200 border border-border rounded-lg">
                        <span className="text-sm text-muted-foreground">Generated: 2024-01-15 at 10:30 AM</span>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                <Printer size={16} />
                                Print
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors font-medium"
                            >
                                <Download size={16} />
                                Download
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function PurchaseReport() {
    const [filters, setFilters] = useState({
        dateRange: "This Month",
        firm: "All Firms",
        user: "All Users",
        payment: "All",
        fromDate: null,
        toDate: null,
    });
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [kpi, setKpi] = useState({
        paid: 0,
        unpaid: 0,
        total: 0,
    });

    const getRangeFromQuickFilter = (range) => {
        const now = new Date();

        if (range === "Today") {
            const from = new Date(now.setHours(0, 0, 0, 0));
            const to = new Date();
            return { from, to };
        }

        if (range === "This Week") {
            const first = new Date(now);
            first.setDate(now.getDate() - now.getDay()); // Monday
            first.setHours(0, 0, 0, 0);

            const last = new Date(first);
            last.setDate(first.getDate() + 6); // Sunday
            last.setHours(23, 59, 59, 999);

            return { from: first, to: last };
        }

        if (range === "This Month") {
            const first = new Date(now.getFullYear(), now.getMonth(), 1);
            const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            return { from: first, to: last };
        }

        return { from: null, to: null };
    };



    useEffect(() => {
const fetchPurchases = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      fromDate: filters.fromDate ? filters.fromDate.toISOString() : "",
      toDate: filters.toDate ? filters.toDate.toISOString() : "",
      partyId: filters.partyId || "",
      userId: filters.userId || "",
      paymentType: filters.payment || "",
      search: filters.search || ""
    });

    const res = await ApiGet(`/admin/purchase-report?${params.toString()}`);

    setRows(res.data || []);

    setKpi({
      paid: res.kpi?.paidTotal || 0,
      unpaid: res.kpi?.unpaidTotal || 0,
      total: res.kpi?.grandTotal || 0,
    });

  } catch (err) {
    console.error("❌ Purchase Fetch Error:", err);
  } finally {
    setLoading(false);
  }
};



    // 👇 converting dates to timestamps ensures re-render
    const fromTs = filters.fromDate ? new Date(filters.fromDate).getTime() : null;
    const toTs = filters.toDate ? new Date(filters.toDate).getTime() : null;

    fetchPurchases();
}, [
    filters.dateRange,
    filters.fromDate ? new Date(filters.fromDate).getTime() : null,
    filters.toDate ? new Date(filters.toDate).getTime() : null,
]);



    return (

        <>


            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] !pr-0 overflow-hidden">
                <div className="flex w-[100%] flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Purchase Report" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
                            <main className="w-[100%]">
                                <div className="w-[100%]">


                                    {/* Filter Section */}
                                    <FilterSection
                                        filters={filters}
                                        setFilters={setFilters}
                                        getRangeFromQuickFilter={getRangeFromQuickFilter}
                                    />


                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <KPICard
                                            title="Paid"
                                            amount={`₹ ${kpi.paid}`}
                                            icon={Download}
                                            bgColor="var(--green-paid)"
                                            lightBgColor="var(--green-light)"
                                        />

                                        <KPICard
                                            title="Unpaid"
                                            amount={`₹ ${kpi.unpaid}`}
                                            icon={TrendingUp}
                                            bgColor="var(--blue-unpaid)"
                                            lightBgColor="var(--blue-light)"
                                        />

                                        <KPICard
                                            title="Total"
                                            amount={`₹ ${kpi.total}`}
                                            icon={Download}
                                            bgColor="var(--orange-total)"
                                            lightBgColor="var(--orange-light)"
                                        />
                                    </div>

                                    {/* Purchase Table */}
                                    <PurchaseTable onViewInvoice={setSelectedInvoice} rows={rows} />

                                    {/* Invoice Details Modal */}
                                    {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
                                </div>
                            </main>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
