

import React, { useEffect, useState } from "react";
import "../src/App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ScrollToTop from "./Component/Scrooltop";
import LoginPage from "./pages/authPage/LoginPage";

import PurchesInvoice from "./pages/purches/PurchesInvoice";
import Login from "./pages/authPage/Login";
import Purchasemain from "./pages/purches/Purchasemain";



function App() {

  return (
    <>
      <ScrollToTop />
      <div className="w-100 ease-soft-spring h-[100%]  !bg-[#F6FAFB]  duration-1000 ">
        <Routes>
        
          <Route path="/" element={<Login />} />
          <Route path="/purches-List" element={<Purchasemain />} />

       
          <Route path="/purches-invoice" element={<PurchesInvoice />} />
        
        </Routes>
      </div>
    </>
  );
}

export default App;
