"use client";

import { motion } from "framer-motion";
import ProfitLossBadge from "./ProfitLossBadge";

export default function PartyPLRow({ serial, transaction, onView }) {
  const isProfit = transaction.type === "Sale";   // Sale = profit, Purchase = loss
  const amount = transaction.amount || 0;

  return (
    <motion.div
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="px-6 py-4 grid grid-cols-4 gap-4 items-center 
                 border-slate-200 cursor-pointer transition"
      onClick={onView}
    >
      <div className="text-slate-600 text-sm">{serial}</div>

      <div className="font-semibold text-slate-900">
        {transaction.partyName || "Unnamed Party"}
      </div>

      <div className="text-right text-slate-900 font-medium">
        ₹{amount.toLocaleString()}
      </div>

      <div className="text-right">
        <ProfitLossBadge 
          value={amount} 
          isProfit={isProfit} 
        />
      </div>
    </motion.div>
  );
}
