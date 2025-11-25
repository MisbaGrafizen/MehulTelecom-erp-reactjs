"use client"
import { Autocomplete, TextField } from "@mui/material"
import { motion } from "framer-motion"

export default function FilterSection({ filters, setFilters }) {
  const items = ["All Items", "iPhone 15 Pro", "Samsung Galaxy S24", "Apple Watch Series 9", "Airpods Pro 2"]
  const categories = ["All Categories", "Mobile", "Watch", "Accessories"]

  const handleItemChange = (value) => {
    setFilters({ ...filters, selectedItem: value })
  }

  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value })
  }

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Item Autocomplete */}
        <Autocomplete
          options={items}
          defaultValue="All Items"
          renderInput={(params) => <TextField {...params} label="Item" variant="outlined" size="small" />}
          onChange={(e, value) => handleItemChange(value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
            },
          }}
        />

        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* From Date */}
        <input
          type="date"
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />

        {/* To Date */}
        <input
          type="date"
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
      </div>

      {/* Search Bar */}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Search IMEI, model, product name…"
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute right-3 top-2.5 w-5 h-5 text-slate-400"
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
    </motion.div>
  )
}
