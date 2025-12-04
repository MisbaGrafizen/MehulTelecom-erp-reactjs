"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ModernFilterBar from "../../../Component/reports/itemsReport/stockSummary/ModernFilterBar";
import KPICards from "../../../Component/reports/itemsReport/stockSummary/KPICards";
import StockListingSection from "../../../Component/reports/itemsReport/stockSummary/StockListingSection";
import TotalStockStrip from "../../../Component/reports/itemsReport/stockSummary/TotalStockStrip";
import Header from "../../../Component/header/Header";
import SideBar from "../../../Component/sidebar/SideBar";

import { ApiGet } from "../../../helper/axios";

export default function StockSummaryReportItem() {
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    category: "all_items",
    stockStatus: "all",
    company: "all",
    search: "",
  });

  const [kpiData, setKPIData] = useState({
    totalProducts: 0,
    totalQty: 0,
    totalStockValue: 0,
  });

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); // ⭐ Dynamic categories from API

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // 🔥 Fetch API Based on Filters
  // ------------------------------------------------------------
  const fetchStockSummary = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (filters.search) query.append("search", filters.search);
      if (filters.category !== "all_items") query.append("category", filters.category);
      if (filters.stockStatus !== "all") query.append("stockStatus", filters.stockStatus);
      if (filters.company !== "all") query.append("company", filters.company);

      if (filters.fromDate)
        query.append("fromDate", new Date(filters.fromDate).toISOString());
      if (filters.toDate)
        query.append("toDate", new Date(filters.toDate).toISOString());

      const url = `/admin/stock-summary?${query.toString()}`;

      const res = await ApiGet(url);
      console.log('res', res)

      // ⭐ Correct API structure
      const { items, summary, categories } = res || {};

      setItems(items || []);
      setKPIData(summary || {});
      setCategories(categories || []); // REAL categories from backend

      setLoading(false);
    } catch (error) {
      console.log("❌ Error fetching stock summary:", error);
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🔄 Run API whenever filters change
  // ------------------------------------------------------------
  useEffect(() => {
    fetchStockSummary();
  }, [filters]);

  // ------------------------------------------------------------
  // 🔍 Modal View
  // ------------------------------------------------------------
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
                          
    


            <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-[100%]"
              >
                <div className="flex flex-col gap-[20px] mb-[10px]">

                  {/* 🔹 Filter Bar */}
                  <ModernFilterBar
                    onFilterChange={setFilters}
                    filters={filters}
                    categories={categories} // ⭐ Use backend categories
                  />

                  {/* 🔹 KPI Cards */}
                  <KPICards kpi={kpiData} loading={loading} />

                  {/* 🔹 Items Listing */}
                  <StockListingSection
                    items={items}
                    filters={filters}
                    loading={loading}
                    onViewItem={handleViewItem}
                  />
                </div>

                {/* 🔹 Total Stock Summary */}
                <TotalStockStrip kpi={kpiData} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
