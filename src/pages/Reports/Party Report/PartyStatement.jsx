"use client";

import { useEffect, useState } from "react";

import FilterSection from "../../../Component/reports/PartySatateMent/FilterSection";
import EmptyState from "../../../Component/reports/PartySatateMent/EmptyState";
import KPISection from "../../../Component/reports/PartySatateMent/KPISection";
import TransactionList from "../../../Component/reports/PartySatateMent/TransactionList";
import PartyStatementModal from "../../../Component/reports/PartySatateMent/modal/PartyStatementModal";

import Header from "../../../Component/header/Header";
import SideBar from "../../../Component/sidebar/SideBar";
import { ApiGet } from "../../../helper/axios";

export default function PartyStatement() {
  const [selectedParty, setSelectedParty] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
    type: "today",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModal, setSelectedModal] = useState(null);

  const [parties, setParties] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [balance, setBalance] = useState(0);

  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                              FETCH PARTIES                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await ApiGet("/admin/party");
        setParties(res?.data || []);
      } catch (err) {
        console.error("Error fetching parties:", err);
      }
    };

    fetchParties();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                        FETCH PARTY STATEMENT DATA                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedParty) return;

    const loadStatement = async () => {
      setLoading(true);

      try {
        let url = `/admin/party-statement?partyId=${selectedParty._id}`;

        if (dateRange.from) url += `&fromDate=${dateRange.from}`;
        if (dateRange.to) url += `&toDate=${dateRange.to}`;

        const res = await ApiGet(url);
        console.log('res', res)
        const data = res || {};

        setTransactions(data.transactions || []);
        setTotalSales(data.totalSales || 0);
        setTotalPurchases(data.totalPurchases || 0);
        setBalance(data.balance || 0);
      } catch (err) {
        console.error("Error loading statement:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStatement();
  }, [selectedParty, dateRange]);
  

  return (
    <>
      <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
        <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
          <Header pageName="Party Statement" />

          <div className="flex gap-[10px] w-full h-full">
            <SideBar />

            <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
              <div className="w-full">
                <FilterSection
                  parties={parties}
                  selectedParty={selectedParty}
                  onPartyChange={setSelectedParty}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                {!selectedParty ? (
                  <EmptyState />
                ) : (
                  <>
                    <KPISection
                      totalSales={totalSales}
                      totalPurchases={totalPurchases}
                      balance={balance}
                    />

                    <TransactionList
                      transactions={transactions}
                      searchQuery={searchQuery}
                      onViewClick={(transaction) =>
                        setSelectedModal({
                          type: "detail",
                          data: transaction,
                        })
                      }
                    />
                  </>
                )}

                {selectedModal && (
                  <PartyStatementModal
                    type={selectedModal.type}
                    data={selectedModal.data}
                    party={selectedParty}
                    onClose={() => setSelectedModal(null)}
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
