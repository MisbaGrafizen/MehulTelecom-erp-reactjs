// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import inventory from "../../../public/imges/sidebar/inventory.png";
// import sales from "../../../public/imges/sidebar/sales.png";
// import settings from "../../../public/imges/sidebar/settings.png";
// import purches from "../../../public/imges/sidebar/purches.png";
// import expan from "../../../public/imges/sidebar/expan.png";
// import newsales from "../../../public/imges/sidebar/newsales.png";

// export default function SideBar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const menuItems = [
//     { name: "Transfer", icon: inventory, path: "/stock-transfer" },
//     { name: "Sales", icon: sales, path: "/sells" },
//     { name: "Purchases", icon: purches, path: "/purches-list" },
//     { name: "Company", icon: newsales, path: "/company-listing" },
//     { name: "Settings", icon: settings, path: "/create-account" },
//     { name: "Items", icon: expan, path: "/items" },
//   ];

//   // Function to check active state including subpaths
//   const isActive = (path) => {
//     return location.pathname === path || location.pathname.startsWith(path + "/");
//   };

//   return (
//     <div className="flex min-w-[110px] max-w-[120px] overflow-y-auto rounded-[10px] py-[10px] bs-giri h-[86vh]">
//       <div className="flex flex-col gap-[7px] w-full">
//         {menuItems.map((item, index) => {
//           const active = isActive(item.path);
//           return (
//             <div
//               key={index}
//               className={`flex w-[80%] rounded-[10px] flex-col text-[10px] gap-[3px] items-center font-Poppins py-[5px] mx-auto justify-center h-fit cursor-pointer transition-all ${
//                 active
//                   ? "bg-[#F68D18] text-white"
//                   : "bg-transparent text-white hover:bg-white/10"
//               }`}
//               onClick={() => navigate(item.path)}
//             >
//               <img
//                 className="w-[29px] h-[29px]"
//                 src={item.icon}
//                 alt={item.name}
//               />
//               <p className="flex text-[12px]">{item.name}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";

import inventory from "../../../public/imges/sidebar/inventory.png";
import sales from "../../../public/imges/sidebar/sales.png";
import settings from "../../../public/imges/sidebar/settings.png";
import purches from "../../../public/imges/sidebar/purches.png";
import expan from "../../../public/imges/sidebar/expan.png";
import newsales from "../../../public/imges/sidebar/newsales.png";
import Party from "../../../public/imges/sidebar/people.png";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Transfer", icon: inventory, path: "/stock-transfer", faIcon: faExchangeAlt },
    { name: "Sales", icon: sales, path: "/sells", faIcon: faShoppingCart },
    { name: "Purchases", icon: purches, path: "/purches-list", faIcon: faIndustry },
    { name: "Company", icon: newsales, path: "/company-listing", faIcon: faBuilding },
    { name: "Settings", icon: settings, path: "/create-account", faIcon: faCog },
    { name: "Items", icon: expan, path: "/items", faIcon: faBoxes },
    { name: "Party", icon: Party, path: "/party-listing", faIcon: faUsers },
  ];

  const isActive = (path) => {
    const base = path.endsWith("/") ? path.slice(0, -1) : path;
    return (
      location.pathname === base || location.pathname.startsWith(base + "/")
    );
  };

  return (
    <>
      {/* 🔹 Desktop Sidebar */}
      <div className="hidden md:flex min-w-[110px] max-w-[120px] overflow-y-auto rounded-[10px] py-[10px] bs-giri h-[86vh]">
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
                onClick={() => navigate(item.path)}
              >
                <img
                  className="w-[29px] h-[29px]"
                  src={item.icon}
                  alt={item.name}
                />
                <p className="flex text-[12px] font-medium">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0  bs-giri left-0 right-0 z-50  text-white shadow-lg h-[70px] flex justify-around items-center rounded-t-[10px] px-2">
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
            <FontAwesomeIcon
              icon={item.faIcon}
              className="text-[18px] mb-[3px]"
            />
            {item.name}
          </NavLink>
        ))}
      </div>
    </>
  );
}
