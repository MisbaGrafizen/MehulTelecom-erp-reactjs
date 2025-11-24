"use client"

import { useState } from "react"

import FilterSection from "../../../Component/reports/PartySatateMent/FilterSection"
import EmptyState from "../../../Component/reports/PartySatateMent/EmptyState"
import KPISection from "../../../Component/reports/PartySatateMent/KPISection"
import SalePurchaseCards from "../../../Component/reports/PartySatateMent/SalePurchaseCards"
import TransactionList from "../../../Component/reports/PartySatateMent/TransactionList"
import PartyStatementModal from "../../../Component/reports/PartySatateMent/modal/PartyStatementModal"
import Header from "../../../Component/header/Header"
import SideBar from "../../../Component/sidebar/SideBar"

export default function PartyStatement() {
    const [selectedParty, setSelectedParty] = useState(null)
    const [dateRange, setDateRange] = useState({ from: null, to: null, type: "today" })
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedModal, setSelectedModal] = useState(null)

    // Sample party data
    const parties = [
        { id: 1, name: "Sharma Electronics", type: "Supplier" },
        { id: 2, name: "Apple Store Delhi", type: "Customer" },
        { id: 3, name: "Tech Zone Mumbai", type: "Customer" },
        { id: 4, name: "Mobile Plus", type: "Supplier" },
    ]

    // Sample transaction data
    const saleTransactions = [
        {
            id: 1,
            date: "2025-01-20",
            time: "10:30 AM",
            invoiceNo: "INV-001",
            items: [{ name: "iPhone 15 Pro", imei: "351756123456789", qty: 2, rate: 79999, total: 159998 }],
            paymentMode: "Card",
            amount: 159998,
            status: "Completed",
        },
        {
            id: 2,
            date: "2025-01-19",
            time: "2:15 PM",
            invoiceNo: "INV-002",
            items: [{ name: "Samsung S24", imei: "353698123456789", qty: 1, rate: 89999, total: 89999 }],
            paymentMode: "Cash",
            amount: 89999,
            status: "Completed",
        },
    ]

    const purchaseTransactions = [
        {
            id: 3,
            date: "2025-01-18",
            time: "11:45 AM",
            invoiceNo: "PO-2001",
            items: [{ name: "iPhone 15", imei: "N/A", qty: 5, rate: 65000, total: 325000 }],
            paymentMode: "Bank Transfer",
            amount: 325000,
            status: "Pending",
        },
    ]

    // Calculate KPI data
    const totalSales = saleTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalPurchases = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0)
    const balance = totalSales - totalPurchases

    return (
        <>

            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Party  Statement" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

                            <div className=" w-[100%]">
                                <div className="  w-[100]">
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
                                            <KPISection totalSales={totalSales} totalPurchases={totalPurchases} balance={balance} />

                                            {/* <SalePurchaseCards
                                                totalSales={totalSales}
                                                saleCount={saleTransactions.length}
                                                totalPurchases={totalPurchases}
                                                purchaseCount={purchaseTransactions.length}
                                                onSaleClick={() => setSelectedModal({ type: "sales", data: saleTransactions })}
                                                onPurchaseClick={() => setSelectedModal({ type: "purchases", data: purchaseTransactions })}
                                            /> */}

                                            <TransactionList
                                                transactions={[
                                                    ...saleTransactions.map((t) => ({ ...t, type: "Sale" })),
                                                    ...purchaseTransactions.map((t) => ({ ...t, type: "Purchase" })),
                                                ]}
                                                searchQuery={searchQuery}
                                                onViewClick={(transaction) => setSelectedModal({ type: "detail", data: transaction })}
                                            />
                                        </>
                                    )}
                                </div>

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
    )
}
