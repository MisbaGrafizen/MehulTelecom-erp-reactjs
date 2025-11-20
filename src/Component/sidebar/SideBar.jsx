// import React, { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate, NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faExchangeAlt,
//   faShoppingCart,
//   faIndustry,
//   faBuilding,
//   faCog,
//   faBoxes,
//   faUsers,
//   faChartBar,
//   faFileInvoiceDollar,
//   faCashRegister,
//   faFileAlt,
//   faChartPie,
//   faUserTie,
// } from "@fortawesome/free-solid-svg-icons";

// import inventory from "../../../public/imges/sidebar/inventory.png";
// import sales from "../../../public/imges/sidebar/sales.png";
// import settings from "../../../public/imges/sidebar/settings.png";
// import purches from "../../../public/imges/sidebar/purches.png";
// import expan from "../../../public/imges/sidebar/expan.png";
// import newsales from "../../../public/imges/sidebar/newsales.png";
// import Party from "../../../public/imges/sidebar/people.png";
// import reports from "../../../public/imges/sidebar/reports.png";


// export default function SideBar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const role = (localStorage.getItem("role") || "").toLowerCase();

//   const [openReports, setOpenReports] = useState(false);
//   const sidebarRef = useRef(null);
//   const reportsRef = useRef(null);

//   // 🔹 Detect click outside of Reports sidebar
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         reportsRef.current &&
//         !reportsRef.current.contains(event.target) &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target)
//       ) {
//         setOpenReports(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   let menuItems = [
//     { name: "Transfer", icon: inventory, path: "/stock-transfer", faIcon: faExchangeAlt },
//     { name: "Sales", icon: sales, path: "/sells", faIcon: faShoppingCart },
//     { name: "Purchases", icon: purches, path: "/purches-list", faIcon: faIndustry },
//     { name: "Items", icon: expan, path: "/items", faIcon: faBoxes },
//     { name: "Party", icon: Party, path: "/party-listing", faIcon: faUsers },
//     { name: "Reports", icon: reports, path: "/reports", faIcon: faChartBar },
//   ];
//   if (role === "admin") {
//     menuItems.splice(3, 0, { name: "Company", icon: newsales, path: "/company-listing", faIcon: faBuilding });
//     menuItems.push({ name: "Settings", icon: settings, path: "/create-account", faIcon: faCog });
//   }
//   const reportsSubmenu = [
//     { name: "Purchase Report", icon: faFileInvoiceDollar, path: "/reports/purchase-report" },
//     { name: "Sells Report", icon: faFileInvoiceDollar, path: "/reports/sales-report" },
//     { name: " Transfer Report", icon: faExchangeAlt, path: "/reports/transfer-report" },
//     { name: "Day Book", icon: faChartPie, path: "/reports/day-book" },
//     // { name: "Total Upi Payment", icon: faCashRegister, path: "/reports/upi-payment" },

//     { name: "Cash Flow Report", icon: faFileAlt, path: "/reports/cash-flow-report" },
//     { name: "Sotck Summary Report", icon: faIndustry, path: "/reports/stock-summery-report" },
//     { name: "Edging Stock REPORT", icon: faChartPie, path: "/reports/stock-ageing-report" },
//     { name: "SALESMAN WISE PROFIT/LOSS", icon: faUserTie, path: "/reports/salesman-wise-profit&loss" },

//   ];

//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + "/");

//   return (
//     <div className="relative flex">
//       {/* 🔹 Main Sidebar */}
//       <div
//         ref={sidebarRef}
//         className="hidden md:flex min-w-[110px] max-w-[120px] flex-col overflow-y-auto rounded-[10px] py-[10px] bs-giri h-[86vh]"
//       >
//         <div className="flex flex-col gap-[7px] w-full">
//           {menuItems.map((item, index) => {
//             const active = isActive(item.path);

