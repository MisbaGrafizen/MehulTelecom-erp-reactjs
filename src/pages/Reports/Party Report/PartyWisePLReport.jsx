"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// import FilterSection from "../../../Component/reports/PartySatateMent/FilterSection"
import FilterSection from "../../../Component/reports/partyReports/partyProfitLoss/FilterSection"

import EmptyState from "../../../Component/reports/partyReports/partyProfitLoss/EmptyState"
import KPISection from "../../../Component/reports/partyReports/partyProfitLoss/KPISection"
import PartyPLTable from "../../../Component/reports/partyReports/partyProfitLoss/PartyPLTable"
import Header from "../../../Component/header/Header"
import SideBar from "../../../Component/sidebar/SideBar"

export default function PartyWisePLReport() {
  const [selectedParty, setSelectedParty] = useState(null)
  const [dateRange, setDateRange] = useState("month")
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [toDate, setToDate] = useState(new Date())
  const [selectedRowData, setSelectedRowData] = useState(null)

  // Sample party data
  const parties = [
    { id: 1, name: "John Electronics", sales: 250000, purchases: 180000 },
    { id: 2, name: "Tech Suppliers Ltd", sales: 520000, purchases: 420000 },
    { id: 3, name: "Mobile Hub", sales: 180000, purchases: 95000 },
    { id: 4, name: "Retail Partners", sales: 420000, purchases: 310000 },
  ]

  const partyOptions = parties.map((p) => ({ label: p.name, value: p.id }))

  const calculateProfit = (sales, purchases) => sales - purchases

  return (

    <>

      <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
        <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
          <Header pageName="Party wise Profit Loss" />
          <div className="flex gap-[10px] w-full h-full">
            <SideBar />
            <div className="flex w-full max-h-[90%]  bg-white pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

              <div className=" w-[100%]">


                <div className=" w-[100%]">
                  <FilterSection
                    selectedParty={selectedParty}
                    setSelectedParty={setSelectedParty}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                    partyOptions={partyOptions}
                  />

                  {!selectedParty ? (
                    <EmptyState />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <KPISection selectedParty={parties.find((p) => p.id === selectedParty)} />

                      <PartyPLTable parties={parties} selectedRowData={selectedRowData} setSelectedRowData={setSelectedRowData} />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
