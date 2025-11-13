"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    MoreVertical,
    Search,
    ArrowUpRight,
    Wrench,
    ChevronDown,
    Printer,
    FileSpreadsheet,
    Eye,
    Download,
    Edit3,
    Trash2,
} from "lucide-react"
import {
    ensureSeed,
    loadItems,
    loadTxns,
    addItem,
    updateItem,
    removeItem,
    addTxn,
    updateTxn,
    removeTxn,
    saveItems,
} from "../../lib/inventory-store"
import { Modal, Toast, Badge, } from "../../Component/Uikit"
import Header from "../../Component/header/Header"
import SideBar from "../../Component/sidebar/SideBar"
import { ApiGet } from "../../helper/axios"



function cn(...classes) {
    return classes.filter(Boolean).join(" ")
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

function useKebab() {
    const [openId, setOpenId] = useState(null)
    useEffect(() => {
        const on = () => setOpenId(null)
        window.addEventListener("click", on)
        return () => window.removeEventListener("click", on)
    }, [])
    return { openId, setOpenId }
}

export default function MianItemspage() {
    // Seed once
    // useEffect(() => {
    //     ensureSeed()
    // }, [])

    const [items, setItems] = useState([])
    const [txns, setTxns] = useState([])
    // ✅ Fetch real data from backend
    useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("❌ No userId found in localStorage");
        return;
      }

      // ✅ Fetch with userId in query
      const res = await ApiGet(`/admin/transactions?userId=${userId}`);
      console.log("🔹 Transaction Response:", res);

      const txns = res?.transactions || res?.data?.transactions || [];

      if (Array.isArray(txns)) {
        // 🟢 Build unique item list (track sale/purchase prices)
        const itemMap = new Map();

        txns.forEach((t) => {
          if (!itemMap.has(t.itemName)) {
            itemMap.set(t.itemName, {
              id: t.itemName,
              name: t.itemName,
              salePrice: t.type === "Sale" ? t.pricePerUnit : 0,
              purchasePrice: t.type === "Purchase" ? t.pricePerUnit : 0,
              qty: t.currentStock ?? 0,
              unsoldSerials: t.unsoldSerialCount ?? 0,
              serialCount: t.serialCount ?? 0,
            });
          } else {
            const existing = itemMap.get(t.itemName);
            if (t.type === "Sale" && t.pricePerUnit)
              existing.salePrice = t.pricePerUnit;
            if (t.type === "Purchase" && t.pricePerUnit)
              existing.purchasePrice = t.pricePerUnit;
            existing.qty = t.currentStock ?? existing.qty;
            existing.unsoldSerials =
              t.unsoldSerialCount ?? existing.unsoldSerials;
            existing.serialCount = t.serialCount ?? existing.serialCount;
          }
        });

        const uniqueItems = Array.from(itemMap.values());
        setItems(uniqueItems);
        setTxns(txns);
      } else {
        console.error("❌ Invalid transaction format:", res);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user transactions:", err);
    }
  };

  fetchTransactions();
}, []);



    // Left list
    const [leftQuery, setLeftQuery] = useState("")
    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        if (!selectedId && items.length) setSelectedId(items[0].id)
    }, [items, selectedId])

    const filteredItems = useMemo(() => {
        const s = leftQuery.trim().toLowerCase()
        if (!s) return items
        return items.filter((i) => `${i.name} ${i.color ?? ""}`.toLowerCase().includes(s))
    }, [items, leftQuery])

    const selectedItem = useMemo(() => items.find((i) => i.id === selectedId), [items, selectedId])
    const itemTxns = useMemo(
        () => txns.filter((t) => t.itemName === selectedItem?.name),
        [txns, selectedItem]
    );


    // UI state
    const [toast, setToast] = useState("")
    const kebabItems = useKebab()
    const kebabRows = useKebab()

    // Right search + sort
    const [tQuery, setTQuery] = useState("")
    const [sortDateDesc, setSortDateDesc] = useState(true)
    const displayTxns = useMemo(() => {
        let list = itemTxns
        if (tQuery.trim()) {
            const s = tQuery.toLowerCase()
            list = list.filter((t) => `${t.type} ${t.invoice} ${t.party} ${t.status}`.toLowerCase().includes(s))
        }
        list = [...list].sort((a, b) => (sortDateDesc ? b.date?.localeCompare(a.date) : a.date?.localeCompare(b.date)))
        return list
    }, [itemTxns, tQuery, sortDateDesc])

    // Modals
    const [viewTxn, setViewTxn] = useState(null)
    const [editTxn, setEditTxn] = useState(null)
    const [confirmTxn, setConfirmTxn] = useState(null)
    const [addItemOpen, setAddItemOpen] = useState(false)
    const [editItemOpen, setEditItemOpen] = useState(null) // item to edit
    const [adjustOpen, setAdjustOpen] = useState(false)
    const [confirmItem, setConfirmItem] = useState(null)

    // Actions
    function handleAddItem(form) {
        const id = "it-" + Date.now()
        const item = { id, ...form }
        const next = addItem(item)
        setItems(next)
        setSelectedId(id)
        setAddItemOpen(false)
        setToast("Item added")
    }
    function handleUpdateItem(id, patch) {
        const next = updateItem(id, patch)
        setItems(next)
        setEditItemOpen(null)
        setToast("Item updated")
    }
    function handleRemoveItem(id) {
        const { items: nextItems, txns: nextTxns } = removeItem(id)
        setItems(nextItems)
        setTxns(nextTxns)
        setConfirmItem(null)
        if (selectedId === id && nextItems.length) setSelectedId(nextItems[0].id)
        setToast("Item deleted")
    }
    function handleAdjust({ deltaQty = 0, newSalePrice, newPurchasePrice, note = "" }) {
        if (!selectedItem) return
        const updated = { ...selectedItem, qty: Math.max(0, (selectedItem.qty || 0) + Number(deltaQty || 0)) }
        if (newSalePrice != null) updated.salePrice = Number(newSalePrice)
        if (newPurchasePrice != null) updated.purchasePrice = Number(newPurchasePrice)
        saveItems(items.map((i) => (i.id === updated.id ? updated : i)))
        setItems(loadItems())

        const txn = {
            id: "tx-" + Date.now(),
            itemId: selectedItem.id,
            type: "Adjust",
            invoice: "-",
            party: "System",
            date: toISODate(new Date()),
            qty: Number(deltaQty || 0),
            price: 0,
            status: "Done",
            note,
        }
        const nextTx = addTxn(txn)
        setTxns(nextTx)
        setAdjustOpen(false)
        setToast("Stock adjusted")
    }

    function handleEditTxnSave(patch) {
        const next = updateTxn(editTxn.id, patch)
        setTxns(next)
        setEditTxn(null)
        setToast("Transaction updated")
    }
    function handleDeleteTxn() {
        const next = removeTxn(confirmTxn.id)
        setTxns(next)
        setConfirmTxn(null)
        setToast("Transaction deleted")
    }

    function exportCSV() {
        if (!selectedItem) return
        const headers = ["Type", "Invoice", "Party", "Date", "Qty", "Price/Unit", "Status"].join(",")
        const lines = displayTxns
            .map((t) =>
                [t.type, t.invoice, t.party, formatDate(t.date), t.qty, t.price, t.status]
                    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n")
        const blob = new Blob([headers + "\n" + lines], { type: "text/csv;charset=utf-8;" })
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `${selectedItem.name}-transactions.csv`
        a.click()
        URL.revokeObjectURL(a.href)
        setToast("CSV exported")
    }

    const stockValue = (selectedItem?.qty || 0) * (selectedItem?.purchasePrice || 0)

    return (


        <>
            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName="Items" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">
                            <div className="flex flex-col gap-[15px] w-[100%]">
                                <div className=" ">


                                    <main className=" grid grid-cols-1 gap-4  md:grid-cols-[320px_1fr]">
                                        {/* Left column */}
                                        <aside className="rounded-[10px] shadow-md border border-blue-200 bg-white">
                                            {/* Bulk update card */}
                                            <div className="border-b border-slate-200 p-3">
                                                <div className="rounded-md bg-rose-50 p-3">
                                                    <div className="font-[600] text-rose-700">Bulk Items Update</div>
                                                    <div className="text-xs text-rose-700/80">Update/Edit multiple items at a time.</div>
                                                </div>
                                            </div>
                                            {/* Add/search */}
                                            <div className="flex items-center justify-between gap-2 p-3">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                                    <input
                                                        placeholder="Search items"
                                                        value={leftQuery}
                                                        onChange={(e) => setLeftQuery(e.target.value)}
                                                        className="w-full rounded-lg border outline-none border-slate-300 pl-7 pr-3 py-2 text-sm"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setAddItemOpen(true)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-[600] text-white hover:bg-amber-600"
                                                    title="Add Item"

                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                    Add Item
                                                </button>
                                            </div>

                                            {/* Header row */}
                                            <div className="grid grid-cols-[1fr_64px_28px] gap-2 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                <div>Item</div>
                                                <div className="text-right">Quantity</div>
                                                <div />
                                            </div>

                                            {/* List */}
                                            <div className="h-[calc(100vh-260px)] overflow-auto px-2 pb-3 pt-1">
                                                {filteredItems.map((it) => (
                                                    <motion.div
                                                        key={it.id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={cn(
                                                            "mb-1 flex items-center gap-2 rounded-md  shadow-sm  px-2 py-2",
                                                            selectedId === it.id ? "bg-slate-100 border border-[#006dfb5a] " : "  shadow-lg hover:bg-slate-50",
                                                        )}
                                                        onClick={() => setSelectedId(it.id)}
                                                    >
                                                        <div className="flex-1 truncate">
                                                            <div className="truncate text-[13px] font-semibold text-slate-800">{it.name}</div>
                                                            {it.color ? <div className="truncate text-[11px] text-slate-500">{it.color}</div> : null}
                                                        </div>
                                                        <div className="w-12 text-right text-[13px] font-[600] text-emerald-700">
                                                            {it.unsoldSerials}
                                                        </div>
                                                        {/* item kebab */}
                                                        <div
                                                            className="relative"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                kebabItems.setOpenId(kebabItems.openId === it.id ? null : it.id)
                                                            }}
                                                        >
                                                            <button className="rounded p-1 hover:bg-slate-100" aria-label="More">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                            <AnimatePresence>
                                                                {kebabItems.openId === it.id ? (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 6 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 4 }}
                                                                        className="absolute right-0 z-40 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                                                                    >
                                                                        <button
                                                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                                                                            onClick={() => {
                                                                                kebabItems.setOpenId(null)
                                                                                setEditItemOpen(it)
                                                                            }}
                                                                        >
                                                                            <Edit3 size={16} />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                                                                            onClick={() => {
                                                                                kebabItems.setOpenId(null)
                                                                                setConfirmItem(it)
                                                                            }}
                                                                        >
                                                                            <Trash2 size={16} />
                                                                            Delete
                                                                        </button>
                                                                    </motion.div>
                                                                ) : null}
                                                            </AnimatePresence>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {!filteredItems.length ? (
                                                    <div className="py-10 text-center text-sm text-slate-500">No items found.</div>
                                                ) : null}
                                            </div>
                                        </aside>

                                        {/* Right column */}
                                        <section className="space-y-4">
                                            {/* Item header */}
                                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                                {selectedItem ? (
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h2 className="text-[18px] font-[600] text-slate-900">{selectedItem.name}</h2>
                                                                <ArrowUpRight size={18} className="text-slate-400" />
                                                            </div>
                                                            <div className="mt-1 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                                                <div className="text-emerald-700">
                                                                    Sale Price: <span className="font-[600]">{formatINR(selectedItem.salePrice || 0)}</span>
                                                                </div>
                                                                <div className="text-blue-700">
                                                                    Purchase Price:{" "}
                                                                    <span className="font-[600]">{formatINR(selectedItem.purchasePrice || 0)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-3">
                                                            <button
                                                                onClick={() => setAdjustOpen(true)}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-[600] text-white hover:bg-blue-700"
                                                            >
                                                                <Wrench size={16} />
                                                                Adjust Item
                                                            </button>
                                                            <div className="text-right text-sm">
                                                                <div>
                                                                    STOCK QUANTITY: <span className="font-[600] text-emerald-700">{selectedItem.qty ?? 0}</span>
                                                                </div>
                                                                <div>
                                                                    STOCK VALUE: <span className="font-[600] text-emerald-700">{formatINR(stockValue)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-10 text-center text-slate-500">Select an item from the left list.</div>
                                                )}
                                            </div>

                                            {/* Transactions */}
                                            <div className="rounded-2xl border border-slate-200 bg-white">
                                                <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-3">
                                                    <div className="font-[600] text-slate-800">TRANSACTIONS</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                                            <input
                                                                placeholder="Search"
                                                                value={tQuery}
                                                                onChange={(e) => setTQuery(e.target.value)}
                                                                className="w-64 rounded-lg border border-slate-300 pl-7 pr-3 py-2 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="max-h-[58vh] overflow-auto">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left">Type</th>
                                                                <th className="px-3 py-2 text-left">Invoice</th>
                                                                <th className="px-3 py-2 text-left">Name</th>
                                                                <th
                                                                    className="px-3 py-2 text-left cursor-pointer select-none"
                                                                    onClick={() => setSortDateDesc((v) => !v)}
                                                                    title="Sort by date"
                                                                >
                                                                    Date <ChevronDown className={cn("inline h-4 w-4", sortDateDesc ? "rotate-180" : "")} />
                                                                </th>
                                                                <th className="px-3 py-2 text-right">Quantity</th>
                                                                <th className="px-3 py-2 text-right">Price/Unit</th>
                                                                <th className="px-3 py-2 text-left">Status</th>
                                                                <th className="px-3 py-2 text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            <AnimatePresence initial={false}>
                                                                {displayTxns.map((t) => (
                                                                    <motion.tr
                                                                        key={t.id}
                                                                        initial={{ opacity: 0, y: 8 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -6 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="hover:bg-slate-50"
                                                                        onClick={() => setViewTxn(t)}
                                                                    >
                                                                        <td className="px-3 py-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <span
                                                                                    className={cn(
                                                                                        "h-2 w-2 rounded-full",
                                                                                        t.type === "Sale"
                                                                                            ? "bg-emerald-500"
                                                                                            : t.type === "Purchase"
                                                                                                ? "bg-blue-500"
                                                                                                : "bg-amber-500",
                                                                                    )}
                                                                                />
                                                                                {t.type}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-2">{t.billNumber}</td>
                                                                        <td className="px-3 py-2">
                                                                            <button className="font-semibold text-blue-700 underline-offset-2 hover:underline">
                                                                                {t.itemName}
                                                                            </button>
                                                                        </td>
                                                                        <td className="px-3 py-2">{formatDate(t.billDate)}</td>

                                                                        <td className="px-3 py-2 text-right">{t.qty}</td>
                                                                        <td className="px-3 py-2 text-right">{formatINR(t.pricePerUnit)}</td>
                                                                        <td className="px-3 py-2">
                                                                            <Badge tone={t.paidAmount === t.totalAmount ? "green" : "amber"}>
                                                                                {t.paidAmount === t.totalAmount ? "Paid" : "Unpaid"}
                                                                            </Badge>

                                                                        </td>
                                                                        <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <button
                                                                                    className="rounded p-1.5 hover:bg-gray-100"
                                                                                    title="View"
                                                                                    onClick={() => setViewTxn(t)}
                                                                                >
                                                                                    <Eye size={16} />
                                                                                </button>
                                                                                <button
                                                                                    className="rounded p-1.5 hover:bg-gray-100"
                                                                                    title="Print"
                                                                                    onClick={() => window.print()}
                                                                                >
                                                                                    <Printer size={16} />
                                                                                </button>
                                                                                <button
                                                                                    className="rounded p-1.5 hover:bg-gray-100"
                                                                                    title="Download"
                                                                                    onClick={() => setToast("Download started")}
                                                                                >
                                                                                    <Download size={16} />
                                                                                </button>

                                                                                <div
                                                                                    className="relative"
                                                                                    onClick={() => kebabRows.setOpenId(kebabRows.openId === t.id ? null : t.id)}
                                                                                >
                                                                                    <button className="rounded p-1.5 hover:bg-gray-100" aria-label="More">
                                                                                        <MoreVertical size={16} />
                                                                                    </button>
                                                                                    <AnimatePresence>
                                                                                        {kebabRows.openId === t.id ? (
                                                                                            <motion.div
                                                                                                initial={{ opacity: 0, y: 6 }}
                                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                                exit={{ opacity: 0, y: 4 }}
                                                                                                className="absolute right-0 z-40 mt-1 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                                                                                            >
                                                                                                <button
                                                                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-100"
                                                                                                    onClick={() => {
                                                                                                        kebabRows.setOpenId(null)
                                                                                                        setEditTxn(t)
                                                                                                    }}
                                                                                                >
                                                                                                    <Edit3 size={16} />
                                                                                                    Edit
                                                                                                </button>
                                                                                                <button
                                                                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                                                                                                    onClick={() => {
                                                                                                        kebabRows.setOpenId(null)
                                                                                                        setConfirmTxn(t)
                                                                                                    }}
                                                                                                >
                                                                                                    <Trash2 size={16} />
                                                                                                    Delete
                                                                                                </button>
                                                                                            </motion.div>
                                                                                        ) : null}
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </motion.tr>
                                                                ))}
                                                            </AnimatePresence>
                                                            {displayTxns.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={8} className="px-3 py-10 text-center text-slate-500">
                                                                        No transactions found.
                                                                    </td>
                                                                </tr>
                                                            ) : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </section>
                                    </main>

                                    {/* Modals */}
                                    <Modal open={addItemOpen} title="Add Item" onClose={() => setAddItemOpen(false)}>
                                        <AddItemForm onSave={handleAddItem} />
                                    </Modal>

                                    <Modal open={!!editItemOpen} title="Edit Item" onClose={() => setEditItemOpen(null)}>
                                        {editItemOpen ? (
                                            <EditItemForm
                                                item={editItemOpen}
                                                onSave={(patch) => handleUpdateItem(editItemOpen.id, patch)}
                                                onCancel={() => setEditItemOpen(null)}
                                            />
                                        ) : null}
                                    </Modal>

                                    <Modal open={!!confirmItem} title="Delete Item" onClose={() => setConfirmItem(null)} width="max-w-md">
                                        <p className="text-sm text-slate-700">
                                            This will remove <span className="font-semibold">{confirmItem?.name}</span> and all its transactions.
                                        </p>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button onClick={() => setConfirmItem(null)} className="rounded-lg border px-4 py-2 font-semibold">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(confirmItem.id)}
                                                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </Modal>

                                    <Modal open={adjustOpen} title="Adjust Item" onClose={() => setAdjustOpen(false)}>
                                        <AdjustForm
                                            defaultSale={selectedItem?.salePrice}
                                            defaultPurchase={selectedItem?.purchasePrice}
                                            onSave={handleAdjust}
                                        />
                                    </Modal>

                                    <Modal open={!!viewTxn} title="Transaction Details" onClose={() => setViewTxn(null)}>
                                        {viewTxn ? <TxnDetails txn={viewTxn} /> : null}
                                    </Modal>

                                    <Modal open={!!editTxn} title="Edit Transaction" onClose={() => setEditTxn(null)}>
                                        {editTxn ? <EditTxnForm txn={editTxn} onSave={handleEditTxnSave} /> : null}
                                    </Modal>

                                    <Modal open={!!confirmTxn} title="Delete Transaction" onClose={() => setConfirmTxn(null)} width="max-w-md">
                                        <p className="text-sm text-slate-700">
                                            Delete invoice <span className="font-semibold">{confirmTxn?.invoice}</span>?
                                        </p>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button onClick={() => setConfirmTxn(null)} className="rounded-lg border px-4 py-2 font-semibold">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDeleteTxn}
                                                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
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
                </div>
            </section>

        </>
    )
}

/* ---------- Forms & Details ---------- */
function AddItemForm({ onSave }) {
    const [form, setForm] = useState({ name: "", color: "", salePrice: 0, purchasePrice: 0, qty: 0 })
    return (
        <form
            className="grid gap-3"
            onSubmit={(e) => {
                e.preventDefault()
                if (!form.name.trim()) return
                onSave({
                    ...form,
                    salePrice: Number(form.salePrice || 0),
                    purchasePrice: Number(form.purchasePrice || 0),
                    qty: Number(form.qty || 0),
                })
            }}
        >
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Item Name</span>
                <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="e.g., I PHONE 12 64 WHITE"
                    required
                />
            </label>
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Color / Variant (optional)</span>
                <input
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="WHITE"
                />
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Sale Price</span>
                    <input
                        type="number"
                        value={form.salePrice}
                        onChange={(e) => setForm((f) => ({ ...f, salePrice: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Purchase Price</span>
                    <input
                        type="number"
                        value={form.purchasePrice}
                        onChange={(e) => setForm((f) => ({ ...f, purchasePrice: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Opening Qty</span>
                    <input
                        type="number"
                        value={form.qty}
                        onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
            </div>

            <div className="mt-2 flex justify-end">
                <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-4 py-2 font-[600] text-white hover:bg-amber-600"
                >
                    Save Item
                </button>
            </div>
        </form>
    )
}

function EditItemForm({ item, onSave, onCancel }) {
    const [form, setForm] = useState({
        name: item.name,
        color: item.color || "",
        salePrice: item.salePrice || 0,
        purchasePrice: item.purchasePrice || 0,
    })
    return (
        <form
            className="grid gap-3"
            onSubmit={(e) => {
                e.preventDefault()
                onSave({
                    name: form.name,
                    color: form.color,
                    salePrice: Number(form.salePrice || 0),
                    purchasePrice: Number(form.purchasePrice || 0),
                })
            }}
        >
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Item Name</span>
                <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    required
                />
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Color</span>
                    <input
                        value={form.color}
                        onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Sale Price</span>
                    <input
                        type="number"
                        value={form.salePrice}
                        onChange={(e) => setForm((f) => ({ ...f, salePrice: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Purchase Price</span>
                    <input
                        type="number"
                        value={form.purchasePrice}
                        onChange={(e) => setForm((f) => ({ ...f, purchasePrice: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
            </div>
            <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 font-semibold">
                    Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-[600] text-white hover:bg-blue-700">
                    Save
                </button>
            </div>
        </form>
    )
}

function AdjustForm({ defaultSale, defaultPurchase, onSave }) {
    const [deltaQty, setDeltaQty] = useState(0)
    const [sale, setSale] = useState(defaultSale || 0)
    const [purchase, setPurchase] = useState(defaultPurchase || 0)
    const [note, setNote] = useState("")
    return (
        <form
            className="grid gap-3"
            onSubmit={(e) => {
                e.preventDefault()
                onSave({
                    deltaQty: Number(deltaQty || 0),
                    newSalePrice: Number(sale || 0),
                    newPurchasePrice: Number(purchase || 0),
                    note,
                })
            }}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Increase / Decrease Qty (+/-)</span>
                    <input
                        type="number"
                        value={deltaQty}
                        onChange={(e) => setDeltaQty(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Sale Price</span>
                    <input
                        type="number"
                        value={sale}
                        onChange={(e) => setSale(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Purchase Price</span>
                    <input
                        type="number"
                        value={purchase}
                        onChange={(e) => setPurchase(e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
            </div>
            <label className="grid gap-1">
                <span className="text-sm font-semibold text-slate-700">Note (optional)</span>
                <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="Reason for adjustment..."
                />
            </label>
            <div className="mt-2 flex justify-end">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-[600] text-white hover:bg-blue-700">
                    Apply
                </button>
            </div>
        </form>
    )
}

function TxnDetails({ txn }) {
    return (
        <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="text-slate-500">Type</div>
                    <div className="font-semibold">{txn.type}</div>
                </div>
                <div>
                    <div className="text-slate-500">Invoice</div>
                    <div className="font-semibold">{txn.billNumber}</div>
                </div>
                <div>
                    <div className="text-slate-500">Party</div>
                    <div className="font-semibold">{txn.partyName}</div>
                </div>
                <div>
                    <div className="text-slate-500">Date</div>
                    <div className="font-semibold">{formatDate(txn.billDate)}</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <div className="text-slate-500">Quantity</div>
                    <div className="font-semibold">{txn.qty}</div>
                </div>
                <div>
                    <div className="text-slate-500">Price/Unit</div>
                    <div className="font-semibold">{formatINR(txn.pricePerUnit)}</div>
                </div>
                <div>
                    <div className="text-slate-500">Status</div>
                    <div className="font-semibold">{txn.paidAmount === txn.totalAmount ? "Paid" : "Unpaid"}</div>
                </div>
            </div>
            {txn.note ? (
                <div>
                    <div className="text-slate-500">Note</div>
                    <div className="font-semibold">{txn.note}</div>
                </div>
            ) : null}
        </div>
    )
}

function EditTxnForm({ txn, onSave }) {
    const [form, setForm] = useState({
        invoice: txn.invoice,
        party: txn.party,
        date: txn.date,
        qty: txn.qty,
        price: txn.price,
        status: txn.status,
    })
    return (
        <form
            className="grid gap-3"
            onSubmit={(e) => {
                e.preventDefault()
                onSave({
                    invoice: form.invoice,
                    party: form.party,
                    date: form.date,
                    qty: Number(form.qty || 0),
                    price: Number(form.price || 0),
                    status: form.status,
                })
            }}
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Invoice</span>
                    <input
                        value={form.invoice}
                        onChange={(e) => setForm((f) => ({ ...f, invoice: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Party</span>
                    <input
                        value={form.party}
                        onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Date</span>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Status</span>
                    <select
                        value={form.status}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    >
                        {["Paid", "Unpaid", "Done", "Cancelled"].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Quantity</span>
                    <input
                        type="number"
                        value={form.qty}
                        onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm font-semibold text-slate-700">Price/Unit</span>
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
            </div>
            <div className="mt-2 flex justify-end">
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-[600] text-white hover:bg-blue-700">
                    Save
                </button>
            </div>
        </form>
    )
}
