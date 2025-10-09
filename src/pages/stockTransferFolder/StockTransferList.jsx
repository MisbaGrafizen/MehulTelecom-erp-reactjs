"use client"

import { useEffect, useMemo, useState } from "react"

import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar,
    FileSpreadsheet,
    Filter,
    IndianRupee,
    MoreVertical,
    Printer,
    Search,
    Eye,
    Download,
    Edit3,
    Trash2,
    Building2,
    MapPin,
} from "lucide-react"
import { Dropdown, Modal, Toast, Badge } from "../../Component/Uikit"
import { companies } from "../../data/companies"
import { loadTransfers, removeTransfer, updateTransfer } from "../../lib/transferstore"
import { useNavigate } from "react-router-dom"
import Header from "../../Component/header/Header"
import SideBar from "../../Component/sidebar/SideBar"

function formatINR(n) {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    } catch {
        return `₹ ${n}`
    }
}
function formatDate(d) {
    const dt = typeof d === "string" ? new Date(d) : d
    return dt.toLocaleDateString("en-GB")
}
function toISODate(d) {
    const dt = typeof d === "string" ? new Date(d) : d
    const yyyy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, "0")
    const dd = String(dt.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}
function addDays(d, days) {
    const dt = new Date(d)
    dt.setDate(dt.getDate() + days)
    return dt
}
function startOfMonth(d = new Date()) {
    const dt = new Date(d)
    dt.setDate(1)
    return dt
}
function endOfMonth(d = new Date()) {
    const dt = new Date(d)
    dt.setMonth(dt.getMonth() + 1)
    dt.setDate(0)
    return dt
}

function Kebab({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <button className="rounded p-1.5 hover:bg-gray-100" onClick={() => setOpen((v) => !v)} aria-label="More">
                <MoreVertical size={16} />
            </button>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 z-40 mt-1 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                    >
                        <button
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                                setOpen(false)
                                onEdit?.()
                            }}
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                        <button
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                            onClick={() => {
                                setOpen(false)
                                onDelete?.()
                            }}
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

