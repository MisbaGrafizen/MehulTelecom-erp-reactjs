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
import { ApiGet, ApiPost } from "../../helper/axios";

export default function SellsInvoice() {
  const navigate = useNavigate();

  // Parties & address
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [address, setAddress] = useState("");// Add these new states 👇
const [billDate, setBillDate] = useState(() => new Date().toISOString().split("T")[0]);
const [partyId, setPartyId] = useState("");


  // Items
  const [items, setItems] = useState([
    { productName: "", serialNo: "", modelNo: "", unit: "", pricePerUnit: "", amount: "" },
  ]);


  // Payments
  const [cashPayment, setCashPayment] = useState("");
  const [bankPayment, setBankPayment] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await ApiGet("/admin/party");
        if (res?.data) setParties(res.data);
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    };
    fetchParties();
  }, []);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      if (!selectedParty) return;
      try {
        const res = await ApiGet(`/admin/party-by-name/${selectedParty}`);
        if (res?.data?.address) setAddress(res.data.address);
      } catch (error) {
        console.error("Error fetching party details:", error);
      }
    };
    fetchPartyDetails();
  }, [selectedParty]);

 const handleItemChange = (index, field, value) => {
  const updated = [...items];
  updated[index][field] = value;

  // ✅ Update amount per row
  const qty = parseFloat(updated[index].unit) || 0;
  const price = parseFloat(updated[index].pricePerUnit) || 0;
  updated[index].amount = (qty * price).toFixed(2);

  // ✅ Update state
  setItems(updated);

  // ✅ Recalculate total
  const total = updated.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  setTotalAmount(total.toFixed(2));
};


  const addRow = () => {
    setItems([
      ...items,
      { productName: "", serialNo: "", modelNo: "", unit: "", pricePerUnit: "", amount: "" },
    ]);
  };


