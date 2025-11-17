import React from 'react'

const SaleModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const formatDate = (date) => date.toLocaleDateString('en-IN');
  const formatAmount = (amount) => '₹' + amount.toLocaleString('en-IN');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sale Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Invoice No</p>
                <p className="font-medium text-gray-900">{transaction.details.invoiceNo}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{formatDate(transaction.date)}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium text-green-600">{formatAmount(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-gray-600">Items Count</p>
                <p className="font-medium text-gray-900">{transaction.details.itemCount}</p>
              </div>
            </div>
          </div>

          {/* Party Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Party Details</h3>
            <div>
              <p className="text-gray-600 text-sm">Party Name</p>
              <p className="font-medium text-gray-900">{transaction.partyName}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Item Name</span>
                <span className="text-gray-600">Qty × Price</span>
              </div>
              {[...Array(transaction.details.itemCount)].map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span className="text-gray-900">Product {i + 1}</span>
                  <span className="text-gray-900">1 × ₹5,000</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Print
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
