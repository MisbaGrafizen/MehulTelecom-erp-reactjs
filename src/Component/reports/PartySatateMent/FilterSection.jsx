'use client'

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"

export default function FilterSection({
  parties,
  selectedParty,
  onPartyChange,
  dateRange,
  onDateRangeChange,
  searchQuery,
  onSearchChange,
}) {

  const [openParty, setOpenParty] = useState(false)
  const [openDate, setOpenDate] = useState(false)

  const [queryParty, setQueryParty] = useState("")
  const [queryDate, setQueryDate] = useState("")

  const partyRef = useRef(null)
  const dateRef = useRef(null)

  const [fromDate, setFromDate] = useState(dayjs(dateRange.from))
  const [toDate, setToDate] = useState(dayjs(dateRange.to))

  const partyOptions = parties || []
  const dateOptions = ["Today", "This Week", "This Month", "Last Month", "Custom"]

  // ----------------------------
  // 📌 DATE RANGE CALCULATION
  // ----------------------------
  const calculateDateRange = (type) => {
    const today = dayjs()
    let from = null
    let to = today.format("YYYY-MM-DD")

    if (type === "Today") {
      from = today.format("YYYY-MM-DD")
    } 
    
    else if (type === "This Week") {
      from = today.startOf("week").format("YYYY-MM-DD")
    } 
    
    else if (type === "This Month") {
      from = today.startOf("month").format("YYYY-MM-DD")
    } 
    
    else if (type === "Last Month") {
      const lastMonth = today.subtract(1, "month")
      from = lastMonth.startOf("month").format("YYYY-MM-DD")
      to = lastMonth.endOf("month").format("YYYY-MM-DD")
    } 
    
    else if (type === "Custom") {
      from = dateRange.from
      to = dateRange.to
    }

    return { from, to }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* -------------------- PARTY DROPDOWN -------------------- */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-text"
              onClick={() => { partyRef.current?.focus(); setOpenParty(true); }}
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
                value={queryParty || selectedParty?.partyName || ""}
                onFocus={() => setOpenParty(true)}
                onBlur={() => setTimeout(() => setOpenParty(false), 200)}
                onChange={(e) => {
                  setQueryParty(e.target.value)
                  onPartyChange(null)
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
                className="absolute top-[45px] w-full bg-white border border-[#dedede] rounded-lg shadow-md max-h-[160px] overflow-y-auto z-10"
              >
                {partyOptions
                  .filter((p) =>
                    p.partyName.toLowerCase().includes(queryParty.toLowerCase())
                  )
                  .map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        onPartyChange(p)
                        setQueryParty("")
                        setOpenParty(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-[14px]"
                    >
                      {p.partyName}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* -------------------- DATE RANGE DROPDOWN -------------------- */}
          <div className="relative">
            <div
              className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 cursor-text"
              onClick={() => { dateRef.current?.focus(); setOpenDate(true); }}
            >
              <label
                className={`absolute left-[13px] bg-white px-[5px] transition-all duration-200 ${
                  openDate || dateRange.type
                    ? "top-[-9px] text-[12px] text-[#083aef]"
                    : "top-[9px] text-[14px] text-[#43414199]"
                }`}
              >
                Date Range
              </label>

              <input
                ref={dateRef}
                type="text"
                value={queryDate || dateRange.type}
                onFocus={() => setOpenDate(true)}
                onBlur={() => setTimeout(() => setOpenDate(false), 200)}
                onChange={(e) => setQueryDate(e.target.value)}
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
                  .filter((d) =>
                    d.toLowerCase().includes(queryDate.toLowerCase())
                  )
                  .map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        const { from, to } = calculateDateRange(d)

                        onDateRangeChange({
                          type: d,
                          from,
                          to,
                        })

                        setFromDate(dayjs(from))
                        setToDate(dayjs(to))
                        setQueryDate("")
                        setOpenDate(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-[14px]"
                    >
                      {d}
                    </button>
                  ))}
              </motion.div>
            )}
          </div>

          {/* -------------------- FROM DATE PICKER -------------------- */}
          <div>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => {
                setFromDate(newValue)
                onDateRangeChange({
                  ...dateRange,
                  from: newValue?.format("YYYY-MM-DD"),
                })
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>

          {/* -------------------- TO DATE PICKER -------------------- */}
          <div>
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => {
                setToDate(newValue)
                onDateRangeChange({
                  ...dateRange,
                  to: newValue?.format("YYYY-MM-DD"),
                })
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>
        </div>

        {/* -------------------- SEARCH -------------------- */}
        <div className="mt-4">
          <div className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3">
            <input
              type="text"
              placeholder="Search invoice, model, IMEI…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full outline-none bg-transparent text-[14px] text-[#000]"
            />
          </div>
        </div>

      </div>
    </LocalizationProvider>
  )
}
