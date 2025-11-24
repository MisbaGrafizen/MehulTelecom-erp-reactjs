'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import FilterSection from '../../Component/reports/allTransections/FilterSection'
import KpiCards from '../../Component/reports/allTransections/KpiCards'
import TransactionList from '../../Component/reports/allTransections/TransactionList'
import TransactionModal from '../../Component/reports/modals/TransactionModal'
import Header from '../../Component/header/Header'
import SideBar from '../../Component/sidebar/SideBar'
import { ApiGet } from '../../helper/axios'

export default function AllTransactions() {
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [transactions, setTransactions] = useState([]);

    const [kpi, setKpi] = useState({
        totalTransactions: 0,
        totalAmount: 0,
        todayTransactions: 0
    });

    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        type: "All Types",
        party: "All Parties",
        search: "",

    });

    const [partyList, setPartyList] = useState(["All Parties"]);

    const fetchParties = async () => {
        try {
            const res = await ApiGet("/admin/party");
            const names = res?.data?.map((p) => p.partyName) || [];
            setPartyList(["All Parties", ...names]);
        } catch (err) {
            console.log("❌ Party Fetch Error:", err);
        }
    };


    const fetchData = async () => {
        try {
            // remove empty/default filters
            const cleanFilters = {};

            if (filters.fromDate) cleanFilters.fromDate = filters.fromDate;
            if (filters.toDate) cleanFilters.toDate = filters.toDate;

            if (filters.type !== "All Types") cleanFilters.type = filters.type;
            if (filters.party !== "All Parties") cleanFilters.party = filters.party;

            if (filters.search.trim() !== "") cleanFilters.search = filters.search;

            const query = new URLSearchParams(cleanFilters).toString();

            const res = await ApiGet(`/admin/transaction-report?${query}`);

            setTransactions(res.transactions || []);

            setKpi({
                totalTransactions: res.totalTransactions || 0,
                totalAmount: res.totalAmount || 0,
                todayTransactions: res.todayCount || 0,
            });

        } catch (error) {
            console.log("❌ API Error:", error);
        }
    };


    useEffect(() => {
        fetchParties();
        fetchData();
    }, [filters]);


    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }


    const filteredTransactions = transactions.filter(tx => {
        if (filters.type !== 'All Types' && tx.type !== filters.type) return false
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            return (
                tx.invoiceNo?.toLowerCase()?.includes(searchLower) ||
                tx.partyName?.toLowerCase()?.includes(searchLower)
            )
        }
        return true
    })

    const totalTransactions = filteredTransactions.length
    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const todayTransactions = filteredTransactions.filter(
        tx => new Date(tx.date).toDateString() === new Date().toDateString()
    ).length




    return (
        <>



            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="All Transections" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">


                            <div className=" bg-slate-50 w-[100%]">


                                <div className=" space-y-6">
                                    <FilterSection
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        partyList={partyList}
                                    />


                                    <KpiCards
                                        totalTransactions={kpi.totalTransactions}
                                        totalAmount={kpi.totalAmount}
                                        todayTransactions={kpi.todayTransactions}
                                    />

                                    <TransactionList
                                        transactions={transactions}
                                        onSelectTransaction={setSelectedTransaction}
                                    />

                                </div>

                                {selectedTransaction && (
                                    <TransactionModal
                                        transaction={selectedTransaction}
                                        onClose={() => setSelectedTransaction(null)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
