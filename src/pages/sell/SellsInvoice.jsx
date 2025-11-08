import { useCallback, useEffect, useRef, useState } from "react";
import SideBar from "../../Component/sidebar/SideBar";
import Header from "../../Component/header/Header";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import { Check } from "lucide-react";

import { Modal as NextUIModal, ModalContent } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Scan, Pencil, Trash2 } from "lucide-react";

import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
const options = ["Cash", "Bank"];
import { X, CheckCircle } from "lucide-react"
import FloatingInput from "../../Component/inputFelleds/FloatingInput";

import FloatingTextarea from "../../Component/inputFelleds/FloatingTextarea";
import { ApiGet, ApiPost } from "../../helper/axios";
import ImeiModal from "../../Component/purchaseCom/ImeiModal";
import NormalDropdown from "../../Component/inputFelleds/NormalDropdown";
import SellsMotionDropdown from "../../Component/sellsCom/SellsMotionDropdown";

export default function SellsInvoice() {
  const navigate = useNavigate();

  // Parties & address
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [billDate, setBillDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [partyId, setPartyId] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isImeiModalOpen, setImeiModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [productAttributes, setProductAttributes] = useState({});


  const options = ["Online", "Card", "Cash"];

  // Payment rows (start with one)
  const [paymentRows, setPaymentRows] = useState([
    { method: "Online", amount: "" },
  ]);


  // Items
  const [items, setItems] = useState([
    { productName: "", serialNumbers: [], modelNo: "", unit: "", pricePerUnit: "", amount: "" },
  ]);


  console.log('items', items)


  // Payments
  const [cashPayment, setCashPayment] = useState("");
  const [bankPayment, setBankPayment] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await ApiGet("/admin/sales-party");
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

      const purchases = res;
      const productsData = {};

      purchases.forEach((purchase) => {
        purchase.items.forEach((item) => {
          const name = item.itemName?.trim();
          if (!name) return;

          if (!productsData[name]) {
            productsData[name] = {
              colors: {},
              specifications: {},
              conditions: {},
              totalStock: 0,
            };
          }

          const color = item.color?.trim?.() || "Unknown";
          const spec =
            item.specifications?.trim?.() ||
            item.specification?.trim?.() ||
            "Unknown";
          const condition = item.condition?.trim?.() || "Unknown";

          const available =
            (item.serialNumbers || []).filter(
              (s) => typeof s === "string" || !s.isSold
            ).length || item.qty || 1;

          productsData[name].colors[color] =
            (productsData[name].colors[color] || 0) + available;
          productsData[name].specifications[spec] =
            (productsData[name].specifications[spec] || 0) + available;
          productsData[name].conditions[condition] =
            (productsData[name].conditions[condition] || 0) + available;
          productsData[name].totalStock += available;
        });
      });

      const formatted = Object.keys(productsData).map((name) => ({
        name,
        colors: productsData[name].colors,
        specifications: productsData[name].specifications,
        conditions: productsData[name].conditions,
        stock: productsData[name].totalStock,
      }));

      setProductSuggestions(formatted);
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
        const res = await ApiGet(`/admin/sales-party-by-name/${selectedParty}`);
        if (res?.data) {
          const party = res.data;
          setAddress(party.billingAddress || "");
          setPhoneNumber(party.phoneNumber || "");
          setEmail(party.email || "");
          setCreditLimit(party.creditLimit || 0);
        }
      } catch (error) {
        console.error("Error fetching party details:", error);
      }
    };
    fetchPartyDetails();
  }, [selectedParty]);


  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Keep both fields in sync
    if (field === "productName") updated[index].itemName = value;
    if (field === "itemName") updated[index].productName = value;

    // ✅ Update amount per row
    const qty = parseFloat(updated[index].unit) || 0;
    const price = parseFloat(updated[index].pricePerUnit) || 0;
    updated[index].amount = (qty * price).toFixed(2);

    setItems(updated);

    // ✅ Recalculate total
    const total = updated.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
   setTotalAmount(Number(total.toFixed(2)));

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
      modelNo: item.modelNo || "",
      // ✅ convert each serial to backend object format
