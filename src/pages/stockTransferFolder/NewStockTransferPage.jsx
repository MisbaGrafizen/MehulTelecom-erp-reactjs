"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";

import { companies, deviceTypes } from "../../../src/data/companies"
import { addTransfer } from "../../../src/lib/transferstore"
import { Dropdown, Toast } from "../../../src/Component/Uikit"
import { Calendar, Building2, MapPin, PlusCircle, Trash2, IndianRupee } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Header from "../../Component/header/Header"
import SideBar from "../../Component/sidebar/SideBar"
import { ApiGet, ApiPost } from "../../helper/axios"
import ImeiModal from "../../Component/purchaseCom/ImeiModal";

function formatINR(n) {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    } catch {
        return `₹ ${n}`
    }
}
function toISODate(d) {
    const dt = typeof d === "string" ? new Date(d) : d
    const yyyy = dt.getFullYear()
    const mm = String(dt.getMonth() + 1).padStart(2, "0")
    const dd = String(dt.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export default function NewStockTransferPage() {
    const navigate = useNavigate()
    const [toast, setToast] = useState("")
    const [date, setDate] = useState(toISODate(new Date()))
    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [companyId, setCompanyId] = useState(null);
    const [fromId, setFromId] = useState(null);
    const [toId, setToId] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isImeiModalOpen, setImeiModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [productAttributes, setProductAttributes] = useState({});

    const selectedCompany = useMemo(
        () => companies.find((c) => c._id === companyId),
        [companyId, companies]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ Fetch all companies (Info)
                const companyRes = await ApiGet("/admin/info");
                console.log('companyRes', companyRes)
                if (companyRes?.data) {
                    setCompanies(companyRes.data);
                    setCompanyId(companyRes.data[0]?._id || null);
                }

                // ✅ Fetch all branches
                const branchRes = await ApiGet("/admin/branch");
                console.log('branchRes', branchRes)
                if (branchRes?.data) {
                    setBranches(branchRes.data);
                }
            } catch (error) {
                console.error("Error loading companies or branches", error);
                setToast("Failed to load companies or branches");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPurchasedProducts = async () => {
            const userId = localStorage.getItem("userId");
            try {
                const res = await ApiGet(`/admin/purchase/user/${userId}`);
                if (!res) return;

                const raw = res?.data?.data || res?.data || res;

                // ✅ Always normalize to an array
                const purchases = Array.isArray(raw) ? raw : raw ? [raw] : [];
                const productsData = {};

                purchases.forEach((purchase) => {
                    const items = Array.isArray(purchase?.items) ? purchase.items : [];
                    items.forEach((item) => {
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
                console.error("❌ Error fetching products:", err);
            }
        };

        fetchPurchasedProducts();
    }, []);



    useEffect(() => {
        if (!companyId) return;

        const companyBranches = branches.filter(
            (b) => b.company?._id === companyId
        );

        if (companyBranches.length > 0) {
            setFromId(companyBranches[0]._id);
            setToId(companyBranches[1]?._id || companyBranches[0]._id);
        }
    }, [companyId, branches]);


    const fromBranch = branches.find((b) => b._id === fromId);
    const toBranch = branches.find((b) => b._id === toId);


    const [items, setItems] = useState([{ type: "Mobile", name: "", imei: "", model: "", qty: 1, price: 0, amount: 0 }])

    useEffect(() => {
        setItems((prev) => prev.map((i) => ({ ...i, amount: Number(i.qty || 0) * Number(i.price || 0) })))
    }, [])

    const total = useMemo(() => items.reduce((s, i) => s + Number(i.amount || 0), 0), [items])

    function addRow() {
        setItems((prev) => [...prev, { type: "Mobile", name: "", imei: "", model: "", qty: 1, price: 0, amount: 0 }])
    }

    function removeRow(idx) {
        setItems((prev) => prev.filter((_, i) => i !== idx))
    }

    function updateItem(idx, patch) {
        setItems((prev) =>
            prev.map((it, i) =>
                i === idx ? { ...it, ...patch, amount: Number(patch.qty ?? it.qty) * Number(patch.price ?? it.price) } : it,
            ),
        )
    }

    const handleSelectProduct = async (index, name) => {
        handleItemChange(index, "itemName", name);
        setActiveDropdown(null);
        setSearchTerm("");

        try {
            // ✅ Fetch product attributes dynamically
            const res = await ApiGet(`/admin/product-details/${encodeURIComponent(name)}`);
            if (res?.data) {
                setProductAttributes((prev) => ({
                    ...prev,
                    [name]: res.data, // should return { colors:[], specifications:[], conditions:[], imeis:[] }
                }));
            }
        } catch (err) {
            console.error("❌ Error fetching product attributes:", err);
        }
    };


    async function submitTransfer() {
        if (!companyId || !fromId || !toId || fromId === toId) {
            setToast("Please select a company and two different branches.");
            return;
        }

        const cleaned = items.filter((i) => i.itemName || i.name || Number(i.amount) > 0);
        if (!cleaned.length) {
            setToast("Add at least one item.");
            return;
        }

        // ✅ Determine userType automatically
        const storedUserType = localStorage.getItem("role") || "";
        const finalUserType =
            storedUserType.toLowerCase() === "admin" ? "User" : "Branch";

        const payload = {
            userId: localStorage.getItem("userId"),
            userType: finalUserType, // ✅ auto assigned
            companyId,
            fromBranchId: fromId,
            toBranchId: toId,
            transferDate: date,
            items: cleaned.map((i) => ({
                itemName: i.itemName || i.name || "",
                serialNumbers: (i.serialNumbers || i.imei || [])
                    .filter(
                        (s) =>
                            (typeof s === "string" && s.trim() !== "") ||
                            (!s.isSold && !s.inTransfer)
                    )
                    .map((s) => ({
                        number: typeof s === "object" ? s.number : s,
                        isSold: false,
                        inTransfer: true, // ✅ mark temporarily in transfer
                    })),
                modelNo: i.model || "",
                specification: i.specification || "",
                condition: i.condition || "",
                color: i.color || "",
                qty: i.serialNumbers?.length || Number(i.qty) || 1,
                unit: i.unit || "PCS",
                pricePerUnit: Number(i.pricePerUnit || i.price || 0),
                amount: Number(i.amount || 0),
            })),
        };

        try {
            const res = await ApiPost("/admin/stock-transfer", payload);
            if (res?.status === 201 || res?.data?.success) {
                setToast("Transfer created successfully!");
                setTimeout(() => navigate("/stock-transfer"), 800);
            } else {
                setToast("Failed to create transfer.");
            }
        } catch (err) {
            console.error("❌ Transfer creation failed:", err);
            setToast("Error creating transfer");
        }
    }



    const filteredSuggestions = (term) => {
        if (!term) return productSuggestions;
        return productSuggestions.filter((p) =>
            p.name.toLowerCase().includes(term.toLowerCase())
        );
    };


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

    const handleSerialClick = async (product, index) => {
  if (!product.itemName) {
    setToast("Please select a product first!");
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    const role = (localStorage.getItem("role") || "").toLowerCase();
    const userType = role === "admin" ? "User" : "Branch";

    // ✅ Fetch purchases belonging only to this user
    const res = await ApiGet(`/admin/purchase/user/${userId}?userType=${userType}`);

    // ✅ Normalize the response
    const raw = res?.data?.data || res?.data || res;
    const purchases = Array.isArray(raw) ? raw : raw ? [raw] : [];

    // ✅ Filter serials by product name
    const serials = purchases.flatMap((p) =>
      (Array.isArray(p.items) ? p.items : [])
        .filter((i) => i.itemName === product.itemName)
        .flatMap((i) =>
          (Array.isArray(i.serialNumbers) ? i.serialNumbers : [])
            .filter((s) => !s.isSold && !s.inTransfer)
            .map((s) => s.number)
        )
    );

    // ✅ Log for debugging
    console.log("✅ Available serial numbers for", product.itemName, ":", serials);

    // ✅ Open modal and show the selected product
    setSelectedModel(product.itemName);
    setSelectedProductIndex(index);
    setImeiModalOpen(true);

    // Optional: preload serials for modal display
    if (serials.length > 0) {
      setItems((prev) => {
        const updated = [...prev];
        updated[index].availableSerials = serials; // store temporarily
        return updated;
      });
    }
  } catch (err) {
    console.error("❌ Error fetching serials:", err);
    setToast("Failed to fetch serial numbers!");
  }
};



    return (
        <>
            <section className="flex w-[100%] font-Poppins h-[100%] select-none p-[15px] overflow-hidden">
                <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
                    <Header pageName=" New Transfer" />
                    <div className="flex gap-[10px] w-[100%] h-[100%]">
                        <SideBar />
                        <div className="flex w-[100%] max-h-[90%] pb-[50px] pr-[15px]  gap-[30px] rounded-[10px]">


                            <div className=" w-[100%]">


                                <main className="mx-auto ">
                                    {/* Company & Branches */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Dropdown
                                                label={selectedCompany?.firmName || "Select Company"}
                                                options={companies.map((c) => ({ label: c.firmName, value: c._id }))}
                                                value={companyId}
                                                onChange={(v) => setCompanyId(v)}
                                                leadingIcon={<Building2 size={16} className="text-blue-600" />}
                                            />

                                            <Dropdown
                                                label={
                                                    fromId
                                                        ? `From: ${branches.find((b) => b._id === fromId)?.name || "Select"}`
                                                        : "From Branch"
                                                }
                                                options={branches
                                                    .filter((b) => b.company?._id === companyId)
                                                    .map((b) => ({ label: b.name, value: b._id }))}
                                                value={fromId}
                                                onChange={(v) => setFromId(v)}
                                                leadingIcon={<MapPin size={16} className="text-slate-700" />}
                                            />

                                            {/* ✅ To Branch Dropdown */}
                                            <Dropdown
                                                label={
                                                    toId
                                                        ? `To: ${branches.find((b) => b._id === toId)?.name || "Select"}`
                                                        : "To Branch"
                                                }
                                                options={branches
                                                    .filter((b) => b.company?._id === companyId && b._id !== fromId)
                                                    .map((b) => ({ label: b.name, value: b._id }))}
                                                value={toId}
                                                onChange={(v) => setToId(v)}
                                                leadingIcon={<MapPin size={16} className="text-slate-700" />}
                                            />

                                            <div className="flex items-center gap-2">
                                                {/* <Calendar size={16} className="text-blue-600" /> */}
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className=" outline-none border rounded-[8px] 00 px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Addresses */}
                                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 p-3">
                                                <div className="text-xs font-[600] text-slate-600">From Address</div>
                                                <div className="text-sm">{fromBranch?.address}</div>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 p-3">
                                                <div className="text-xs font-[600] text-slate-600">To Address</div>
                                                <div className="text-sm">{toBranch?.address}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white w-[100%] relative  mt-[20px]  rounded-[10px] shadow1-blue">
                                        <div className="flex-shrink-0 border bg-white rounded-[10px] w-[100%]">
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

                                                                <td className="py-2 relative px-4 border-r font-Poppins border-gray-200">
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
                                                                    <AnimatePresence>
                                                                        {activeDropdown === index && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -5 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -5 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="absolute z-30 left-[0px] top-[68%] mt-4 w-[300px] bg-white border border-gray-200 shadow-lg rounded-md max-h-[220px] overflow-y-auto"
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

                                                                </td>

                                                                {/* ✅ COLOR DROPDOWN */}
                                                                <td className="py-2 px-4 border-r font-Poppins border-gray-200 relative">
                                                                    <input
                                                                        type="text"
                                                                        value={product.color}
                                                                        disabled={!product.itemName}
                                                                        onFocus={() => product.itemName && setActiveDropdown(`color-${index}`)}
                                                                        onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                                                        placeholder={product.itemName ? "Select color" : "Select Product First"}
                                                                        className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
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
                                                                                        className={`flex justify-between items-center px-3 py-2 text-sm transition-colors ${stock === 0
                                                                                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                                                                            : "hover:bg-blue-50 cursor-pointer text-gray-700"
                                                                                            }`}
                                                                                    >
                                                                                        <span>{color}</span>
                                                                                        <span
                                                                                            className={`font-medium ${stock === 0
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
                                                                        className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
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
                                                                                                className={`font-medium ${stock === 1 ? "text-blue-500" : "text-green-600"
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
                                                                        className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""
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
                                                                                                className={`font-medium ${stock === 0
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




                                                                {/* IMEI / SERIAL NUMBER FIELD */}
                                                                <td className="py-2 px-4 border-r font-Poppins border-gray-200">
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            product.serialNumbers
                                                                                ?.map((s) => (typeof s === "object" ? s.number : s))
                                                                                .join(", ") || ""
                                                                        }
                                                                        readOnly
                                                                        disabled={!product.itemName}
                                                                        onFocus={() => {
                                                                            if (product.itemName) handleSerialClick(product, index);
                                                                        }}
                                                                        className={`w-full border-0 outline-none font-Poppins focus:ring-0 text-sm ${!product.itemName
                                                                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                                                            : "cursor-pointer"
                                                                            }`}
                                                                        placeholder={
                                                                            product.itemName ? "Select IMEI / Serial" : "Select Product First"
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
                                                                        onClick={() => removeRow(index)}
                                                                        className="text-red-500  w-[30px]  justify-center flex h-[30px] items-center right-[-30px] shadow-lg top-[9px] absolute bg-white hover:text-red-700 rounded-r-[10px] transition-colors"
                                                                        title="Delete row"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                )}

                                                            </tr>


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
                                                                            inTransfer: false,
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


                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">


                                        <div className=" grid grid-cols-1 gap-3 md:grid-cols-3">
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white">
                                                        <IndianRupee size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-[600] text-emerald-700">Items</div>
                                                        <div className="text-lg font-[600] text-emerald-900">{items.length}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                                <div className="text-sm font-[600] text-blue-700">From</div>
                                                <div className="text-sm font-[500]">{fromBranch?.name}</div>
                                            </div>
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                <div className="text-sm font-[600] text-amber-700">Total</div>
                                                <div className="text-lg font-[600] text-amber-900">{formatINR(total)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 flex justify-end gap-2">
                                        <button onClick={() => router.push("/stock-transfer")} className="rounded-xl border px-4 py-2 font-[500]">
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitTransfer}
                                            className="rounded-xl bg-blue-600 px-5 py-2 font-[600] text-white hover:bg-blue-700"
                                        >
                                            Transfer
                                        </button>
                                    </div>
                                </main>

                                <Toast message={toast} onDismiss={() => setToast("")} />
                            </div>

                        </div>
                    </div>

                </div>
            </section>

        </>
    )
}
