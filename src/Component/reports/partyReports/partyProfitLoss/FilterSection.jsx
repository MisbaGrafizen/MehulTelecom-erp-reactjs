"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

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
  const [openParty, setOpenParty] = useState(false)
  const [openDate, setOpenDate] = useState(false)
  const [queryParty, setQueryParty] = useState("")
  const [queryDate, setQueryDate] = useState("")

  const partyRef = useRef(null)
  const dateRef = useRef(null)

  const dateOptions = ["Today", "This Week", "This Month", "Last Month", "Custom"]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Party Dropdown */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-pointer"
              onClick={() => {
                partyRef.current.focus()
                setOpenParty(true)
              }}
            >
              <label
                className={`absolute left-[13px] bg-white px-[5px] font-Poppins transition-all duration-200
                  ${
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
                value={queryParty || selectedParty}
                onFocus={() => setOpenParty(true)}
                onBlur={() => setTimeout(() => setOpenParty(false), 200)}
                onChange={(e) => {
                  setQueryParty(e.target.value)
                  setSelectedParty("")
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
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[45px] w-full bg-white border border-[#dedede] rounded-lg shadow-md z-10 max-h-[180px] overflow-y-auto"
              >
                {partyOptions
                  .filter((p) => p.label.toLowerCase().includes(queryParty.toLowerCase()))
                  .map((p) => (
                    <button
                      key={p.value}
                      onClick={() => {
                        setSelectedParty(p.value)
                        setQueryParty("")
                        setOpenParty(false)
                      }}
                      className="w-full text-left px-3 py-2 text-[14px] hover:bg-blue-50"
                    >
                      {p.label}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-pointer"
              onClick={() => {
                dateRef.current.focus()
                setOpenDate(true)
              }}
            >
              <label
                className={`absolute left-[13px] bg-white px-[5px] font-Poppins transition-all duration-200
                  ${
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
                  setQueryDate(e.target.value)
                  setDateRange("")
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
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[45px] w-full bg-white border border-[#dedede] rounded-lg shadow-md z-10 max-h-[160px] overflow-y-auto"
              >
                {dateOptions
                  .filter((d) => d.toLowerCase().includes(queryDate.toLowerCase()))
                  .map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDateRange(d)
                        setQueryDate("")
                        setOpenDate(false)
                      }}
                      className="w-full text-left px-3 py-2 text-[14px] hover:bg-blue-50"
                    >
                      {d}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* From Date */}
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": { borderColor: "#dedede" },
                    "&:hover fieldset": { borderColor: "#305af3" },
                  },
                },
              },
            }}
          />

          {/* To Date */}
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white",
                    "& fieldset": { borderColor: "#dedede" },
                    "&:hover fieldset": { borderColor: "#305af3" },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  )
}