export default function StockTransferList() {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [period, setPeriod] = useState("thisMonth")
    const [from, setFrom] = useState(toISODate(startOfMonth(new Date())))
    const [to, setTo] = useState(toISODate(endOfMonth(new Date())))
    const [query, setQuery] = useState("")
    const [company, setCompany] = useState(null)
    const [branch, setBranch] = useState(null)
    const [viewMode, setViewMode] = useState("table")
    const [toast, setToast] = useState("")
    const [viewRow, setViewRow] = useState(null)
    const [editRow, setEditRow] = useState(null)
    const [confirmRow, setConfirmRow] = useState(null)


    const handleAdd = () => {

        navigate("/stock-transfer")
    }


    useEffect(() => {
        setList(loadTransfers())
    }, [])

    useEffect(() => {
        if (period === "custom") return
        const now = new Date()
        if (period === "today") {
            setFrom(toISODate(now))
            setTo(toISODate(now))
        } else if (period === "thisWeek") {
            const day = now.getDay() || 7
            const start = addDays(now, 1 - day)
            const end = addDays(start, 6)
            setFrom(toISODate(start))
            setTo(toISODate(end))
        } else if (period === "thisMonth") {
            setFrom(toISODate(startOfMonth(now)))
            setTo(toISODate(endOfMonth(now)))
        }
    }, [period])

    const filtered = useMemo(() => {
        const s = query.trim().toLowerCase()
        const f = new Date(from)
        const t = addDays(new Date(to), 1)
        return list.filter((r) => {
            const d = new Date(r.date)
            if (!(d >= f && d < t)) return false
            if (company && r.company?.id !== company) return false
            if (branch && r.fromBranch?.id !== branch && r.toBranch?.id !== branch) return false
            if (!s) return true
            const hay = `${r.transferNo} ${r.company?.name} ${r.fromBranch?.name} ${r.toBranch?.name} ${r.items
                .map((i) => `${i.type} ${i.name} ${i.imei || i.serial || ""}`)
                .join(" ")}`.toLowerCase()
            return hay.includes(s)
        })
    }, [list, from, to, company, branch, query])

    const totals = useMemo(() => {
        const total = filtered.reduce((sum, r) => sum + (r.total || 0), 0)
        const pending = filtered
            .filter((r) => r.status !== "Transferred" && r.status !== "Received")
            .reduce((s, r) => s + (r.total || 0), 0)
        const transferred = total - pending
        return { total, pending, transferred }
    }, [filtered])

    function exportCSV() {
        const headers = ["Date", "Transfer No", "Company", "From Branch", "To Branch", "Items", "Total", "Status"].join(",")
        const lines = filtered
            .map((r) =>
                [
                    formatDate(r.date),
                    r.transferNo,
                    r.company?.name,
                    r.fromBranch?.name,
                    r.toBranch?.name,
                    r.items.length,
                    r.total,
                    r.status,
                ]
                    .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n")
        const blob = new Blob([headers + "\n" + lines], { type: "text/csv;charset=utf-8;" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = "stock-transfers.csv"
        a.click()
        URL.revokeObjectURL(a.href)
        setToast("CSV exported")
    }

    function doPrint() {
        window.print()
    }

    function onEditSave(patch) {
        const updated = updateTransfer(editRow.id, patch)
        setList(updated)
        setEditRow(null)
        setToast("Transfer updated")
    }
    function onDelete() {
        const updated = removeTransfer(confirmRow.id)
        setList(updated)
        setConfirmRow(null)
        setToast("Transfer deleted")
    }

    return (
        <>

            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName="Stock Transfer" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">






                            <div className="   w-[100%]">
                                <header className="  flex justify-end">



                                    <div className="flex items-center gap-2">


                                    </div>

                                </header>

                                <section className="mx-auto pt-[0px]">
                                    <div className=" flex justify-between items-center ">


                                        <div className="flex flex-wrap items-center gap-3">
                                            <Dropdown
                                                label={
                                                    period === "today"
                                                        ? "Today"
                                                        : period === "thisWeek"
                                                            ? "This Week"
                                                            : period === "thisMonth"
                                                                ? "This Month"
                                                                : "Custom"
                                                }
                                                options={["Today", "This Week", "This Month", "Custom"]}
                                                value={
                                                    period === "today"
                                                        ? "Today"
                                                        : period === "thisWeek"
                                                            ? "This Week"
                                                            : period === "thisMonth"
                                                                ? "This Month"
                                                                : "Custom"
                                                }
                                                onChange={(opt) => {
                                                    const map = { Today: "today", "This Week": "thisWeek", "This Month": "thisMonth", Custom: "custom" }
                                                    setPeriod(map[opt] || "thisMonth")
                                                }}
                                                leadingIcon={<Calendar size={16} className="text-blue-600" />}
                                            />

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={from}
                                                    onChange={(e) => {
                                                        setFrom(e.target.value)
                                                        setPeriod("custom")
                                                    }}
                                                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                                />
                                                <span className="text-sm font-semibold text-slate-600">To</span>
                                                <input
                                                    type="date"
                                                    value={to}
                                                    onChange={(e) => {
                                                        setTo(e.target.value)
                                                        setPeriod("custom")
                                                    }}
                                                    className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                                                />
                                            </div>

                                            <Dropdown
                                                label={company ? companies.find((c) => c.id === company)?.name : "All Companies"}
                                                options={companies.map((c) => ({ label: c.name, value: c.id }))}
                                                value={company}
                                                onChange={(v) => setCompany(v)}
                                                leadingIcon={<Building2 size={16} className="text-slate-600" />}
                                            />
                                            <Dropdown
                                                label={branch ? companies.flatMap((c) => c.branches).find((b) => b.id === branch)?.name : "All Branches"}
                                                options={companies.flatMap((c) => c.branches).map((b) => ({ label: b.name, value: b.id }))}
                                                value={branch}
                                                onChange={(v) => setBranch(v)}
                                                leadingIcon={<MapPin size={16} className="text-slate-600" />}
                                            />



                                        </div>


                                        <button
                                            onClick={handleAdd}
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-[15px] font-[600] text-white hover:bg-blue-700"
                                        >

                                            <i className="fa-solid fa-plus"></i>
                                            Create Transfer
                                        </button>

                                    </div>



                                    {/* Summary */}
                                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <motion.div
                                            initial={{ y: 8, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                                        >
                                            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
                                                <IndianRupee size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-emerald-700">Transferred</div>
                                                <div className="text-lg font-[600] text-emerald-900">{formatINR(totals.transferred)}</div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ y: 8, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.06 }}
                                            className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4"
                                        >
                                            <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white">
                                                <IndianRupee size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-blue-700">Pending</div>
                                                <div className="text-lg font-[600] text-blue-900">{formatINR(totals.pending)}</div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ y: 8, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.12 }}
                                            className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                                        >
                                            <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-500 text-white">
                                                <IndianRupee size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-amber-700">Total</div>
                                                <div className="text-lg font-[600] text-amber-900">{formatINR(totals.total)}</div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Search + toggle */}
                                    <div className="mt-6 mb-2 flex items-center justify-between">
                                        <h3 className="text-sm font-black tracking-wide text-slate-800">TRANSACTIONS</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                                <input
                                                    placeholder="Search"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    className="w-64 rounded-xl border border-slate-300 pl-7 pr-3 py-2 text-sm"
                                                />
                                            </div>
                                            <button
                                                className={
                                                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold " +
                                                    (viewMode === "table" ? "border-slate-300" : "border-blue-600 bg-blue-600 text-white")
                                                }
                                                onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                                            >
                                                <Filter size={16} />
                                                {viewMode === "table" ? "Cards View" : "Table View"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table or cards */}
                                    {viewMode === "table" ? (
                                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                            <div className="max-h-[520px] overflow-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left">Date</th>
                                                            <th className="px-3 py-2 text-left">Transfer No</th>
                                                            <th className="px-3 py-2 text-left">Company</th>
                                                            <th className="px-3 py-2 text-left">From</th>
                                                            <th className="px-3 py-2 text-left">To</th>
                                                            <th className="px-3 py-2 text-right">Items</th>
                                                            <th className="px-3 py-2 text-right">Total</th>
                                                            <th className="px-3 py-2 text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        <AnimatePresence initial={false}>
                                                            {filtered.map((r) => (
                                                                <motion.tr
                                                                    key={r.id}
                                                                    initial={{ opacity: 0, y: 8 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -6 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="hover:bg-slate-50"
                                                                >
                                                                    <td className="px-3 py-2">{formatDate(r.date)}</td>
                                                                    <td className="px-3 py-2">{r.transferNo}</td>
                                                                    <td className="px-3 py-2">{r.company?.name}</td>
                                                                    <td className="px-3 py-2">{r.fromBranch?.name}</td>
                                                                    <td className="px-3 py-2">{r.toBranch?.name}</td>
                                                                    <td className="px-3 py-2 text-right">{r.items.length}</td>
                                                                    <td className="px-3 py-2 text-right">{formatINR(r.total || 0)}</td>
                                                                    <td className="px-2 py-2">
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            <Badge
                                                                                tone={r.status === "Transferred" ? "green" : r.status === "Received" ? "blue" : "amber"}
                                                                            >
                                                                                {r.status || "Draft"}
                                                                            </Badge>
                                                                            <button
                                                                                className="rounded p-1.5 hover:bg-gray-100"
                                                                                onClick={() => setViewRow(r)}
                                                                                title="View"
                                                                            >
                                                                                <Eye size={16} />
                                                                            </button>
                                                                            <button
                                                                                className="rounded p-1.5 hover:bg-gray-100"
                                                                                onClick={() => window.print()}
                                                                                title="Print"
                                                                            >
                                                                                <Printer size={16} />
                                                                            </button>
                                                                            <button
                                                                                className="rounded p-1.5 hover:bg-gray-100"
                                                                                onClick={() => setToast("Download started")}
                                                                                title="Download"
                                                                            >
                                                                                <Download size={16} />
                                                                            </button>
                                                                            <Kebab onEdit={() => setEditRow(r)} onDelete={() => setConfirmRow(r)} />
                                                                        </div>
                                                                    </td>
                                                                </motion.tr>
                                                            ))}
                                                        </AnimatePresence>
                                                        {filtered.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={8} className="px-3 py-10 text-center text-slate-500">
                                                                    No transfers match your filters.
                                                                </td>
                                                            </tr>
                                                        ) : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {filtered.map((r) => (
                                                <motion.div
                                                    key={r.id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="text-xs text-slate-500">{formatDate(r.date)}</div>
                                                            <div className="text-sm font-[600]">{r.transferNo}</div>
                                                            <div className="text-xs text-slate-500">{r.company?.name}</div>
                                                        </div>
                                                        <Badge tone={r.status === "Transferred" ? "green" : r.status === "Received" ? "blue" : "amber"}>
                                                            {r.status || "Draft"}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                                        <div className="text-slate-500">From</div>
                                                        <div className="text-slate-800">{r.fromBranch?.name}</div>
                                                        <div className="text-slate-500">To</div>
                                                        <div className="text-slate-800">{r.toBranch?.name}</div>
                                                        <div className="text-slate-500">Items</div>
                                                        <div className="text-slate-800">{r.items.length}</div>
                                                        <div className="text-slate-500">Total</div>
                                                        <div className="text-slate-800">{formatINR(r.total || 0)}</div>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-end gap-1">
                                                        <button className="rounded p-1.5 hover:bg-gray-100" onClick={() => setViewRow(r)} title="View">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="rounded p-1.5 hover:bg-gray-100" onClick={() => window.print()} title="Print">
                                                            <Printer size={16} />
                                                        </button>
                                                        <button
                                                            className="rounded p-1.5 hover:bg-gray-100"
                                                            onClick={() => setToast("Download started")}
                                                            title="Download"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <Kebab onEdit={() => setEditRow(r)} onDelete={() => setConfirmRow(r)} />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* View modal */}
                                <Modal open={!!viewRow} title="Transfer Details" onClose={() => setViewRow(null)}>
                                    {viewRow ? (
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <div className="text-slate-500">Date</div>
                                                    <div className="font-semibold">{formatDate(viewRow.date)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Transfer No</div>
                                                    <div className="font-semibold">{viewRow.transferNo}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Company</div>
                                                    <div className="font-semibold">{viewRow.company?.name}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500">Status</div>
                                                    <div className="font-semibold">{viewRow.status}</div>
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-slate-200 p-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-600">From Branch</div>
                                                        <div className="font-semibold">{viewRow.fromBranch?.name}</div>
                                                        <div className="text-xs text-slate-500">{viewRow.fromBranch?.address}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-600">To Branch</div>
                                                        <div className="font-semibold">{viewRow.toBranch?.name}</div>
                                                        <div className="text-xs text-slate-500">{viewRow.toBranch?.address}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-600 mb-2">Items</div>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full text-xs">
                                                        <thead>
                                                            <tr className="bg-slate-100 text-slate-700">
                                                                <th className="px-2 py-1 text-left">Type</th>
                                                                <th className="px-2 py-1 text-left">Name</th>
                                                                <th className="px-2 py-1 text-left">IMEI/Serial</th>
                                                                <th className="px-2 py-1 text-right">Qty</th>
                                                                <th className="px-2 py-1 text-right">Price</th>
                                                                <th className="px-2 py-1 text-right">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {viewRow.items.map((it, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="px-2 py-1">{it.type}</td>
                                                                    <td className="px-2 py-1">{it.name}</td>
                                                                    <td className="px-2 py-1">{it.imei || it.serial || "-"}</td>
                                                                    <td className="px-2 py-1 text-right">{it.qty}</td>
                                                                    <td className="px-2 py-1 text-right">{formatINR(it.price)}</td>
                                                                    <td className="px-2 py-1 text-right">{formatINR(it.amount)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-2 text-right text-sm font-[600]">Total: {formatINR(viewRow.total || 0)}</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </Modal>

                                {/* Edit modal */}
                                <Modal open={!!editRow} title="Edit Transfer" onClose={() => setEditRow(null)}>
                                    {editRow ? <EditTransferForm row={editRow} onSave={onEditSave} /> : null}
                                </Modal>

                                {/* Delete confirm */}
                                <Modal open={!!confirmRow} title="Delete Transfer" onClose={() => setConfirmRow(null)} width="max-w-md">
                                    <p className="text-sm text-slate-700">This action will permanently delete {confirmRow?.transferNo}.</p>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => setConfirmRow(null)}
                                            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={onDelete}
                                            className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Modal>

                                <Toast message={toast} onDismiss={() => setToast("")} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>








        </>
    )
}

function EditTransferForm({ row, onSave }) {
    const [status, setStatus] = useState(row.status || "Draft")
    const [note, setNote] = useState(row.note || "")

    return (
        <form
            className="grid gap-3"
            onSubmit={(e) => {
                e.preventDefault()
                onSave({ status, note })
            }}
        >
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2"
                >
                    {["Draft", "Transferred", "Received"].map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </label>
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Note</span>
                <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-2"
                    placeholder="Optional note..."
                />
            </label>
            <div className="mt-2 flex justify-end gap-2">
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                    Save
                </button>
            </div>
        </form>
    )
}