const handleSave = async () => {
  if (!selectedParty) {
    alert("Please select a party");
    return;
  }

  if (items.length === 0) {
    alert("Please add at least one item");
    return;
  }

  // ✅ Map items to backend schema
  const mappedItems = items.map((item) => ({
    itemName: item.productName,
    serialNo: item.serialNo || "",
    modelNo: item.modelNo || "",
    qty: parseFloat(item.unit) || 1,
    unit: item.unit || "NONE",
    pricePerUnit: parseFloat(item.pricePerUnit) || 0,
    amount: parseFloat(item.amount) || 0,
  }));

  const cashAmt = parseFloat(cashPayment) || 0;
  const bankAmt = parseFloat(bankPayment) || 0;
  const paidAmount = cashAmt + bankAmt;
  const unpaidAmount = Math.max((parseFloat(totalAmount) || 0) - paidAmount, 0);

  const payload = {
    partyId,
    billNumber: `BILL-${Date.now()}`,
    billDate: billDate ? new Date(billDate) : new Date(),
    time: new Date().toLocaleTimeString(),
    paymentType: bankAmt > 0 && cashAmt > 0 ? "Mixed" : bankAmt > 0 ? "Bank" : "Cash",
    items: mappedItems,
    totalAmount: parseFloat(totalAmount) || 0,
    payments: [
      { method: "Cash", amount: cashAmt },
      { method: "Online", amount: bankAmt },
    ],
    paidAmount,
    unpaidAmount,
  };

  try {
    const res = await ApiPost("/admin/purchase", payload);
    console.log("Purchase saved:", res.data);
    alert("Purchase saved successfully!");
    navigate("/purches-list");
  } catch (error) {
    console.error("Error saving purchase:", error);
    alert("Failed to save purchase");
  }
};


  const remainingAmount = Math.max(
  totalAmount - (parseFloat(cashPayment || 0) + parseFloat(bankPayment || 0)),
  0
);


  return (
    <>
      <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Sells Invoice" />
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
                 <MotionDropdown
  label="Select Party"
  options={parties.map((p) => p.partyName)}
  onChange={async (val) => {
    setSelectedParty(val);
    try {
      const res = await ApiGet(`/admin/party-by-name/${val}`);
      if (res?.data) {
        setPartyId(res.data._id); // ✅ store the party ID for backend
        setAddress(
          res.data.address?.billingAddress ||
          res.data.address?.shippingAddress ||
          ""
        );
      }
    } catch (error) {
      console.error("Error fetching party details:", error);
    }
  }}
  onPartyCreated={(newParty) => {
    setParties((prev) => [...prev, newParty]);
    setSelectedParty(newParty.partyName);
    setPartyId(newParty._id); // ✅ new party ID
    setAddress(
      newParty.address?.billingAddress || newParty.address?.shippingAddress || ""
    );
  }}
/>

                      </div>

                      <FloatingTextarea
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />                    </div>
                  </div>
                  <div className="flex flex-col w-full">
  <label className="text-[14px] font-Poppins text-gray-600 mb-1">Bill Date</label>
  <input
    type="date"
    value={billDate}
    onChange={(e) => setBillDate(e.target.value)}
    className="border border-[#dedede] rounded-lg shadow px-3 py-2 text-[14px] font-Poppins"
  />
</div>




                    {/* Table Header */}
                    <div className="bg-white w-[100%] relative rounded-lg shadow1-blue">
  <div className="overflow-x-auto flex-shrink-0 bg-white rounded-lg w-[100%]">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#f0f1f364]">
          <th className="py-4 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
            Sr. No.
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-40 border-r border-gray-200">
            Product Name
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px] border-r border-gray-200">
            SERIAL NO.
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[115px] border-r border-gray-200">
            MODEL NO.
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[108px] border-r border-gray-200">
            UNIT
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[103px] border-r border-gray-200">
            PRICE/UNIT
          </th>
          <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px] border-r border-gray-200">
            AMOUNT
          </th>
        </tr>
      </thead>

      <tbody>
        {items.map((product, index) => (
          <tr key={index} className="border-t relative border-gray-200">
            <td className="py-2 px-4 text-sm text-gray-600 font-Poppins border-r border-gray-200">
              {index + 1}
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200">
              <input
                type="text"
                value={product.productName}
                onChange={(e) =>
                  handleItemChange(index, "productName", e.target.value)
                }
                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                placeholder="Enter product name"
              />
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200">
              <input
                type="text"
                value={product.serialNo}
                onChange={(e) =>
                  handleItemChange(index, "serialNo", e.target.value)
                }
                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                placeholder="Serial No."
              />
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200">
              <input
                type="text"
                value={product.modelNo}
                onChange={(e) =>
                  handleItemChange(index, "modelNo", e.target.value)
                }
                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                placeholder="Model No."
              />
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200">
              <input
                type="number"
                value={product.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                placeholder="0"
              />
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200">
              <input
                type="number"
                value={product.pricePerUnit}
                onChange={(e) =>
                  handleItemChange(index, "pricePerUnit", e.target.value)
                }
                className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                placeholder="0.00"
              />
            </td>

            <td className="py-2 px-4 border-r font-Poppins border-gray-200 text-right pr-3">
              ₹ {product.amount || "0.00"}
            </td>
          </tr>
        ))}

        {/* Total Row */}
        <tr className="bg-[#f0f1f364] font-Poppins">
          <td
            colSpan="6"
            className="py-4 px-2 text-right text-[14px] font-medium text-gray-700 border-r border-gray-200"
          >
            Total
          </td>
          <td className="py-4 px-2 text-center text-[14px] font-semibold text-[#00b4d8] border-gray-200">
            ₹ {totalAmount || "0.00"}
          </td>
        </tr>
      </tbody>
    </table>

    {/* Add Product Button */}
    <div className="px-4 py-3 w-[100%] relative flex justify-between items-center">
      <button
        className="w-[200px] mx-auto py-2 font-Poppins border-[1.5px] border-dashed border-[#60A5FA] text-[#60A5FA] rounded-sm hover:bg-blue-50 transition-colors"
        onClick={addRow}
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
  type="number"
  name="cashPayment"
  value={cashPayment}
  onChange={(e) => setCashPayment(parseFloat(e.target.value) || 0)}
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
  type="number"
  name="bankPayment"
  value={bankPayment}
  onChange={(e) => setBankPayment(parseFloat(e.target.value) || 0)}
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
                                <p>{remainingAmount.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className=" bs-spj  font-[500] font-Poppins text-[#fff] rounded-[8px] py-[5px] justify-center  text-[18px] mx-auto mt-[10px] flex w-[120px]"
                    onClick={handleSave}

                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
