"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

import FilterSection from "../../../Component/reports/partyReports/partyProfitLoss/FilterSection";
import EmptyState from "../../../Component/reports/partyReports/partyProfitLoss/EmptyState";
import KPISection from "../../../Component/reports/partyReports/partyProfitLoss/KPISection";
import PartyPLTable from "../../../Component/reports/partyReports/partyProfitLoss/PartyPLTable";

import Header from "../../../Component/header/Header";
import SideBar from "../../../Component/sidebar/SideBar";
import { ApiGet } from "../../../helper/axios";

export default function PartyWisePLReport() {
  const [selectedParty, setSelectedParty] = useState(null);
  const [partyOptions, setPartyOptions] = useState([]);

  // DATE RANGE
  const [dateRange, setDateRange] = useState("month");
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day"));
  const [toDate, setToDate] = useState(dayjs());

  // REPORT DATA
  const [transactions, setTransactions] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [balance, setBalance] = useState(0);

  const [selectedRowData, setSelectedRowData] = useState(null);

  /* ------------------------------------------------------------------
      FETCH PARTY LIST
  ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await ApiGet("/admin/party");
        const list = res?.data || [];

        setPartyOptions(
          list.map((p) => ({
            label: p.partyName,
            value: p._id,
          }))
        );
      } catch (err) {
        console.error("Error fetching parties:", err);
      }
    };

    fetchParties();
  }, []);

  /* ------------------------------------------------------------------
      FETCH PARTY PROFIT & LOSS REPORT
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!selectedParty) return;

    const fetchPL = async () => {
      try {
        const res = await ApiGet(
          `/admin/party-pl?partyId=${selectedParty}` +
            `&fromDate=${fromDate.format("YYYY-MM-DD")}` +
            `&toDate=${toDate.format("YYYY-MM-DD")}`
        );

        console.log('res', res)

        const data = res;

        setTransactions(data?.transactions || []);
        setTotalSales(data?.totalSales || 0);
        setTotalPurchases(data?.totalPurchases || 0);
        setBalance(data?.balance || 0);
      } catch (err) {
        console.error("Error fetching P/L report:", err);
      }
    };

    fetchPL();
  }, [selectedParty, fromDate, toDate]);

  /* ------------------------------------------------------------------
      UI RENDER
  ------------------------------------------------------------------ */
  return (
    <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
      <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
        <Header pageName="Party wise Profit Loss" />

        <div className="flex gap-[10px] w-full h-full">
          <SideBar />

          <div className="flex w-full max-h-[90%] bg-white pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
            <div className="w-full">

              {/* FILTER SECTION */}
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

              {/* CONTENT */}
              {!selectedParty ? (
                <EmptyState />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* KPI */}
                  <KPISection
                    selectedParty={{
                      totalSales,
                      totalPurchases,
                      balance,
                    }}
                  />

                  {/* TABLE */}
                  <PartyPLTable
                    parties={transactions}
                    selectedRowData={selectedRowData}
                    setSelectedRowData={setSelectedRowData}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
