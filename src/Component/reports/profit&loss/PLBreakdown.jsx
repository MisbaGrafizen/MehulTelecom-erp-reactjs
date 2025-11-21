'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Boxes, Wallet, Receipt, Percent } from 'lucide-react'
import PLRow from './PLRow'
import PLSectionTitle from './PLSectionTitle'

export default function PLBreakdown({ breakdown }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const SectionHeader = ({ icon: Icon, title, color }) => (
    <motion.div
      variants={itemVariants}
      className={`flex items-center gap-2 px-5 py-3 ${color.bg} ${color.text} border-b`}
    >
      <Icon className="w-4 h-4 opacity-75" />
      <PLSectionTitle title={title} />
    </motion.div>
  )

  const SectionBox = ({ header, color, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <SectionHeader {...header} color={color} />
      <div className="p-4 space-y-2">{children}</div>
    </div>
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
    >
      {/* GRID 1 → PARTICULARS + STOCK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <SectionBox
          header={{
            icon: Receipt,
            title: 'Particulars',
          }}
          color={{ bg: 'bg-blue-100', text: 'text-blue-800' }}
        >
          {/* <PLRow label="Sale" amount={45200000} positive />
          <PLRow label="Sale FA" amount={8500000} positive />
          <PLRow label="Cr. Note / Sale Return" amount={250000} negative />
          <PLRow label="Purchase" amount={28500000} negative />
          <PLRow label="Purchase FA" amount={5200000} negative />
          <PLRow label="Dr. Note / Purchase Return" amount={320000} positive />
          <PLRow label="Payment Out Discount" amount={150000} positive /> */}

{breakdown?.particulars?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}


        </SectionBox>

        <SectionBox
          header={{
            icon: Boxes,
            title: 'Stock',
          }}
          color={{ bg: 'bg-sky-100', text: 'text-sky-800' }}
        >
          {/* <PLRow label="Opening Stock" amount={5200000} negative />
          <PLRow label="Closing Stock" amount={6100000} positive />
          <PLRow label="Opening FA Stock" amount={800000} negative />
          <PLRow label="Closing FA Stock" amount={950000} positive /> */}
{breakdown?.stock?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}
  

        </SectionBox>
      </div>

      {/* GRID 2 → DIRECT EXPENSES + TAX PAYABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <SectionBox
          header={{
            icon: TrendingDown,
            title: 'Direct Expenses',
          }}
          color={{ bg: 'bg-pink-100', text: 'text-pink-800' }}
        >
          {/* <PLRow label="Other Direct Expense" amount={450000} negative />
          <PLRow label="Payment In Discount" amount={75000} negative /> */}
{breakdown?.directExpenses?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}


        </SectionBox>

        <SectionBox
          header={{
            icon: Percent,
            title: 'Tax Payable',
          }}
          color={{ bg: 'bg-amber-100', text: 'text-amber-800' }}
        >
          {/* <PLRow label="GST Payable" amount={280000} negative />
          <PLRow label="TCS Payable" amount={45000} negative />
          <PLRow label="TDS Payable" amount={120000} negative /> */}
{breakdown?.taxPayable?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}


        </SectionBox>
      </div>

      {/* GRID 3 → TAX RECEIVABLE + OTHER INCOME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <SectionBox
          header={{
            icon: Percent,
            title: 'Tax Receivable',
          }}
          color={{ bg: 'bg-emerald-100', text: 'text-emerald-800' }}
        >
          {/* <PLRow label="GST Receivable" amount={95000} positive />
          <PLRow label="TCS Receivable" amount={28000} positive />
          <PLRow label="TDS Receivable" amount={52000} positive /> */}
{breakdown?.taxReceivable?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}

        </SectionBox>

        <SectionBox
          header={{
            icon: Wallet,
            title: 'Other Income',
          }}
          color={{ bg: 'bg-lime-100', text: 'text-lime-800' }}
        >
          {/* <PLRow label="Other Income" amount={85000} positive /> */}
{breakdown?.otherIncome?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}


        </SectionBox>
      </div>

      {/* GROSS PROFIT (Full Width) */}
      <motion.div
        variants={itemVariants}
        className="mx-4 my-6 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 shadow-md"
      >
        <div className="flex justify-between items-center">
          <span className="uppercase text-sm font-semibold opacity-90">Gross Profit</span>
          {/* <span className="text-2xl md:text-3xl font-bold">₹18,45,000</span> */}
          <span className="text-2xl md:text-3xl font-bold">₹{breakdown?.grossProfit || 0}</span>
        </div>
      </motion.div>

      {/* GRID 4 → INDIRECT EXPENSES + (Future placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <SectionBox
          header={{
            icon: TrendingDown,
            title: 'Indirect Expenses',
          }}
          color={{ bg: 'bg-rose-100', text: 'text-rose-800' }}
        >
          {/* <PLRow label="Other Expense" amount={250000} negative />
          <PLRow label="Loan Interest Expense" amount={180000} negative />
          <PLRow label="Loan Processing Fee Expense" amount={35000} negative />
          <PLRow label="Charges on Loan Expenses" amount={25000} negative /> */}
{breakdown?.indirectExpenses?.map((row, i) => (
  <PLRow
    key={i}
    label={row.label}
    amount={row.amount}
    positive={row.amount >= 0}
    negative={row.amount < 0}
  />
))}


        </SectionBox>

        <div className="bg-white rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
          Future Section
        </div>
      </div>

      {/* NET PROFIT (Full Width) */}
      <motion.div
        variants={itemVariants}
        className="m-5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm uppercase font-bold tracking-wide">Net Profit</span>
          {/* <span className="text-3xl font-bold">₹17,95,000</span> */}
          <span className="text-3xl font-bold">₹{breakdown?.netProfit || 0}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
