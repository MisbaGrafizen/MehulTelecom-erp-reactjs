"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// MUI DATE PICKER
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function FilterSection({ filters, setFilters }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const stockOptions = ["All Stock", "Mobiles", "Watches", "Accessories"];
  const ageOptions = [
    "10 Days",
    "20 Days",
    "30 Days",
    "1 Month",
    "2 Month",
    "3 Month",
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownSelect = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setOpenDropdown(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        ref={dropdownRef}
      >
        {/* STOCK TYPE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("stock")}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg hover:border-slate-300 bg-white transition-all"
          >
            <span className="text-sm text-slate-700">{filters.stockType}</span>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform ${
                openDropdown === "stock" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "stock" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                {stockOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleDropdownSelect("stockType", option)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-100 last:border-b-0"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AGE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("age")}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg hover:border-slate-300 bg-white transition-all"
          >
            <span className="text-sm text-slate-700">{filters.ageFilter}</span>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform ${
                openDropdown === "age" ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openDropdown === "age" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                {ageOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleDropdownSelect("ageFilter", option)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-100 last:border-b-0"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FROM DATE – MUI */}
        <div className="border rounded-[10px] ">
          <DatePicker
            value={filters.fromDate ? dayjs(filters.fromDate) : null}
            onChange={(value) =>
              setFilters({
                ...filters,
                fromDate: value ? value.format("YYYY-MM-DD") : "",
              })
            }
            slotProps={{
              textField: {
                size: "small",
                className:
                  "w-full bg-white border border-slate-200 rounded-lg text-sm hover:border-slate-300 focus:ring-0 focus:outline-none",
              },
            }}
          />
        </div>

        {/* TO DATE – MUI */}
        <div className=" border rounded-[10px]">
          <DatePicker
            value={filters.toDate ? dayjs(filters.toDate) : null}
            onChange={(value) =>
              setFilters({
                ...filters,
                toDate: value ? value.format("YYYY-MM-DD") : "",
              })
            }
            slotProps={{
              textField: {
                size: "small",
                className:
                  "w-full bg-white border border-slate-200 rounded-lg text-sm hover:border-slate-300 focus:ring-0 focus:outline-none",
              },
            }}
          />
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search product, IMEI…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg hover:border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
