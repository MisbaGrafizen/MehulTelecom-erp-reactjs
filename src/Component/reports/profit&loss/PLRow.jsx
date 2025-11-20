'use client'

export default function PLRow({ label, amount, positive, negative }) {
  const getAmountColor = () => {
    if (positive) return 'text-green-600'
    if (negative) return 'text-red-600'
    return 'text-slate-600'
  }

  const getAmountSymbol = () => {
    if (positive) return '+'
    if (negative) return '−'
    return ''
  }

  const formattedAmount = `${getAmountSymbol()}₹${(amount / 100000).toFixed(2)}L`

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-slate-700 text-sm">{label}</span>
      <span className={`font-semibold text-sm ${getAmountColor()}`}>
        {formattedAmount}
      </span>
    </div>
  )
}
