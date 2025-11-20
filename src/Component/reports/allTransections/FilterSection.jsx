'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

export default function FilterSection({ filters, onFilterChange }) {
  const [openDropdown, setOpenDropdown] = useState(null)

  const transactionTypes = ['All Types', 'Sale', 'Purchase', 'Transfer']
  const parties = ['All Parties', 'Apple Store', 'Samsung', 'Vivo', 'OnePlus', 'Xiaomi']

  const handleTypeSelect = (type) => {
    onFilterChange({ ...filters, type })
    setOpenDropdown(null)
  }

  const handlePartySelect = (party) => {
    onFilterChange({ ...filters, party })
    setOpenDropdown(null)
  }

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const DatePickerMUI = ({ label, value, onChange }) => (
    <div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={(newValue) =>
              onChange(newValue ? newValue.format('YYYY-MM-DD') : '')
            }
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
                    '&:hover': { backgroundColor: 'var(--secondary)' },
                    '& fieldset': { border: 'none' },
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* From Date */}
        <DatePickerMUI
          label="From Date"
          value={filters.fromDate}
          onChange={(val) => onFilterChange({ ...filters, fromDate: val })}
        />

        {/* To Date */}
        <DatePickerMUI
          label="To Date"
          value={filters.toDate}
          onChange={(val) => onFilterChange({ ...filters, toDate: val })}
        />

        {/* Transaction Type Dropdown */}
        <div>
     
          <div className="relative">
            <motion.button
              onClick={() =>
                setOpenDropdown(openDropdown === 'type' ? null : 'type')
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-left text-sm flex items-center justify-between hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-slate-900">{filters.type}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition ${
                  openDropdown === 'type' ? 'rotate-180' : ''
                }`}
              />
            </motion.button>
            {openDropdown === 'type' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10"
              >
                {transactionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition"
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Party Dropdown */}
        <div>

          <div className="relative">
            <motion.button
              onClick={() =>
                setOpenDropdown(openDropdown === 'party' ? null : 'party')
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-left text-sm flex items-center justify-between hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-slate-900">{filters.party}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition ${
                  openDropdown === 'party' ? 'rotate-180' : ''
                }`}
              />
            </motion.button>
            {openDropdown === 'party' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
              >
                {parties.map((party) => (
                  <button
                    key={party}
                    onClick={() => handlePartySelect(party)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm transition"
                  >
                    {party}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search invoice, party…"
              className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={filters.search}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
