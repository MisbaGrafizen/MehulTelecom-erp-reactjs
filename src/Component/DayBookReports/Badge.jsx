import React from 'react'

export default function Badge({ type, text, className = "" }) {
  const badgeStyles = {
    purchase: "bg-green-light text-green-paid",
    sale: "bg-blue-light text-blue-unpaid",
    transfer: "bg-orange-light text-orange-total",
    cash: "bg-teal-100 text-teal-700",
    upi: "bg-purple-100 text-purple-700",
    online: "bg-indigo-100 text-indigo-700",
    completed: "bg-green-light text-green-paid",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-destructive/10 text-destructive",
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badgeStyles[type] || "bg-gray-200  text-foreground"} ${className}`}>
      {text}
    </span>
  )
}

