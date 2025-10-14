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



function App() {

  return (
    <>
      <ScrollToTop />
      <div className="w-100 ease-soft-spring h-[100%]  !bg-[#F6FAFB]  duration-1000 ">
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/purches-list" element={<Purchasemain />} />


          <Route path="/purches-invoice" element={<PurchesInvoice />} />
          <Route path ="/create-account" element={<CreateCompany />} />

          <Route path="/company-listing" element={<ComapnyListing />} />





          <Route path="/sells" element={<SellListing />} />
          <Route path="/sells-invoice" element={<SellsInvoice />} />
          <Route path="/stock-transfer" element={<StockTransferList />} />
          <Route path="/new-transfer" element={<NewStockTransferPage />} />
          <Route path="/items" element={<MianItemspage />} />






        </Routes>
      </div>
    </>
  );
}

export default App;
