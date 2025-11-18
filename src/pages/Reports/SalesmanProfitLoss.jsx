'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import FilterSection from '../../Component/reports/salesmanProfit/FilterSection';
import KPICards from '../../Component/reports/salesmanProfit/KPICards';
import SalesmanList from '../../Component/reports/salesmanProfit/SalesmanList';
import ProfitLossModal from '../../Component/reports/salesmanProfit/ProfitLossModal';
import Header from '../../Component/header/Header';
import SideBar from '../../Component/sidebar/SideBar';
import { ApiGet } from '../../helper/axios';

const DUMMY_DATA = [
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    imei: '359575900000001',
    qty: 2,
    purchasePrice: 115000,
    salePrice: 125000,
    profitLoss: 20000,
    isProfit: true,
    salesmanName: 'Rajesh Kumar',
    condition: 'New',
    purchaseDate: '2024-11-01',
    category: 'Smartphones',
    brand: 'Apple',
  },
  {
    id: 2,
    productName: 'Samsung Galaxy S24',
    imei: '359575900000002',
    qty: 1,
    purchasePrice: 85000,
    salePrice: 80000,
    profitLoss: -5000,
    isProfit: false,
    salesmanName: 'Priya Singh',
    condition: 'New',
    purchaseDate: '2024-11-02',
    category: 'Smartphones',
    brand: 'Samsung',
  },
  {
    id: 3,
    productName: 'OnePlus 12',
    imei: '359575900000003',
    qty: 3,
    purchasePrice: 65000,
    salePrice: 72000,
    profitLoss: 21000,
    isProfit: true,
    salesmanName: 'Rajesh Kumar',
    condition: 'Refurbished',
    purchaseDate: '2024-11-03',
    category: 'Smartphones',
    brand: 'OnePlus',
  },
  {
    id: 4,
    productName: 'Xiaomi 14',
    imei: '359575900000004',
    qty: 1,
    purchasePrice: 55000,
    salePrice: 58000,
    profitLoss: 3000,
    isProfit: true,
    salesmanName: 'Amit Patel',
    condition: 'New',
    purchaseDate: '2024-11-04',
    category: 'Smartphones',
    brand: 'Xiaomi',
  },
  {
    id: 5,
    productName: 'Motorola Edge 50',
    imei: '359575900000005',
    qty: 2,
    purchasePrice: 45000,
    salePrice: 42000,
    profitLoss: -6000,
    isProfit: false,
    salesmanName: 'Priya Singh',
    condition: 'New',
    purchaseDate: '2024-11-05',
    category: 'Smartphones',
    brand: 'Motorola',
  },
];

export default function SalesmanProfitLoss() {
const [selectedTransaction, setSelectedTransaction] = useState(null);

const [filters, setFilters] = useState({
  salesman: "all",
  fromDate: null,
  toDate: null,
  search: "",
});

const [reportData, setReportData] = useState([]);
const [salesmanList, setSalesmanList] = useState([]);

const [summary, setSummary] = useState({
  totalSales: 0,
  totalPurchase: 0,
  totalProfit: 0,
  totalLoss: 0,
});


  // const totalSales = filteredData.reduce((sum, item) => sum + (item.salePrice * item.qty), 0);
  // const totalPurchase = filteredData.reduce((sum, item) => sum + (item.purchasePrice * item.qty), 0);
  // const totalProfit = filteredData.reduce((sum, item) => sum + (item.isProfit ? item.profitLoss : 0), 0);
  // const totalLoss = filteredData.reduce((sum, item) => sum + (!item.isProfit ? Math.abs(item.profitLoss) : 0), 0);

  // const handleFilter = (filters) => {
  //   let filtered = DUMMY_DATA;

  //   if (filters.salesman && filters.salesman !== 'all') {
  //     filtered = filtered.filter(item => item.salesmanName === filters.salesman);
  //   }

  //   if (filters.search) {
  //     const searchLower = filters.search.toLowerCase();
  //     filtered = filtered.filter(item =>
  //       item.productName.toLowerCase().includes(searchLower) ||
  //       item.imei.includes(searchLower)
  //     );
  //   }

  //   setFilteredData(filtered);
  // };

  const handleFilter = (newFilters) => {
  setFilters(newFilters);
};

const fetchReport = async () => {
  try {
    const query = new URLSearchParams({
      salesman: filters.salesman || "all",
      fromDate: filters.fromDate || "",
      toDate: filters.toDate || "",
      search: filters.search || "",
    }).toString();

    const res = await ApiGet(`/admin/salesman-profit?${query}`);
    console.log('res', res)

    setReportData(res.items || []);
    setSummary(res.summary || {});
    setSalesmanList(res.salesmanList || []);

  } catch (err) {
    console.log("REPORT FETCH ERROR:", err);
  }
};

useEffect(() => {
  fetchReport();
}, [filters]);


  return (

    <>

                <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                    <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                        <Header pageName="Sales Man wise Profit/Loss " />
                        <div className="flex gap-[10px] w-full h-full">
                            <SideBar />
                            <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">
    <div className="w-[100%]">


      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
<FilterSection
  filters={filters}
  setFilters={setFilters}
  salesmanList={salesmanList}
  onFilter={handleFilter}
/>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <KPICards
  totalSales={summary.totalSales}
  totalPurchase={summary.totalPurchase}
  totalProfit={summary.totalProfit}
  totalLoss={summary.totalLoss}
/>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
<SalesmanList
  data={reportData}
  onSelectTransaction={setSelectedTransaction}
/>


      </motion.div>

      {selectedTransaction && (
        <ProfitLossModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
    </div>
    </div>
    </div>
    </section>
    </>
  );
}
