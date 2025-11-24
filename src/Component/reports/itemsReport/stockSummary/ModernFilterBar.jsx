"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function ModernFilterBar({ onFilterChange, filters }) {
  const [openDropdown, setOpenDropdown] = useState(null)

  const categories = ["All Items", "Mobile", "Watch", "Accessories"]

  const handleDropdownClick = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleSelect = (key, value) => {
    onFilterChange({ ...filters, [key]: value.toLowerCase().replace(/\s+/g, "_") })
    setOpenDropdown(null)
  }

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleDateChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div>

          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search item, model, IMEI…"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
            {/* SVG Search Icon */}
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          
          <div className="relative">
            <motion.button
              onClick={() => handleDropdownClick("category")}
              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="capitalize">
                {filters.category === "all_items" ? "All Items" : filters.category.replace(/_/g, " ")}
              </span>
              <motion.div animate={{ rotate: openDropdown === "category" ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {openDropdown === "category" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-50 overflow-hidden"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleSelect("category", cat)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 text-slate-900 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* From Date */}
        <div>

          <input
            type="date"
            value={filters.fromDate || ""}
            onChange={(e) => handleDateChange("fromDate", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
          />
        </div>

        {/* To Date */}
        <div>
   
          <input
            type="date"
            value={filters.toDate || ""}
            onChange={(e) => handleDateChange("toDate", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
          />
        </div>
      </div>
    </motion.div>
  )
}
