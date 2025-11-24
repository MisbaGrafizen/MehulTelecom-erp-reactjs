"use client"

import { useState } from "react"

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

export default function PartySalePurchaseModal({ party, onClose }) {
  const [expandedSale, setExpandedSale] = useState(null)
  const [expandedPurchase, setExpandedPurchase] = useState(null)

  const netBalance = party.totalSale - party.totalPurchase

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <h2 className="text-2xl font-bold">{party.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Party Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Party Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Phone</p>
                <p className="text-slate-900">{party.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="text-slate-900">{party.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Address</p>
                <p className="text-slate-900">{party.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Credit Limit</p>
                <p className="text-slate-900 font-semibold">₹{party.creditLimit.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Opening Balance</p>
                <p className="text-slate-900 font-semibold">₹{party.openingBalance.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Right Column - Summary Cards */}
            <div className="space-y-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-1">Total Sale Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{party.totalSale.toLocaleString("en-IN")}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-700 font-medium mb-1">Total Purchase Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{party.totalPurchase.toLocaleString("en-IN")}</p>
              </div>

              <div
                className={`bg-gradient-to-br rounded-lg p-4 border ${
                  netBalance >= 0
                    ? "from-green-50 to-emerald-50 border-green-200"
                    : "from-red-50 to-orange-50 border-red-200"
                }`}
              >
                <p className={`text-sm font-medium mb-1 ${netBalance >= 0 ? "text-green-700" : "text-red-700"}`}>
                  Net Balance
                </p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{Math.abs(netBalance).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Sales Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sales Records</h3>
            <div className="space-y-3">
              {party.sales.map((sale) => (
                <div key={sale.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {sale.date} {sale.time}
                        </p>
                        <p className="font-semibold text-slate-900">Invoice: {sale.invoiceNo}</p>
                      </div>
                      <div className="ml-auto mr-4">
                        <p className="text-sm text-slate-600">Payment Mode</p>
                        <p className="font-medium text-slate-900">{sale.paymentMode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Amount</p>
                        <p className="font-semibold text-green-600">₹{sale.amount.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${expandedSale === sale.id ? "rotate-180" : ""}`}>
                      <ChevronDownIcon />
                    </div>
                  </button>

                  {expandedSale === sale.id && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-700 font-semibold border-b border-slate-200">
                            <th className="text-left py-2">Product</th>
                            <th className="text-left py-2">IMEI</th>
                            <th className="text-right py-2">Qty</th>
                            <th className="text-right py-2">Rate</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sale.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-200 hover:bg-slate-100">
                              <td className="py-2">{item.name}</td>
                              <td className="py-2 text-slate-600">{item.imei}</td>
                              <td className="text-right py-2">{item.qty}</td>
                              <td className="text-right py-2">₹{item.rate.toLocaleString("en-IN")}</td>
                              <td className="text-right py-2 font-semibold">₹{item.total.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Purchases Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Purchase Records</h3>
            <div className="space-y-3">
              {party.purchases.map((purchase) => (
                <div key={purchase.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedPurchase(expandedPurchase === purchase.id ? null : purchase.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">
                          {purchase.date} {purchase.time}
                        </p>
                        <p className="font-semibold text-slate-900">Bill: {purchase.billNo}</p>
                      </div>
                      <div className="ml-auto mr-4">
                        <p className="text-sm text-slate-600">Payment Mode</p>
                        <p className="font-medium text-slate-900">{purchase.paymentMode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Amount</p>
                        <p className="font-semibold text-red-600">₹{purchase.amount.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform ${expandedPurchase === purchase.id ? "rotate-180" : ""}`}
                    >
                      <ChevronDownIcon />
                    </div>
                  </button>

                  {expandedPurchase === purchase.id && (
                    <div className="bg-slate-50 p-4 border-t border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-700 font-semibold border-b border-slate-200">
                            <th className="text-left py-2">Product</th>
                            <th className="text-left py-2">IMEI</th>
                            <th className="text-right py-2">Qty</th>
                            <th className="text-right py-2">Rate</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchase.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-200 hover:bg-slate-100">
                              <td className="py-2">{item.name}</td>
                              <td className="py-2 text-slate-600">{item.imei}</td>
                              <td className="text-right py-2">{item.qty}</td>
                              <td className="text-right py-2">₹{item.rate.toLocaleString("en-IN")}</td>
                              <td className="text-right py-2 font-semibold">₹{item.total.toLocaleString("en-IN")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Summary */}
          <div className="border-t border-slate-200 pt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Grand Total Sale</p>
                <p className="text-2xl font-bold text-green-600">₹{party.totalSale.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Grand Total Purchase</p>
                <p className="text-2xl font-bold text-red-600">₹{party.totalPurchase.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Net Profit/Loss</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{Math.abs(netBalance).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
