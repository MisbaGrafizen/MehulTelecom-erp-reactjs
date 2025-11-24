export default function ProfitLossBadge({ value, isProfit }) {
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
        isProfit
          ? "from-green-100 to-green-200 text-green-700"
          : "from-red-100 to-red-200 text-red-700"
      }`}
    >
      {isProfit ? "+" : "-"}₹{Math.abs(value).toLocaleString()}
    </div>
  );
}
