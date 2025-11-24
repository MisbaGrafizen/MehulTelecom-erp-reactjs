'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import StockItemModal from './StockItemModal';

export default function StockListingSection({ onViewItem, filters }) {
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
      purchasePrice: '₹35,999',
      stockValue: '₹10,000',
      status: 'good',
      imei: 'AWM-2024-001',
      currentStockValue: '₹10,000',
      statusBadge: 'OK',
    },
    {
      id: 2,
      name: 'SAMSUNG GALAXY S24 ULTRA',
      category: 'Mobiles',
      purchaseDate: '12 Nov 2025',
      specs: '12GB RAM | 256GB ROM | Titanium Gray',
      quantity: 5,
      purchasePrice: '₹1,29,999',
      stockValue: '₹6,49,995',
      status: 'good',
      imei: 'SGS-2024-024',
      currentStockValue: '₹6,49,995',
      statusBadge: 'OK',
    },
    {
      id: 3,
      name: 'ONEPLUS 13',
      category: 'Mobiles',
      purchaseDate: '10 Nov 2025',
      specs: '16GB RAM | 512GB ROM | Black',
      quantity: 0,
      purchasePrice: '₹89,999',
      stockValue: '₹0',
      status: 'outofstock',
      imei: 'OPS-2024-013',
      currentStockValue: '₹0',
      statusBadge: 'Out of stock',
    },
    {
      id: 4,
      name: 'BOAT AIRDOPES 131',
      category: 'Accessories',
      purchaseDate: '08 Nov 2025',
      specs: 'TWS | Black | Touch Controls',
      quantity: 2,
      purchasePrice: '₹2,999',
      stockValue: '₹5,998',
      status: 'lowstock',
      imei: 'BAT-2024-131',
      currentStockValue: '₹5,998',
      statusBadge: 'Low stock',
    },
  ];

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'lowstock':
        return 'text-orange-600';
      case 'outofstock':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
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
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Purchase Date</th>
              <th className="px-4 py-3 text-left">Specs</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-right">Purchase Price</th>
              <th className="px-4 py-3 text-right">Stock Value</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-t border-slate-200 hover:bg-slate-50 transition-all"
              >

                <td className="px-3  text-[13px] py-2 font-semibold text-slate-900">{item.name}</td>
                <td className="px-3  text-[13px] py-2 text-slate-600">{item.category}</td>
                <td className="px-3  text-[13px] py-2 text-slate-600">{item.purchaseDate}</td>
                <td className="px-3  text-[13px] py-2 text-slate-500">{item.specs}</td>
                <td className="px-3  text-[13px] py-2 text-right font-semibold text-slate-900">{item.quantity}</td>
                <td className="px-3  text-[13px] py-2 text-right font-semibold text-blue-600">{item.purchasePrice}</td>
                <td className="px-3  text-[13px] py-2 text-right text-slate-700">{item.stockValue}</td>
                <td className={`px-3  text-[13px] py-2 font-semibold ${getStatusColor(item.status)}`}>
                  {item.statusBadge}
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
            ))}
          </tbody>
        </table>
      </motion.div>

      {showModal && selectedItem && (
        <StockItemModal item={selectedItem} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
