'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import ModernFilterBar from '../../../Component/reports/itemsReport/stockSummary/ModernFilterBar';
import KPICards from '../../../Component/reports/itemsReport/stockSummary/KPICards';
import StockListingSection from '../../../Component/reports/itemsReport/stockSummary/StockListingSection';
import TotalStockStrip from '../../../Component/reports/itemsReport/stockSummary/TotalStockStrip';
import Header from '../../../Component/header/Header';
import SideBar from '../../../Component/sidebar/SideBar';

export default function StockSummaryReportItem() {
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    category: 'all',
    stockStatus: 'all',
    company: 'all',
    search: '',
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (

    <>

                <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                    <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[98vh]">
                        <Header pageName="Stock Summary Report" />
                        <div className="flex gap-[10px] w-full h-full">
                            <SideBar />
                            <div className="flex w-full max-h-[95%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" w-[100%]"
    >

      <div className=" flex flex-col gap-[20px] mb-[10px]">
        <ModernFilterBar onFilterChange={handleFilterChange} filters={filters} />
        <KPICards />
        <StockListingSection onViewItem={handleViewItem} filters={filters} />
      </div>
      <TotalStockStrip />
    </motion.div>
  </div>  
  </div>
    </div>
       </section>
    </>
  );
}
