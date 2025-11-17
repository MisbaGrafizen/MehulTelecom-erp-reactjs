'use client';

import { motion } from 'framer-motion';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const KPICard = ({ icon: Icon, title, value, subtitle, gradient, trend }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`relative rounded-xl p-6 shadow-lg overflow-hidden text-white`}
    style={{
      background: gradient,
    }}
  >
    {/* Gradient circle icon on right */}
    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 bg-white" />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-">
        <div>
          <p className="text-sm font-medium opacity-90">{subtitle}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
            {/* {trend && (
              <span className="text-sm font-semibold flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded">
                {trend.icon} {trend.text}
              </span>
            )} */}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white bg-opacity-20">
          <Icon />
        </div>
      </div>
      <p className="text-xs opacity-75">{title}</p>
    </div>
  </motion.div>
);

export default function KPICards({ totalSales, totalPurchase, totalProfit, totalLoss }) {
  const ShoppingCart = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const Receipt = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const TrendUp = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  const TrendDown = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <KPICard
        icon={ShoppingCart}
        title="Total Sales"
        subtitle="Total Sales Amount"
        value={formatCurrency(totalSales)}
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        trend={{ icon: '↑', text: '+12%' }}
      />

      <KPICard
        icon={Receipt}
        title="Total Purchase"
        subtitle="Total Purchase Cost"
        value={formatCurrency(totalPurchase)}
        gradient="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
      />

      <KPICard
        icon={TrendUp}
        title="Total Profit"
        subtitle="Net Profit"
        value={formatCurrency(totalProfit)}
        gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        trend={{ icon: '+', text: '+8%' }}
      />

      <KPICard
        icon={TrendDown}
        title="Total Loss"
        subtitle="Net Loss"
        value={formatCurrency(totalLoss)}
        gradient="linear-gradient(135deg, #ef4444 0%, #ea580c 100%)"
      />
    </div>
  );
}
