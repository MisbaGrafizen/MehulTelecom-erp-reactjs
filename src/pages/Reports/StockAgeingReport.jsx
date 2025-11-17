'use client';

import { useState } from 'react';
import { Search, FileText, Download } from 'lucide-react';
import FilterSection  from '../../Component/reports/ageingReport/FilterSection';
import { KpiCards } from '../../Component/reports/ageingReport/KpiCards';
import { StockAgeList } from '../../Component/reports/ageingReport/StockAgeList';
import { StockAgeModal } from '../../Component/reports/ageingReport/StockAgeModal';
import Header from '../../Component/header/Header';
import SideBar from '../../Component/sidebar/SideBar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function StockAgeingReport() {
    const [selectedStock, setSelectedStock] = useState(null);
    const [filters, setFilters] = useState({
        stockType: 'All Stock',
        ageFilter: '30 Days',
        fromDate: null,
        toDate: null,
        search: '',
    });

    // Sample data
    const stockData = [
        {
            id: 1,
            product: 'iPhone 14 Pro Max',
            imei: '353569150186508',
            quantity: 12,
            purchaseDate: '2024-08-15',
            ageDays: 24,
            condition: 'New',
            specs: '256GB, Space Black',
            category: 'Mobiles',
            stockValue: 1200000,
            status: 'OK',
        },
        {
            id: 2,
            product: 'Samsung Galaxy S24',
            imei: '358223087156432',
            quantity: 8,
            purchaseDate: '2024-07-10',
            ageDays: 60,
            condition: 'New',
            specs: '512GB, Phantom Black',
            category: 'Mobiles',
            stockValue: 720000,
            status: 'Old',
        },
        {
            id: 3,
            product: 'Apple Watch Series 9',
            imei: '357098123456789',
            quantity: 15,
            purchaseDate: '2024-08-20',
            ageDays: 19,
            condition: 'New',
            specs: '45mm, Midnight',
            category: 'Watches',
            stockValue: 225000,
            status: 'OK',
        },
        {
            id: 4,
            product: 'OnePlus 12',
            imei: '357123456789012',
            quantity: 5,
            purchaseDate: '2024-06-15',
            ageDays: 105,
            condition: 'Refurbished',
            specs: '256GB, Obsidian',
            category: 'Mobiles',
            stockValue: 175000,
            status: 'Low',
        },
        {
            id: 5,
            product: 'AirPods Pro 2',
            imei: '357445623127654',
            quantity: 25,
            purchaseDate: '2024-09-01',
            ageDays: 8,
            condition: 'New',
            specs: 'USB-C, White',
            category: 'Accessories',
            stockValue: 125000,
            status: 'OK',
        },
    ];

    // Calculate KPI values
    const totalStock = stockData.reduce((sum, item) => sum + item.quantity, 0);
    const highAgeingStock = stockData
        .filter((item) => item.ageDays > 30)
        .reduce((sum, item) => sum + item.quantity, 0);
    const oldStock = stockData
        .filter((item) => item.ageDays > 30)
        .reduce((sum, item) => sum + item.quantity, 0);

    return (

        <>

            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Stock Ageing Report" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
                        <div className="w-[100%]">
                            <div className=" px-[10px] w-[100%] space-y-4">
                                {/* Filter Section */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <FilterSection filters={filters} setFilters={setFilters} />

                                </LocalizationProvider>
                                <KpiCards totalStock={totalStock} highAgeingStock={highAgeingStock} oldStock={oldStock} />

                                {/* Stock Listing */}
                                <StockAgeList data={stockData} onViewClick={setSelectedStock} />
                            </div>

                            {/* Modal */}
                            {selectedStock && (
                                <StockAgeModal data={selectedStock} onClose={() => setSelectedStock(null)} />
                            )}
                        </div>
                    </div>
                                  </div>
                </div>
            </section>
        </>
    );
}
