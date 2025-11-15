"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, ChevronDown } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const AnimatedDropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
       
            <motion.div className="relative">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-gray-200  transition-colors"
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
                            className="absolute top-full left-0 right-0 mt-2 bg-white  border border-border rounded-lg shadow-xl z-50 overflow-hidden"
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
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${value === option
                                            ? "bg-primary text-primary-foreground font-medium"
                                            : "text-foreground hover:bg-gray-200 "
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

const DatePickerMUI = ({ label, value, onChange }) => {
    return (
        <div>
         
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

export default function FilterBar({ selectedDate, setSelectedDate, }) {
    const [filters, setFilters] = useState({
        dateRange: "This Month",
        firm: "All Firms",
        user: "All Users",
        payment: "All",
        fromDate: dayjs("2024-01-01").toDate(),
        toDate: dayjs("2024-12-31").toDate(),
    });
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-4 bg-white  border border-border rounded-xl shadow-md"
        >
            <div className="space-y-4">
                {/* Quick Date Filters */}
                {/* <div className="flex gap-3 pb-3 overflow-x-auto scrollbar-hide">
          {["Today", "This Week", "This Month", "Custom"].map((option) => (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (option === "Today") setSelectedDate(dayjs())
                else if (option === "This Week") setSelectedDate(dayjs().startOf("week"))
                else if (option === "This Month") setSelectedDate(dayjs().startOf("month"))
              }}
              className="px-4 py-2.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap bg-gradient-to-r from-blue-unpaid to-green-paid text-white shadow-lg hover:opacity-90"
            >
              {option}
            </motion.button>
          ))}
        </div> */}


                <div className=" flex  gap-[15px]">


                    <div className="flex gap-3  ">
                        {["Today", "This Week", "This Month"].map(
                            (option) => (
                                <motion.button
                                    key={option}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setFilters({ ...filters, dateRange: option })
                                    }
                                    className={`px-4 py-2 rounded-lg shadow-md font-medium text-sm transition-all duration-200 whitespace-nowrap ${filters.dateRange === option
                                        ? "bg-gradient-to-r from-[#0044ff] to-[#ff70b0] text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {option}
                                </motion.button>
                            )
                        )}
                    </div>

                    {/* Filters Grid */}
                    <div className=" w-[100%] flex gap-4">
                        <DatePickerMUI
                            label="Select Date"
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                        <AnimatedDropdown
                            label="Company"
                            options={["All Companies", "ABC Mobile Store", "XYZ Electronics", "Tech Hub"]}
                            value={filters.company}
                            onChange={(company) => setFilters({ ...filters, company })}
                        />
                        <AnimatedDropdown
                            label="Transaction Type"
                            options={["All Types", "Purchase", "Sale", "Transfer"]}
                            value={filters.transactionType}
                            onChange={(type) => setFilters({ ...filters, transactionType: type })}
                        />
                                   <div className="flex items-center w-[400px] gap-2 bg-input border border-border rounded-lg px-4 py-2.5">
                            <Search size={16} className="text-muted-foreground flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search invoice, serial no, party name…"
                                className=" bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    )
}
