import React from "react";
import {
  X,
  CalendarDays,
  User,
  MapPin,
  PhoneIcon,
  Receipt,
  Landmark,
  IndianRupee,  
  Smartphone,
  TabletSmartphone,
  Printer,
  Download,
} from "lucide-react";

// 💰 Currency formatter
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

// ✅ Reusable Chip
function Chip({ children, color = "gray" }) {
  const colors = {
    sky: "bg-sky-100 text-sky-800",
    green: "bg-green-100 text-green-800",
    amber: "bg-amber-100 text-amber-800",
    violet: "bg-violet-100 text-violet-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color] || colors.gray
        }`}
    >
      {children}
    </span>
  );
}

// ✅ Left/Right Row Line
function RowLine({ icon: Icon, label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="col-span-1 text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </dt>
      <dd className="col-span-2 text-sm text-slate-800">{value}</dd>
    </div>
  );
}

// ✅ Item card component
function DeviceCard({ device }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white p-4">
      <div
        aria-hidden
        className={`absolute -right-px -top-px h-8 w-8 bg-indigo-500`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-slate-200">
            <TabletSmartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {device.name || "—"}
            </p>
            <p className="text-xs text-slate-500">
              Model: {device.modelNo || "—"}
            </p>
          </div>
        </div>
        <Chip color="violet">Qty: {device.qty || 1}</Chip>
      </div>

      {/* ✅ Serial numbers display */}
      <div className="mt-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200/70">
        <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
          Serial / IMEI Numbers ({device.serialNumbers?.length || 0})
        </p>
        {device.serialNumbers?.length > 0 ? (
          <ul className="mt-1 ml-3 list-disc text-xs text-slate-700 space-y-0.5">
            {device.serialNumbers.map((sn, i) => (
              <li key={i}>{sn}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-0.5 text-xs text-slate-500">No serials available</p>
        )}
      </div>

      <div className="mt-2 flex justify-between text-sm text-slate-700">
        <span>Rate: {INR.format(device.pricePerUnit || 0)}</span>
        <span>Total: {INR.format(device.amount || 0)}</span>
      </div>
    </div>
  );
}


// ✅ Main Modal Component
export default function PurchaseDetailsModal({ open, onClose, row }) {
  // 🧠 Map real purchase data into modal fields
  const data = {
    invoiceNo: row?.billNumber || "—",
    date: row?.billDate
      ? new Date(row.billDate).toLocaleDateString("en-GB")
      : "—",
    transaction: "Purchase",
    payment: row?.paymentType || "—",
    amount: row?.totalAmount || 0,
    balance: row?.unpaidAmount || 0,
    party: {
      name: row?.partyId?.partyName || "—",
      address:
        row?.partyId?.address?.billingAddress ||
        row?.partyId?.address?.shippingAddress ||
        "—",
      number: row?.partyId?.phoneNumber || "—",
    },
    devices:
      row?.items?.map((item) => ({
        name: item.itemName,
        modelNo: item.modelNo,
        qty: item.qty,
        pricePerUnit: item.pricePerUnit,
        amount: item.amount,
        serialNumbers: item.serialNumbers || [], // ✅ corrected
      })) || [],

  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl overflow-hidden max-h-[90vh] rounded-2xl bg-white h-[90vh] shadow-2xl ring-1 ring-slate-200 animate-fadeIn">
          {/* Accent rail */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-sky-400 to-indigo-500" />

          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-50 via-white to-white">
            <div
              aria-hidden
              className="absolute right-0 top-0 h-10 w-10 bg-sky-500"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
            />
            <div className="px-6 pt-5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="tx-title"
                    className="text-lg sm:text-xl font-[600] text-slate-900 flex items-center gap-2"
                  >
                    <Receipt className="w-5 h-5 text-sky-600" />
                    {data.invoiceNo}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Chip color="sky">{data.transaction}</Chip>
                    <Chip color="green">{data.payment}</Chip>
                    {data.balance > 0 ? (
                      <Chip color="amber">
                        Balance: {INR.format(data.balance)}
                      </Chip>
                    ) : (
                      <Chip>Paid</Chip>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 ml-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {data.date}
                    </span>
                  </div>
                </div>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="shrink-0 grid place-items-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 overflow-y-auto py-5 max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction summary */}
              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Transaction
                </h3>
                <dl className="space-y-3">
                  <RowLine
                    icon={Receipt}
                    label="Invoice No."
                    value={data.invoiceNo}
                  />
                  <RowLine icon={Landmark} label="Payment" value={data.payment} />
                  <RowLine
                    icon={IndianRupee}
                    label="Amount"
                    value={INR.format(data.amount)}
                  />
                  <RowLine
                    icon={IndianRupee}
                    label="Balance"
                    value={
                      data.balance ? INR.format(data.balance) : "—"
                    }
                  />
                </dl>
              </section>

              {/* Party details */}
              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  Party Details
                </h3>
                <dl className="space-y-3">
                  <RowLine
                    icon={User}
                    label="Party Name"
                    value={data.party.name}
                  />
                  <RowLine
                    icon={MapPin}
                    label="Address"
                    value={data.party.address}
                  />
                  <RowLine
                    icon={PhoneIcon}
                    label="Contact"
                    value={data.party.number}
                  />
                </dl>
              </section>
            </div>

            {/* Items purchased */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">
                  Items Purchased
                </h3>
                <span className="text-xs text-slate-500">
                  {data.devices?.length || 0} item(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(data.devices || []).map((d, i) => (
                  <DeviceCard key={i} device={d} />
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Generated preview from live transaction data.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                onClick={() => alert("Download invoice (coming soon)")}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