serialNumbers: (item.serialNumbers || [])
  .filter((s) => s.isSold === true || s === true || typeof s === "string")
  .map((s) => (typeof s === "object" ? s.number : s)),


      qty: item.serialNumbers?.length || parseFloat(item.unit) || 1,
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
      const res = await ApiPost("/admin/sale", payload);
      console.log("Sales saved:", res.data);
      alert("Sales saved successfully!");
      navigate("/sells");
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Failed to save sale");
    }
  };



  const remainingAmount = Math.max(
    totalAmount - (parseFloat(cashPayment || 0) + parseFloat(bankPayment || 0)),
    0
  );


  const deleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };



  // ✅ Product selection handler
  const handleSelectProduct = async (index, name) => {
    handleItemChange(index, "itemName", name);
    setActiveDropdown(null);
    setSearchTerm("");

    try {
      // Fetch dynamic product attributes
      const res = await ApiGet(`/admin/product-details/${encodeURIComponent(name)}`);

      if (res?.data) {
        setProductAttributes((prev) => ({
          ...prev,
          [name]: res.data, // expected format: { colors:[], specifications:[], conditions:[], imeis:[] }
        }));
      }
    } catch (err) {
      console.error("❌ Error fetching product attributes:", err);
    }
  };



  const filteredSuggestions = (term) => {
    if (!term) return productSuggestions;

    console.log('productSuggestions', productSuggestions)
    return productSuggestions.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  };


  const handleSerialClick = async (product, index) => {
    if (!product.itemName) return;

    try {
      const res = await ApiGet("/admin/purchase");
      const purchases = res;

      // ✅ Find available serials for this product
      const serials = purchases.flatMap((p) =>
        p.items
          .filter((i) => i.itemName === product.itemName)
          .flatMap((i) =>
            (i.serialNumbers || [])
              .filter((s) => !s.isSold) // Only unsold
              .map((s) => s.number)
          )
      );


      // if (serials.length === 0) {
      //   alert("No available serial numbers for this product!");
      //   return;
      // }

      // ✅ Store for modal
      setSelectedModel(product.itemName);
      setSelectedProductIndex(index);
      setImeiModalOpen(true);

      // Optionally, pass them into your modal as props (see Step 3)
    } catch (err) {
      console.error("Error fetching serials:", err);
    }
  };


  const [remaining, setRemaining] = useState(totalAmount || 0);

  // Handle value change in dropdown/input
  const handlePaymentChange = (index, field, value) => {
    const updated = [...paymentRows];
    updated[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
    setPaymentRows(updated);

    // Update totals
    const totalPaid = updated.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );
    setRemaining(Math.max(totalAmount - totalPaid, 0));
  };

  // Add new row automatically when previous is filled
  const handleAddNewRowIfNeeded = (index) => {
    const current = paymentRows[index];
    const allFilled = current.method && current.amount > 0;
    const totalPaid = paymentRows.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );

    // Add new only if valid and total not reached
    if (allFilled && totalPaid < totalAmount) {
      setPaymentRows([...paymentRows, { method: "Online", amount: "" }]);
    }
  };

  // Remove payment row
  const removePaymentRow = (index) => {
    const updated = paymentRows.filter((_, i) => i !== index);
    setPaymentRows(updated);

    const totalPaid = updated.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );
    setRemaining(Math.max(totalAmount - totalPaid, 0));
  };



  return (
    <>
      <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Sale Invoice" />
          <div className="flex gap-[10px] w-[100%] h-[100%]">
            <SideBar />
            <div className="flex w-[100%] max-h-[90%] pb-[50px]  overflow-y-auto md:pr-[15px] gap-[30px] rounded-[10px]">
              <div className="flex flex-col gap-[15px] w-[100%]">
                <div className=" w-[100%] ] flex-col gap-[15px] flex ">
                  <div className=" flex justify-between w-[100%] ">

                    <div className=" flex  w-[200px]  items-center gap-[10px]">

                    </div>
                  </div>

                  <div className=" md:w-[600px] flex md:flex-row flex-col   gap-[15px] border-[1px] relative bg-white shadow1-blue py-[15px]  px-[15px] rounded-[10px] h-fit">
                    <div className=" flex md:w-[48%] flex-col gap-[16px]">

                      <div className=" flex ">
                        <SellsMotionDropdown
                          label="Select Party"
                          options={parties.map((p) => p.partyName)}
                          onChange={async (val) => {
                            setSelectedParty(val);
                            try {
                              const res = await ApiGet(`/admin/sales-party-by-name/${val}`);
                              console.log('res', res)
                              if (res?.data) {
                                const party = res.data;
                                setPartyId(party._id);
                                setAddress(party.billingAddress || "");
                                setPhoneNumber(party.phoneNumber || "");
                                setEmail(party.email || "");
                                setCreditLimit(party.creditLimit || 0);
                              }
                            } catch (error) {
                              console.error("Error fetching party details:", error);
                            }
                          }}

                          onPartyCreated={(newParty) => {
                            setParties((prev) => [...prev, newParty]);
                            setSelectedParty(newParty.partyName);
                            setPartyId(newParty._id);
                            setAddress(newParty.billingAddress || "");
                          }}
                        />

                      </div>

                      <FloatingTextarea
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className=" flex gap-[15px]  md:w-[50%] flex-col">
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

                      <FloatingInput
                        label="Credit Limit"
                        name="creditLimit"
                        type="number"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                      />


                    </div>
                  </div>


                  {/* Table Header */}
                  <div className="bg-white w-[100%] relative rounded-lg shadow1-blue">
                    <div className="flex-shrink-0 bg-white overflow-x-auto md:overflow-x-visible rounded-lg w-[100%]">
                      <table className="w-full min-w-[1100px] md:min-w-[100%] border-collapse">
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
                                    value={product.itemName || product.productName || ""}
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

                                {/* COLOR AUTOCOMPLETE DROPDOWN */}
                                {/* ✅ COLOR DROPDOWN */}
<td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
  <input
    type="text"
    value={product.color}
    disabled={!product.itemName}
    onFocus={() => product.itemName && setActiveDropdown(`color-${index}`)}
    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
    placeholder={product.itemName ? "Select color" : "Select Product First"}
    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${
      !product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
    }`}
    readOnly
  />

  <AnimatePresence>
    {activeDropdown === `color-${index}` && product.itemName && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="absolute z-30 left-0 top-[100%] mt-1 w-[240px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
      >
        <div className="flex justify-between bg-blue-50 px-3 py-2 border-b text-[13px] font-semibold text-gray-700">
          <span>Color</span>
          <span>Stock</span>
        </div>

        {Object.entries(
          productSuggestions.find((p) => p.name === product.itemName)?.colors || {}
        ).map(([color, stock], i) => (
          <div
            key={i}
            onClick={() => {
              if (stock === 0) return;
              handleItemChange(index, "color", color);
              setActiveDropdown(null);
            }}
            className={`flex justify-between items-center px-3 py-2 text-sm transition-colors ${
              stock === 0
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "hover:bg-blue-50 cursor-pointer text-gray-700"
            }`}
          >
            <span>{color}</span>
            <span
              className={`font-medium ${
                stock === 0
                  ? "text-red-500"
                  : stock === 1
                  ? "text-blue-500"
                  : "text-green-600"
              }`}
            >
              {stock}
            </span>
          </div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</td>




                                {/* ✅ SPECIFICATION DROPDOWN */}
<td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
  <input
    type="text"
    value={product.specification}
    disabled={!product.itemName}
    onFocus={() => product.itemName && setActiveDropdown(`spec-${index}`)}
    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
    placeholder={product.itemName ? "Select specification" : "Select Product First"}
    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${
      !product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
    }`}
    readOnly
  />

  <AnimatePresence>
    {activeDropdown === `spec-${index}` && product.itemName && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="absolute z-30 left-0 top-[100%] mt-1 w-[260px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
      >
        <div className="flex justify-between bg-blue-50 px-3 py-2 border-b text-[13px] font-semibold text-gray-700">
          <span>Specification</span>
          <span>Stock</span>
        </div>

        {(() => {
          const found = productSuggestions.find(
            (p) => p.name === product.itemName
          );
          const validSpecs = Object.entries(found?.specifications || {}).filter(
            ([spec, stock]) =>
              spec &&
              spec.trim() !== "" &&
              spec.toLowerCase() !== "unknown" &&
              stock > 0
          );

          if (validSpecs.length === 0)
            return (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">
                No specification found
              </div>
            );

          return validSpecs.map(([spec, stock], i) => (
            <div
              key={i}
              onClick={() => {
                handleItemChange(index, "specification", spec);
                setActiveDropdown(null);
              }}
              className="flex justify-between items-center px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
              <span>{spec}</span>
              <span
                className={`font-medium ${
                  stock === 1 ? "text-blue-500" : "text-green-600"
                }`}
              >
                {stock}
              </span>
            </div>
          ));
        })()}
      </motion.div>
    )}
  </AnimatePresence>
