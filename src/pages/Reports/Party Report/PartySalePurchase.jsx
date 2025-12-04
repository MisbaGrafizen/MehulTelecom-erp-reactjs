"use client";

import { useState, useEffect } from "react";
import FilterSection from "../../../Component/reports/partyReports/alllParty/FilterSection";
import PartyTable from "../../../Component/reports/partyReports/salePurchaseByParty/PartyTable";
import PartySalePurchaseModal from "../../../Component/reports/partyReports/salePurchaseByParty/modal/PartySalePurchaseModal";
import SideBar from "../../../Component/sidebar/SideBar";
import Header from "../../../Component/header/Header";

import { ApiGet } from "../../../helper/axios";

export default function PartySalePurchase() {
  const [partyOptions, setPartyOptions] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);

  const [selectedPartyData, setSelectedPartyData] = useState(null);
  const [allPartiesData, setAllPartiesData] = useState([]);

  const [dateRange, setDateRange] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // 🔹 Fetch All Parties
  // ---------------------------
  const fetchAllParties = async () => {
    try {
      const res = await ApiGet("/admin/party");

      const formattedOptions = (res?.data || res)?.map((p) => ({
        label: p.partyName,
        value: p._id,
      }));

      setPartyOptions(formattedOptions || []);
    } catch (err) {
      console.log("❌ Error fetching parties:", err);
    }
  };

  useEffect(() => {
    fetchAllParties();
  }, []);

  // ---------------------------
  // 🔹 Fetch Report of ONE Party
  // ---------------------------
  const fetchSelectedParty = async (partyId) => {
    try {
      setLoading(true);

      const url = `/admin/reports/party/${partyId}${
        fromDate || toDate
          ? `?fromDate=${fromDate ? fromDate.toISOString() : ""}&toDate=${
              toDate ? toDate.toISOString() : ""
            }`
          : ""
      }`;

      const res = await ApiGet(url);
      setSelectedPartyData(res?.data || null);

      setLoading(false);
    } catch (err) {
      console.log("❌ Error fetching party report:", err);
      setLoading(false);
    }
  };

  // ---------------------------
  // ⭐ NEW → Fetch ALL Party Reports
  // ---------------------------
  const fetchAllPartyReports = async () => {
    try {
      setLoading(true);

      const url = `/admin/reports/party${
        fromDate || toDate
          ? `?fromDate=${fromDate ? fromDate.toISOString() : ""}&toDate=${
              toDate ? toDate.toISOString() : ""
            }`
          : ""
      }`;

      const res = await ApiGet(url);
      setAllPartiesData(res?.data || []);

      setLoading(false);
    } catch (err) {
      console.log("❌ Error fetching all party reports:", err);
      setLoading(false);
    }
  };

  // ---------------------------
  // 🔥 Trigger When Selection OR Date Changes
  // ---------------------------
  useEffect(() => {
    if (!selectedParty) return;

    if (selectedParty === "all") {
      fetchAllPartyReports();
      setSelectedPartyData(null); // clear single party data
    } else {
      fetchSelectedParty(selectedParty);
      setAllPartiesData([]); // clear multiparty data
    }
  }, [selectedParty, fromDate, toDate]);

  return (
    <>
      <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
        <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
          <Header pageName="Sale / Purchase by Party" />
          <div className="flex gap-[10px] w-full h-full">
            <SideBar />

            <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
              <div className="w-full h-full">

                {/* 🔹 Filter Section */}
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

                {/* 🔹 LOADING */}
                {loading && (
                  <div className="text-center py-10 text-slate-500">Loading...</div>
                )}

                {/* 🔹 SHOW ALL PARTIES */}
                {!loading && selectedParty === "all" && allPartiesData.length > 0 && (
                  allPartiesData.map((p, idx) => (
                    <PartyTable
                      key={idx}
                      party={p}
                      onViewClick={setModalData}
                    />
                  ))
                )}

                {/* 🔹 SHOW SELECTED PARTY */}
                {!loading && selectedParty !== "all" && selectedPartyData && (
                  <PartyTable
                    party={selectedPartyData}
                    onViewClick={setModalData}
                  />
                )}

                {/* 🔹 NO SELECTION */}
                {!loading && !selectedParty && (
                  <div className="text-center text-slate-500 py-10">
                    Please select a party to view sale/purchase details.
                  </div>
                )}

                {/* 🔹 Modal */}
                {modalData && (
                  <PartySalePurchaseModal
                    party={modalData}
                    onClose={() => setModalData(null)}
                  />
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
