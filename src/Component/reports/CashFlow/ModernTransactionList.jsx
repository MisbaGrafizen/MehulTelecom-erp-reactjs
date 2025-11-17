import React from 'react';
import { ChevronRight, Eye } from 'lucide-react';



const ModernTransactionList = ({ transactions, isMoneyIn, onTransactionClick, total }) => {
  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return date.toLocaleDateString('en-IN', options);
  };

  const formatAmount = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const getTypeColor = (type) => {
    const colors = {
      Sale: 'bg-blue-100 text-blue-700 border-blue-200',
      Purchase: 'bg-orange-100 text-orange-700 border-orange-200',
      Transfer: 'bg-purple-100 text-purple-700 border-purple-200',
      Receipt: 'bg-green-100 text-green-700 border-green-200',
      Expense: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[type] || colors.Sale;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4   bg-gray-100 border-b border-slate-200 text-xs font-[500] text-slate-600 uppercase tracking-wider">
        <div className="col-span-3">Party Name</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Reference</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {/* Transaction Rows */}
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            onClick={() => onTransactionClick(transaction)}
            className="group px-6 py-2 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Party Name */}
              <div className="col-span-3">
                <p className="font-[500] text-slate-900 text-[14px] truncate">{transaction.partyName}</p>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <p className="text-[13px] text-slate-600">{formatDate(transaction.date)}</p>
              </div>

              {/* Type Badge */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2 py-[2px] rounded-xl text-[10px] font-semibold border ${getTypeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-[13px] text-slate-600 font-medium">
                  {transaction.details?.invoiceNo ||
                    transaction.details?.poNo ||
                    transaction.details?.transferNo ||
                    'REF-' + transaction.id}
                </p>
              </div>

              {/* Amount */}
              <div className="col-span-2 text-right">
                <p className={`text-[13px] font-[500] ${isMoneyIn ? 'text-green-600' : 'text-red-600'}`}>
                  {isMoneyIn ? '+' : '−'} {formatAmount(transaction.amount)}
                </p>
              </div>

              {/* View Icon */}
              <div className="col-span-1 flex justify-end">
                <Eye size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Footer */}
      <div className="grid grid-cols-12 gap-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-[500]">
        <div className="col-span-10">
          {isMoneyIn ? 'Total Money In' : 'Total Money Out'}
        </div>
        <div className="col-span-2 text-right text-xl">
          {isMoneyIn ? '+' : '−'} ₹{(total / 100000).toFixed(2)} Cr
        </div>
      </div>
    </div>
  );
};

export default ModernTransactionList;
