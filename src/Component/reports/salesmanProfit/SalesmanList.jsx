'use client';

import { motion } from 'framer-motion';
import SalesmanListRow from './SalesmanListRow';

export default function SalesmanList({ data, onSelectTransaction }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-slate-500">No transactions found</p>
        </div>
      ) : (
        data.map((transaction) => (
          <motion.div key={transaction.id} variants={item}>
            <SalesmanListRow
              transaction={transaction}
              onView={() => onSelectTransaction(transaction)}
            />
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
