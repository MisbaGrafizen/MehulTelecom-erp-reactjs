"use client"

import { useState, useMemo } from "react"
import FilterSection from "../../../Component/reports/partyReports/alllParty/FilterSection"
import PartyTable from "../../../Component/reports/partyReports/salePurchaseByParty/PartyTable"
import PartySalePurchaseModal from "../../../Component/reports/partyReports/salePurchaseByParty/modal/PartySalePurchaseModal"
import SideBar from "../../../Component/sidebar/SideBar"
import Header from "../../../Component/header/Header"

const sampleParties = [
  {
    id: 1,
    name: "Raj Electronics",
    phone: "+91 98765 43210",
    email: "raj@electronics.com",
    address: "123 Market Street, Mumbai",
    creditLimit: 100000,
    openingBalance: 5000,
    totalSale: 450000,
    totalPurchase: 250000,
    sales: [
      {
        id: 1,
        date: "2024-11-15",
        time: "14:30",
        invoiceNo: "INV-2024-001",
        amount: 75000,
        paymentMode: "Credit Card",
        items: [{ name: "iPhone 15 Pro", imei: "123456789012345", qty: 2, rate: 37500, total: 75000 }],
      },
    ],
    purchases: [
      {
        id: 1,
        date: "2024-11-14",
        time: "10:15",
        billNo: "BILL-2024-001",
        amount: 120000,
        paymentMode: "Bank Transfer",
        items: [{ name: "Samsung Galaxy S24", imei: "987654321098765", qty: 3, rate: 40000, total: 120000 }],
      },
    ],
  },
  {
    id: 2,
    name: "Mobile Hub",
    phone: "+91 98123 45678",
    email: "info@mobilehub.com",
    address: "456 Shop Complex, Delhi",
    creditLimit: 150000,
    openingBalance: 10000,
    totalSale: 650000,
    totalPurchase: 380000,
    sales: [
      {
        id: 2,
        date: "2024-11-15",
        time: "11:20",
        invoiceNo: "INV-2024-002",
        amount: 125000,
        paymentMode: "Cash",
        items: [{ name: "OnePlus 12", imei: "111111111111111", qty: 5, rate: 25000, total: 125000 }],
      },
    ],
    purchases: [
      {
        id: 2,
        date: "2024-11-13",
        time: "09:45",
        billNo: "BILL-2024-002",
        amount: 95000,
        paymentMode: "Credit Card",
        items: [{ name: "Mi 14 Ultra", imei: "222222222222222", qty: 2, rate: 47500, total: 95000 }],
      },
    ],
  },
  {
    id: 3,
    name: "Tech Store",
    phone: "+91 99876 54321",
    email: "contact@techstore.com",
    address: "789 Business Park, Bangalore",
    creditLimit: 200000,
    openingBalance: 15000,
    totalSale: 520000,
    totalPurchase: 310000,
    sales: [
      {
        id: 3,
        date: "2024-11-15",
        time: "15:45",
        invoiceNo: "INV-2024-003",
        amount: 95000,
        paymentMode: "Online Transfer",
        items: [{ name: "Google Pixel 8", imei: "333333333333333", qty: 2, rate: 47500, total: 95000 }],
      },
    ],
    purchases: [
      {
        id: 3,
        date: "2024-11-14",
        time: "14:20",
        billNo: "BILL-2024-003",
        amount: 140000,
        paymentMode: "Check",
        items: [{ name: "Vivo X100", imei: "444444444444444", qty: 4, rate: 35000, total: 140000 }],
      },
    ],
  },
]

export default function PartySalePurchase() {
  const [selectedParty, setSelectedParty] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModalParty, setSelectedModalParty] = useState(null)

  // ✅ Filter list by search
  const filteredParties = useMemo(() => {
    return sampleParties.filter((party) =>
      party.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const partyOptions = sampleParties.map((p) => ({ label: p.name, value: p.id }))

  return (

    <>

       <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
          <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
            <Header pageName=" Sale / Purchase by Party" />
            <div className="flex gap-[10px] w-full h-full">
              <SideBar />
              <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
    <div className=" w-[100%] h-[100%]">
      <div className="w-[100%]">
        {/* 🔹 Filter Section */}
        <FilterSection
          selectedParty={selectedParty}
          setSelectedParty={setSelectedParty}
          partyOptions={partyOptions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 🔹 Show Table when party selected */}
        {selectedParty ? (
          <PartyTable
            party={sampleParties.find((p) => p.id === selectedParty)}
            onViewClick={setSelectedModalParty}
          />
        ) : (
          <div className="text-center text-slate-500 py-10">
            Please select a party to view sale/purchase details.
          </div>
        )}
      </div>

      {/* 🔹 Modal */}
      {selectedModalParty && (
        <PartySalePurchaseModal
          party={selectedModalParty}
          onClose={() => setSelectedModalParty(null)}
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
