"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import FilterSection from "../../../Component/reports/partyReports/alllParty/FilterSection"
import KPISection from "../../../Component/reports/partyReports/alllParty/KPISection"
import PartyList from "../../../Component/reports/partyReports/alllParty/PartyList"

export default function AllPartyReport() {
  const [selectedParty, setSelectedParty] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("all")

  // ✅ Sample party data
  const parties = [
    {
      id: 1,
      name: "ABC Mobile Store",
      contact: "+91 9876543210",
      address: "123 Main Street, City",
      creditLimit: 50000,
      openingBalance: 5000,
    },
    {
      id: 2,
      name: "XYZ Electronics",
      contact: "+91 8765432109",
      address: "456 Market Road, Town",
      creditLimit: 75000,
      openingBalance: -2000,
    },
    {
      id: 3,
      name: "Tech Hub Retail",
      contact: "+91 7654321098",
      address: "789 Shopping Mall, District",
      creditLimit: 100000,
      openingBalance: 10000,
    },
    {
      id: 4,
      name: "Digital World",
      contact: "+91 6543210987",
      address: "321 Commercial Area, Zone",
      creditLimit: 60000,
      openingBalance: 3500,
    },
    {
      id: 5,
      name: "Smart Devices Co",
      contact: "+91 5432109876",
      address: "654 Business Park, Region",
      creditLimit: 80000,
      openingBalance: -1000,
    },
  ]

  // ✅ Filter by search
  const filteredParties = useMemo(() => {
    return parties.filter((party) =>
      party.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, parties])

  // ✅ KPI calculations
  const kpiData = {
    totalParties: parties.length,
    totalSales: parties.length * 150000,
    totalPurchases: parties.length * 120000,
    balance: parties.length * (150000 - 120000),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 🔹 Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            parties={parties}
          />
        </motion.div>

        {/* 🔹 KPI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
      <KPISection data={kpiData} />

        </motion.div>

        {/* 🔹 Party List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredParties.length > 0 ? (
            <PartyList parties={filteredParties} />
          ) : (
            <div className="text-center text-slate-500 py-8">
              No parties found matching your search.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
