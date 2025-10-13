"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar,
    ChevronDown,
    Filter,
    Search,
    Upload,
    Plus,
    Share2,
    FileSpreadsheet,
    Printer,
    MoreVertical,
    Edit3,
    Trash2,
    CreditCard,
    IndianRupee,
    Building2,
    Users,
    X,
    Check,
    Eye,
    Download,
} from "lucide-react"
import Header from "../../Component/header/Header"
import SideBar from "../../Component/sidebar/SideBar"
import { useNavigate } from "react-router-dom"
import { ApiDelete, ApiGet, ApiPut } from "../../helper/axios"
import PurchaseDetailsModal from "../../Component/purchaseCom/PurchaseDetailsModal"; 

function cn(...a) {
    return a.filter(Boolean).join(" ")
}

function formatINR(n) {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    } catch {
        return `₹ ${n}`
    }
}

function formatDate(d) {
    const dt = typeof d === "string" ? new Date(d) : d
    return dt?.toLocaleDateString("en-GB")
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

const firms = ["Main Firm", "Branch A", "Branch B"]
const users = ["Amit", "Riya", "Priya"]
const paymentTypes = ["Cash", "UPI", "Bank"]

function Dropdown({ label, icon, options = [], value, onChange, className }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
            >
                {icon}
                <span className="truncate">{label ? label : (value ?? "Select")}</span>
                <ChevronDown size={16} className="text-gray-500" />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.16 }}
                        className="absolute z-30 mt-2 max-h-64 w-52 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                    >
                        <li>
                            <button
                                className={cn(
                                    "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100",
                                    value == null && "bg-red-50/40",
                                )}
                                onClick={() => {
                                    onChange?.(null)
                                    setOpen(false)
                                }}
                            >
                                All
                            </button>
                        </li>
                        {options.map((opt) => (
                            <li key={opt}>
                                <button
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100",
                                        value === opt && "bg-red-50",
                                    )}
                                    onClick={() => {
                                        onChange?.(opt)
                                        setOpen(false)
                                    }}
                                >
                                    <span className="truncate">{opt}</span>
                                    {value === opt ? <Check size={16} className="text-red-600" /> : null}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

function KebabMenu({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="relative">
            <button
                className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setOpen((v) => !v)}
                aria-label="Row actions"
            >
                <MoreVertical size={18} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 z-40 mt-1 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                    >
                        <button
                            onClick={() => {
                                setOpen(false)
                                onEdit?.()
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                setOpen(false)
                                onDelete?.()
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Modal({ open, title, onClose, children, width = "max-w-xl" }) {
    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        className={cn("w-full rounded-2xl bg-white p-5 shadow-xl", width)}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-lg font-[700] text-gray-900">{title}</h4>
                            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100" aria-label="Close">
                                <X size={18} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

function Toast({ message, onDismiss }) {
    return (
        <AnimatePresence>
            {message ? (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    className="fixed bottom-4 left-1/2 z-[120] -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                >
                    {message}
                    <button onClick={onDismiss} className="ml-3 rounded bg-white/10 px-2 py-0.5">
                        Dismiss
                    </button>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

export default function Purchasemain() {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [period, setPeriod] = useState("thisMonth") // today|thisWeek|thisMonth|custom
    const [from, setFrom] = useState(toISODate(startOfMonth(new Date())))
    const [to, setTo] = useState(toISODate(endOfMonth(new Date())))
    const [firm, setFirm] = useState(null)
    const [user, setUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [payFilter, setPayFilter] = useState(null) // Cash/UPI/Bank
    const [viewMode, setViewMode] = useState("table") // table|cards
    const [shareDot, setShareDot] = useState(true)
    const [toast, setToast] = useState("")
    const [editRow, setEditRow] = useState(null)
    const [confirmRow, setConfirmRow] = useState(null)
    const [firms, setFirms] = useState([])
    const [users, setUsers] = useState([])
    const paymentTypes = ["Cash", "Bank", "UPI", "Online", "Credit"];
    const [selectedRow, setSelectedRow] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);




const handleRowClick = (row) => {
  setSelectedRow(row);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedRow(null);
};
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const purchaseRes = await ApiGet("/admin/purchase")
                console.log('purchaseRes', purchaseRes)
                if (purchaseRes?.data && Array.isArray(purchaseRes.data)) {
                    setRows(purchaseRes.data)
                } else if (Array.isArray(purchaseRes)) {
                    setRows(purchaseRes)
                } else {
                    setRows([])
                }


                const companyRes = await ApiGet("/admin/info")
                console.log('companyRes', companyRes)
                if (companyRes?.data) {
                    const firmNames = companyRes.data?.map(c => c.firmName)
                    setFirms(firmNames)
                }

                const userRes = await ApiGet("/admin/party")
                console.log('userRes', userRes)
                if (userRes?.data) {
                    const userNames = userRes.data.map(u => u.partyName)
                    setUsers(userNames)
                }

            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])


    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true)
                const res = await ApiGet("/admin/purchase")
                console.log('res', res)
                if (res) {
                    setRows(res)
                }
            } catch (error) {
                console.error("Error fetching purchases:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPurchases()
    }, [])

    const filtered = useMemo(() => {
        let result = [...rows]

        if (firm) {
            result = result.filter((r) => {
                const firmName = r.companyId?.firmName || r.firmName || ""
                return firmName.toLowerCase() === firm.toLowerCase()
            })
        }

        if (user) {
            result = result.filter((r) => {
                const userName = r.partyId?.partyName || r.userName || ""
                return userName.toLowerCase() === user.toLowerCase()
            })
        }
        if (payFilter) {
            result = result.filter(r => r.paymentType?.toLowerCase() === payFilter.toLowerCase())
        }

        const search = searchTerm.trim()?.toLowerCase()
        if (search) {
            result = result.filter(r =>
                `${r.billNumber} ${r.partyId?.partyName} ${r.paymentType}`.toLowerCase().includes(search)
            )
        }

        // Date filter
        const fDate = new Date(from)
        const tDate = new Date(to)
        result = result.filter(r => {
            const d = new Date(r.billDate)
            return d >= fDate && d <= tDate
        })

        return result
    }, [rows, from, to, firm, user, payFilter, searchTerm])


    const handleDelete = async (id) => {
        try {
            await ApiDelete(`/admin/purchase/${id}`)
            setRows(prev => prev.filter(r => r._id !== id))
            setConfirmRow(null)
            setToast("Purchase deleted successfully")
        } catch (error) {
            console.error("❌ Error deleting purchase:", error)
        }
    }


    const handleSaveEdit = async (updated) => {
        try {
            await ApiPut(`/admin/purchase/${updated._id}`, updated)
            setRows(prev => prev.map(r => r._id === updated._id ? updated : r))
            setEditRow(null)
            setToast("Purchase updated successfully")
        } catch (error) {
            console.error("❌ Error updating purchase:", error)
        }
    }




    const navigate = useNavigate()


    const handleCreate = () => {
        navigate("/purches-invoice")
    }
    // Period shortcuts
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

    const totals = useMemo(() => {
        let paid = 0;
        let unpaid = 0;
        let total = 0;

        filtered.forEach((r) => {
            const totalAmt = Number(r.totalAmount) || 0;
            const paidAmt = Number(r.paidAmount) || 0;
            const unpaidAmt = Number(r.unpaidAmount) || Math.max(totalAmt - paidAmt, 0);

            total += totalAmt;
            paid += paidAmt;
            unpaid += unpaidAmt;
        });

        return { paid, unpaid, total };
    }, [filtered]);


    function exportCSV() {
        const headers = ["Date", "Invoice No", "Party", "Transaction", "Payment", "Amount", "Balance", "Firm", "User"].join(
            ",",
        )
        const lines = filtered
            .map((r) =>
                [
                    formatDate(r.date),
                    r.invoiceNo,
                    r.partyName,
                    r.transaction,
                    r.paymentType,
                    r.amount,
                    r.balance,
                    r.firm,
                    r.user,
                ]
                    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n")
        const csv = [headers, lines].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "purchase-bills.csv"
        link.click()
        URL.revokeObjectURL(link.href)
        setToast("CSV exported")
    }

    function doPrint() {
        window.print()
    }

    // function handleSaveEdit(updated) {
    //     setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
    //     setEditRow(null)
    //     setToast("Transaction updated")
    // }

    // function handleDelete(id) {
    //     setRows((prev) => prev.filter((r) => r.id !== id))
    //     setConfirmRow(null)
    //     setToast("Transaction deleted")
    // }

    // Row form for edit
    function EditForm({ row }) {
        const [form, setForm] = useState({
            id: row._id,
            date: row.billDate,
            partyName: row.partyId?.partyName,
            paymentType: row.paymentType,
            amount: row.totalAmount,
            isPaid: row.isPaid,
        })
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSaveEdit(form)
                }}
                className="grid gap-3"
            >
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-gray-700">Date</span>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-gray-700">Party Name</span>
                    <input
                        value={form.partyName}
                        onChange={(e) => setForm((s) => ({ ...s, partyName: e.target.value }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-gray-700">Payment Type</span>
                    <select
                        value={form.paymentType}
                        onChange={(e) => setForm((s) => ({ ...s, paymentType: e.target.value }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                        {paymentTypes.map((p) => (
                            <option key={p}>{p}</option>
                        ))}
                    </select>
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-gray-700">Amount</span>
                    <input
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm((s) => ({ ...s, amount: Number(e.target.value) }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </label>
                <label className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.isPaid}
                        onChange={(e) => setForm((s) => ({ ...s, isPaid: e.target.checked }))}
                    />
                    <span className="text-sm font-semibold text-gray-700">Mark as paid</span>
                </label>
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setEditRow(null)}
                        className="rounded-lg border border-gray-300 px-4 py-2 font-semibold"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white">
                        Save
                    </button>
                </div>
            </form>
        )
    }

    return (




        <>
            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName="Purchase" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">
                            <div className="flex flex-col gap-[15px] w-[100%]">
                                <div className=" ">


                                    <div className=" flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
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
                                            icon={<Calendar size={16} className="text-rose-600" />}
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
                                        />
                                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                                            Between
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="date"
                                                value={from}
                                                onChange={(e) => {
                                                    setFrom(e.target.value)
                                                    setPeriod("custom")
                                                }}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            />
                                            <span className="text-sm font-semibold text-gray-600">To</span>
                                            <input
                                                type="date"
                                                value={to}
                                                onChange={(e) => {
                                                    setTo(e.target.value)
                                                    setPeriod("custom")
                                                }}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div className="flex-1" />
                                        <div className="flex items-center gap-2">
                                            <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white" onClick={handleCreate}>
                                                <Plus size={16} />
                                                Create Purchase
                                            </button>
                                            <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
                                                <FileSpreadsheet size={16} />
                                                Excel
                                            </button>
                                            <button onClick={doPrint} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
                                                <Printer size={16} />
                                                Print
                                            </button>
                                        </div>
                                    </div>

                                    {/* secondary filters */}
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <Dropdown
                                            label={firm ? firm : "All Firms"}
                                            icon={<Building2 size={16} className="text-gray-500" />}
                                            options={firms}
                                            value={firm}
                                            onChange={setFirm}
                                        />
                                        <Dropdown
                                            label={user ? user : "All Users"}
                                            icon={<Users size={16} className="text-gray-500" />}
                                            options={users}
                                            value={user}
                                            onChange={setUser}
                                        />
                                        <Dropdown
                                            label={payFilter ? `Payment: ${payFilter}` : "Payment: All"}
                                            icon={<CreditCard size={16} className="text-gray-500" />}
                                            options={paymentTypes}
                                            value={payFilter}
                                            onChange={setPayFilter}
                                        />
                                    </div>

                                    {/* summary */}
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
                                                <div className="text-sm font-[600] text-emerald-700">Paid</div>
                                                <div className="text-lg font-[700] text-emerald-900">{formatINR(totals.paid)}</div>
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
                                                <div className="text-sm font-[600] text-blue-700">Unpaid</div>
                                                <div className="text-lg font-[700] text-blue-900">{formatINR(totals.unpaid)}</div>
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
                                                <div className="text-sm font-[600] text-amber-700">Total</div>
                                                <div className="text-lg font-[700] text-amber-900">{formatINR(totals.total)}</div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Transactions section */}
                                    <div className="mt-6 mb-[100px]">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-sm font-black tracking-wide text-gray-800">TRANSACTIONS</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                                    <input
                                                        placeholder="Search"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-64 rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm"
                                                    />
                                                </div>
                                                <button
                                                    className={cn(
                                                        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold",
                                                        viewMode === "table"
                                                            ? "border-gray-300 text-gray-700"
                                                            : "border-rose-600 bg-rose-600 text-white hover:bg-rose-700",
                                                    )}
                                                    onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                                                >
                                                    <Filter size={16} />
                                                    {viewMode === "table" ? "Cards View" : "Table View"}
                                                </button>
                                            </div>
                                        </div>

                                        {viewMode === "table" ? (
                                            <div className="overflow-hidden rounded-xl border bg-white shadow-xl  border-gray-200">
                                                <div className="max-h-[520px] overflow-auto">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="sticky top-0 !font-[500] z-10 bg-blue-100 text-gray-600">
                                                            <tr>
                                                                <th className="px-3 !font-[600] py-2 text-left">Date</th>
                                                                <th className="px-3 !font-[600] py-2 text-left">Invoice No.</th>
                                                                <th className="px-3 !font-[600] py-2 text-left">Party Name</th>
                                                                <th className="px-3  !font-[600] py-2 text-left">Transaction</th>
                                                                <th className="px-3 !font-[600] py-2 text-left">Payment</th>
                                                                <th className="px-3 !font-[600] py-2 text-right">Amount</th>
                                                                <th className="px-3 !font-[600] py-2 text-right">Balance</th>
                                                                <th className="px-3  !font-[600] py-2 text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            <AnimatePresence initial={false}>
                                                                {filtered.map((r) => (
                                                                    <motion.tr
                                                                        key={r._id}
                                                                        initial={{ opacity: 0, y: 8 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -6 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="hover:bg-gray-50"
 onClick={() => handleRowClick(r)}
                                                                    >
                                                                        <td className="px-3 py-2">{formatDate(r.billDate)}</td>
                                                                        <td className="px-3 py-2">{r.billNumber}</td>
                                                                        <td className="px-3 py-2">{r.partyId?.partyName}</td>
                                                                        <td className="px-3 py-2">{r.transaction}</td>
                                                                        <td className="px-3 py-2">{r.paymentType}</td>
                                                                        <td className="px-3 py-2 text-right">{formatINR(r.totalAmount)}</td>
                                                                        <td className="px-3 py-2 text-right">{r.balance}</td>
                                                                        <td className="px-2 py-2">
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <button className="rounded p-1.5 hover:bg-gray-100" aria-label="View">
                                                                                    <Eye size={16} />
                                                                                </button>
                                                                                <button className="rounded p-1.5 hover:bg-gray-100" aria-label="Print">
                                                                                    <Printer size={16} />
                                                                                </button>
                                                                                <button className="rounded p-1.5 hover:bg-gray-100" aria-label="Download">
                                                                                    <Download size={16} />
                                                                                </button>
                                                                                <KebabMenu onEdit={() => setEditRow(r)} onDelete={() => setConfirmRow(r)} />
                                                                            </div>
                                                                        </td>
                                                                    </motion.tr>
                                                                ))}
                                                            </AnimatePresence>
                                                            {filtered.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={8} className="px-3 py-10 text-center text-gray-500">
                                                                        No transactions match your filters.
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>




                                                    </table>







                                                    {isModalOpen && (
  <PurchaseDetailsModal
    open={isModalOpen}
    onClose={handleCloseModal}
    row={selectedRow}
  />
)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                {filtered.map((r) => (
                                                    <motion.div
                                                        key={r.id}
                                                        initial={{ opacity: 0, y: 8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <div className="text-xs text-gray-500">{formatDate(r.date)}</div>
                                                                <div className="text-sm font-[600]">{r.partyName}</div>
                                                                <div className="text-xs text-gray-500">{r.invoiceNo}</div>
                                                            </div>
                                                            <KebabMenu onEdit={() => setEditRow(r)} onDelete={() => setConfirmRow(r)} />
                                                        </div>
                                                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                                            <div className="text-gray-500">Transaction</div>
                                                            <div className="text-gray-800">{r.transaction}</div>
                                                            <div className="text-gray-500">Payment</div>
                                                            <div className="text-gray-800">{r.paymentType}</div>
                                                            <div className="text-gray-500">Amount</div>
                                                            <div className="text-gray-800">{formatINR(r.totalAmount)}</div>
                                                            <div className="text-gray-500">Balance</div>
                                                            <div className="text-gray-800">{r.balance}</div>
                                                        </div>
                                                        <div className="mt-3 flex items-center justify-end gap-1">
                                                            <button className="rounded p-1.5 hover:bg-gray-100" aria-label="View">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button className="rounded p-1.5 hover:bg-gray-100" aria-label="Print">
                                                                <Printer size={16} />
                                                            </button>
                                                            <button className="rounded p-1.5 hover:bg-gray-100" aria-label="Download">
                                                                <Download size={16} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Modals */}
                                    <Modal open={!!editRow} title="Edit Transaction" onClose={() => setEditRow(null)}>
                                        {editRow ? <EditForm row={editRow} /> : null}
                                    </Modal>

                                    <Modal open={!!confirmRow} title="Delete Transaction" onClose={() => setConfirmRow(null)} width="max-w-md">
                                        <p className="text-sm text-gray-700">
                                            Are you sure you want to delete transaction <span className="font-semibold">{confirmRow?.invoiceNo}</span>?
                                            This action cannot be undone.
                                        </p>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => setConfirmRow(null)}
                                                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDelete(confirmRow.id)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </Modal>

                                    <Toast message={toast} onDismiss={() => setToast("")} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
