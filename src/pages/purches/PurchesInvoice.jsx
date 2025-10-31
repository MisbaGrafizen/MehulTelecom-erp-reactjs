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
  const options = ["Cash", "Bank"];
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [items, setItems] = useState([
    {
      productName: "",
      type: "",
      color: "",
      specification: "",
      condition: "",
      serialNumbers: [],
      modelNo: "",
      unit: "",
      pricePerUnit: "",
      amount: ""
    },
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

        if (!res) return;

        const productsData = {};

        res.forEach((purchase) => {
          purchase.items.forEach((item) => {
            const name = item.itemName?.trim();
            if (!name) return;

            if (!productsData[name]) {
              productsData[name] = {
                colors: new Set(),
                specs: new Set(),
                conditions: new Set(),
                stock: 0,
              };
            }

            // Dynamically extract
            if (item.color) productsData[name].colors.add(item.color);
            if (item.specification) productsData[name].specs.add(item.specification);
            if (item.condition) productsData[name].conditions.add(item.condition);
            if (Array.isArray(item.serialNumbers)) {
  const available = item.serialNumbers.filter((s) =>
    typeof s === "string" ? true : !s.isSold
  ).length;
  productsData[name].stock += available;
}
});

        });

        // Convert Sets → Arrays for rendering
        Object.keys(productsData).forEach((key) => {
          productsData[key].colors = [...productsData[key].colors];
          productsData[key].specs = [...productsData[key].specs];
          productsData[key].conditions = [...productsData[key].conditions];
        });

        setProductSuggestions(Object.keys(productsData).map((k) => ({ name: k, ...productsData[k] })));
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

  // ✅ Map frontend items → backend format
  const mappedItems = items.map((item) => ({
    itemName: item.itemName || item.productName || "",
    modelNo: item.modelNo || "",
    color: item.color || "",
    specifications: item.specification || "", // ✅ match backend field name
    condition: item.condition || "",
    serialNumbers: (item.serialNumbers || []).map((num) => String(num)),
    qty:
      item.serialNumbers?.length > 0
        ? item.serialNumbers.length
        : parseFloat(item.unit) || 1,
    unit: item.unit || "PCS",
    pricePerUnit: parseFloat(item.pricePerUnit) || 0,
    amount: parseFloat(item.amount) || 0,
  }));

  // ✅ Payment details
  const cashAmt = parseFloat(cashPayment) || 0;
  const bankAmt = parseFloat(bankPayment) || 0;
  const paidAmount = cashAmt + bankAmt;
  const unpaidAmount = Math.max((parseFloat(totalAmount) || 0) - paidAmount, 0);

  // ✅ Payload matching backend schema
  const payload = {
    partyId,
    billNumber: `BILL-${Date.now()}`,
    billDate: billDate ? new Date(billDate) : new Date(),
    time: new Date().toLocaleTimeString(),
    paymentType:
      bankAmt > 0 && cashAmt > 0 ? "Mixed" : bankAmt > 0 ? "Bank" : "Cash",
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
    console.log("✅ Purchase saved:", res.data);
    alert("Purchase saved successfully!");
    navigate("/purches-list");
  } catch (error) {
    console.error("❌ Error saving purchase:", error);
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
    setSelectedModel(product.itemName);
    setSelectedProductIndex(index);
    setImeiModalOpen(true);
  };



  const deleteRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));

    // ✅ Recalculate total after deletion
    const updated = items.filter((_, i) => i !== index);
    const total = updated.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    setTotalAmount(total.toFixed(2));
  };


  return (
    <>
      <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Purchese Invoice" />
          <div className="flex gap-[10px] w-[100%] h-[100%]">
            <SideBar />
            <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px] gap-[30px] rounded-[10px]">
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
                              console.log('resdscds', res)
                              if (res?.data) {
                                const p = res.data;
                                setPartyId(p._id);

                                // 🧠 Fix address formatting
                                const formatAddress = (addr) => {
                                  if (!addr) return "";
                                  if (typeof addr === "string") return addr;
                                  if (typeof addr === "object") {
                                    // Join all values (e.g., street, city, state, etc.)
                                    return Object.values(addr).filter(Boolean).join(", ");
                                  }
                                  return "";
                                };

                                const cleanAddress =
                                  formatAddress(p.billingAddress) ||
                                  formatAddress(p.address) ||
                                  formatAddress(p.shippingAddress) ||
                                  "";

                                setAddress(cleanAddress);
                                console.log('address', cleanAddress)

                                // ✅ Set other fields
                                setPhoneNumber(p.phoneNumber || "");
                                setEmail(p.email || "");
                                setCreditLimit(typeof p.creditLimit === "object" ? "" : p.creditLimit || "");
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
                              newParty?.billingAddress || ""
                            );
                          }}
                        />

                      </div>

                      <FloatingTextarea
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        name="address"
                      />                    </div>

                    <div className=" flex gap-[15px]  w-[50%] flex-col">
                      <FloatingInput
                        label="Phone Number"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />

                      <FloatingInput
                        label="Email ID"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />


                    </div>


                  </div>





                  {/* Table Header */}
                  <div className="bg-white w-[100%] relative rounded-lg shadow1-blue">
                    <div className="flex-shrink-0 bg-white rounded-lg w-[100%]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#f0f1f364]">
                            <th className="py-3 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
                              Sr. No.
                            </th>
                            <th className="py-3 w-[280px]    tracking-wide px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 border-r border-gray-200">
                              Product Name
                            </th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 border-r border-gray-200">COLOR</th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 border-r border-gray-200">SPECIFICATION</th>
                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 border-r border-gray-200">CONDITION</th>

                            <th className="py-3 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[200px] border-r border-gray-200">
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

                                {/* COLOR FIELD (hybrid: dropdown + free typing) */}
                                <td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
                                  <input
                                    type="text"
                                    value={product.color}
                                    disabled={!product.itemName}
                                    onChange={(e) => {
                                      if (!product.itemName) return;
                                      handleItemChange(index, "color", e.target.value);
                                      setSearchTerm(e.target.value);
                                      setActiveDropdown(`color-${index}`);
                                    }}
                                    onFocus={() => product.itemName && setActiveDropdown(`color-${index}`)}
                                    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                    placeholder={product.itemName ? "Select or type color" : "Select Product First"}
                                    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                                      }`}
                                  />

                                  <AnimatePresence>
                                    {activeDropdown === `color-${index}` &&
                                      product.itemName &&
                                      searchTerm.trim() !== "" && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute z-30 left-0 top-[100%] mt-1 w-[200px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
                                        >
                                          {(productSuggestions
                                            .find((p) => p.name === product.itemName)
                                            ?.colors?.filter((opt) =>
                                              opt.toLowerCase().includes(searchTerm.toLowerCase())
                                            ) || []
                                          ).map((opt, i) => (
                                            <div
                                              key={i}
                                              onClick={() => {
                                                handleItemChange(index, "color", opt);
                                                setActiveDropdown(null);
                                              }}
                                              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700"
                                            >
                                              {opt}
                                            </div>
                                          ))}
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </td>



                                {/* SPECIFICATION FIELD (hybrid) */}
                                <td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
                                  <input
                                    type="text"
                                    value={product.specification}
                                    disabled={!product.itemName}
                                    onChange={(e) => {
                                      if (!product.itemName) return;
                                      handleItemChange(index, "specification", e.target.value);
                                      setSearchTerm(e.target.value);
                                      setActiveDropdown(`spec-${index}`);
                                    }}
                                    onFocus={() => product.itemName && setActiveDropdown(`spec-${index}`)}
                                    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                    placeholder={product.itemName ? "Select or type specification" : "Select Product First"}
                                    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                                      }`}
                                  />

                                  <AnimatePresence>
                                    {activeDropdown === `spec-${index}` &&
                                      product.itemName &&
                                      searchTerm.trim() !== "" && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute z-30 left-0 top-[100%] mt-1 w-[220px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
                                        >
                                          {(productSuggestions
                                            .find((p) => p.name === product.itemName)
                                            ?.specs?.filter((opt) =>
                                              opt.toLowerCase().includes(searchTerm.toLowerCase())
                                            ) || []
                                          ).map((opt, i) => (
                                            <div
                                              key={i}
                                              onClick={() => {
                                                handleItemChange(index, "specification", opt);
                                                setActiveDropdown(null);
                                              }}
                                              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700"
                                            >
                                              {opt}
                                            </div>
                                          ))}
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </td>

                                {/* CONDITION FIELD (hybrid) */}
                                <td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
                                  <input
                                    type="text"
                                    value={product.condition}
                                    disabled={!product.itemName}
                                    onChange={(e) => {
                                      if (!product.itemName) return;
                                      handleItemChange(index, "condition", e.target.value);
                                      setSearchTerm(e.target.value);
                                      setActiveDropdown(`cond-${index}`);
                                    }}
                                    onFocus={() => product.itemName && setActiveDropdown(`cond-${index}`)}
                                    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                    placeholder={product.itemName ? "Select or type condition" : "Select Product First"}
                                    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
                                      }`}
                                  />

                                  <AnimatePresence>
                                    {activeDropdown === `cond-${index}` &&
                                      product.itemName &&
                                      searchTerm.trim() !== "" && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          transition={{ duration: 0.2 }}
                                          className="absolute z-30 left-0 top-[100%] mt-1 w-[180px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[200px] overflow-y-auto"
                                        >
                                          {(productSuggestions
                                            .find((p) => p.name === product.itemName)
                                            ?.conditions?.filter((opt) =>
                                              opt.toLowerCase().includes(searchTerm.toLowerCase())
                                            ) || []
                                          ).map((opt, i) => (
                                            <div
                                              key={i}
                                              onClick={() => {
                                                handleItemChange(index, "condition", opt);
                                                setActiveDropdown(null);
                                              }}
                                              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700"
                                            >
                                              {opt}
                                            </div>
                                          ))}
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </td>





                                {/* IMEI / SERIAL NO. FIELD */}
                                <td className="py-2 px-4 border-r font-Poppins border-gray-200">
                                  <input
                                    type="text"
                                    value={product.serialNumbers?.join(", ") || ""}
                                    readOnly
                                    disabled={!product.itemName} // ⛔ disable when product not selected
                                    onFocus={() => {
                                      if (!product.itemName) return; // prevent opening modal
                                      handleSerialClick(product, index);
                                    }}
                                    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer"
                                      }`}
                                    placeholder={
                                      product.itemName
                                        ? "Select IMEI / Serial"
                                        : "Select product first"
                                    }
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

                                <td className="py-2 px-4 border-r tracking-wide  flex-shrink-0 font-Poppins border-gray-200 text-right w-[140px] pr-3">
                                  ₹ {product.amount || "0.00"}
                                </td>


                                {items.length > 1 && (
                                  <button
                                    onClick={() => deleteRow(index)}
                                    className="text-red-500  w-[30px]  absolute justify-center flex h-[30px] items-center right-[-30px] shadow-lg top-[9px]  bg-white hover:text-red-700 rounded-r-[10px] transition-colors"
                                    title="Delete row"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}

                              </tr>


                              <AnimatePresence>
                                {activeDropdown === index && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute z-30 left-[150px] top-[68%] mt-1 w-[300px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
                                  >
                                    {/* Header Row */}
                                    <div className="flex font-Poppins justify-between bg-blue-50 px-3 py-2 border-b border-gray-200 text-[13px] font-semibold text-gray-700">
                                      <span>Model Name</span>
                                      <span>Stock</span>
                                    </div>

                                    {/* Filtered Product List */}
                                    {filteredSuggestions(searchTerm).map((p, i) => (
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
))}


                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <ImeiModal
                                isOpen={isImeiModalOpen}
                                onClose={() => setImeiModalOpen(false)}
                                modelName={items[selectedProductIndex]?.itemName || selectedModel} // ✅ auto-passes selected product name
                                existingImeis={items[selectedProductIndex]?.serialNumbers || []}   // ✅ also passes existing serials for that item
                                onSave={(imeis) => {
                                  const cleanImeis = imeis.filter((num) => !!num && num.trim() !== "");
                                  if (selectedProductIndex !== null) {
                                    const updated = [...items];
                                    updated[selectedProductIndex].serialNumbers = cleanImeis;
                                    updated[selectedProductIndex].unit = cleanImeis.length;
                                    updated[selectedProductIndex].amount = (
                                      cleanImeis.length *
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
                              colSpan="6"
                              className="py-3 px-2 text-right text-[14px] font-medium text-gray-700 border-r border-gray-200"
                            >
                              Total
                            </td>
                            <td className="py-3 px-2  border-r text-right text-[14px] font-semibold text-[#083aef]">
                              ₹ {totalAmount || "0.00"}
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
                                options={options}                // ["Cash", "Bank"]
                                value={paymentMethod}            // ✅ default is "Cash"
                                onChange={(value) => setPaymentMethod(value)} // ✅ updates when user selects
                              />
                            </div>
                          </div>
                          {/* <div className="flex items-center justify-between gap-4">
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
                          </div> */}
                          {/* Total Amount */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-[#FF6B35] font-Poppins text-md font-medium">
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