</td>



                                {/* ✅ CONDITION DROPDOWN */}
<td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
  <input
    type="text"
    value={product.condition}
    disabled={!product.itemName}
    onFocus={() => product.itemName && setActiveDropdown(`cond-${index}`)}
    onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
    placeholder={product.itemName ? "Select condition" : "Select Product First"}
    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${
      !product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
    }`}
    readOnly
  />

  <AnimatePresence>
    {activeDropdown === `cond-${index}` && product.itemName && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="absolute z-30 left-0 top-[100%] mt-1 w-[220px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[200px] overflow-y-auto"
      >
        <div className="flex justify-between bg-blue-50 px-3 py-2 border-b text-[13px] font-semibold text-gray-700">
          <span>Condition</span>
          <span>Stock</span>
        </div>

        {(() => {
          const found = productSuggestions.find(
            (p) => p.name === product.itemName
          );
          const allConditions = found?.conditions || {};
          const validConditions = ["New", "Old"].map((label) => [
            label,
            allConditions[label] || 0,
          ]);

          return validConditions.map(([label, stock], i) => (
            <div
              key={i}
              onClick={() => {
                handleItemChange(index, "condition", label);
                setActiveDropdown(null);
              }}
              className="flex justify-between items-center px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
              <span>{label}</span>
              <span
                className={`font-medium ${
                  stock === 0
                    ? "text-red-500"
                    : stock === 1
                    ? "text-blue-500"
                    : "text-green-600"
                }`}
              >
                {stock}
              </span>
            </div>
          ));
        })()}
      </motion.div>
    )}
  </AnimatePresence>
</td>


                                <td className="py-2 px-4 border-r font-Poppins border-gray-200">
                                  <input
                                    type="text"
                                    value={product.serialNumbers?.map((s) =>
                                      typeof s === "object" ? s.number : s
                                    ).join(", ") || ""}
                                    readOnly
                                    disabled={!product.itemName}
                                    onFocus={() => {
                                      if (product.itemName) handleSerialClick(product, index);
                                    }}
                                    className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer"
                                      }`}
                                    placeholder={
                                      product.itemName ? "Select IMEI / Serial" : "Select product first"
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

                                <td className="py-2 px-4 border-r font-Poppins border-gray-200 text-right pr-3">
                                  ₹ {product.amount || "0.00"}
                                </td>


                                {items.length > 1 && (
                                  <button
                                    onClick={() => deleteRow(index)}
                                    className="text-red-500  w-[30px]  justify-center flex h-[30px] items-center right-[-30px] shadow-lg top-[9px] absolute bg-white hover:text-red-700 rounded-r-[10px] transition-colors"
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
                                    className="absolute z-30 left-[150px] top-[68%] mt-1 w-[400px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
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
                                        onClick={() => {
                                          if (p.stock > 0) handleSelectProduct(index, p.name);
                                        }}
                                        className={`flex justify-between items-center px-3 py-2 text-sm transition-colors ${p.stock === 0
                                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                          : "hover:bg-blue-50 cursor-pointer text-gray-700"
                                          }`}
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
  modelName={items[selectedProductIndex]?.itemName || selectedModel}
  productAttributes={{
    color: items[selectedProductIndex]?.color,
    specification: items[selectedProductIndex]?.specification,
    condition: items[selectedProductIndex]?.condition,
  }}
  existingImeis={items[selectedProductIndex]?.serialNumbers || []}
  onSave={(imeis) => {
    if (selectedProductIndex !== null) {
      const updated = [...items];
      updated[selectedProductIndex].serialNumbers = imeis.map((n) => ({
        number: n,
        isSold: false,
      }));
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
                  <div className=" flex w-[100%]  justify-between md:gap-[20px]  mt-[19px] mb-[20px]">
                    <div className=" hidden md:flex w-[50%]  flex-col  gap-[15px] ">
                      <div className="bg-white  w-[100%] rounded-lg shadow1-blue  ">
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                      </div>

                    </div>
                    {/* 🔹 PAYMENT SECTION */}
                    <div className="flex md:w-[42%] w-[100%]">
                      <div className="bg-white w-full rounded-lg shadow1-blue p-3">
                        <div className="space-y-4">
                          {/* Section Header */}
                          <h3 className="text-gray-700 font-Poppins font-semibold text-[15px]">
                            Payment Details
                          </h3>

                          {/* 🔹 Dynamic Payment Rows */}
                          {paymentRows.map((row, index) => (
                            <div key={index} className="flex items-center justify-between gap-3">
                              {/* Dropdown */}
                              <div className="flex-1  relative max-w-[230px]">
                                <label className="absolute  z-[10] left-3 top-[-10px] text-[12px] text-blue-700 px-[3px] font-Poppins bg-white ">Payment Method</label>
                                <NormalDropdown
                                  label="Select Method"
                                  options={options}
                                  value={row.method}
                                  onChange={(value) => handlePaymentChange(index, "method", value)}
                                />
                              </div>

                              {/* Input */}
                              <div className="flex-1 max-w-[240px]">
                                <div className="relative w-full h-10 border border-[#dedede] rounded-lg shadow flex items-center space-x-2 text-[#00000099] cursor-pointer">
                                  <label className="absolute left-3 top-[-10px] text-[12px] text-blue-500 px-[3px] font-Poppins bg-white ">Amount</label>
                                  <input
                                    type="number"
                                    value={row.amount}
                                    placeholder="0.00"
                                    onChange={(e) =>
                                      handlePaymentChange(index, "amount", e.target.value)
                                    }
                                    onBlur={() => handleAddNewRowIfNeeded(index)}
                                    className="w-full outline-none text-[15px] py-[9px] px-[6px] font-Poppins font-[400] bg-transparent"
                                  />
                                </div>
                              </div>

                              {/* Delete Row (only if more than one) */}
                              {paymentRows.length > 1 && (
                                <button
                                  onClick={() => removePaymentRow(index)}
                                  className="text-red-500 hover:text-red-600 font-medium"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Divider */}
                          <div className="h-[1px] w-full bg-gray-200 mt-2 mb-1" />

                          {/* 🔹 TOTAL AMOUNT */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-[#FF6B35] font-Poppins text-md font-medium">
                              TOTAL AMOUNT
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className="relative w-full h-10 border font-Poppins px-[15px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099]">
                                <p>₹ {Number(totalAmount || 0).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* 🔹 REMAINING AMOUNT */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-md font-medium">
                              Remaining
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className="relative w-full h-10 border font-Poppins px-[15px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099]">
                                <p>₹ {remaining.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <button
                    className=" bs-spj  font-[500] font-Poppins text-[#fff] rounded-[8px] py-[5px] justify-center  text-[18px] mx-auto mt-[px] flex w-[120px]"
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
