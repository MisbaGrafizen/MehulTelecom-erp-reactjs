'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import StockItemModal from './StockItemModal';

export default function StockListingSection({ items = [], onViewItem }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Auto status based on qty
  const getStatusBadge = (qty) => {
    if (qty === 0) return { text: "Out of Stock", class: "bg-red-100 text-red-700" };
    if (qty <= 2) return { text: "Low Stock", class: "bg-orange-100 text-orange-700" };
    return { text: "Good", class: "bg-green-100 text-green-700" };
  };

  const openView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden shadow-md rounded-xl border border-slate-200 bg-white"
      >
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr className="text-slate-700 text-sm">
              <th className="px-4 py-2 font-semibold">Product</th>
              <th className="px-4 py-2 font-semibold">Specs</th>
              <th className="px-4 py-2 font-semibold">Stock</th>
              <th className="px-4 py-2 font-semibold">Price</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No stock items found
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const status = getStatusBadge(item.qty);

                return (
                  <motion.tr
                    key={item.purchaseId + idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    {/* Product name */}
                    <td className="px-4 py-2">
                      <p className="font-[500] text-[14px] text-slate-900">{item.itemName}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(item.purchaseDate).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Specs */}
                    <td className="px-4 py-2 text-[13px] text-slate-600">
                      {item.specification || "-"}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-2 text-sm font-[500] text-slate-700">
                      {item.qty} <span className="text-slate-700">pcs</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-2 text-sm font-semibold text-slate-800">
                      ₹{item.pricePerUnit.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.class}`}>
                        {status.text}
                      </span>
                    </td>

                    {/* View Button */}
                    <td className="px-4 py-2 text-right">
                      <motion.button
                        onClick={() => openView(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 text-sm rounded-lg flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 shadow-sm ml-auto"
                      >
                        <Eye className="w-4 h-4" />
                        View
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