//             return (
//               <div
//                 key={index}
//                 className={`flex w-[80%] rounded-[10px] flex-col text-[10px] gap-[3px] items-center font-Poppins py-[5px] mx-auto justify-center h-fit cursor-pointer transition-all duration-200 ${active
//                   ? "bg-[#F68D18] text-white shadow-md scale-[1.03]"
//                   : "bg-transparent text-white hover:bg-white/10"
//                   }`}
//                 onClick={() => {
//                   if (item.name === "Reports") {
//                     setOpenReports((prev) => !prev); // toggle on click
//                   } else {
//                     navigate(item.path);
//                     setOpenReports(false); // close when navigating elsewhere
//                   }
//                 }}
//               >
//                 <img className="w-[29px] h-[29px]" src={item.icon} alt={item.name} />
//                 <p className="flex text-[12px] font-medium">{item.name}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 🔹 Reports Sub-sidebar (Click to open, click outside to close) */}
//       {openReports && (
//         <div
//           ref={reportsRef}
//           className="absolute left-[115px] top-0 w-[210px] font-Poppins h-[85vh] bg-white text-gray-800 shadow-xl rounded-r-[10px] overflow-y-auto transition-all duration-300 z-50"
//         >
//           <div className="p-3 border-b border-dashed border-gray-200 font-semibold text-[#F68D18] text-sm">
//             Reports
//           </div>
//           <div className="flex flex-col mt-2">
//             {reportsSubmenu.map((report, i) => {
//               const active = isActive(report.path);
//               return (
//                 <div
//                   key={i}
//                   className={`flex items-center  border-b gap-2 px-1 py-[7px] text-sm cursor-pointer border-l-4 ${active
//                     ? "border-[#F68D18] bg-orange-50 text-[#F68D18] font-semibold"
//                     : " border-l-transparent border-b-blue-100 text-gray-600 hover:bg-blue-50 hover:text-[#291eff]"
//                     } transition-all`}
//                   onClick={() => {
//                     navigate(report.path);
//                     setOpenReports(true); // keep open when inside reports
//                   }}
//                 >
//                   <FontAwesomeIcon icon={report.icon} className="w-3 h-3" />
//                   <span className=" font-[400] text-[12px]">{report.name}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* 🔹 Mobile Bottom Navigation */}
//       <div className="md:hidden fixed bottom-0 bs-giri left-0 right-0 z-50 text-white shadow-lg h-[70px] flex justify-around items-center rounded-t-[10px] px-2">
//         {menuItems.map((item, index) => (
//           <NavLink
//             key={index}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex flex-col items-center  justify-center text-[11px] transition-all duration-200 ${isActive ? "text-[#F68D18] scale-110" : "text-gray-300"
//               }`
//             }
//           >
//             <FontAwesomeIcon icon={item.faIcon} className="text-[18px] mb-[3px]" />
//             <p className=" font-[600]">

//             </p>
//             {item.name}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faShoppingCart,
  faIndustry,
  faBuilding,
  faCog,
  faBoxes,
  faUsers,
  faChartBar,
  faFileInvoiceDollar,
  faFileAlt,
  faChartPie,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

