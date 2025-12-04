"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ApiGet } from "../../../helper/axios";

import FilterSection from "../../../Component/reports/itemsReport/itemwiseProfitLoss/FilterSection";
import KpiCards from "../../../Component/reports/itemsReport/itemwiseProfitLoss/KpiCards";
import ItemTable from "../../../Component/reports/itemsReport/itemwiseProfitLoss/ItemTable";
import Header from "../../../Component/header/Header";
import SideBar from "../../../Component/sidebar/SideBar";

export default function ItemWisePLReport() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    category: "All Categories",
    selectedItem: "All Items",
    search: "",
  });

  const [items, setItems] = useState([]);
  const [itemNames, setItemNames] = useState(["All Items"]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------------------
  // 🔥 Fetch Item-wise Profit/Loss
  // -----------------------------------------------------
  const fetchItemPL = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      // --------------------------
      // ⭐ Apply Filters
      // --------------------------
      if (filters.selectedItem !== "All Items" && filters.selectedItem)
        query.append("itemName", filters.selectedItem.trim());

      if (filters.category !== "All Categories" && filters.category)
        query.append("category", filters.category.trim());

      if (filters.search)
        query.append("search", filters.search.trim());

      if (filters.fromDate)
        query.append("fromDate", filters.fromDate);

      if (filters.toDate)
        query.append("toDate", filters.toDate);

      const url = `/admin/item-wise-pl?${query.toString()}`;
      const res = await ApiGet(url);

      const list = res?.data?.items || []; // ⭐ CORRECT PATH

      setItems(list);

      // ⭐ Dynamic Item Names
      const dynamicItems = [...new Set(list.map((i) => i.name))];
      setItemNames(["All Items", ...dynamicItems]);

      // ⭐ Dynamic Categories
      const dynamicCats = [...new Set(list.map((i) => i.category))];
      setCategories(["All Categories", ...dynamicCats]);

      setLoading(false);
    } catch (e) {
      console.log("❌ Error fetching PL report:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemPL();
  }, [filters]);

  // -------------------------------------------
  // 🔢 KPI Calculations
  // -------------------------------------------
  const totalSale = items.reduce((sum, i) => sum + (i.totalSale || 0), 0);
  const totalPurchase = items.reduce((sum, i) => sum + (i.totalPurchase || 0), 0);
  const totalProfit = items.reduce((sum, i) => sum + (i.profit || 0), 0);

  return (
    <>
      <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
        <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[98vh]">

          <Header pageName="Item Wise Profit Loss" />

          <div className="flex gap-[10px] w-full h-full">
            <SideBar />

            <div className="flex w-full max-h-[95%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-[100%]"
              >
                <div className="w-full flex flex-col gap-[20px]">

                  {/* ⭐ UPDATED Filter Section */}
                  <FilterSection
                    filters={filters}
                    setFilters={setFilters}
                    itemList={itemNames}
                    categoryList={categories}
                  />

                  {/* ⭐ KPI Cards */}
                  <KpiCards
                    totalSale={totalSale}
                    totalPurchase={totalPurchase}
                    totalProfit={totalProfit}
                    loading={loading}
                  />

                  {/* ⭐ Table */}
                  <ItemTable items={items} loading={loading} />
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
