'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    Search,
    Layers,
    Box,
    Factory,
    Users
} from 'lucide-react';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ModernFilterBar({ onFilterChange, filters, options }) {

    const [openDropdown, setOpenDropdown] = useState(null);

    // 🔥 DATA FROM BACKEND (passed as props)
    const categories = ["all", ...(options?.categories || [])];
    const branches = ["all", ...(options?.branches || []).map(b => ({ label: b.name, value: b._id }))];
    const companies = ["all", ...(options?.companies || [])];
    const products = ["all", ...(options?.products || [])];

    const stockStatuses = ["all", "Good", "Low", "Out"];

    const toggleDropdown = (key) => {
        setOpenDropdown(openDropdown === key ? null : key);
    };

    const handleSelect = (key, value) => {
        onFilterChange({
            ...filters,
            [key]: value
        });
        setOpenDropdown(null);
    };

    const handleSearch = (e) => {
        onFilterChange({ ...filters, search: e.target.value });
    };

    const clearFilters = () => {
        onFilterChange({
            fromDate: null,
            toDate: null,
            category: "all",
            stockStatus: "all",
            branch: "all",
            company: "all",
            search: ""
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-3"
            >
                <div className="flex items-center gap-3 flex-wrap">

                    {/* DATE FILTER */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-[3px] rounded-lg border border-slate-200">
                        <DatePicker
                            value={filters.fromDate ? dayjs(filters.fromDate) : null}
                            onChange={(v) =>
                                onFilterChange({ ...filters, fromDate: v ? v.toISOString() : null })
                            }
                            slotProps={{
                                textField: {
                                    variant: "standard",
                                    InputProps: { disableUnderline: true },
                                    sx: { minWidth: 110, '& input': { fontSize: "12px" } },
                                }
                            }}
                        />

                        <span className="text-slate-400 mx-[60px] text-xs">–</span>

                        <DatePicker
                            value={filters.toDate ? dayjs(filters.toDate) : null}
                            onChange={(v) =>
                                onFilterChange({ ...filters, toDate: v ? v.toISOString() : null })
                            }
                            slotProps={{
                                textField: {
                                    variant: "standard",
                                    InputProps: { disableUnderline: true },
                                    sx: { minWidth: 110, '& input': { fontSize: "12px" } },
                                }
                            }}
                        />
                    </div>

                    {/* SEARCH */}
                    <div className="relative">
                        <Search className="absolute left-3 top-[9px] w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearch}
                            placeholder="Search..."
                            className="pl-10 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none"
                        />
                    </div>

                    {/* CATEGORY */}
                    <FilterDropdown
                        icon={<Box className="w-4 h-4 text-slate-600" />}
                        label={filters.category === "all" ? "Category" : filters.category}
                        open={openDropdown === "category"}
                        onToggle={() => toggleDropdown("category")}
                        items={categories}
                        onSelect={(v) => handleSelect("category", v)}
                    />

                    {/* STOCK STATUS */}
                    <FilterDropdown
                        icon={<Layers className="w-4 h-4 text-slate-600" />}
                        label={filters.stockStatus === "all" ? "Stock" : filters.stockStatus}
                        open={openDropdown === "stockStatus"}
                        onToggle={() => toggleDropdown("stockStatus")}
                        items={stockStatuses}
                        onSelect={(v) => handleSelect("stockStatus", v)}
                    />

                    {/* BRANCH */}
                    <FilterDropdown
    icon={<Users className="w-4 h-4 text-slate-600" />}
    label={
        filters.branch === "all"
            ? "Branch"
            : (branches.find(b => b.value === filters.branch)?.label || "Branch")
    }
    open={openDropdown === "branch"}
    onToggle={() => toggleDropdown("branch")}
    items={branches}
    onSelect={(v) => handleSelect("branch", v)}
/>


                    {/* COMPANY */}
                    <FilterDropdown
                        icon={<Factory className="w-4 h-4 text-slate-600" />}
                        label={filters.company === "all" ? "Company" : filters.company}
                        open={openDropdown === "company"}
                        onToggle={() => toggleDropdown("company")}
                        items={companies}
                        onSelect={(v) => handleSelect("company", v)}
                    />

                    {/* CLEAR ALL */}
                    {/* <button
                        onClick={clearFilters}
                        className="text-xs ml-2 text-red-500 underline font-medium"
                    >
                        Clear All
                    </button> */}

                </div>
            </motion.div>
        </LocalizationProvider>
    );
}


/* ---------------------------------------------------------
   DROPDOWN COMPONENT
--------------------------------------------------------- */
function FilterDropdown({ icon, label, open, onToggle, items, onSelect }) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-slate-100"
            >
                {icon}
                <span className="capitalize">{label}</span>
                <ChevronDown className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-2 left-0 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
                    >
                        {items.map((i) => {
                            const value = typeof i === "object" ? i.value : i;
                            const label = typeof i === "object" ? i.label : i;

                            return (
                                <button
                                    key={value}
                                    onClick={() => onSelect(value)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
