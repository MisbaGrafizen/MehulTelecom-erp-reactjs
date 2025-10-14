"use client"

import { formatINR, amountToIndianWords } from "../../lib/amount-in-words"

export default function InvoiceTemplate({
  company = {
    name: "MEHUL TELECOM",
    address: "ASTRON CHOWK, SARDAR NAGAR MEIN ROAD, RAJKOT",
    phone: "8320683171",
  },
  invoice = { number: "613", date: "2025-10-11" },
  billTo = { name: "BANSHI HANSALPARA", contact: "7861025026" },
  items = [
    {
      name: "MOTOROLA EDGE60PRO 8/256 PURPLE",
      serial: "3553777541752716",
      qty: 1,
      price: 19000,
    },
  ],
  terms = "NO EXCUSE PHYSICAL AND WATER DAMAGES & DISPLAY AND BATTERY",
  signFor = "MEHUL TELECOM",
  signatureImage = "/images/signature.jpg",
}) {
  const rows = items.map((it, i) => {
    const amount = Number(it.qty || 0) * Number(it.price || 0)
    return { sn: i + 1, ...it, amount }
  })
  const subTotal = rows.reduce((s, r) => s + r.amount, 0)
  const total = subTotal

  return (
    <div className="mx-auto w-[210mm] bg-white shadow print:shadow-none print:w-auto">
      {/* Top padding for on-screen view */}
      <div className="p-[14mm] print:p-[12mm]">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-[20px] font-extrabold tracking-wide text-slate-900">{company.name}</h1>
            <p className="mt-1 text-[12px] text-slate-600">{company.address}</p>
            <p className="text-[12px] text-slate-600">Phone No.: {company.phone}</p>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-extrabold uppercase tracking-wide text-slate-600">Invoice Details</div>
            <div className="mt-2 text-[12px] text-slate-800">
              <div>Invoice No.: {invoice.number}</div>
              <div>Date : {formatDate(invoice.date)}</div>
            </div>
          </div>
        </header>

        {/* Rule + Title */}
        <div className="mt-3 border-t border-slate-300" />
        <div className="py-2 text-center text-[20px] font-extrabold text-slate-600">Tax Invoice</div>

        {/* Bill To */}
        <section className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[12px] font-extrabold text-slate-700">Bill To</div>
            <div className="mt-1 text-[13px] font-semibold text-slate-900">{billTo.name}</div>
            <div className="text-[12px] text-slate-700">Contact No.: {billTo.contact}</div>
          </div>
          <div />
        </section>

        {/* Items table */}
        <section className="mt-4">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="!bg-gray-300 text-slate-800">
                <th className="w-[28px] px-2 py-1 text-left">#</th>
                <th className="px-2 py-1 text-left">Item name</th>
                <th className="w-[80px] px-2 py-1 text-center">Quantity</th>
                <th className="w-[110px] px-2 py-1 text-right">Price/ Unit</th>
                <th className="w-[110px] px-2 py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {rows.map((r) => (
                <tr key={r.sn} className="border-b border-slate-200">
                  <td className="px-2 py-2">{r.sn}</td>
                  <td className="px-2 py-2">
                    <div className="font-bold uppercase text-slate-900">{r.name}</div>
                    <div className="text-[11px] text-slate-600">Serial No.: {r.serial || "-"}</div>
                  </td>
                  <td className="px-2 py-2 text-center">{r.qty}</td>
                  <td className="px-2 py-2 text-right">{formatINR(r.price)}</td>
                  <td className="px-2 py-2 text-right">{formatINR(r.amount)}</td>
                </tr>
              ))}

              {/* Total row similar to screenshot */}
              <tr className="border-t-2 border-slate-400 font-extrabold text-slate-900">
                <td className="px-2 py-2"></td>
                <td className="px-2 py-2">Total</td>
                <td className="px-2 py-2 text-center">{rows.reduce((s, r) => s + Number(r.qty || 0), 0)}</td>
                <td className="px-2 py-2"></td>
                <td className="px-2 py-2 text-right">{formatINR(subTotal)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Bottom summaries */}
        <section className="mt-4 grid grid-cols-2 gap-6">
          {/* Left notes */}
          <div>
            <div className="text-[12px]">
              <span className="font-extrabold text-slate-800">Invoice Amount in Words: </span>
              <span className="text-slate-800">{amountToIndianWords(total)}</span>
            </div>

            <div className="mt-3 text-[12px]">
              <span className="font-extrabold text-slate-800">Terms and Conditions </span>
              <span className="text-slate-800">( {terms} )</span>
            </div>
          </div>

          {/* Right totals box */}
          <div className="ml-auto w-[60%]">
            <table className="w-full text-[12px]">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="px-2 py-1 text-slate-700">Sub Total</td>
                  <td className="px-2 py-1 text-right font-semibold text-slate-900">{formatINR(subTotal)}</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 font-extrabold text-slate-900">Total</td>
                  <td className="px-2 py-1 text-right font-extrabold text-slate-900">{formatINR(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Signature block */}
        <section className="mt-10 grid grid-cols-2 gap-6">
          <div />
          <div className="text-right">
            <div className="text-[12px] text-slate-800">
              For : <span className="font-semibold">{signFor}</span>
            </div>
            <div className="mt-3 inline-block rounded border border-slate-300 bg-slate-50 p-1">
              <img
                src={signatureImage || "/placeholder.svg"}
                alt="Authorized signature"
                className="h-[80px] w-[200px] object-cover"
              />
            </div>
            <div className="mt-2 text-[12px] font-extrabold text-slate-800">Authorized Signatory</div>
          </div>
        </section>
      </div>

 {/* Print styles */}
{/* Print styles */}
<style jsx global>{`
  @page {
    size: 21cm 14.8cm; /* A5 Landscape */
    margin: 10mm; /* Adjust as needed */
  }

  @media print {
    html,
    body {
      width: 1300px;
      height: 14.8cm;
      background: white !important;
      margin-top: 60px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print\\:shadow-none {
      box-shadow: none !important;
    }

    .print\\:w-auto {
      width: auto !important;
    }

    .no-print {
      display: none !important;
    }

    /* Optional: Center content for neat print */
    body {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`}</style>


    </div>
  )
}

function formatDate(d) {
  const dt = typeof d === "string" ? new Date(d) : d
  return dt.toLocaleDateString("en-GB")
}
