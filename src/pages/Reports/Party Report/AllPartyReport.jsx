"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dayjs from "dayjs"

import FilterSection from "../../../Component/reports/partyReports/alllParty/FilterSection"
import KPISection from "../../../Component/reports/partyReports/alllParty/KPISection"
import PartyList from "../../../Component/reports/partyReports/alllParty/PartyList"

import { ApiGet } from "../../../helper/axios"

export default function AllPartyReport() {
  const [selectedParty, setSelectedParty] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [dateRange, setDateRange] = useState("")

  const [partyOptions, setPartyOptions] = useState([])
  const [parties, setParties] = useState([])

  const [kpiData, setKpiData] = useState({
    totalParties: 0,
    totalSales: 0,
    totalPurchases: 0,
    balance: 0,
  })

  // -----------------------------------------------------------
  // 1️⃣ FETCH ALL PARTIES FOR DROPDOWN
  // -----------------------------------------------------------
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await ApiGet("/admin/party")
        const list = res?.data || []

        setPartyOptions(
          list.map(p => ({
            value: p._id,
            label: p.partyName,
          }))
        )
      } catch (e) {
        console.error("Error loading parties:", e)
      }
    }

    fetchParties()
  }, [])

  // -----------------------------------------------------------
  // 2️⃣ FETCH ALL PARTY REPORT
  // -----------------------------------------------------------
  useEffect(() => {
    const loadReport = async () => {
      try {
        let url = `/admin/all-party-report?search=${searchQuery}`

        if (selectedParty) url += `&partyId=${selectedParty}`
        if (fromDate) url += `&fromDate=${dayjs(fromDate).format("YYYY-MM-DD")}`
        if (toDate) url += `&toDate=${dayjs(toDate).format("YYYY-MM-DD")}`
        if (dateRange) url += `&dateRange=${dateRange}`

        const res = await ApiGet(url);
        console.log('res', res)
        const data = res || {}

        setParties(data.parties || [])
        setKpiData(data.kpi || {})
      } catch (error) {
        console.error("Report Error:", error)
      }
    }

    loadReport()
  }, [selectedParty, searchQuery, fromDate, toDate, dateRange])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* FILTER */}
<FilterSection
  selectedParty={selectedParty}
  setSelectedParty={setSelectedParty}
  dateRange={dateRange}
  setDateRange={setDateRange}
  fromDate={fromDate}
  setFromDate={setFromDate}
  toDate={toDate}
  setToDate={setToDate}
  partyOptions={partyOptions}     // ONLY MASTER PARTY LIST
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
/>


        <KPISection data={kpiData} />

        {parties.length ? <PartyList parties={parties} /> : (
          <div className="text-center text-slate-500 py-8">
            No parties found matching filters.
          </div>
        )}
      </div>
    </div>
  )
}
