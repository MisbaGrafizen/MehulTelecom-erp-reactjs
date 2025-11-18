'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import StockHeader from './StockHeader';
// import ModernFilterBar from './ModernFilterBar';
// import KPICards from './KPICards';
// import StockListingSection from './StockListingSection';
// import TotalStockStrip from './TotalStockStrip';
import Header from '../../Component/header/Header';
import SideBar from '../../Component/sidebar/SideBar';
import ModernFilterBar from '../../Component/stockSummeryReport/ModernFilterBar';
import KPICardsSum from '../../Component/stockSummeryReport/KPICardsSum';
import StockListingSection from '../../Component/stockSummeryReport/StockListingSection';
import TotalStockStrip from '../../Component/stockSummeryReport/TotalStockStrip';
import { ApiGet } from '../../helper/axios';

export default function StockSummaryReport() {
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
    const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQty: 0,
    totalStockValue: 0,
});
const [filterOptions, setFilterOptions] = useState({
    categories: [],
    branches: [],
    products: [],
});


const [stockItems, setStockItems] = useState([]);

const fetchStockSummary = async () => {
    try {
        const query = new URLSearchParams({
            fromDate: filters.fromDate || "",
            toDate: filters.toDate || "",
            category: filters.category,
            stockStatus: filters.stockStatus,
            company: filters.company,
            branch: filters.branch || "all",
            search: filters.search,
        }).toString();

        const res = await ApiGet(`/admin/stock-summary?${query}`);
        console.log("SUMMARY RESPONSE:", res);

        setSummary(res.summary || {});
        setStockItems(res.items || []);

        // NEW: set dropdown options
        setFilterOptions({
            categories: res.categories || [],
            branches: res.branches || [],
            products: res.products || [],
        });

    } catch (error) {
        console.log("STOCK SUMMARY FETCH ERROR:", error);
    }
};


useEffect(() => {
    fetchStockSummary();
}, [filters]);



    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleViewItem = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
            <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                <Header pageName="Stock Summary Report" />
                <div className="flex gap-[10px] w-full h-full">
                    <SideBar />
                    <div className="flex w-full max-h-[96%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className=" w-[100%]"
                        >

                            <div className=" w-[100%] space-y-4">
   <ModernFilterBar
    onFilterChange={handleFilterChange}
    filters={filters}
    options={filterOptions}
/>

                               <KPICardsSum
    totalProducts={summary.totalProducts}
    totalQty={summary.totalQty}
    totalStockValue={summary.totalStockValue}
/>

<StockListingSection
    onViewItem={handleViewItem}
    filters={filters}
    items={stockItems.map(i => ({
        ...i,
        purchaseDate: new Date(i.purchaseDate)
    }))}
/>

                            </div>
<TotalStockStrip
    totalQty={summary.totalQty}
    totalStockValue={summary.totalStockValue}
/>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
