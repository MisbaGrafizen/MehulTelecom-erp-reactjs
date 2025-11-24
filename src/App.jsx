import React, { useEffect, useState } from "react";
import "../src/App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ScrollToTop from "./Component/Scrooltop";

import PurchesInvoice from "./pages/purches/PurchesInvoice";
import Login from "./pages/authPage/Login";
import Purchasemain from "./pages/purches/Purchasemain";
import ComapnyListing from "./pages/companyManage/ComapnyListing";
import SellListing from "./pages/sell/SellListing";
import SellsInvoice from "./pages/sell/SellsInvoice";
import CreateCompany from "./pages/companyManage/CreateCompany";
import StockTransferList from "./pages/stockTransferFolder/StockTransferList";
import NewStockTransferPage from "./pages/stockTransferFolder/NewStockTransferPage";
import MianItemspage from "./pages/items/MainItemsPage";
import PartyList from "./pages/party/PartyList";
import PurchaseReport from "./pages/Reports/PurchaseReport";
import SalesReport from "./pages/Reports/SalesReport";
import StockTransferReport from "./pages/Reports/StockTransferReport";
import DayBookReport from "./pages/Reports/DayBookReport";
import CashflowReport from "./pages/Reports/CashflowReport";
import StockSummaryReport from "./pages/Reports/StockSummaryReport";
import { StockAgeingReport } from "./pages/Reports/StockAgeingReport";
import SalesmanProfitLoss from "./pages/Reports/SalesmanProfitLoss";
import AllTransactions from "./pages/Reports/AllTransactions";
import ProfitLossReport from "./pages/Reports/ProfitLossReport";
import PartyStatement from "./pages/Reports/Party Report/PartyStatement";
import PartyWisePLReport from "./pages/Reports/Party Report/PartyWisePLReport";
import AllPartyReport from "./pages/Reports/Party Report/AllPartyReport";



function App() {

  return (
    <>
      <ScrollToTop />
      <div className="w-100 ease-soft-spring h-[100%]  !bg-[#F6FAFB]  duration-1000 ">
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/purches-list" element={<Purchasemain />} />
          <Route path="/purches-invoice" element={<PurchesInvoice />} />
          <Route path="/create-account" element={<CreateCompany />} />
          <Route path="/company-listing" element={<ComapnyListing />} />
          <Route path="/sells" element={<SellListing />} />
          <Route path="/sells-invoice" element={<SellsInvoice />} />
          <Route path="/stock-transfer" element={<StockTransferList />} />
          <Route path="/stock-transfer/new-transfer" element={<NewStockTransferPage />} />
          <Route path="/items" element={<MianItemspage />} />
          <Route path="/party-listing" element={<PartyList />} />
          <Route path="/reports/purchase-report" element={<PurchaseReport />} />
          <Route path="/reports/sales-report" element={<SalesReport />} />
          <Route path="/reports/purchase-report" element={<PurchaseReport />} />
          <Route path="/reports/transfer-report" element={<StockTransferReport />} />
          <Route path="/reports/day-book" element={<DayBookReport />} />
          <Route path="/reports/cash-flow-report" element={<CashflowReport />} />
          <Route path="/reports/stock-summery-report" element={<StockSummaryReport />} />
          <Route path="/reports/stock-ageing-report" element={<StockAgeingReport />} />
          <Route path="/reports/salesman-wise-profit&loss" element={<SalesmanProfitLoss />} />
          <Route path="/reports/all-transections" element={<AllTransactions />} />
          <Route path="/reports/profit-loss-report" element={<ProfitLossReport />} />
          <Route path="/reports/party-statement" element={<PartyStatement />} />
          <Route path="/reports/party-wise-profit-loss" element={<PartyWisePLReport />} />
          <Route path="/reports/all-party-report" element={<AllPartyReport />} />














        </Routes>
      </div>
    </>
  );
}

export default App;
