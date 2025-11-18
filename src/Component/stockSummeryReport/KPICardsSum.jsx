"use client";

import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Package, Layers, TrendingUp } from "lucide-react";

export default function KPICardsSum({ totalProducts = 0, totalQty = 0, totalStockValue = 0 }) {

  // Format ₹ 1,34,000 style
  const formatINR = (num) => {
    if (!num || isNaN(num)) return "0";
    return num.toLocaleString("en-IN");
  };

  // Final dynamic cards
  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      subtitle: "Unique product count",
      icon: Package,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Quantity",
      value: totalQty,
      subtitle: "Items in stock",
      icon: Layers,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Stock Value",
      value: totalStockValue,
      subtitle: "Total worth",
      icon: TrendingUp,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    }
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
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {cards.map((card, index) => {
        const IconComponent = card.icon;

        return (
          <motion.div
            key={index}
            variants={item}
            className={`rounded-2xl p-4 border shadow-sm flex flex-col gap-2 ${card.bg}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[13px] font-semibold text-slate-700">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold mt-1 text-slate-900">
                  <CountUp
                    start={0}
                    end={card.value}
                    duration={1}
                    formattingFn={(val) => formatINR(val)}
                  />
                </h3>
              </div>

              <div className={`p-3 rounded-xl shadow-md ${card.iconBg}`}>
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <p className="text-xs text-slate-600">{card.subtitle}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
