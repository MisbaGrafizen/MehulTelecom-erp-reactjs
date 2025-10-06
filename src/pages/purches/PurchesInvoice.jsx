import { useCallback, useEffect, useRef, useState } from "react";
import SideBar from "../../Component/sidebar/SideBar";
import Header from "../../Component/header/Header";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import { Check } from "lucide-react";
import { Plus, Scan, Pencil } from "lucide-react";
import { Modal as NextUIModal, ModalContent } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";

import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import { X, CheckCircle } from "lucide-react"
import FloatingInput from "../../Component/inputFelleds/FloatingInput";
import MotionDropdown from "../../Component/inputFelleds/MotionDropdown";
import FloatingTextarea from "../../Component/inputFelleds/FloatingTextarea";

export default function PurchesInvoice() {


  const farmers = [
    "Ravi Patel",
    "Suresh Sharma",
    "Amit Kumar",
    "Kishan Bhai",
    "Meena Devi",
    "Rajesh Singh",
  ];



  return (
    <>
      <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Purchese Invoice" />
          <div className="flex gap-[10px] w-[100%] h-[100%]">
            <SideBar />
            <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">
              <div className="flex flex-col gap-[15px] w-[100%]">
                <div className=" w-[100%] ] flex-col gap-[15px] flex ">
                  <div className=" flex justify-between w-[100%] ">
                    <div className=" flex  font-Poppins text-[15px]">
                      <p>Quotation No:</p>
                      <p className="  font-[500] text-[#ff8000] ">
                        Q/20024-25/1
                      </p>
                    </div>
                    <div className=" flex  w-[200px]  items-center gap-[10px]">

                    </div>
                  </div>

                  <div className=" w-[38%] flex   gap-[15px] border-[1px] relative bg-white shadow1-blue py-[15px]  px-[15px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] flex-col gap-[16px]">

                      <div className=" flex ">
                        <MotionDropdown label="Select party" options={farmers} />
                      </div>

                      <FloatingTextarea label="Address" />
                    </div>
                  </div>



                  <div className="bg-white w-[100%] relative  rounded-lg shadow1-blue ">
                    {/* Table Header */}
                    <div

                      className="overflow-x-auto flex-shrink-0  bg-white rounded-lg w-[100%]">
                      <table className="  w-full border-collapse">
                        <thead>
                          <tr className="bg-[#f0f1f364]">
                            <th className="py-4 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
                              Sr. No.
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-40 border-r border-gray-200">
                              Product Name
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              SERIAL NO.
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[115px]  border-r border-gray-200">
                              MODEL NO.
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[108px] border-r border-gray-200">
                              UNIT                       </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[103px] border-r border-gray-200">
                              PRICE/UNIT
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              AMOUNT
                            </th>


                          </tr>
                        </thead>
                        <tbody>


                          <tr

                            className="border-t relative border-gray-200"
                          >
                            <td className="py-2 px-4 text-sm text-gray-600 font-Poppins border-r border-gray-200">
                              1
                            </td>
                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">

                              <input
                                type="text"
                                // ref={(el) => (productNameInputRefs.current[index] = el)}
                                // onKeyDown={(e) => handleKeyDown(e, index)}
                                // value={product.productName}
                                // onChange={(e) => handleProductInputChange(e, index, "productName")}

                                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                autoFocus
                              />

                            </td>
                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                              <input
                                type="number"
                                className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                placeholder="0.00"

                              />
                            </td>
                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                              <input
                                type="number"


                                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                autoFocus
                              />
                            </td>
                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                              <input
                                type="number"
                                name="lessWeight"

                                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                autoFocus
                              />
                            </td>
                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                              <input
                                type="number"
                                name="netWeight"

                                className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                placeholder="0.00"
                              />
                            </td>

                            <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                              <input
                                type="number"

                                className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                placeholder="0.00"
                              />
                            </td>



                          </tr>
                          <tr className="bg-[#f0f1f364]   ">
                            <th className="py-4 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
                              Total
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[165px] border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[115px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[110px] border-r border-gray-200">

                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[104px] border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[104px]  border-r border-gray-200">

                            </th>
                           
                    
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">

                            </th>

                          </tr>
                        </tbody>
                      </table>



                      <div className="px-4 py-3  w-[100%] relative flex  justify-between items-center">
                        <button

                          className="w-[200px] mx-auto py-2  font-Poppins border-[1.5px] border-dashed border-[#60A5FA] text-[#60A5FA] rounded-sm hover:bg-blue-50 transition-colors"
                        >
                          ADD PRODUCT
                        </button>

                      </div>


                    </div>
                  </div>
                  <div className=" flex w-[100%]  justify-between gap-[20px]  mt-[19px] mb-[20px]">
                    <div className="flex w-[50%]  flex-col gap-[15px] ">
                      <div className="bg-white  w-[100%] rounded-lg shadow1-blue  ">

                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Bank Details Card */}
                        <div className="bg-white rounded-lg shadow1-blue p-[30px] relative">
                          <div className="flex justify-between items-start mb-2">
                            <h2 className="text-[#FF6B35] font-Poppins text-[16px] font-[400]">
                              Bank Details
                            </h2>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-[6px]">
                            <div className="flex  items-center  gap-[20px] justify-between">
                              <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                Account Name :
                              </span>
                              <span className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">

                              </span>
                            </div>
                            <div className="flex gap-[20px] justify-between items-center">
                              <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                Account No :
                              </span>
                              <span className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">

                              </span>
                            </div>
                            <div className="flex  items-center  gap-[20px] justify-between">
                              <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                IFSC Code:
                              </span>
                              <span className="text-[#5d5b5b] text-[12px]  gap-[4px] flex fnt-[300] font-Poppins">

                              </span>
                            </div>
                            <div className="flex gap-[20px] justify-between">
                              <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                Bank Name:
                              </span>
                              <div className="flex items-center gap-1">

                                <span className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">

                                </span>
                              </div>
                            </div>
                            <div className="flex  i  gap-[20px] justify-between">
                              <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                Address:
                              </span>
                              <span className="text-[#5d5b5b] text-right text-[12px] fnt-[300] font-Poppins">

                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Terms & Conditions Card */}
                        <div className="bg-white rounded-lg shadow1-blue p-[20px] relative">
                          <div className="flex justify-between items-start mb-[10px]">
                            <h2 className="text-[#FF6B35] font-Poppins text-[16px] font-[400]">
                              Term & Condition
                            </h2>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                          <ol className="list-decimal list-outside ml-4 space-y-2">
                            <li className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">

                            </li>

                          </ol>
                        </div>
                      </div>

                    </div>
                    <div className=" flex w-[48%]">
                      <div className="bg-white  w-[100%]  rounded-lg  shadow1-blue p-6">
                        <div className="space-y-2">

                   
          


          


                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              Cash Payment
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <input
                                  type="text"
                                  name="cashPayment"

                                  className="w-full outline-none text-[15px] py-[9px] px-[10px] font-Poppins font-[400] bg-transparent cursor-pointer"


                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              Online Payment
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <input
                                  type="text"
                                  name="bankPayment"

                                  className="w-full outline-none text-[15px] py-[9px] px-[10px] font-Poppins font-[400] bg-transparent cursor-pointer"


                                />
                              </div>
                            </div>
                          </div>

                          {/* Total Amount */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-[#FF6B35] text-gray-600 font-Poppins text-lg font-medium">
                              TOTAL AMOUNT
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  font-Poppins px-[15px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <p>90</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className=" bs-spj  font-[500] font-Poppins text-[#fff] rounded-[8px] py-[5px] justify-center  text-[18px] mx-auto mt-[10px] flex w-[120px]"

                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <NextUIModal isOpen={partyModalopen}>
        <ModalContent className="md:max-w-[760px] max-w-[740px] shadow-none relative  bg-transparent rounded-2xl z-[700] flex justify-center !py-0 mx-auto  h-[450px]  ">
          <>
            <div className="relative w-[100%] max-w-[730px] mt-[10px]   bg-white  rounded-2xl z-[100] flex justify-center !py-0 mx-auto  h-[96%]">
              <div
                className=" absolute right-[-13px]  top-[-13px]  flex gap-[5px]  z-[300] items-center cursor-pointer py-[5px]  border-red rounded-bl-[8px] px-[5px]"
                onClick={closePartyModal}
              >
                <i className=" text-[30px] text-[red] shadow-delete-icon bg-white   rounded-full fa-solid fa-circle-xmark"></i>
              </div>
              <div className=" flex flex-col gap-[15px] w-[100%]  p-[25px]  ">
                <div>
                  <h1 className=" flex  font-[600] font-Poppins text-[24px]">
                    Create New Party
                  </h1>
                </div>
                <div className="  flex w-[100%] gap-[15px]">
                  <div className=" flex w-[50%] flex-col gap-[16px]">
                    {/* <div
                      ref={createdropdownRef}
                      className="relative w-full border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer"
                      onClick={() => setCreateDropdownOpen((prev) => !prev)} // Toggle dropdown on click
                    >
                      <span
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${createselectedType || groupFocused
                          ? "text-[#000] -translate-y-[21px] "
                          : "text-[#8f8f8f]"
                          }`}
                      >
                        Party Group
                      </span>
                      <input
                        type="text"
                        name="firmType"
                        id="type"
                        value={createselectedType}
                        className="w-full outline-none text-[15px] py-[9px] font-Poppins font-[400] bg-transparent cursor-pointer"
                        readOnly
                        onFocus={() => setGroupFocused(true)}
                        onBlur={() => setGroupFocused(false)}
                      />
                      <i
                        className={
                          createdropdownOpen
                            ? "fa-solid fa-chevron-up text-[14px] pr-[10px]"
                            : "fa-solid fa-chevron-down text-[14px] pr-[10px]"
                        }
                      ></i>
                    </div> 

                    <AnimatePresence>
                      {createdropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute  mt-[50px] bg-white w-[330px] border border-[#dedede] rounded-lg shadow-md z-10"
                        >
                          {[
                            "Sole Proprietorship",
                            "Partnership",
                            "LLC",
                            "Corporation",
                          ].map((type, index) => (
                            <>
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                onClick={() => {
                                  setCreateSelectedType(type);
                                  setCreateDropdownOpen(false);
                                }}
                              >
                                {type}
                              </div>
                            </>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <lavel
                        htmlFor="partyName"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.name || partyNameFocused
                          ? "text-[#000] hidden "
                          : "text-[#8f8f8f]"
                          }`}
                      >
                        Party Name
                      </lavel>
                      <input
                        type="text"
                        name="name"
                        id="partyName"
                        value={formData.name}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyNameFocused(true)}
                        onBlur={() => setPartyNameFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full  border-[1px] border-[#dedede]  h-[97px]  shadow rounded-lg flex items-center space-x-4 text-[#43414199]">
                      <span
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.address || partyAddressFocused
                          ? "text-[#000] -translate-y-[48px] hidden font-[]"
                          : "  -translate-y-[27px] "
                          }`}
                      >
                        Address
                      </span>
                      <textarea
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyAddressFocused(true)}
                        onBlur={(e) =>
                          setPartyAddressFocused(e.target.value !== "")
                        }
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] pt-[10px]  h-[100%] font-Poppins font-[400] bg-transparent"
                      ></textarea>
                    </div>
                    <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <lavel
                        htmlFor="gstNumber"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.GST || partyGstFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f]"
                          }`}
                      >
                        GST Number
                      </lavel>
                      <input
                        type="number"
                        name="GST"
                        id="gstNumber"
                        value={formData.GST}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyGstFocused(true)}
                        onBlur={() => setPartyGstFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="PanParty"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.panNo || partyPanFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        PAN Number
                      </label>
                      <input
                        type="number"
                        name="panNo"
                        id="PanParty"
                        value={formData.panNo}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyPanFocused(true)}
                        onBlur={() => setPartyPanFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                  </div>

                  <div className=" flex w-[50%] gap-[16px] flex-col ">
                    {/* <div
                      ref={firmdropdownRef}
                      className="relative w-full border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer"
                      onClick={() => setFirmDropdownOpen((prev) => !prev)} // Toggle dropdown on click
                    >
                      <label
                        htmlFor="selectFirm"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${firmselectedType || firmFocused
                          ? "text-[#000] -translate-y-[21px] "
                          : "text-[#8f8f8f]"
                          }`}
                      >
                        Firm Type
                      </label>
                      <input
                        type="text"
                        name="firmType"
                        id="selectFirm"
                        value={firmselectedType}
                        className="w-full outline-none text-[15px] py-[9px] font-Poppins font-[400] bg-transparent cursor-pointer"
                        readOnly
                        onFocus={() => setFirmFocused(true)}
                        onBlur={() => setFirmFocused(false)}
                      />
                      <i
                        className={
                          firmdropdownOpen
                            ? "fa-solid fa-chevron-up text-[14px] pr-[10px]"
                            : "fa-solid fa-chevron-down text-[14px] pr-[10px]"
                        }
                      ></i>
                    </div>

                    <AnimatePresence>
                      {firmdropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute  mt-[50px] bg-white w-[230px] border border-[#dedede] rounded-lg shadow-md z-10"
                        >
                          {[
                            "Sole Proprietorship",
                            "Partnership",
                            "LLC",
                            "Corporation",
                          ].map((type, index) => (
                            <>
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                onClick={() => {
                                  setFirmSelectedType(type);
                                  setFirmDropdownOpen(false);
                                }}
                              >
                                {type}
                              </div>
                            </>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="partyState"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.state || partyStateFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        State Name
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="partyState"
                        value={formData.state}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyStateNameFocused(true)}
                        onBlur={() => setPartyStateNameFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="partycity"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.city || partyCityFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        City Name
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="partycity"
                        value={formData.city}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyCityFocused(true)}
                        onBlur={() => setPartyCityFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="partyPin"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.pinCode || partyPinFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        Pin Code
                      </label>
                      <input
                        type="number"
                        name="pinCode"
                        id="partyPin"
                        value={formData.pinCode}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyPinFocused(true)}
                        onBlur={() => setPartyPinFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="partynumber"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.mobileNumber || partyNumberFocused
                          ? "text-[#000] -translate-y-[21px]  hidden"
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        Mobile Number
                      </label>
                      <input
                        type="number"
                        name="mobileNumber"
                        id="partynumber"
                        value={formData.mobileNumber}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyNumberFocused(true)}
                        onBlur={() => setPartyNumberFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                    <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="emailparty"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${formData.email || partyEmailFocused
                          ? "text-[#000] -translate-y-[21px] hidden "
                          : "text-[#8f8f8f] cursor-text"
                          }`}
                      >
                        Email ID
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="emailparty"
                        value={formData.email}
                        onChange={handlePartyInputChange}
                        onFocus={() => setPartyEmailFocused(true)}
                        onBlur={() => setPartyEmailFocused(false)}
                        autoComplete="nasme"
                        className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                <button
                  className=" bs-spj  font-[500] font-Poppins text-[#fff] rounded-[8px] py-[5px] justify-center text-[18px] mx-auto mt-[10px] flex w-[120px]"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </>
        </ModalContent>
      </NextUIModal>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#9b9b9b] bg-opacity-50 backdrop-blur-sm"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center relative justify-center min-h-screen px-4 text-center">
              <motion.div
                initial={{ scale: 0.5, rotateX: 90 }}
                animate={{ scale: 1, rotateX: 0 }}
                exit={{ scale: 0.5, rotateX: -90 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="inline-block w-full relative max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-gradient-to-br bg-white shadow-xl rounded-2xl transform"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#122f97] to-[#02124e]"></div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <CheckCircle className="w-16 h-16 text-[#122f97]" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-[500]  font-Poppins  leading-6 text-center text-[#122f97] mb-2"
                  id="modal-title"
                >
                  Stock Added successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center font-[400] font-Poppins  text-[#122f97] mb-4"
                >
                  Your information has been successfully saved to our database.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 flex justify-center"
                >
                  <button
                    onClick={onClose}
                    className="inline-flex font-Poppins justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#122f97] to-[#0c288c] border border-transparent rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                  >
                    Close
                  </button>
                </motion.div>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-[#122f97] hover:text-[#343fa0] transition-colors duration-200"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
}
