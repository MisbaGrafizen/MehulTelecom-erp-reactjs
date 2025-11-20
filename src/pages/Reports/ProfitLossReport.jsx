'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import FilterSection from '../../Component/reports/profit&loss/FilterSection'
import KpiCards from '../../Component/reports/profit&loss/KpiCards'
import PLBreakdown from '../../Component/reports/profit&loss/PLBreakdown'
import Header from '../../Component/header/Header'
import SideBar from '../../Component/sidebar/SideBar'

export default function ProfitLossReport() {
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        branch: 'all',
        search: '',
    })

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
                                    <FilterSection filters={filters} setFilters={setFilters} />
                                </motion.div>

                                {/* KPI Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <KpiCards />
                                </motion.div>

                                {/* P&L Breakdown */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <PLBreakdown />
                                </motion.div>
                            </div>
                        </div>
                          </div> 
                           </div> 
                           </section>
        </>
    )
}
