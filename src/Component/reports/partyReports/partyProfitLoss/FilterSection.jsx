"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function FilterSection({
  selectedParty,
  setSelectedParty,
  dateRange,
  setDateRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  partyOptions,
}) {
  const [openParty, setOpenParty] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [queryParty, setQueryParty] = useState("");
  const [queryDate, setQueryDate] = useState("");

  const partyRef = useRef(null);
  const dateRef = useRef(null);

  const dateOptions = ["Today", "This Week", "This Month", "Last Month", "Custom"];

  /* ------------------------------------------------------------------
       APPLY DATE RANGE LOGIC
  ------------------------------------------------------------------ */
  const applyDateRange = (range) => {
    setDateRange(range);

    const today = dayjs();

    if (range === "Today") {
      setFromDate(today.startOf("day"));
      setToDate(today.endOf("day"));
    }

    if (range === "This Week") {
      setFromDate(today.startOf("week"));
      setToDate(today.endOf("week"));
    }

    if (range === "This Month") {
      setFromDate(today.startOf("month"));
      setToDate(today.endOf("month"));
    }

    if (range === "Last Month") {
      const lastMonth = today.subtract(1, "month");
      setFromDate(lastMonth.startOf("month"));
      setToDate(lastMonth.endOf("month"));
    }

    if (range === "Custom") {
      // Do nothing → user manually selects from & to
    }
  };

  /* ------------------------------------------------------------------
       FIND SELECTED PARTY NAME FROM ID
  ------------------------------------------------------------------ */
  const selectedPartyLabel =
    partyOptions.find((p) => p.value === selectedParty)?.label || "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* -------------------- PARTY DROPDOWN -------------------- */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-pointer"
              onClick={() => {
                partyRef.current.focus();
                setOpenParty(true);
              }}
            >
              <label
                className={`absolute left-[13px] bg-white px-[5px] transition-all duration-200 ${
                  openParty || selectedParty
                    ? "top-[-9px] text-[12px] text-[#083aef]"
                    : "top-[9px] text-[14px] text-[#43414199]"
                }`}
              >
                Select Party
              </label>

              <input
                ref={partyRef}
                type="text"
                value={queryParty || selectedPartyLabel}
                onFocus={() => setOpenParty(true)}
                onBlur={() => setTimeout(() => setOpenParty(false), 200)}
                onChange={(e) => {
                  setQueryParty(e.target.value);
                  setSelectedParty(null);
                }}
                className="w-full outline-none text-[14px] bg-transparent"
              />

              <motion.div animate={{ rotate: openParty ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FaChevronDown className="text-[#305af3] text-[12px]" />
              </motion.div>
            </div>

            {openParty && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[45px] w-full bg-white border border-[#dedede] rounded-lg shadow-md max-h-[180px] overflow-y-auto z-10"
              >
                {partyOptions
                  .filter((p) => p.label.toLowerCase().includes(queryParty.toLowerCase()))
                  .map((p) => (
                    <button
                      key={p.value}
                      onClick={() => {
                        setSelectedParty(p.value);
                        setQueryParty("");
                        setOpenParty(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[14px] hover:bg-blue-50"
                    >
                      {p.label}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* -------------------- DATE RANGE DROPDOWN -------------------- */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-pointer"
              onClick={() => {
                dateRef.current.focus();
                setOpenDate(true);
              }}
            >
              <label
                className={`absolute left-[13px] bg-white px-[5px] transition-all duration-200 ${
                  openDate || dateRange
                    ? "top-[-9px] text-[12px] text-[#083aef]"
                    : "top-[9px] text-[14px] text-[#43414199]"
                }`}
              >
                Date Range
              </label>

              <input
                ref={dateRef}
                type="text"
                value={queryDate || dateRange}
                onFocus={() => setOpenDate(true)}
                onBlur={() => setTimeout(() => setOpenDate(false), 200)}
                onChange={(e) => {
                  setQueryDate(e.target.value);
                }}
                className="w-full outline-none text-[14px] bg-transparent"
              />

              <motion.div animate={{ rotate: openDate ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FaChevronDown className="text-[#305af3] text-[12px]" />
              </motion.div>
            </div>

            {openDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[45px] w-full bg-white border border-[#dedede] rounded-lg shadow-md max-h-[160px] overflow-y-auto z-10"
              >
                {dateOptions
                  .filter((d) => d.toLowerCase().includes(queryDate.toLowerCase()))
                  .map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        applyDateRange(d);
                        setQueryDate("");
                        setOpenDate(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[14px] hover:bg-blue-50"
                    >
                      {d}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* FROM DATE */}
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
          />

          {/* TO DATE */}
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
