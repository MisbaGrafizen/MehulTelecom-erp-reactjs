const TransactionList = ({ transactions, isMoneyIn, onTransactionClick, total }) => {
  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-IN', options);
  };

  const formatAmount = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          onClick={() => onTransactionClick(transaction)}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            index === 0 ? 'rounded-t-lg' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{transaction.partyName}</p>
              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                <span>{formatDate(transaction.date)}</span>
                <span className={`px-2 py-1 rounded-full ${
                  transaction.type === 'Sale' ? 'bg-blue-100 text-blue-700' :
                  transaction.type === 'Purchase' ? 'bg-orange-100 text-orange-700' :
                  transaction.type === 'Transfer' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {transaction.type}
                </span>
              </div>
            </div>
            <div className={`text-right font-semibold ${isMoneyIn ? 'text-green-600' : 'text-red-600'}`}>
              {isMoneyIn ? '+' : '−'} {formatAmount(transaction.amount)}
            </div>
          </div>
        </div>
      ))}

      {/* Total Row */}
      <div className="p-4 bg-gray-50 flex justify-between items-center font-bold text-gray-900">
        <span>{isMoneyIn ? 'Total Money In' : 'Total Money Out'}</span>
        <span className={isMoneyIn ? 'text-green-600' : 'text-red-600'}>
          {isMoneyIn ? '+' : '−'} ₹{(total / 100000).toFixed(2)} Cr
        </span>
      </div>
    </div>
  );
};

export default TransactionList;
