"use client";

import { Autocomplete, TextField } from "@mui/material";
import { motion } from "framer-motion";

export default function FilterSection({
  filters,
  setFilters,
  itemList = [],
  categoryList = [],
}) {
  // ⭐ Always ensure "All Items" is permanently first
  const dynamicItems = [...new Set(itemList)];

  const dynamicCategories = ["All Categories", ...new Set(categoryList)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ⭐ Correct Dynamic Item Dropdown */}
        <Autocomplete
          options={dynamicItems}
          value={filters.selectedItem || "All Items"}
          onChange={(e, value) => {
            setFilters({
              ...filters,
              selectedItem: value || "All Items",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Item" size="small" />
          )}
          sx={{
            "& .MuiInputBase-root": { fontSize: "14px" },
          }}
        />

        {/* ⭐ Correct Dynamic Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          {dynamicCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* From Date */}
        <input
          type="date"
          value={filters.fromDate || ""}
          onChange={(e) =>
            setFilters({ ...filters, fromDate: e.target.value })
          }
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />

        {/* To Date */}
        <input
          type="date"
          value={filters.toDate || ""}
          onChange={(e) =>
            setFilters({ ...filters, toDate: e.target.value })
          }
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
      </div>

      {/* Search Bar */}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Search item, IMEI, model…"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
        />
      </div>
    </motion.div>
  );
}
