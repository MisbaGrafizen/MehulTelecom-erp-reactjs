'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import FilterSection from '../../Component/reports/profit&loss/FilterSection'
import KpiCards from '../../Component/reports/profit&loss/KpiCards'
import PLBreakdown from '../../Component/reports/profit&loss/PLBreakdown'
import Header from '../../Component/header/Header'
import SideBar from '../../Component/sidebar/SideBar'
import { ApiGet } from '../../helper/axios'

export default function ProfitLossReport() {
    const [branches, setBranches] = useState([]);

     const [kpi, setKpi] = useState({
   totalProfit: 0,
   totalLoss: 0,
   netPL: 0,
 });

const [breakdown, setBreakdown] = useState({
  particulars: [],
  stock: [],
  directExpenses: [],
  taxPayable: [],
  taxReceivable: [],
  otherIncome: [],
  indirectExpenses: [],
  grossProfit: 0,
  netProfit: 0,
});

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        branch: 'all',
        search: '',
    })

    const fetchBranches = async () => {
  try {
    const res = await ApiGet("/admin/branches");
    console.log('res', res)
    setBranches(res?.branches || []);
  } catch (error) {
    console.log("Branches Fetch Error:", error);
  }
};


const fetchPLReport = async () => {
  try {
    const cleanFilters = {};

    if (filters.fromDate) cleanFilters.fromDate = filters.fromDate;
    if (filters.toDate) cleanFilters.toDate = filters.toDate;
    if (filters.branch !== "all") cleanFilters.branch = filters.branch;
    if (filters.search.trim() !== "") cleanFilters.search = filters.search;

    const query = new URLSearchParams(cleanFilters).toString();

    const res = await ApiGet(`/admin/profit-loss-report?${query}`);
    console.log("res", res);

    setKpi({
      totalProfit: res?.kpi?.totalProfit || 0,
      totalLoss: res?.kpi?.totalLoss || 0,
      netPL: res?.kpi?.netPL || 0,
    });

    setBreakdown({
      particulars: res?.breakdown?.particulars || [],
      stock: res?.breakdown?.stock || [],
      directExpenses: res?.breakdown?.directExpenses || [],
      taxPayable: res?.breakdown?.taxPayable || [],
      taxReceivable: res?.breakdown?.taxReceivable || [],
      otherIncome: res?.breakdown?.otherIncome || [],
      indirectExpenses: res?.breakdown?.indirectExpenses || [],
      grossProfit: res?.breakdown?.grossProfit || 0,
      netProfit: res?.breakdown?.netProfit || 0,
    });

  } catch (error) {
    console.log("P&L API Error:", error);
  }
};


 useEffect(() => {
    fetchBranches();
    fetchPLReport();
 }, [filters])

    return (
        <>
            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Profit & Loss Report" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">


                            <div className=" bg-slate-50  w-[100%]">
           
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                   <FilterSection
  filters={filters}
  setFilters={setFilters}
  branches={branches}
/>

                                </motion.div>

                                {/* KPI Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <KpiCards kpi={kpi} />
                                </motion.div>

                                {/* P&L Breakdown */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                   <PLBreakdown breakdown={breakdown} />

                                </motion.div>
                            </div>
                        </div>
                          </div> 
                           </div> 
                           </section>
        </>
    )
}
