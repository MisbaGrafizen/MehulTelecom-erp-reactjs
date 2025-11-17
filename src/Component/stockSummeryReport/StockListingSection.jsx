'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import StockItemModal from './StockItemModal';

export default function StockListingSection() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const stockItems = [
    {
      id: 1,
      name: 'APPLE WATCH 7 45MM BLACK',
      category: 'Watches',
      purchaseDate: '14 Nov 2025',
      specs: '45MM | Aluminum',
      quantity: 1,
      price: '₹35,999',
      stockValue: '₹10,000',
      imei: 'AWM-2024-001',
      status: 'Good',
    },
    {
      id: 2,
      name: 'SAMSUNG GALAXY S24 ULTRA',
      category: 'Mobiles',
      purchaseDate: '12 Nov 2025',
      specs: '12GB | 256GB | Titanium',
      quantity: 5,
      price: '₹1,29,999',
      stockValue: '₹6,49,995',
      imei: 'SGS-2024-024',
      status: 'Good',
    },
    {
      id: 3,
      name: 'ONEPLUS 13',
      category: 'Mobiles',
      purchaseDate: '10 Nov 2025',
      specs: '16GB | 512GB | Black',
      quantity: 0,
      price: '₹89,999',
      stockValue: '₹0',
      imei: 'OPS-2024-013',
      status: 'Out of Stock',
    },
    {
      id: 4,
      name: 'BOAT AIRDOPES 131',
      category: 'Accessories',
      purchaseDate: '08 Nov 2025',
      specs: 'TWS | Black',
      quantity: 2,
      price: '₹2,999',
      stockValue: '₹5,998',
      imei: 'BAT-2024-131',
      status: 'Low Stock',
    },
  ];

  const getStatusBadge = (status) => {
    if (status === 'Good') return "bg-green-100 text-green-700";
    if (status === 'Low Stock') return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const openView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>


      {/* 📘 Table Section */}
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
              <th className="px-4 py-2 font-semibold">IMEI / Ref</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {stockItems.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-4 py-2">
                  <p className="font-[500] text-[14px] text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.purchaseDate}</p>
                </td>

                <td className="px-4 py-2 text-[13px] text-slate-600">{item.specs}</td>

                <td className="px-4 py-2 text-sm font-[500] text-slate-700">
                  {item.quantity} <span className="text-slate-700">pcs</span>
                </td>

                <td className="px-4 py-2 text-xs font-[500] font-mono text-slate-700">{item.imei}</td>

                <td className="px-4 py-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>

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
            ))}
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
