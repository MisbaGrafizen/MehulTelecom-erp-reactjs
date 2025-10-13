import { useCallback, useEffect, useRef, useState } from "react";
import SideBar from "../../Component/sidebar/SideBar";
import Header from "../../Component/header/Header";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import { Check } from "lucide-react";
import { Plus, Scan, Pencil, Trash2 } from "lucide-react";
import { Modal as NextUIModal, ModalContent } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";


import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import { X, CheckCircle } from "lucide-react"
import FloatingInput from "../../Component/inputFelleds/FloatingInput";
import MotionDropdown from "../../Component/inputFelleds/MotionDropdown";
import FloatingTextarea from "../../Component/inputFelleds/FloatingTextarea";
import { ApiGet, ApiPost } from "../../helper/axios";
import ImeiModal from "../../Component/purchaseCom/ImeiModal";
import NormalDropdown from "../../Component/inputFelleds/NormalDropdown";

export default function PurchesInvoice() {
  const navigate = useNavigate();
  const options = ["Option 1", "Option 2", "Option 3"];
  // Parties & address
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [address, setAddress] = useState("");// Add these new states 👇
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [partyId, setPartyId] = useState("");
  const [isImeiModalOpen, setImeiModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [productSuggestions, setProductSuggestions] = useState([]);




  // Items
  const [items, setItems] = useState([
    { productName: "", serialNumbers: [], modelNo: "", unit: "", pricePerUnit: "", amount: "" },
  ]);


  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    const fetchPurchasedProducts = async () => {
      try {
        const res = await ApiGet("/admin/purchase");
        console.log('res', res)
        if (res) {
          const products = res.flatMap((p) =>
            p.items.map((item) => ({
              name: item.itemName,
              stock: item.serialNumbers?.length || 0,
            }))
          );

          // ✅ Group by product name & sum stock
          const grouped = Object.values(
            products.reduce((acc, cur) => {
              if (!acc[cur.name]) acc[cur.name] = { name: cur.name, stock: 0 };
              acc[cur.name].stock += cur.stock;
              return acc;
            }, {})
          );

          // Optional: filter out 0 stock if needed
          setProductSuggestions(grouped.filter((g) => g.stock >= 0));
        }
      } catch (err) {
        console.error("❌ Error fetching purchase products:", err);
      }
    };

    fetchPurchasedProducts();
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

    const qty =
      updated[index].serialNumbers?.length ||
      parseFloat(updated[index].unit) ||
      0;
    const price = parseFloat(updated[index].pricePerUnit) || 0;
    updated[index].amount = (qty * price).toFixed(2);

    setItems(updated);

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
      itemName: item.itemName || item.productName || "",
      serialNumbers: item.serialNumbers || [],
      modelNo: item.modelNo || "",
      qty: item.serialNumbers?.length > 0 ? item.serialNumbers.length : parseFloat(item.unit) || 1,
      unit: item.unit || "PCS",
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


  const handleSelectProduct = (index, name) => {
    handleItemChange(index, "itemName", name);
    setActiveDropdown(null);
    setSearchTerm(""); // reset search after select
  };


  const filteredSuggestions = (term) => {
    if (!term) return productSuggestions;

    console.log('productSuggestions', productSuggestions)
    return productSuggestions.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  };


  const handleSerialClick = (product, index) => {
    if (product.itemName) {
      setSelectedModel(product.itemName);
      setSelectedProductIndex(index); // ✅ track which item we’re updating
      setImeiModalOpen(true);
    }
  };



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

                    <div className=" flex  w-[200px]  items-center gap-[10px]">

                    </div>
                  </div>

                  <div className=" w-[600px] flex   gap-[15px] border-[1px] relative bg-white shadow1-blue py-[15px]  px-[15px] rounded-[10px] h-fit">
                    <div className=" flex w-[48%] flex-col gap-[16px]">

                      <div className=" flex ">
                        <MotionDropdown
                          label="Select Party"
                          options={parties.map((p) => p?.partyName)}
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

                    <div className=" flex gap-[15px]  w-[50%] flex-col">
                      <FloatingInput
                        label="Phone Number"
                        name="phoneNumber"

                      />
                      <FloatingInput
                        label="Email ID"
                        name="email"

                      />
                      <FloatingInput
                        label="Credit Limit"
                        name="creditLimit"
                        type="number"

                      />

                    </div>


                  </div>





                  {/* Table Header */}
                  <div className="bg-white w-[100%] relative rounded-lg shadow1-blue">
                    <div className="overflow-x-auto flex-shrink-0 bg-white rounded-lg w-[100%]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#f0f1f364]">
                            <th className="py-3 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
                              Sr. No.
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-40 border-r border-gray-200">
                              Product Name
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px] border-r border-gray-200">
                              SERIAL NO.
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[108px] border-r border-gray-200">
                              UNIT
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[103px] border-r border-gray-200">
                              PRICE/UNIT
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px] border-r border-gray-200">
                              AMOUNT
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[70px]">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {items.map((product, index) => (
                            <>
                              <tr key={index} className="border-t relative border-gray-200">
                                <td className="py-2 px-4 text-sm text-gray-600 font-Poppins border-r border-gray-200">
                                  {index + 1}
                                </td>

                                <td className="py-2 px-4 border-r font-Poppins border-gray-200">
                                  <input
                                    type="text"
                                    value={product.itemName}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      handleItemChange(index, "itemName", value);
                                      setSearchTerm(value);
                                      setActiveDropdown(index);
                                    }}
                                    onFocus={() => setActiveDropdown(index)}
                                    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                    className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                    placeholder="Product name"
                                  />

                                </td>


                                <td className="py-2 px-4 border-r font-Poppins border-gray-200">
                                  <input
                                    type="text"
                                    value={product.serialNumbers?.join(", ") || ""}
                                    onFocus={() => handleSerialClick(product, index)}
                                    readOnly
                                    className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm cursor-pointer"
                                    placeholder="Select IMEI"
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

                                <td className="py-2 px-2 text-center">
                                  {items.length > 1 && (
                                    <button
                                      onClick={() => deleteRow(index)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors"
                                      title="Delete row"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                                </td>
                              </tr>


                              <AnimatePresence>
                                {activeDropdown === index && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-30 left-[150px] top-[68%] mt-1 w-[400px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
                                  >
                                    {/* Header Row */}
                                    <div className="flex font-Poppins justify-between bg-blue-50 px-3 py-2 border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                                      <span>Model Name</span>
                                      <span>Stock</span>
                                    </div>

                                    {/* Filtered Product List */}
                                    {filteredSuggestions(searchTerm).length > 0 ? (
                                      filteredSuggestions(searchTerm).map((p, i) => (
                                        <div
                                          key={i}
                                          onClick={() => handleSelectProduct(index, p.name)}
                                          className="flex justify-between items-center px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                          <span className="font-Poppins text-gray-700">{p.name}</span>
                                          <span
                                            className={`font-medium font-Poppins ${p.stock === 0
                                              ? "text-red-500"
                                              : p.stock === 1
                                                ? "text-blue-500"
                                                : "text-green-600"
                                              }`}
                                          >
                                            {p.stock}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-3 py-2 text-sm text-gray-500">
                                        No products found
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>



                              <ImeiModal
                                isOpen={isImeiModalOpen}
                                onClose={() => setImeiModalOpen(false)}
                                modelName={items[selectedProductIndex]?.itemName || selectedModel} // ✅ auto-passes selected product name
                                existingImeis={items[selectedProductIndex]?.serialNumbers || []}   // ✅ also passes existing serials for that item
                                onSave={(imeis) => {
                                  if (selectedProductIndex !== null) {
                                    const updated = [...items];
                                    updated[selectedProductIndex].serialNumbers = imeis;
                                    updated[selectedProductIndex].unit = imeis.length;
                                    updated[selectedProductIndex].amount = (
                                      imeis.length *
                                      (parseFloat(updated[selectedProductIndex].pricePerUnit) || 0)
                                    ).toFixed(2);
                                    setItems(updated);

                                    const total = updated.reduce(
                                      (sum, item) => sum + (parseFloat(item.amount) || 0),
                                      0
                                    );
                                    setTotalAmount(total.toFixed(2));
                                  }
                                  setImeiModalOpen(false);
                                }}
                              />


                            </>
                          ))}

                          {/* Total Row (Action column preserved) */}
                          <tr className="bg-[#f0f1f364] font-Poppins border-t border-gray-200">
                            <td
                              colSpan="2"
                              className="px-2 text-left text-[14px] font-medium text-gray-700 border-r border-gray-200"
                            >
                              <button
                                className="w-[120px] mx-auto py-1 font-Poppins border-[1.5px] border-dashed border-[#60A5FA] text-[#60A5FA] rounded-sm hover:bg-blue-50 transition-colors"
                                onClick={addRow}
                              >
                                Add Row
                              </button>
                            </td>
                            <td
                              colSpan="3"
                              className="py-3 px-2 text-right text-[14px] font-medium text-gray-700 border-r border-gray-200"
                            >
                              Total
                            </td>
                            <td className="py-3 px-2  border-r text-right text-[14px] font-semibold text-[#00b4d8]">
                              ₹ {totalAmount || "0.00"}
                            </td>
                            <td className="py-3 px-2 text-center text-[14px] font-semibold text-[#00b4d8]">

                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className=" flex w-[100%]  justify-between gap-[20px]  mt-[19px] mb-[20px]">
                    <div className="flex w-[50%]  flex-col gap-[15px] ">
                      <div className="bg-white  w-[100%] rounded-lg shadow1-blue  ">

                      </div>



                    </div>
                    <div className=" flex w-[42%]">
                      <div className="bg-white  w-[100%]  rounded-lg  shadow1-blue p-3">
                        <div className="space-y-2">










                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-md font-medium">
                              Payment Method
                            </label>
                            <div className="flex-1 max-w-[320px]">


                              <NormalDropdown
                                label="Select Payment Method"
                                options={options}
                                onChange={(value) => console.log("Selected:", value)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-md font-medium">
                              Cash Payment
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <input
                                  type="number"
                                  name="cashPayment"
                                  placeholder="0.00"
                                  value={cashPayment}
                                  onChange={(e) => setCashPayment(parseFloat(e.target.value) || 0)}
                                  className="w-full outline-none text-[15px] py-[9px] px-[15px] font-Poppins font-[400] bg-transparent cursor-pointer"
                                />

                              </div>
                            </div>
                          </div>
                          {/* Total Amount */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-[#FF6B35] text-gray-600 font-Poppins text-md font-medium">
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
