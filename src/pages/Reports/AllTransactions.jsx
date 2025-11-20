'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import FilterSection from '../../Component/reports/allTransections/FilterSection'
import KpiCards from '../../Component/reports/allTransections/KpiCards'
import TransactionList from '../../Component/reports/allTransections/TransactionList'
import TransactionModal from '../../Component/reports/modals/TransactionModal'
import Header from '../../Component/header/Header'
import SideBar from '../../Component/sidebar/SideBar'

const sampleTransactions = [
    {
        id: 1,
        date: '2024-01-15',
        time: '10:30 AM',
        partyName: 'Apple Store Mumbai',
        type: 'Sale',
        amount: 45000,
        invoiceNo: 'INV-2024-001',
        items: [
            { product: 'iPhone 15 Pro', imei: '123456789012345', qty: 2, rate: 20000, total: 40000 },
            { product: 'AirPods Pro', imei: 'N/A', qty: 1, rate: 5000, total: 5000 }
        ],
        paymentMode: 'Credit Card',
        salesman: 'Raj Kumar'
    },
    {
        id: 2,
        date: '2024-01-15',
        time: '02:15 PM',
        partyName: 'Samsung Distributor',
        type: 'Purchase',
        amount: 120000,
        invoiceNo: 'PO-2024-045',
        items: [
            { product: 'Galaxy S24', imei: '987654321098765', qty: 5, rate: 20000, total: 100000 },
            { product: 'Galaxy Tab', imei: '111111111111111', qty: 4, rate: 5000, total: 20000 }
        ],
        paymentMode: 'Bank Transfer',
        supplier: 'Samsung India'
    },
    {
        id: 3,
        date: '2024-01-15',
        time: '04:45 PM',
        partyName: 'Delhi Branch',
        type: 'Transfer',
        amount: 35000,
        invoiceNo: 'TR-2024-012',
        fromBranch: 'Mumbai HQ',
        toBranch: 'Delhi Branch',
        items: [
            { product: 'iPhone 14', imei: '555555555555555', qty: 3, rate: 10000, total: 30000 },
            { product: 'OnePlus 12', imei: '666666666666666', qty: 1, rate: 5000, total: 5000 }
        ]
    },
    {
        id: 4,
        date: '2024-01-14',
        time: '11:20 AM',
        partyName: 'Retail Shop Kolkata',
        type: 'Sale',
        amount: 28500,
        invoiceNo: 'INV-2024-002',
        items: [
            { product: 'Xiaomi Redmi', imei: '777777777777777', qty: 3, rate: 8000, total: 24000 },
            { product: 'Charging Cable', imei: 'N/A', qty: 5, rate: 900, total: 4500 }
        ],
        paymentMode: 'Cash',
        salesman: 'Priya Singh'
    },
    {
        id: 5,
        date: '2024-01-14',
        time: '03:30 PM',
        partyName: 'Vivo Supplier',
        type: 'Purchase',
        amount: 85000,
        invoiceNo: 'PO-2024-046',
        items: [
            { product: 'Vivo X100', imei: '888888888888888', qty: 4, rate: 20000, total: 80000 },
            { product: 'Vivo Case', imei: 'N/A', qty: 10, rate: 500, total: 5000 }
        ],
        paymentMode: 'Cheque',
        supplier: 'Vivo Distribution'
    }
]

export default function AllTransactions() {
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [transactions, setTransactions] = useState(sampleTransactions)
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        type: 'All Types',
        party: 'All Parties',
        search: ''
    })

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
        // Filter logic would go here
    }

    const filteredTransactions = transactions.filter(tx => {
        if (filters.type !== 'All Types' && tx.type !== filters.type) return false
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            return (
                tx.invoiceNo.toLowerCase().includes(searchLower) ||
                tx.partyName.toLowerCase().includes(searchLower)
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
                <FilterSection filters={filters} onFilterChange={handleFilterChange} />

                <KpiCards
                    totalTransactions={totalTransactions}
                    totalAmount={totalAmount}
                    todayTransactions={todayTransactions}
                />

                <TransactionList
                    transactions={filteredTransactions}
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
