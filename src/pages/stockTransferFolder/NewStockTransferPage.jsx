"use client"

import { useEffect, useMemo, useState } from "react"

import { companies, deviceTypes } from "../../../src/data/companies"
import { addTransfer } from "../../../src/lib/transferstore"
import { Dropdown, Toast } from "../../../src/Component/Uikit"
import { Calendar, Building2, MapPin, PlusCircle, Trash2, IndianRupee } from "lucide-react"
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
function toISODate(d) {
    const dt = typeof d === "string" ? new Date(d) : d
    const yyyy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, "0")
    const dd = String(dt.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export default function NewStockTransferPage() {
    const navigate = useNavigate()
    const [toast, setToast] = useState("")
    const [date, setDate] = useState(toISODate(new Date()))
    const [companyId, setCompanyId] = useState(companies[0].id)
    const selectedCompany = useMemo(() => companies.find((c) => c.id === companyId), [companyId])

    const [fromId, setFromId] = useState(selectedCompany.branches[0].id)
    const [toId, setToId] = useState(selectedCompany.branches[1]?.id || selectedCompany.branches[0].id)

    useEffect(() => {
        // Reset branches when company changes
        setFromId(companies.find((c) => c.id === companyId).branches[0].id)
        setToId(
            companies.find((c) => c.id === companyId).branches[1]?.id ||
            companies.find((c) => c.id === companyId).branches[0].id,
        )
    }, [companyId])

    const fromBranch = selectedCompany.branches.find((b) => b.id === fromId)
    const toBranch = selectedCompany.branches.find((b) => b.id === toId)

    const [items, setItems] = useState([{ type: "Mobile", name: "", imei: "", model: "", qty: 1, price: 0, amount: 0 }])

    useEffect(() => {
        setItems((prev) => prev.map((i) => ({ ...i, amount: Number(i.qty || 0) * Number(i.price || 0) })))
    }, [])

    const total = useMemo(() => items.reduce((s, i) => s + Number(i.amount || 0), 0), [items])

    function addRow() {
        setItems((prev) => [...prev, { type: "Mobile", name: "", imei: "", model: "", qty: 1, price: 0, amount: 0 }])
    }

    function removeRow(idx) {
        setItems((prev) => prev.filter((_, i) => i !== idx))
    }

    function updateItem(idx, patch) {
        setItems((prev) =>
            prev.map((it, i) =>
                i === idx ? { ...it, ...patch, amount: Number(patch.qty ?? it.qty) * Number(patch.price ?? it.price) } : it,
            ),
        )
    }

    function submitTransfer() {
        if (!companyId || !fromId || !toId || fromId === toId) {
            setToast("Please select company and two different branches.")
            return
        }
        const cleaned = items.filter((i) => i.name || i.imei || Number(i.amount) > 0)
        if (!cleaned.length) {
            setToast("Add at least one item.")
            return
        }
        const id = "ST-" + Date.now()
        const transferNo = id
        const payload = {
            id,
            transferNo,
            date,
            company: selectedCompany,
            fromBranch,
            toBranch,
            items: cleaned,
            total,
            status: "Transferred",
            createdAt: new Date().toISOString(),
        }
        addTransfer(payload)
        setToast("Transfer created")
        setTimeout(() => router.push("/stock-transfer"), 500)
    }

    return (


        <>



            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName="PurchCreate Stock Transferase" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">


            <div className=" w-[100%]">


                <main className="mx-auto ">
                    {/* Company & Branches */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <Dropdown
                                label={companies.find((c) => c.id === companyId)?.name}
                                options={companies.map((c) => ({ label: c.name, value: c.id }))}
                                value={companyId}
                                onChange={(v) => setCompanyId(v)}
                                leadingIcon={<Building2 size={16} className="text-blue-600" />}
                            />
                            <Dropdown
                                label={`From: ${fromBranch?.name}`}
                                options={selectedCompany.branches.map((b) => ({ label: b.name, value: b.id }))}
                                value={fromId}
                                onChange={(v) => setFromId(v)}
                                leadingIcon={<MapPin size={16} className="text-slate-700" />}
                            />
                            <Dropdown
                                label={`To: ${toBranch?.name}`}
                                options={selectedCompany.branches
                                    .filter((b) => b.id !== fromId)
                                    .map((b) => ({ label: b.name, value: b.id }))}
                                value={toId}
                                onChange={(v) => setToId(v)}
                                leadingIcon={<MapPin size={16} className="text-slate-700" />}
                            />
                            <div className="flex items-center gap-2">
                                {/* <Calendar size={16} className="text-blue-600" /> */}
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className=" outline-none border rounded-[8px] 00 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 p-3">
                                <div className="text-xs font-[600] text-slate-600">From Address</div>
                                <div className="text-sm">{fromBranch?.address}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-3">
                                <div className="text-xs font-[600] text-slate-600">To Address</div>
                                <div className="text-sm">{toBranch?.address}</div>
                            </div>
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-100 text-slate-600">
                                    <tr>
                                        <th className="px-2 py-2 !font-[500] text-left">#</th>

                                        <th className="px-2 py-2 !font-[600] text-left">Product Name</th>
                                        <th className="px-2 py-2 !font-[600] text-left">IMEI/Serial</th>
                                        <th className="px-2 py-2 !font-[600] text-left">Model</th>
                                        <th className="px-2 py-2 !font-[600] text-right">Qty</th>
                                        <th className="px-2 py-2 !font-[600] text-right">Price</th>
                                        <th className="px-2 py-2 !font-[600] text-right">Amount</th>
                                        <th className="px-2 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((it, idx) => (
                                        <tr key={idx} className="align-top">
                                            <td className="px-2 py-2">{idx + 1}</td>
                                 
                                            <td className="px-2 py-2">
                                                <input
                                                    value={it.name}
                                                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                                                    className="w-56  outline-none border-b 00 px-2 py-1.5"
                                                    placeholder="e.g., iPhone 14"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    value={it.imei}
                                                    onChange={(e) => updateItem(idx, { imei: e.target.value })}
                                                    className="w-56  outline-none border-b 00 px-2 py-1.5"
                                                    placeholder="IMEI / Serial No."
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    value={it.model}
                                                    onChange={(e) => updateItem(idx, { model: e.target.value })}
                                                    className="w-40  outline-none border-b 00 px-2 py-1.5"
                                                    placeholder="Model"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={it.qty}
                                                    onChange={(e) => updateItem(idx, { qty: Number(e.target.value) || 0 })}
                                                    className="w-20  outline-none border-b 00 px-2 py-1.5 text-right"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                <input
                                                    type="number"
                                                    value={it.price}
                                                    onChange={(e) => updateItem(idx, { price: Number(e.target.value) || 0 })}
                                                    className="w-28  outline-none border-b 00 px-2 py-1.5 text-right"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-right font-[500]">{formatINR(it.amount || 0)}</td>
                                            <td className="px-2 py-2 text-right">
                                                <button
                                                    className="rounded-lg5 text-rose-700 hover:bg-rose-50"
                                                    onClick={() => removeRow(idx)}
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={9} className="px-2 py-2">
                                            <button
                                                onClick={addRow}
                                                className="inline-flex items-center gap-2 rounded-md border border-dashed border-blue-400 px-3 py-1.5 text-sm font-[500] text-blue-700 hover:bg-blue-50"
                                            >
                                                <PlusCircle size={16} />
                                                Add Item
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
                                        <IndianRupee size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-[600] text-emerald-700">Items</div>
                                        <div className="text-lg font-[600] text-emerald-900">{items.length}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <div className="text-sm font-[600] text-blue-700">From</div>
                                <div className="text-sm font-[500]">{fromBranch?.name}</div>
                            </div>
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="text-sm font-[600] text-amber-700">Total</div>
                                <div className="text-lg font-[600] text-amber-900">{formatINR(total)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => router.push("/stock-transfer")} className="rounded-xl border px-4 py-2 font-[500]">
                            Cancel
                        </button>
                        <button
                            onClick={submitTransfer}
                            className="rounded-xl bg-blue-600 px-5 py-2 font-[600] text-white hover:bg-blue-700"
                        >
                            Transfer
                        </button>
                    </div>
                </main>

                <Toast message={toast} onDismiss={() => setToast("")} />
            </div>

</div>
</div>

</div>
</section>

        </>
    )
}
