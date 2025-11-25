"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import FilterSection from "../../../Component/reports/itemsReport/itemwiseProfitLoss/FilterSection"
import KpiCards from "../../../Component/reports/itemsReport/itemwiseProfitLoss/KpiCards"
import ItemTable from "../../../Component/reports/itemsReport/itemwiseProfitLoss/ItemTable"
import Header from "../../../Component/header/Header"
import SideBar from "../../../Component/sidebar/SideBar"

export default function ItemWisePLReport() {
    const [filters, setFilters] = useState({
        fromDate: null,
        toDate: null,
        category: "All Categories",
        search: "",
    })

    const items = [
        {
            id: 1,
            name: "iPhone 15 Pro",
            model: "A3094",
            color: "Space Black",
            spec: "256GB",
            category: "Mobile",
            totalSale: 1245000,
            totalPurchase: 950000,
            profit: 295000,
            sales: [
                {
                    invoiceNo: "INV-001",
                    date: "2024-11-20",
                    qty: 2,
                    imei: ["353988812345678", "353988812345679"],
                    rate: 99500,
                    total: 199000,
                },
                {
                    invoiceNo: "INV-005",
                    date: "2024-11-18",
                    qty: 3,
                    imei: ["353988812345680", "353988812345681", "353988812345682"],
                    rate: 99500,
                    total: 298500,
                },
            ],
            purchases: [
                { billNo: "PO-001", date: "2024-11-15", qty: 5, rate: 95000, total: 475000 },
                { billNo: "PO-002", date: "2024-11-12", qty: 5, rate: 95000, total: 475000 },
            ],
        },
        {
            id: 2,
            name: "Samsung Galaxy S24",
            model: "SM-S921B",
            color: "Phantom Black",
            spec: "512GB",
            category: "Mobile",
            totalSale: 950000,
            totalPurchase: 780000,
            profit: 170000,
            sales: [
                { invoiceNo: "INV-002", date: "2024-11-19", qty: 1, imei: ["990012345678901"], rate: 79500, total: 79500 },
            ],
            purchases: [{ billNo: "PO-003", date: "2024-11-14", qty: 10, rate: 78000, total: 780000 }],
        },
        {
            id: 3,
            name: "Apple Watch Series 9",
            model: "A2848",
            color: "Silver",
            spec: "45mm GPS",
            category: "Watch",
            totalSale: 425000,
            totalPurchase: 315000,
            profit: 110000,
            sales: [
                { invoiceNo: "INV-003", date: "2024-11-17", qty: 3, imei: ["NA", "NA", "NA"], rate: 42500, total: 127500 },
            ],
            purchases: [{ billNo: "PO-004", date: "2024-11-10", qty: 5, rate: 63000, total: 315000 }],
        },
        {
            id: 4,
            name: "Airpods Pro 2",
            model: "A2931",
            color: "White",
            spec: "2nd Gen",
            category: "Accessories",
            totalSale: 185000,
            totalPurchase: 195000,
            profit: -10000,
            sales: [
                {
                    invoiceNo: "INV-004",
                    date: "2024-11-16",
                    qty: 5,
                    imei: ["NA", "NA", "NA", "NA", "NA"],
                    rate: 37000,
                    total: 185000,
                },
            ],
            purchases: [{ billNo: "PO-005", date: "2024-11-08", qty: 5, rate: 39000, total: 195000 }],
        },
    ]

    // ✅ Filter logic (show all by default)
    const filteredItems = items.filter((item) => {
        const matchesCategory =
            filters.category === "All Categories" || item.category === filters.category
        const matchesSearch =
            !filters.search ||
            item.name.toLowerCase().includes(filters.search.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const totalSale = filteredItems.reduce((sum, item) => sum + item.totalSale, 0)
    const totalPurchase = filteredItems.reduce((sum, item) => sum + item.totalPurchase, 0)
    const totalProfit = filteredItems.reduce((sum, item) => sum + item.profit, 0)

    return (

        <>


            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[98vh]">
                    <Header pageName="Item Wise Profit Loss" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[95%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className=" w-[100%]"
                            >
                                <div className=" w-[100%] flex flex-col gap-[20px]">
                                    {/* 🔹 Filter Section */}
                                    <FilterSection filters={filters} setFilters={setFilters} />

                                    {/* 🔹 KPI Cards + Table */}
                                    <KpiCards
                                        totalSale={totalSale}
                                        totalPurchase={totalPurchase}
                                        totalProfit={totalProfit}
                                    />
                                    <ItemTable items={filteredItems} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
