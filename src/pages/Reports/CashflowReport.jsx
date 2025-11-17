'use client';

import { useState, useMemo } from 'react';
import FilterBar from '../../Component/reports/CashFlow/FilterBar';
import SummaryStrip from '../../Component/reports/CashFlow/SummaryStrip';
import TransactionTabs from '../../Component/reports/CashFlow/TransactionTabs';
import TransactionList from '../../Component/reports/CashFlow/TransactionList';
import SaleModal from '../../Component/reports/modals/SaleModalCash';
import PurchaseModal from '../../Component/reports/modals/PurchaseModalCash';
import TransferModal from '../../Component/reports/modals/TransferModalCash';
import { ArrowLeft, Search, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernKPICards from '../../Component/reports/CashFlow/ModernKPICards';
import ModernTransactionTabs from '../../Component/reports/CashFlow/ModernTransactionTabs';
import ModernTransactionList from '../../Component/reports/CashFlow/ModernTransactionList';
import Header from '../../Component/header/Header';
import SideBar from '../../Component/sidebar/SideBar';

const CashflowReport = () => {
    const [activeTab, setActiveTab] = useState('moneyIn');
    const [filters, setFilters] = useState({
        dateRange: 'This Month',
        fromDate: null,
        toDate: null,
    });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalType, setModalType] = useState(null);

    // Mock data
    const mockTransactions = {
        moneyIn: [
            {
                id: 1,
                partyName: 'Rajesh Mobile Store',
                date: new Date('2024-11-10'),
                type: 'Sale',
                amount: 25000,
                details: { invoiceNo: 'INV-001', itemCount: 5 },
            },
            {
                id: 2,
                partyName: 'Sharma Electronics',
                date: new Date('2024-11-08'),
                type: 'Sale',
                amount: 45000,
                details: { invoiceNo: 'INV-002', itemCount: 8 },
            },
            {
                id: 3,
                partyName: 'Receipt from Supplier',
                date: new Date('2024-11-05'),
                type: 'Receipt',
                amount: 15000,
                details: { receiptNo: 'REC-001' },
            },
            {
                id: 4,
                partyName: 'Joshi Tech',
                date: new Date('2024-11-01'),
                type: 'Sale',
                amount: 55000,
                details: { invoiceNo: 'INV-003', itemCount: 10 },
            },
        ],
        moneyOut: [
            {
                id: 5,
                partyName: 'Samsung India',
                date: new Date('2024-11-09'),
                type: 'Purchase',
                amount: 80000,
                details: { poNo: 'PO-001', itemCount: 20 },
            },
            {
                id: 6,
                partyName: 'Apple Distribution',
                date: new Date('2024-11-07'),
                type: 'Purchase',
                amount: 120000,
                details: { poNo: 'PO-002', itemCount: 15 },
            },
            {
                id: 7,
                partyName: 'Branch Mumbai',
                date: new Date('2024-11-04'),
                type: 'Transfer',
                amount: 30000,
                details: { transferNo: 'TR-001' },
            },
            {
                id: 8,
                partyName: 'Rent Payment',
                date: new Date('2024-11-01'),
                type: 'Expense',
                amount: 25000,
                details: { expenseNo: 'EXP-001' },
            },
        ],
    };

    const totalMoneyIn = mockTransactions.moneyIn.reduce((sum, t) => sum + t.amount, 0);
    const totalMoneyOut = mockTransactions.moneyOut.reduce((sum, t) => sum + t.amount, 0);
    const closingCash = 150000 + totalMoneyIn - totalMoneyOut;
    const openingCash = 150000;

    const currentTransactions = activeTab === 'moneyIn'
        ? mockTransactions.moneyIn
        : mockTransactions.moneyOut;

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setModalType(transaction.type.toLowerCase());
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedTransaction(null);
    };

    return (

        <>

            <section className="flex w-full font-Poppins h-full select-none p-[15px] pr-0 overflow-hidden">
                <div className="flex w-full flex-col overflow-hidden gap-[14px] h-[96vh]">
                    <Header pageName="Cash Flow Report" />
                    <div className="flex gap-[10px] w-full h-full">
                        <SideBar />
                        <div className="flex w-full max-h-[90%] pb-[50px] md:pr-[12px] overflow-y-auto gap-[30px] rounded-[10px]">




                            <main className=" w-[100%]">
                                {/* Filter Bar */}
                                <FilterBar filters={filters} setFilters={setFilters} />

                                <div className='  z-0 relative'>


                                    <ModernKPICards
                                        closingCash={closingCash}
                                        openingCash={openingCash}
                                        moneyIn={totalMoneyIn}
                                        moneyOut={totalMoneyOut}
                                    />
                                </div>
                                <div className=' border mb-4 shadow-sm  rounded-[14px] w-fit p-[7px]'>


                                    <ModernTransactionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                                </div>
                                {/* Transaction List with Animation */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ModernTransactionList
                                            transactions={currentTransactions}
                                            isMoneyIn={activeTab === 'moneyIn'}
                                            onTransactionClick={handleTransactionClick}
                                            total={activeTab === 'moneyIn' ? totalMoneyIn : totalMoneyOut}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </main>

                            {/* Modals */}
                            <AnimatePresence>
                                {modalType === 'sale' && (
                                    <SaleModal transaction={selectedTransaction} onClose={handleCloseModal} />
                                )}
                                {modalType === 'purchase' && (
                                    <PurchaseModal transaction={selectedTransaction} onClose={handleCloseModal} />
                                )}
                                {modalType === 'transfer' && (
                                    <TransferModal transaction={selectedTransaction} onClose={handleCloseModal} />
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};



export default CashflowReport;
