import React from 'react'

const TransactionTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => setActiveTab('moneyIn')}
        className={`flex-1 px-4 py-4 text-sm font-medium tracking-wide transition-colors ${
          activeTab === 'moneyIn'
            ? 'text-red-600 border-b-2 border-red-600'
            : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
        }`}
      >
        Money In
      </button>
      <button
        onClick={() => setActiveTab('moneyOut')}
        className={`flex-1 px-4 py-4 text-sm font-medium tracking-wide transition-colors ${
          activeTab === 'moneyOut'
            ? 'text-red-600 border-b-2 border-red-600'
            : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
        }`}
      >
        Money Out
      </button>
    </div>
  );
};

export default TransactionTabs;

