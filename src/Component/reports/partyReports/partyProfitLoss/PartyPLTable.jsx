"use client";

import { useState } from "react";
import PartyPLRow from "./PartyPLRow";
import PartyPLModal from "./modal/PartyPLModal";

export default function PartyPLTable({ parties, selectedRowData, setSelectedRowData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (transaction) => {
    setSelectedRowData(transaction);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 
                        grid grid-cols-4 gap-4 font-medium text-slate-700 text-sm">
          <div>Serial No</div>
          <div>Party Name</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Profit / Loss</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-200">
          {parties.map((transaction, idx) => (
            <PartyPLRow
              key={transaction.id}
              serial={idx + 1}
              transaction={transaction}
              onView={() => handleRowClick(transaction)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedRowData && (
        <PartyPLModal
          partyData={selectedRowData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
