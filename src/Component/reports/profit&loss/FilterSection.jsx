'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

export default function FilterSection({ filters, setFilters, branches }) {
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleDateChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value ? value.format('YYYY-MM-DD') : '',
    }))
  }

  const handleBranchChange = (value) => {
    setFilters(prev => ({ ...prev, branch: value }))
    setOpenDropdown(null)
  }

  // ✅ Custom DatePicker wrapper with your styling
  const DatePickerMUI = ({ label, value, onChange }) => (
    <div>
      <label className="block text-xs uppercase text-slate-600 font-semibold mb-2 tracking-wide">
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={onChange}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
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
                    '& fieldset': { border: 'none' },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '0.625rem 0.75rem',
                  },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
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
                    '&:hover': { backgroundColor: 'var(--secondary)' },
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

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* From Date */}
        <DatePickerMUI
          label="From Date"
          value={filters.fromDate}
          onChange={(newValue) => handleDateChange('fromDate', newValue)}
        />

        {/* To Date */}
        <DatePickerMUI
          label="To Date"
          value={filters.toDate}
          onChange={(newValue) => handleDateChange('toDate', newValue)}
        />

        {/* Branch Dropdown */}
        <div>
          <label className="block text-xs uppercase text-slate-600 font-semibold mb-2 tracking-wide">
            Branch
          </label>
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === 'branch' ? null : 'branch')
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-left text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm">
                {filters.branch === 'all' ? 'All Branches' : filters.branch}
              </span>
              <motion.div animate={{ rotate: openDropdown === 'branch' ? 180 : 0 }}>
                <ChevronDown size={16} className="text-slate-500" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openDropdown === 'branch' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10"
                >
                  {[{ _id: "all", name: "All Branches" }, ...branches]?.map((b) => (
  <button
    key={b._id}
    onClick={() => handleBranchChange(b._id)}
    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-b-0"
  >
    {b._id === "all" ? "All Branches" : b.name}
  </button>
))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs uppercase text-slate-600 font-semibold mb-2 tracking-wide">
            Search
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search invoice..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
