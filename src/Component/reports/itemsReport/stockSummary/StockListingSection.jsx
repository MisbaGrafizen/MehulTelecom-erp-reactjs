"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import StockItemModal from "./StockItemModal";

export default function StockListingSection({ items = [], loading, onViewItem }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ⭐ Determine Status Badge & Color
  const getStatusBadge = (qty) => {
    if (qty === 0) return { label: "Out of stock", color: "text-red-600" };
    if (qty <= 3) return { label: "Low stock", color: "text-orange-600" };
    return { label: "OK", color: "text-green-600" };
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Item Name</th>
              {/* <th className="px-4 py-3 text-left">Category</th> */}
              <th className="px-4 py-3 text-left">Purchase Date</th>
              <th className="px-4 py-3 text-left">Specs</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Price/Unit</th>
              <th className="px-4 py-3 text-right">Stock Value</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-slate-500">
                  No stock records found
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const status = getStatusBadge(item.qty);

                return (
                  <motion.tr
                    key={item.purchaseId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-t border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <td className="px-3 py-2 font-semibold text-slate-900 text-[13px]">
                      {item.itemName}
                    </td>

                    {/* <td className="px-3 py-2 text-slate-600 text-[13px]">
                      {item.category || "-"}
                    </td> */}

                    <td className="px-3 py-2 text-slate-600 text-[13px]">
                      {new Date(item.purchaseDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-3 py-2 text-slate-500 text-[13px]">
                      {item.specification || item.modelNo || "-"}
                    </td>

                    <td className="px-3 py-2 text-right font-semibold text-slate-900 text-[13px]">
                      {item.qty}
                    </td>

                    <td className="px-3 py-2 text-right text-blue-600 font-semibold text-[13px]">
                      ₹{item.pricePerUnit.toLocaleString("en-IN")}
                    </td>

                    <td className="px-3 py-2 text-right text-slate-700 text-[13px]">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>

                    <td className={`px-3 py-2 font-semibold text-[13px] ${status.color}`}>
                      {status.label}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <motion.button
                        onClick={() => handleViewItem(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      {showModal && selectedItem && (
        <StockItemModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
