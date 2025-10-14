"use client"

// Indian numbering system: up to 99,99,99,999
export function amountToIndianWords(n) {
  n = Math.round(Number(n || 0))
  if (n === 0) return "Zero Rupees only"
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  function twoDigits(num) {
    if (num < 20) return ones[num]
    const t = Math.floor(num / 10)
    const o = num % 10
    return `${tens[t]}${o ? " " + ones[o] : ""}`.trim()
  }
  function threeDigits(num) {
    const h = Math.floor(num / 100)
    const r = num % 100
    return `${h ? ones[h] + " Hundred" : ""}${h && r ? " " : ""}${r ? twoDigits(r) : ""}`.trim()
  }

  const crore = Math.floor(n / 10000000)
  const lakh = Math.floor((n % 10000000) / 100000)
  const thousand = Math.floor((n % 100000) / 1000)
  const hundred = n % 1000

  const parts = []
  if (crore) parts.push(`${twoDigits(crore)} Crore`)
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))

  return `${parts.join(" ")} Rupees only`.trim()
}

export function formatINR(n) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(n || 0),
    )
  } catch {
    return `₹ ${n}`
  }
}
