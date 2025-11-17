'use client';

import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Package,
  AlertCircle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function KPICardsSum() {
  const cards = [
    {
      title: "Total Items",
      value: 799,
      subtitle: "Updated live",
      icon: Package,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: 585,
      subtitle: "Below threshold",
      icon: AlertCircle,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Total Stock Value",
      value: 12900000,
      subtitle: "Inventory worth",
      icon: TrendingUp,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Out of Stock",
      value: 142,
      subtitle: "Pending restock",
      icon: AlertTriangle,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card, index) => {
        const IconComp = card.icon;

        return (
          <motion.div
            key={index}
            variants={item}
            className={`
              rounded-2xl 
              p-3
              flex flex-col gap-1
              shadow-sm 
              border 
              ${card.bg} 
              border-slate-200 
            `}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              {/* LEFT SIDE */}
              <div>
                <p className="text-[13px] font-semibold text-slate-700">
                  {card.title}
                </p>

                <h3 className="text-3xl font-[600] mt-1 text-slate-900">
                  <CountUp end={card.value} duration={1.2} separator="," />
                </h3>
              </div>

              {/* ICON BOX */}
              <div className={`p-3  shadow-md rounded-xl ${card.iconBg} border border-white`}>
                <IconComp className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* SUBTITLE */}
            <p className="text-xs text-slate-600 ">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
