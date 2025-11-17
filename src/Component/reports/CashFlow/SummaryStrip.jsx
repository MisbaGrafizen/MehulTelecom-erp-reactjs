const SummaryStrip = ({ closingCash, openingCash, moneyIn, moneyOut }) => {
  const formatAmount = (amount) => {
    return '₹' + (amount / 100000).toFixed(2) + ' Cr';
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
      {/* Closing Cash - Red */}
      <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100">
        <p className="text-xs text-red-600 font-medium mb-1">Closing Cash</p>
        <p className="text-lg sm:text-xl font-bold text-red-600">{formatAmount(closingCash)}</p>
      </div>

      {/* Opening Cash - Blue */}
      <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
        <p className="text-xs text-blue-600 font-medium mb-1">= Opening Cash</p>
        <p className="text-lg sm:text-xl font-bold text-blue-600">{formatAmount(openingCash)}</p>
      </div>

      {/* Money In - Green */}
      <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
        <p className="text-xs text-green-600 font-medium mb-1">+ Money In</p>
        <p className="text-lg sm:text-xl font-bold text-green-600">{formatAmount(moneyIn)}</p>
      </div>

      {/* Money Out - Pink/Red */}
      <div className="bg-pink-50 rounded-xl p-4 shadow-sm border border-pink-100">
        <p className="text-xs text-pink-600 font-medium mb-1">- Money Out</p>
        <p className="text-lg sm:text-xl font-bold text-pink-600">{formatAmount(moneyOut)}</p>
      </div>
    </div>
  );
};

export default SummaryStrip;
