"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Eye, Printer, Download, Search, TrendingUp, TrendingDown, ChevronDown, X, MoreVertical, Plus, MapPin, Package, Smartphone, ShoppingCart, CreditCard, ArrowRight } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import KPICard from '../../Component/DayBookReports/KPICard'
import Badge from '../../Component/DayBookReports/Badge'
import DayBookTable from '../../Component/DayBookReports/DayBookTable'
import PurchaseModal from '../../Component/DayBookReports/PurchaseModal'
import SaleModal from '../../Component/DayBookReports/SaleModal'
import TransferModal from '../../Component/DayBookReports/TransferModal'
import FilterBar from '../../Component/DayBookReports/FilterBar'
import SearchBar from '../../Component/DayBookReports/SearchBar'
import Header from "../../Component/header/Header"
import SideBar from "../../Component/sidebar/SideBar"


export default function DayBookReport() {
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [modalType, setModalType] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({
        company: "All Companies",
        transactionType: "All Types",
    })

    const itemsPerPage = 10

    // Mock data
    const dayBookData = [
        {
            id: 1,
            time: "09:15 AM",
            type: "purchase",
            invoiceNo: "PUR-001",
            party: "ABC Suppliers",
            paymentMode: "Cash",
            amount: "₹45,000",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                partyName: "ABC Suppliers",
                items: 3,
                totalAmount: 45000
            }
        },
        {
            id: 2,
            time: "10:30 AM",
            type: "sale",
            invoiceNo: "INV-001",
            party: "Customer 1",
            paymentMode: "UPI",
            amount: "₹23,500",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                customerName: "Customer 1",
                items: 2,
                totalAmount: 23500,
                remainingAmount: 0,
                salesman: "John Doe"
            }
        },
        {
            id: 3,
            time: "11:45 AM",
            type: "transfer",
            invoiceNo: "TRN-001",
            party: "Mumbai Branch",
            paymentMode: "None",
            amount: "₹15,000",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                fromBranch: "Delhi Branch",
                toBranch: "Mumbai Branch",
                items: 5,
                totalAmount: 15000
            }
        },
        {
            id: 4,
            time: "01:00 PM",
            type: "sale",
            invoiceNo: "INV-002",
            party: "Customer 2",
            paymentMode: "Online",
            amount: "₹34,200",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                customerName: "Customer 2",
                items: 3,
                totalAmount: 34200,
                remainingAmount: 5000,
                salesman: "Jane Smith"
            }
        },
        {
            id: 5,
            time: "02:15 PM",
            type: "purchase",
            invoiceNo: "PUR-002",
            party: "XYZ Distributors",
            paymentMode: "Online",
            amount: "₹67,800",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                partyName: "XYZ Distributors",
                items: 5,
                totalAmount: 67800
            }
        },
        {
            id: 6,
            time: "03:30 PM",
            type: "sale",
            invoiceNo: "INV-003",
            party: "Customer 3",
            paymentMode: "Cash",
            amount: "₹12,300",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                customerName: "Customer 3",
                items: 1,
                totalAmount: 12300,
                remainingAmount: 0,
                salesman: "Mike Johnson"
            }
        },
        {
            id: 7,
            time: "04:45 PM",
            type: "transfer",
            invoiceNo: "TRN-002",
            party: "Bangalore Branch",
            paymentMode: "None",
            amount: "₹28,500",
            status: "Pending",
            details: {
                company: "ABC Mobile Store",
                fromBranch: "Delhi Branch",
                toBranch: "Bangalore Branch",
                items: 8,
                totalAmount: 28500
            }
        },
        {
            id: 8,
            time: "05:20 PM",
            type: "purchase",
            invoiceNo: "PUR-003",
            party: "Tech Wholesale",
            paymentMode: "UPI",
            amount: "₹56,400",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                partyName: "Tech Wholesale",
                items: 4,
                totalAmount: 56400
            }
        },
        {
            id: 9,
            time: "06:00 PM",
            type: "sale",
            invoiceNo: "INV-004",
            party: "Customer 4",
            paymentMode: "Cash",
            amount: "₹18,900",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                customerName: "Customer 4",
                items: 2,
                totalAmount: 18900,
                remainingAmount: 0,
                salesman: "Sarah Lee"
            }
        },
        {
            id: 10,
            time: "06:45 PM",
            type: "transfer",
            invoiceNo: "TRN-003",
            party: "Chennai Branch",
            paymentMode: "None",
            amount: "₹9,200",
            status: "Completed",
            details: {
                company: "ABC Mobile Store",
                fromBranch: "Delhi Branch",
                toBranch: "Chennai Branch",
                items: 3,
                totalAmount: 9200
            }
        },
    ]

    // Calculate KPI totals
    const calculateKPIs = () => {
        let purchaseTotal = 0
        let saleTotal = 0
        let transferTotal = 0
        let cashTotal = 0
        let upiTotal = 0
        let onlineTotal = 0

        dayBookData.forEach(item => {
            const amount = parseInt(item.amount.replace(/[₹,]/g, ""))

            if (item.type === "purchase") purchaseTotal += amount
            if (item.type === "sale") saleTotal += amount
            if (item.type === "transfer") transferTotal += amount

            if (item.paymentMode === "Cash") cashTotal += (item.type === "sale" ? amount : 0)
            if (item.paymentMode === "UPI") upiTotal += (item.type === "sale" ? amount : 0)
            if (item.paymentMode === "Online") onlineTotal += (item.type === "sale" ? amount : 0)
        })

        return {
            purchaseTotal,
            saleTotal,
            transferTotal,
            cashTotal,
            upiTotal,
            onlineTotal,
            grandTotal: saleTotal - purchaseTotal
        }
    }

    const kpis = calculateKPIs()

    return (

        <>

            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Day Book" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

                            <main className="w-[100%]">
                                <div className="w-[100%]">
                                    <FilterBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} filters={filters} setFilters={setFilters} />

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        <KPICard
                                            title="Purchase Total"
                                            amount={`₹${kpis.purchaseTotal.toLocaleString("en-IN")}`}
                                            icon={ShoppingCart}
                                            bgColor="var(--green-paid)"
                                            lightBgColor="var(--green-light)"
                                            trend={8}
                                        />
                                        <KPICard
                                            title="Sales Total"
                                            amount={`₹${kpis.saleTotal.toLocaleString("en-IN")}`}
                                            icon={CreditCard}
                                            bgColor="var(--blue-unpaid)"
                                            lightBgColor="var(--blue-light)"
                                            trend={12}
                                        />
                                        <KPICard
                                            title="Transfer Total"
                                            amount={`₹${kpis.transferTotal.toLocaleString("en-IN")}`}
                                            icon={ArrowRight}
                                            bgColor="var(--orange-total)"
                                            lightBgColor="var(--orange-light)"
                                            trend={5}
                                        />
                                        <KPICard
                                            title="Cash Received"
                                            amount={`₹${kpis.cashTotal.toLocaleString("en-IN")}`}
                                            icon={ShoppingCart}
                                            bgColor="#14b8a6"
                                            lightBgColor="#ccfbf1"
                                            trend={10}
                                        />
                                        <KPICard
                                            title="UPI Received"
                                            amount={`₹${kpis.upiTotal.toLocaleString("en-IN")}`}
                                            icon={CreditCard}
                                            bgColor="#a855f7"
                                            lightBgColor="#e9d5ff"
                                            trend={15}
                                        />
                                        <KPICard
                                            title="Online Payments"
                                            amount={`₹${kpis.onlineTotal.toLocaleString("en-IN")}`}
                                            icon={CreditCard}
                                            bgColor="#6366f1"
                                            lightBgColor="#e0e7ff"
                                            trend={6}
                                        />
                                    </div>

                                    {/* Day Book Table */}
                                    <DayBookTable
                                        data={dayBookData}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        itemsPerPage={itemsPerPage}
                                        onViewTransaction={(transaction) => {
                                            setSelectedTransaction(transaction)
                                            setModalType(transaction.type)
                                        }}
                                    />

                                    {/* Modals */}
                                    <AnimatePresence>
                                        {selectedTransaction && modalType === "purchase" && (
                                            <PurchaseModal
                                                purchase={selectedTransaction}
                                                onClose={() => {
                                                    setSelectedTransaction(null)
                                                    setModalType(null)
                                                }}
                                            />
                                        )}
                                        {selectedTransaction && modalType === "sale" && (
                                            <SaleModal
                                                sale={selectedTransaction}
                                                onClose={() => {
                                                    setSelectedTransaction(null)
                                                    setModalType(null)
                                                }}
                                            />
                                        )}
                                        {selectedTransaction && modalType === "transfer" && (
                                            <TransferModal
                                                transfer={selectedTransaction}
                                                onClose={() => {
                                                    setSelectedTransaction(null)
                                                    setModalType(null)
                                                }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