import inventory from "../../../public/imges/sidebar/inventory.png";
import sales from "../../../public/imges/sidebar/sales.png";
import settings from "../../../public/imges/sidebar/settings.png";
import purches from "../../../public/imges/sidebar/purches.png";
import expan from "../../../public/imges/sidebar/expan.png";
import newsales from "../../../public/imges/sidebar/newsales.png";
import Party from "../../../public/imges/sidebar/people.png";
import reports from "../../../public/imges/sidebar/reports.png";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toLowerCase();

  const [openReports, setOpenReports] = useState(false);
  const sidebarRef = useRef(null);
  const reportsRef = useRef(null);

  // Close report panel when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reportsRef.current &&
        !reportsRef.current.contains(event.target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setOpenReports(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Main sidebar items
  let menuItems = [
    { name: "Transfer", icon: inventory, path: "/stock-transfer", faIcon: faExchangeAlt },
    { name: "Sales", icon: sales, path: "/sells", faIcon: faShoppingCart },
    { name: "Purchases", icon: purches, path: "/purches-list", faIcon: faIndustry },
    { name: "Items", icon: expan, path: "/items", faIcon: faBoxes },
    { name: "Party", icon: Party, path: "/party-listing", faIcon: faUsers },
    { name: "Reports", icon: reports, path: "/reports", faIcon: faChartBar },
  ];

  if (role === "admin") {
    menuItems.splice(3, 0, { name: "Company", icon: newsales, path: "/company-listing", faIcon: faBuilding });
    menuItems.push({ name: "Settings", icon: settings, path: "/create-account", faIcon: faCog });
  }

  // Report submenus grouped
  const transactionReports = [
    { name: "Sale Report", path: "/reports/sales-report", icon: faFileInvoiceDollar },
    { name: "Purchase Report", path: "/reports/purchase-report", icon: faFileInvoiceDollar },
    { name: "Day Book", path: "/reports/day-book", icon: faChartPie },
    { name: "All Transactions", path: "/reports/all-transections", icon: faFileAlt },
    { name: "Bill Wise Profit", path: "/reports/bill-wise-profit", icon: faChartPie },
    { name: "Profit & Loss", path: "/reports/profit-loss-report", icon: faChartPie },
    { name: "Cashflow", path: "/reports/cash-flow-report", icon: faFileAlt },
    { name: "Balance Sheet", path: "/reports/balance-sheet", icon: faChartBar },
  ];

  const partyReports = [
    { name: "Party Statement", path: "/reports/party-statement", icon: faUsers },
    { name: "Party Wise Profit & Loss", path: "/reports/party-wise-profit-loss", icon: faUserTie },
    { name: "All Parties Report", path: "/reports/all-parties", icon: faUsers },
    { name: "Party Report by Items", path: "/reports/party-report-items", icon: faBoxes },
    { name: "Sale/Purchase by Party", path: "/reports/sale-purchase-party", icon: faIndustry },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="relative flex">
      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className="hidden md:flex min-w-[110px] max-w-[120px] flex-col overflow-y-auto rounded-[10px] py-[10px] bs-giri h-[86vh]"
      >
        <div className="flex flex-col gap-[7px] w-full">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <div
                key={index}
                className={`flex w-[80%] rounded-[10px] flex-col text-[10px] gap-[3px] items-center font-Poppins py-[5px] mx-auto justify-center h-fit cursor-pointer transition-all duration-200 ${
                  active
                    ? "bg-[#F68D18] text-white shadow-md scale-[1.03]"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
                onClick={() => {
                  if (item.name === "Reports") {
                    setOpenReports((prev) => !prev);
                  } else {
                    navigate(item.path);
                    setOpenReports(false);
                  }
                }}
              >
                <img className="w-[29px] h-[29px]" src={item.icon} alt={item.name} />
                <p className="flex text-[12px] font-medium">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reports Submenu (Grouped) */}
      {openReports && (
        <div
          ref={reportsRef}
          className="absolute left-[115px] top-0 w-[220px] font-Poppins h-[85vh] bg-white text-gray-800 shadow-xl rounded-r-[10px] overflow-y-auto transition-all duration-300 z-50"
        >
          {/* Transaction Reports */}
          <div className="p-3 border-b border-gray-200 font-semibold text-[#F68D18] text-sm">
            Transaction
          </div>
          <div className="flex flex-col">
            {transactionReports.map((report, i) => {
              const active = isActive(report.path);
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-2 py-[8px] text-sm cursor-pointer border-l-4 ${
                    active
                      ? "border-[#F68D18] bg-orange-50 text-[#F68D18] font-semibold"
                      : "border-l-transparent text-gray-600 hover:bg-blue-50 hover:text-[#F68D18]"
                  }`}
                  onClick={() => navigate(report.path)}
                >
                  <FontAwesomeIcon icon={report.icon} className="w-3 h-3" />
                  <span className="text-[12px]">{report.name}</span>
                </div>
              );
            })}
          </div>

          {/* Party Reports */}
          <div className="p-3 border-b border-gray-200 font-semibold text-[#F68D18]  bg-[#ececec45] text-sm mt-2">
            Party Reports
          </div>
          <div className="flex flex-col">
            {partyReports.map((report, i) => {
              const active = isActive(report.path);
              return (
                <div
                  key={i}
                  className={`flex items-center border-b gap-2 px-2 py-[8px] text-sm cursor-pointer border-l-4 ${
                    active
                      ? "border-[#F68D18] bg-orange-50 text-[#F68D18] font-semibold"
                      : "border-l-transparent text-gray-600 hover:bg-blue-50 hover:text-[#F68D18]"
                  }`}
                  onClick={() => navigate(report.path)}
                >
                  <FontAwesomeIcon icon={report.icon} className="w-3 h-3" />
                  <span className="text-[12px]">{report.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 bs-giri left-0 right-0 z-50 text-white shadow-lg h-[70px] flex justify-around items-center rounded-t-[10px] px-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-[11px] transition-all duration-200 ${
                isActive ? "text-[#F68D18] scale-110" : "text-gray-300"
              }`
            }
          >
            <FontAwesomeIcon icon={item.faIcon} className="text-[18px] mb-[3px]" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
