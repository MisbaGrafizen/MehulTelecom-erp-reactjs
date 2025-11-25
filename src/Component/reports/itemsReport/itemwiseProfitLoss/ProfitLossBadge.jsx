export default function ProfitLossBadge({ amount }) {
  const isProfit = amount >= 0

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
        isProfit
          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
          : "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200"
      }`}
    >
      ₹{Math.abs(amount).toLocaleString()}
    </span>
  )
}
