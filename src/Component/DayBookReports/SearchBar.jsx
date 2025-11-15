"use client"

import { motion } from "framer-motion"
import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = "Search...", onSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-input border border-border rounded-lg px-4 py-2.5 w-full"
    >
      <Search size={16} className="text-muted-foreground flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-muted-foreground"
      />
    </motion.div>
  )
}
