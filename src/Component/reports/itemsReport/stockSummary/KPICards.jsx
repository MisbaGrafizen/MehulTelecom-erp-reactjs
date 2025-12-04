"use client";

import { motion } from "framer-motion";
import { Package, AlertCircle, TrendingUp, AlertTriangle } from "lucide-react";

export default function KPICards({ kpi = {}, loading }) {
  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toLocaleString("en-IN");
  };

  const formatCurrency = (num) => {
    if (!num) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const cards = [
    {
      title: "Total No. of Items",
      value: loading ? "…" : formatNumber(kpi.totalProducts),
      subtitle: "Updated live",
      icon: Package,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      trend: null,
      badge: null,
    },
    {
      title: "Total Qty",
      value: loading ? "…" : formatNumber(kpi.totalQty),
      subtitle: "Total item quantity",
      icon: AlertCircle,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      trend: null,
      badge: null,
    },
    {
      title: "Total Stock Value",
      value: loading ? "…" : formatCurrency(kpi.totalStockValue),
      subtitle: "Total inventory worth",
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      trend: null,
      badge: null,
    },
    {
      title: "Out of Stock Items",
      value: "0", // Backend not giving this → you can add later
      subtitle: "Pending replenishment",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      trend: null,
      badge: null,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, idx) => {
        const IconComponent = card.icon;

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${card.bgGradient} shadow-sm hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer`}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-15 transition-opacity`}
            />

            {/* Decorative circle */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white opacity-5 group-hover:opacity-10 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 mb-1">
                    {card.title}
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {card.value}
                  </h3>
                </div>

                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <IconComponent
                    className={`w-5 h-5 bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">{card.subtitle}</p>

                {card.trend && (
                  <span className="text-xs font-semibold text-green-600">
                    {card.trend}
                  </span>
                )}

                {card.badge && (
                  <span
                    className={`px-2 py-1 text-xs font-bold text-white rounded ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
