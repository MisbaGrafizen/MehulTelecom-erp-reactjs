import { useCallback, useEffect, useRef, useState } from "react";
import SideBar from "../../Component/sidebar/SideBar";
import Header from "../../Component/header/Header";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import { Check } from "lucide-react";
import { Plus, Scan, Pencil } from "lucide-react";
import { Modal as NextUIModal, ModalContent } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomerAction } from "../../redux/action/userManagement";
import { ApiGet, ApiPost } from "../../helper/axios";
import { getCompanyInfoAction } from "../../redux/action/generalManagement";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import { X, CheckCircle } from "lucide-react"

export default function PurchesInvoice() {
  const [nameFocused, setNameFocused] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedType, setSelectedType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const createdropdownRef = useRef(null);
  const [createselectedType, setCreateSelectedType] = useState("");
  const [createdropdownOpen, setCreateDropdownOpen] = useState(false);
  const firmdropdownRef = useRef(null);
  const [firmselectedType, setFirmSelectedType] = useState("");
  const [firmdropdownOpen, setFirmDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [gstFocused, setGstFocused] = useState(false);
  const [panFocused, setPanFocused] = useState(false);
  const [stateFocused, setStateFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [partyModalopen, setPartyModalOpen] = useState(false);
  const [discountInFocused, setDiscountInFocused] = useState(false);
  const [outFocused, setOutocused] = useState(false);
  const [groupFocused, setGroupFocused] = useState(false);
  const [firmFocused, setFirmFocused] = useState(false);
  const [partyNameFocused, setPartyNameFocused] = useState(false);
  const [partyStateFocused, setPartyStateNameFocused] = useState(false);
  const [partyCityFocused, setPartyCityFocused] = useState(false);
  const [partyAddressFocused, setPartyAddressFocused] = useState(false);
  const [partyPinFocused, setPartyPinFocused] = useState(false);
  const [partyGstFocused, setPartyGstFocused] = useState(false);
  const [partyPanFocused, setPartyPanFocused] = useState(false);
  const [partyEmailFocused, setPartyEmailFocused] = useState(false);
  const [partyNumberFocused, setPartyNumberFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [createdInvoiceId, setCreatedInvoiceId] = useState(null);
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [selectedLabourType, setSelectedLabourType] = useState("");
  const [labourFocused, setLabourFocused] = useState(false);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [totalTaxAmount, setTotalTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [lastEditedField, setLastEditedField] = useState(null);

  const [cashPayment, setCashPayment] = useState(0);
  const [onlinePayment, setOnlinePayment] = useState(finalTotal);

  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [userState, setUserState] = useState("");
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  useEffect(() => {
    // Reset all states on page load
    setSelectedType("");
    setCustomerId(null);
    setAddress("");
    setGstNumber("");
    setPanNumber("");
    setUserState("");
    setSelectedDate(new Date());
    setDropdownOpen(false);
    setProducts([]); // Reset products table to an empty array
    setTotals({
      grossQty: 0,
      netQty: 0,
      amount: 0,
    });
    setCgst(0);
    setSgst(0);
    setTotalTaxAmount(0);
    setDiscountAmount(0);
    setDiscountPrice(0);
    setFinalTotal(0);
    setDiscountPercentage(0);
  }, []); // Run only once when the component mounts




  const [products, setProducts] = useState([
    {
      id: 1,
      barcodeVisible: true, // Ensure first row has visible barcode input
      groupItemId: { itemName: "" }, // Placeholder for product name
      toWeight: "",
      netWeight: "",
      totalPrice: "",
    }
  ]);


  const dispatch = useDispatch();

  const [totals, setTotals] = useState({
    grossQty: 0,
    netQty: 0,
    amount: 0,
  });

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    partyGroup: "",
    name: "",
    address: "",
    GST: "",
    panNo: "",
    firmType: "",
    state: "",
    city: "",
    pinCode: "",
    mobileNumber: "",
    email: "",
  });



  const customers = useSelector((state) => state?.users?.getCustomer);
  const companyInfo = useSelector((state) => state?.general?.getCompanyInfo);
  const productNameInputRefs = useRef([]);

  useEffect(() => {
    dispatch(getAllCustomerAction());
    dispatch(getCompanyInfoAction());
    }, [dispatch]);


  const fetchProductDetails = async (productName, index) => {
    try {
      const response = await ApiGet(`/admin/productDetails?productName=${productName}`);
      console.log("Fetched Product Details:", response);

      if (response) {
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];

          // ✅ Ensure we are updating the existing product at the given index
          updatedProducts[index] = {
            ...prevProducts[index], // Preserve any manually entered data
            productId: response._id, // ✅ Ensure productId is correctly assigned
            productName: response.productName,
            availableStock: response.toWeight,
            remainingStock: response.toWeight,
            availablePcs: response.pcs,
            remainingPcs: response.pcs,
            grossWeight: response.toWeight || 0,
            netWeight: (response.toWeight || 0) - (prevProducts[index]?.lessWeight || 0),
            barcodeVisible: response.barcodeVisible ?? false,
            pcs: response.pcs || 0,

            // marketRateUsed: response.marketRateUsed || 0,
            extraRate: response.extraRate || 0,
            labour: response.labour || 0,
            gst: response.gst || 0,
            gRate: response.marketRateUsed || 0, // ✅ Assuming G Rate = marketRateUsed
            gRs: response.calculatedMarketRate || 0, // ✅ Ensure this gets the correct value
            GMEAmount: response.GMEPrice || (response.calculatedMarketRate + response.extraRate) || 0,
            totalPrice: response.totalPrice || response.finalPrice || 0,
          };

          console.log("✅ Updated Products:", updatedProducts);
          return updatedProducts; // ✅ Ensure we return the correctly formatted array
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    // Calculate total price whenever products change
    let total = products.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0);
    setTotalPrice(total);

    // Apply discount if available
    const discountAmt = (total * discountPercentage) / 100;
    setDiscountAmount(discountAmt);

    const finalAmount = total - discountAmt;
    setFinalTotal(finalAmount);
  }, [products, discountPercentage]);

  useEffect(() => {
    // Determine applicable total (finalTotal if discount is applied, otherwise totalPrice)
    const applicableTotal = discountPercentage > 0 ? finalTotal : totalPrice;

    // Ensure cashPayment does not exceed applicable total
    const validCashPayment = Math.min(parseFloat(cashPayment) || 0, applicableTotal);
    const calculatedOnlinePayment = applicableTotal - validCashPayment;

    setCashPayment(validCashPayment);
    setOnlinePayment(calculatedOnlinePayment);
  }, [cashPayment, finalTotal, totalPrice, discountPercentage]);

  useEffect(() => {
    // Reset payments when total updates
    setCashPayment(0);
    setOnlinePayment(discountPercentage > 0 ? finalTotal : totalPrice);
  }, [finalTotal, totalPrice, discountPercentage]);


  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust the multiplier for speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePartyModal = () => {
    setPartyModalOpen(true);
  };

  const closePartyModal = () => {
    setPartyModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        createdropdownRef.current &&
        !createdropdownRef.current.contains(event.target)
      ) {
        setCreateDropdownOpen(false);
      }
      if (
        firmdropdownRef.current &&
        !firmdropdownRef.current.contains(event.target)
      ) {
        setFirmDropdownOpen(false);
      }
      if (
        labourDropdownRef.current &&
        !labourDropdownRef.current.contains(event.target)
      ) {
        setDropdownTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [checkedItems, setCheckedItems] = useState({
    grossQty: false,
    netQty: false,
    discount: false,
    rate: false,
    tcs: false,
  });

  const handleChange = (name) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };


  const handlePartyInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleInputChange = (e, index, field) => {
    const value = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleKeyDown = async (e, index) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const inputValue = e.target.value.trim();

      if (/^\d{5,}$/.test(inputValue)) {
        // ✅ Fetch by Barcode
        await fetchProductByBarcode(inputValue, index);
      } else {
        // ✅ Fetch by Product Name
        fetchProductDetails(inputValue, index);
      }
    }
  };


  const fetchUserDetails = async (userName) => {
    try {
      const response = await ApiGet(`/admin/customer-by-name/${userName}`);
      console.log("response", response);
      const userData = response.data?.data || response.data;

      setAddress(userData.address || "");
      setGstNumber(userData.GST || "");
      setPanNumber(userData.panNo || "");
      setUserState(userData.state || "");

      setAddressFocused(Boolean(userData.address));
      setGstFocused(Boolean(userData.GST));
      setPanFocused(Boolean(userData.panNo));
      setStateFocused(Boolean(userData.state));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedType(user.name);
    setCustomerId(user._id);
    setDropdownOpen(false);
    fetchUserDetails(user.name);
  };

  const fetchProductByBarcode = async (barcodeValue, productIndex) => {
    try {
      const response = await ApiGet(`/admin/product/${barcodeValue}`);
      const productData = response.product || {};

      console.log("Fetched Barcode Product Data:", productData);

      setProducts((prevProducts) =>
        prevProducts.map((product, index) =>
          index === productIndex
            ? {
              ...product,
              ...productData,
              barcodeVisible: false, // Hide barcode input after fetching
              productId: productData._id, // Ensure correct product reference
              autoRef: "SPJProduct", // Reference model type
              groupItemId: productData.groupItemId || { itemName: "N/A" },
              toWeight: productData.toWeight || "0",
              netWeight: productData.netWeight || "0",
              totalPrice: productData.finalPrice || "0",
            }
            : product
        )
      );

      // Update totals
      setTotals((prevTotals) => ({
        grossQty: prevTotals.grossQty + parseFloat(productData.toWeight || 0),
        netQty: prevTotals.netQty + parseFloat(productData.netWeight || 0),
        amount: prevTotals.amount + parseFloat(productData.totalPrice || 0),
      }));
    } catch (error) {
      console.error("Error fetching product by barcode:", error);
    }
  };


  const handleAddProduct = () => {
    const newProduct = {
      id: products?.length + 1,
      barcodeVisible: true,
      groupItemId: { itemName: "" },
      toWeight: "",
      netWeight: "",
      marketRateUsed: "",
      gTs: "",
      totalPrice: "",
    };
    setProducts([...products, newProduct]);

    setTimeout(() => {
      const inputRef = productNameInputRefs.current[products.length];
      if (inputRef) {
        inputRef.focus();
      }
    }, 0);
  };


  const handleDiscountKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTotalsAndApplyDiscount();
    }
  };

  const handleDiscountPercentageChange = (e) => {
    const percentage = parseFloat(e.target.value) || 0;
    setDiscountPercentage(percentage.toFixed(2));
    setLastEditedField("percentage"); // ✅ Track last edited field
  };
  
  const handleDiscountAmountChange = (e) => {
    const amount = Number(e.target.value);
    setDiscountAmount(amount);
    setDiscountPercentage(""); // Reset percentage when amount is entered
    setLastEditedField("amount"); // Track last edited field
  };

  // const calculateInvoiceTotals = (products = [], discountPercentage = 0, isTaxApplied = false) => {
  //   if (!products.length) return null;

  //   console.log("📌 Calculating Invoice Totals...");

  //   let totalPrice = products.reduce((sum, p) => sum + (parseFloat(p.finalPrice) || 0), 0);
  //   console.log('✅ Total Price Before Discount:', totalPrice);

  //   // ✅ Step 1: Apply Discount (if any)
  //   const discountAmount = discountPercentage ? (totalPrice * discountPercentage) / 100 : 0;
  //   const discountPrice = totalPrice - discountAmount;
  //   console.log("✅ Discounted Price:", discountPrice, "Discount Amount:", discountAmount);

  //   let calculatedCgst = 0;
  //   let calculatedSgst = 0;
  //   let totalTax = 0;
  //   let finalPrice = discountPrice;

  //   // ✅ Step 2: Apply GST ONLY if Tax is selected
  //   if (isTaxApplied) {
  //     calculatedCgst = (discountPrice * 1.5) / 100;
  //     calculatedSgst = (discountPrice * 1.5) / 100;
  //     totalTax = calculatedCgst + calculatedSgst;

  //     // ✅ Step 3: Add GST to the final price
  //     finalPrice = discountPrice + totalTax;
  //   }

  //   console.log("✅ CGST:", calculatedCgst, "SGST:", calculatedSgst, "Total Tax:", totalTax);
  //   console.log("✅ Final Invoice Amount:", finalPrice);

  //   return {
  //     totalPrice,
  //     discountPercentage,
  //     discountAmount,
  //     discountPrice,
  //     cgst: calculatedCgst,
  //     sgst: calculatedSgst,
  //     totalTax,
  //     finalPrice,
  //   };
  // };

  const calculateInvoiceTotals = (products = [], discountPercentage = 0, discountAmount = 0, isTaxApplied = false) => {
    if (!products.length) return null;
  
    console.log("📌 Calculating Invoice Totals...");
  
    let totalPrice = products.reduce((sum, p) => sum + (parseFloat(p.finalPrice) || 0), 0);
    console.log('✅ Total Price Before Discount:', totalPrice);
  
    // If discount amount is provided, recalculate discountPercentage
    if (discountAmount > 0) {
      discountPercentage = (discountAmount / totalPrice) * 100;
    } else {
      discountAmount = (totalPrice * discountPercentage) / 100;
    }
  
    const discountedPrice = totalPrice - discountAmount;
    console.log("✅ Discounted Price:", discountedPrice, "Discount Amount:", discountAmount, "Discount %:", discountPercentage);
  
    let calculatedCgst = 0;
    let calculatedSgst = 0;
    let totalTax = 0;
    let finalPrice = discountedPrice;
  
    // ✅ Step 2: Apply GST ONLY if Tax is selected
    if (isTaxApplied) {
      calculatedCgst = (discountedPrice * 1.5) / 100;
      calculatedSgst = (discountedPrice * 1.5) / 100;
      totalTax = calculatedCgst + calculatedSgst;
  
      // ✅ Step 3: Add GST to the final price
      finalPrice = discountedPrice + totalTax;
    }
  
    finalPrice = Math.max(finalPrice, 0); // Prevent negative total
  
    console.log("✅ CGST:", calculatedCgst, "SGST:", calculatedSgst, "Total Tax:", totalTax);
    console.log("✅ Final Invoice Amount:", finalPrice);
  
    return {
      totalPrice,
      discountPercentage,
      discountAmount,
      discountPrice: discountedPrice,
      cgst: calculatedCgst,
      sgst: calculatedSgst,
      totalTax,
      finalPrice,
    };
  };
  

  // ✅ Function to Update State with Calculated Values
  // const updateTotalsAndApplyDiscount = (isTaxApplied) => {
  //   setProducts((prevProducts) => {
  //     let totalPrice = prevProducts.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0);

  //     // ✅ Step 1: Apply Discount
  //     const discountAmount = (totalPrice * discountPercentage) / 100;
  //     const discountedPrice = totalPrice - discountAmount;

  //     let calculatedCgst = 0;
  //     let calculatedSgst = 0;
  //     let totalTax = 0;
  //     let finalPrice = discountedPrice;

  //     // ✅ Step 2: Apply GST ONLY if Tax is selected
  //     if (isTaxApplied) {
  //       calculatedCgst = (discountedPrice * 1.5) / 100;
  //       calculatedSgst = (discountedPrice * 1.5) / 100;
  //       totalTax = calculatedCgst + calculatedSgst;

  //       // ✅ Step 3: Add GST to the final price
  //       finalPrice = discountedPrice + totalTax;
  //     }

  //     // ✅ Update invoice state
  //     setDiscountAmount(discountAmount);
  //     setDiscountPrice(discountedPrice);
  //     setCgst(calculatedCgst);
  //     setSgst(calculatedSgst);
  //     setTotalTaxAmount(totalTax);
  //     setFinalTotal(finalPrice);

  //     console.log("✅ Updated Invoice Totals:", {
  //       totalPrice,
  //       discountAmount,
  //       discountedPrice,
  //       cgst: calculatedCgst,
  //       sgst: calculatedSgst,
  //       totalTax,
  //       finalPrice,
  //       isTaxApplied,
  //     });

  //     return prevProducts;
  //   });
  // };

  // const updateTotalsAndApplyDiscount = (isTaxApplied) => {
  //   setProducts((prevProducts) => {
  //     let totalPrice = prevProducts.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0);
  
  //     // ✅ Step 1: Ensure discountAmount is updated dynamically
  //     let discountAmt = discountAmount > 0 ? discountAmount : (totalPrice * discountPercentage) / 100;
  //     let discountPer = discountAmount > 0 ? (discountAmount / totalPrice) * 100 : discountPercentage;
  
  //     const discountedPrice = totalPrice - discountAmt;
  
  //     let calculatedCgst = 0;
  //     let calculatedSgst = 0;
  //     let totalTax = 0;
  //     let finalPrice = discountedPrice;
  
  //     // ✅ Step 2: Apply GST ONLY if Tax is selected
  //     if (isTaxApplied) {
  //       calculatedCgst = (discountedPrice * 1.5) / 100;
  //       calculatedSgst = (discountedPrice * 1.5) / 100;
  //       totalTax = calculatedCgst + calculatedSgst;
  
  //       // ✅ Step 3: Add GST to the final price
  //       finalPrice = discountedPrice + totalTax;
  //     }
  
  //     finalPrice = Math.max(finalPrice, 0); // Prevent negative total
  
  //     // ✅ Update invoice state
  //     setDiscountAmount(Number(discountAmt).toFixed(2));
  //     setDiscountPercentage(Number(discountPer).toFixed(2));
  //     setDiscountPrice(Number(discountedPrice).toFixed(2));
  //     setCgst(Number(calculatedCgst).toFixed(2));
  //     setSgst(Number(calculatedSgst).toFixed(2));
  //     setTotalTaxAmount(Number(totalTax).toFixed(2));
  //     setFinalTotal(finalPrice);
  
  //     console.log("✅ Updated Invoice Totals:", {
  //       totalPrice,
  //       discountAmt,
  //       discountPer,
  //       discountedPrice,
  //       cgst: calculatedCgst,
  //       sgst: calculatedSgst,
  //       totalTax,
  //       finalPrice,
  //       isTaxApplied,
  //     });
  
  //     return prevProducts;
  //   });
  // };

  const updateTotalsAndApplyDiscount = (isTaxApplied) => {
    setProducts((prevProducts) => {
      let totalPrice = prevProducts.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0);
  
      let discountAmt = parseFloat(discountAmount) || 0;
      let discountPer = parseFloat(discountPercentage) || 0;
  
      // ✅ Ensure only one value is recalculated based on the last edited field
      if (lastEditedField === "amount") {
        discountPer = totalPrice > 0 ? ((discountAmt / totalPrice) * 100) : 0;
      } else if (lastEditedField === "percentage") {
        discountAmt = totalPrice > 0 ? ((totalPrice * discountPer) / 100) : 0;
      }
  
      // ✅ Do NOT recalculate discountAmt if lastEditedField is "amount"
      const discountedPrice = totalPrice - discountAmt;
  
      let calculatedCgst = 0;
      let calculatedSgst = 0;
      let totalTax = 0;
      let finalPrice = discountedPrice;
  
      if (isTaxApplied) {
        calculatedCgst = (discountedPrice * 1.5) / 100;
        calculatedSgst = (discountedPrice * 1.5) / 100;
        totalTax = calculatedCgst + calculatedSgst;
        finalPrice = discountedPrice + totalTax;
      }
  
      finalPrice = Math.max(finalPrice, 0); // Prevent negative totals
  
      // ✅ Preserve exact values entered by the user
      setDiscountAmount(lastEditedField === "amount" ? discountAmt.toFixed(2) : discountAmt);
      setDiscountPercentage(lastEditedField === "percentage" ? discountPer.toFixed(2) : discountPer);
      setDiscountPrice(discountedPrice.toFixed(2));
      setCgst(calculatedCgst.toFixed(2));
      setSgst(calculatedSgst.toFixed(2));
      setTotalTaxAmount(totalTax.toFixed(2));
      setFinalTotal(finalPrice);
  
      console.log("✅ Updated Invoice Totals:", {
        totalPrice,
        discountAmt,
        discountPer,
        discountedPrice,
        cgst: calculatedCgst,
        sgst: calculatedSgst,
        totalTax,
        finalPrice,
        isTaxApplied,
      });
  
      return prevProducts;
    });
  };
  
  
  const handleSaveInvoice = async () => {
    try {
      const invoiceData = calculateInvoiceTotals(products, discountPercentage);

      if (!invoiceData) {
        console.error("❌ Error: Invoice Data calculation failed!");
        return;
      }

      const isTaxApplied = formData1.taxType === "tax";

      const cgstAmount = isTaxApplied ? invoiceData.cgst : 0;
      const sgstAmount = isTaxApplied ? invoiceData.sgst : 0;
      const totalGstAmount = isTaxApplied ? invoiceData.totalTax : 0;
      const finalPrice = isTaxApplied ? invoiceData.finalPrice : invoiceData.discountPrice;

      console.log('invoiceData.cgst', invoiceData.cgst)


      const payload = {
        customerId,
        products: products.map((product) => ({
          productId: product?.productId || "",
          hsnCode: product?.hsn || 0,
          gstRate: product?.gstRate || 0,
          grossWeight: product?.toWeight || 0,
          netWeight: product?.netWeight || 0,
          labour: product?.labour || 0,
          labourRate: product?.labourRate || 0,
          extraRs: product?.extraRate || 0,
          totalPrice: product?.finalPrice || 0,
          pcs: Number(product?.pcs) || 0,
        })),
        billType: isTaxApplied ? "tax" : "estimate",
        billNo: Date.now(),
        date: selectedDate,
        discount: discountPercentage || 0,
        discountAmount: invoiceData.discountAmount,
        discountPrice: invoiceData.discountPrice,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        gstAmount: totalGstAmount,
        cashPayment: cashPayment,
        bankPayment: onlinePayment,
        totalPrice: finalPrice,
        companyId: companyInfo?.[0]?._id,
        paymentType: "cash",
      };

      console.log("📌 Invoice Payload:", payload);

      const response = await ApiPost("/admin/bill", payload);
      console.log("✅ Response:", response);

      if (response.data.bill) {
        setCreatedInvoiceId(response.data.bill._id);
        alert("Invoice created successfully!");
        navigate(`/invoice-bill/${response.data.bill._id}?type=sale`);
      } else {
        alert("Failed to create invoice!");
      }
    } catch (error) {
      console.error("❌ Error creating invoice:", error);
      alert("An error occurred while creating the invoice.");
    }
  };


  const handleSubmit = async () => {
    try {
      const response = await ApiPost("/admin/customer", formData);
      console.log("response", response);
      setIsOpen(true)
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);


      // Reset form and close modal
      setFormData({
        partyGroup: "",
        name: "",
        address: "",
        GST: "",
        panNo: "",
        firmType: "",
        state: "",
        city: "",
        pinCode: "",
        mobileNumber: "",
        email: "",
      });
      closePartyModal(); // Close the modal
    } catch (error) {
      console.error("Error creating party:", error);
      alert("Failed to create party. Please try again.");
    }
  };

  const onClose = () => {
    setIsOpen(false); // Close the modal
  };

  const handleProductInputChange = (e, index, field) => {
    const value = e.target.value;

    setProducts((prevProducts) => {
      return prevProducts.map((product, i) => {
        if (i === index) {
          let updatedProduct = { ...product, [field]: value };

          updatedProduct.productId = product?.productId || product?.groupItemId?._id || "";

          if (field === "productName") {
            fetchProductDetails(value, index);
          }

          if (field === "grossWeight") {
            updatedProduct.grossWeight = parseFloat(value) || 0;
            updatedProduct.availableStock = updatedProduct.grossWeight;
            updatedProduct.netWeight = updatedProduct.grossWeight;
          }

          if (field === "marketRateUsed" || field === "netWeight") {
            const marketRateUsed = parseFloat(updatedProduct.marketRateUsed) || 0;
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;
            updatedProduct.calculatedMarketRate = marketRateUsed * netWeight;
          }

          // ✅ Move Labour Calculation to a Function
          updatedProduct.labourRate = calculateLabourRate(
            selectedLabourType,
            updatedProduct.labour,
            updatedProduct.pcs,
            updatedProduct.netWeight,
            updatedProduct.totalPrice
          );

          if (field === "totalPrice") {
            updatedProduct.totalPrice = value;

            // ✅ Step 1: Apply Discount
            const discountAmount = (value * discountPercentage) / 100;
            const discountedPrice = value - discountAmount;

            // ✅ Step 2: Calculate GST (CGST & SGST at 1.5% each)
            const cgst = (discountedPrice * 1.5) / 100;
            const sgst = (discountedPrice * 1.5) / 100;
            const totalTax = cgst + sgst;

            // ✅ Step 3: Calculate Final Invoice Amount
            const finalPrice = discountedPrice + totalTax;

            // ✅ Assign Calculated Values
            updatedProduct.discountAmount = discountAmount;
            updatedProduct.discountedPrice = discountedPrice;
            updatedProduct.cgst = cgst;
            updatedProduct.sgst = sgst;
            updatedProduct.totalTax = totalTax;
            updatedProduct.finalPrice = finalPrice;

            // ✅ Labour Calculation
            const goldRs = parseFloat(updatedProduct.calculatedMarketRate) || 0;
            updatedProduct.labour = value - goldRs;

            if (updatedProduct.labour !== 0) {
              updatedProduct.labourType = "FX";
            }
          }

          // ✅ Update GME Price
          const calculatedMarketRate = parseFloat(updatedProduct.calculatedMarketRate) || 0;
          const labourRate = parseFloat(updatedProduct.labourRate) || 0;
          const extraRate = parseFloat(updatedProduct.extraRate) || 0;
          updatedProduct.GMEPrice = calculatedMarketRate + labourRate + extraRate;

          // ✅ Add GST Directly (Not as Percentage)
          const GMEPrice = parseFloat(updatedProduct.GMEPrice) || 0;
          const gstAmount = parseFloat(updatedProduct.gst) || 0;
          updatedProduct.finalPrice = GMEPrice + gstAmount;

          if (field === "pcs") {
            updatedProduct.pcs = parseFloat(value) || 0;
            updatedProduct.availablePcs = updatedProduct.pcs;
          }

          console.log("📌 Updated product:", updatedProduct);
          return updatedProduct;
        }
        return product;
      });
    });

    updateTotalsAndApplyDiscount();
  };

  // ✅ Function to Dynamically Calculate Labour Based on Selected Type
  const calculateLabourRate = (labourType, labour, pcs, netWeight, totalPrice, marketRateUsed) => {
    let labourValue = parseFloat(labour) || 0;
    let totalPcs = parseFloat(pcs) || 1;
    let weight = parseFloat(netWeight) || 1;
    let marketRate = parseFloat(marketRateUsed) || 0;

    if (labourType === "PP") {
      return labourValue * totalPcs; // Per Piece
    } else if (labourType === "%") {
      return (marketRate * weight * labourValue) / 100; // Percentage on Net Weight
    } else if (labourType === "GM") {
      return labourValue * weight; // Per Gram
    } else if (labourType === "FX") {
      return labourValue; // Fixed amount
    }
    return 0;
  };

  // ✅ UseEffect to Instantly Apply New Labour Type Calculation
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        labourRate: calculateLabourRate(
          selectedLabourType,
          product.labour,
          product.pcs,
          product.netWeight,
          product.totalPrice
        ),
        GMEPrice:
          (parseFloat(product.calculatedMarketRate) || 0) +
          (parseFloat(calculateLabourRate(
            selectedLabourType,
            product.labour,
            product.pcs,
            product.netWeight,
            product.totalPrice
          )) || 0) +
          (parseFloat(product.extraRate) || 0),
        finalPrice:
          (parseFloat(product.GMEPrice) || 0) +
          (parseFloat(product.gst) || 0),
      }))
    );
  }, [selectedLabourType]); // ✅ Runs whenever Labour Type changes

  const labourDropdownRef = useRef(null);

  // Labour Types
  const labourTypes = [
    { type: "PP" },
    { type: "GM" },
    { type: "%" },
    { type: "FX" }
  ];

  // Function to handle selection
  const handleSelectLabourType = (labour) => {
    setSelectedLabourType(labour.type);
    setDropdownTypeOpen(false);
  };





  useEffect(() => {
    const handleScroll = () => {
      setDropdownTypeOpen(false); // Close dropdown when scrolling
    };

    window.addEventListener("scroll", handleScroll); // Attach listener

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup
    };
  }, []);

  const [formData1, setFormData1] = useState({ taxType: '' });

  return (
    <>
      <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
        <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
          <Header pageName=" Sale Invoice" />
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
                      {/* <p className=" flex font-Poppins w-[50px]">Date :</p> */}
                      {/* <div className=" flex  items-center">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          className=" flex  w-[100px] border"
                        />
                        <i className="fa-regular text-[#9c9c9c] fa-calendar-days"></i>
                      </div> */}
                    </div>
                  </div>

                  <div className=" w-[38%] flex   gap-[15px] border-[1px] relative bg-white shadow1-blue py-[15px]  px-[15px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] flex-col gap-[16px]">
                      <div
                        ref={dropdownRef}
                        className="relative w-full border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                      >
                        <label
                          htmlFor="inname"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${selectedType || nameFocused
                            ? "text-[#000] -translate-y-[21px] hidden "
                            : "text-[#8f8f8f] cursor-text flex"
                            }`}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="firmType"
                          id="inname"
                          value={selectedType}
                          className="w-full outline-none text-[15px] py-[9px] font-Poppins font-[400] bg-transparent cursor-pointer"
                          readOnly
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setNameFocused(false)}
                        />
                        <i
                          className={
                            dropdownOpen
                              ? "fa-solid fa-chevron-up text-[14px] pr-[10px]"
                              : "fa-solid fa-chevron-down text-[14px] pr-[10px]"
                          }
                        ></i>
                      </div>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute  mt-[50px] bg-white w-[230px] border border-[#dedede] rounded-lg shadow-md z-10"
                          >
                            {customers.map((type, index) => (
                              <>
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                  onClick={() => handleSelectUser(type)}
                                >
                                  {type?.name}
                                </div>
                              </>
                            ))}
                            <div className=" flex w-[100%] p-[10px]">
                              <button
                                className=" flex w-[100%] items-center gap-[5px]  text-[13px] border-[#122f97] ts-spj rounded-[5px] font-Poppins border-[1px] font-[400]  justify-center py-[5px] border-dashed "
                                onClick={handlePartyModal}
                              >
                                <i className="fa-solid fa-plus"></i>Add Party
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="relative w-full  border-[1px] border-[#dedede]  h-[90px]  shadow rounded-lg flex items-center space-x-4 text-[#43414199]">
                        <label
                          htmlFor="address"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${address || addressFocused
                            ? "text-[#000] -translate-y-[45px] hidden font-[]"
                            : "  -translate-y-[27px] flex cursor-text "
                            }`}
                        >
                          Address
                        </label>
                        <textarea
                          type="text"
                          name="address"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          onFocus={() => setAddressFocused(true)}
                          onBlur={(e) =>
                            setAddressFocused(e.target.value !== "")
                          }
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] pt-[10px]  h-[100%] font-Poppins font-[400] bg-transparent"
                        ></textarea>
                      </div>
                    </div>

                    <div className=" flex w-[90%] gap-[15px] flex-col ">
                      <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="gst"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${gstFocused
                            ? "text-[#000] -translate-y-[21px] hidden "
                            : "text-[#8f8f8f] cursor-text flex"
                            }`}
                        >
                          GST Number
                        </label>
                        <input
                          type="number"
                          name="GST"
                          id="gst"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          onFocus={() => setGstFocused(true)}
                          onBlur={() => setGstFocused(false)}
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="pan"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${panFocused
                            ? "text-[#000] -translate-y-[21px] hidden "
                            : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          onClick={() =>
                            document.getElementById("number").setPanFocused()
                          }
                        >
                          PAN Number
                        </label>
                        <input
                          type="number"
                          name="panNo"
                          id="pan"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                          onFocus={() => setPanFocused(true)}
                          onBlur={() => setPanFocused(false)}
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="state"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${stateFocused
                            ? "text-[#000] -translate-y-[21px] hidden "
                            : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          onClick={() =>
                            document.getElementById("number").setPanFocused()
                          }
                        >
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={userState}
                          onChange={(e) => setUserState(e.target.value)}
                          onFocus={() => setStateFocused(true)}
                          onBlur={() => setStateFocused(false)}
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between w-[100%]">
                    <label className="flex cursor-pointer flex-col justify-start">
                      <div className="flex justify-between w-full gap-[20px]">


                        <label className="flex items-center gap-[5px] cursor-pointer group">
                          <div className="relative flex items-center justify-center w-7 h-7">
                            <input
                              type="radio"
                              name="taxType"
                              value="tax"
                              checked={formData1.taxType === "tax"}
                              onChange={(e) => {
                                setFormData1((prev) => ({
                                  ...prev,
                                  taxType: prev.taxType === "tax" ? "" : "tax",
                                }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                            <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                          </div>
                          <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                            Tax
                          </span>
                        </label>
                      </div>
                    </label>
                    {/* <div className=" pr-[80px]">
                      <div className="flex justify-between w-full gap-[20px]">

                        <label className="flex items-center gap-[5px] cursor-pointer group">
                          <div className="relative flex items-center justify-center w-7 h-7">
                            <input
                              type="radio"
                              name="paymentType"
                              value="cash"
                              checked={formData1.paymentType === "cash"}
                              onChange={(e) =>
                                setFormData1((prev) => ({
                                  ...prev,
                                  paymentType: prev.paymentType === "cash" ? "" : "cash",
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                            <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                          </div>
                          <span className="text-[15px] text-gray-700 font-Poppins group-hover:text-gray-900">
                            Cash
                          </span>
                        </label>


                        <label className="flex items-center gap-[5px] cursor-pointer group">
                          <div className="relative flex items-center justify-center w-7 h-7">
                            <input
                              type="radio"
                              name="paymentType"
                              value="online"
                              checked={formData1.paymentType === "online"}
                              onChange={(e) =>
                                setFormData1((prev) => ({
                                  ...prev,
                                  paymentType: prev.paymentType === "online" ? "" : "online",
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                            <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                          </div>
                          <span className="text-[15px] text-gray-700 font-Poppins group-hover:text-gray-900">
                            Online
                          </span>
                        </label>
                      </div>

                    </div> */}
                  </div>

                  {/* <div className=" p-1">
                    <div className="flex flex-wrap items-center gap-6">
            
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checkedItems.grossQty}
                            onChange={() => handleChange("grossQty")}
                            className="sr-only peer"
                          />
                          <div className="w-[18px] h-[18px] border-[1px] border-gray-300 peer-checked:border-[#e77848] rounded transition-colors">
                            {checkedItems.grossQty && (
                              <Check
                                className="w-[15px] h-[15px] text-[#e77848]"
                                strokeWidth={2}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-Poppins text-gray-600">
                          Gross Qty in gm
                        </span>
                      </label>

       
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checkedItems.netQty}
                            onChange={() => handleChange("netQty")}
                            className="sr-only peer"
                          />
                          <div className="w-[18px] h-[18px] border-[1px] border-gray-300 peer-checked:border-[#e77848] rounded transition-colors">
                            {checkedItems.netQty && (
                              <Check
                                className="w-[15px] h-[15px] text-[#e77848]"
                                strokeWidth={2}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-Poppins text-gray-600">
                          Net Qty in gm
                        </span>
                      </label>

    
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checkedItems.discount}
                            onChange={() => handleChange("discount")}
                            className="sr-only peer"
                          />
                          <div className="w-[18px] h-[18px] border-[1px] border-gray-300 peer-checked:border-[#e77848] rounded transition-colors">
                            {checkedItems.discount && (
                              <Check
                                className="w-[15px] h-[15px] text-[#e77848]"
                                strokeWidth={2}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-sm  font-Poppins text-gray-600">
                          Discount
                        </span>
                      </label>


                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checkedItems.rate}
                            onChange={() => handleChange("rate")}
                            className="sr-only peer"
                          />
                          <div className="w-[18px] h-[18px] border-[1px] border-gray-300 peer-checked:border-[#e77848] rounded transition-colors">
                            {checkedItems.rate && (
                              <Check
                                className="w-[15px] h-[15px] text-[#e77848]"
                                strokeWidth={2}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 font-Poppins">
                          Rate
                        </span>
                      </label>
                    </div>
                  </div> */}
                  <div className="bg-white w-[100%] relative  rounded-lg shadow1-blue ">
                    {/* Table Header */}
                    <div
                      ref={scrollContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="overflow-x-auto  !max-w-[3500px] flex-shrink-0  bg-white rounded-lg w-[100%]">
                      <table className=" min-w-[2400px]  w-full border-collapse">
                        <thead>
                          <tr className="bg-[#f0f1f364]">
                            <th className="py-4 px-2 text-left text-[13px] font-medium font-Poppins text-gray-600 w-20 border-r border-gray-200">
                              Sr. No.
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-40 border-r border-gray-200">
                              Product Name
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              Pcs
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[115px]  border-r border-gray-200">
                              Gross Weight
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[108px] border-r border-gray-200">
                              Less Weight                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[103px] border-r border-gray-200">
                              Net Weight
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              G Rate
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[94px]  border-r border-gray-200">
                              G Rs
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[146px]  border-r border-gray-200">
                              M Rate
                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[88px]  border-r border-gray-200">
                              M Rs
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[88px]  border-r border-gray-200">
                              HSN/SAC
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[90px]  border-r border-gray-200">
                              Extra Rate
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600  w-[80px]   border-r border-gray-200">
                              GME Amt
                            </th>
                            {formData1.taxType === "tax" && (
                              <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[80px] border-r border-gray-200">
                                GST
                              </th>
                            )}
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[150px] border-r border-gray-200">
                              Amount
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600  w-[130px]  border-r border-gray-200">
                              Group
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px] border-r border-gray-200">
                              Account
                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              Location
                            </th>
                            {products.every((product) => product.barcodeVisible) && (
                              <>


                                <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                                  Design
                                </th>
                                <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                                  Size
                                </th>
                              </>

                            )}


                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              Moti
                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              Stone
                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">
                              Jadatr
                            </th>

                          </tr>
                        </thead>
                        <tbody>

                          {products?.map((product, index) => (
                            <tr
                              key={product.id || index}
                              className="border-t relative border-gray-200"
                            >
                              <td className="py-2 px-4 text-sm text-gray-600 font-Poppins border-r border-gray-200">
                                {index + 1}
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                {product.barcodeVisible ? (
                                  <input
                                    type="text"
                                    ref={(el) => (productNameInputRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    value={product.productName}
                                    onChange={(e) => handleProductInputChange(e, index, "productName")}

                                    className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                    autoFocus
                                  />
                                ) : (
                                  product.productName || product?.groupItemId?.itemName
                                )}
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                  value={product.pcs}
                                  onChange={(e) => handleProductInputChange(e, index, "pcs")}
                                />
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  value={product.toWeight || ""}
                                  onChange={(e) => handleProductInputChange(e, index, "toWeight")}
                                  // onKeyDown={(e) => handleKeyDown(e, index)}
                                  className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                  autoFocus
                                />
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  name="lessWeight"
                                  value={product.lessWeight}
                                  onChange={(e) => handleProductInputChange(e, index, "lessWeight")}
                                  className="w-full border-0 outline-none font-Poppins focus:ring-0 text-sm"
                                  autoFocus
                                />
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  name="netWeight"
                                  value={product.netWeight}
                                  onChange={(e) => handleProductInputChange(e, index, "netWeight")}
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                />
                              </td>
                              {/* <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                />

                              </td> */}
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  value={product.marketRateUsed}
                                  onChange={(e) => handleProductInputChange(e, index, "marketRateUsed")}
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                {/* <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                /> */}
                                {product?.calculatedMarketRate}
                              </td>
                              {/* <td className="py-2 px-2 border-r overflow-x-auto font-Poppins  w-[100%] flex border-gray-200">
                                {!product.barcodeVisible ? (
                                  <>
                                    <input
                                      type="number"
                                      value={product.labour}
                                      onChange={(e) => handleProductInputChange(e, index, "labour")}
                                      className={` border-0  outline-none font-Poppins focus:ring-0 text-sm ${product.barcodeVisible ? "w-[100%] pl-[5px]" : "w-[40%]"}`}
                                      placeholder="0.00"
                                    />

                                   

                                  </>
                                ) : (
                                  <>
                                    <input
                                      type="number"
                                      value={product.labour}
                                      onChange={(e) => handleProductInputChange(e, index, "labour")}
                                      className={` border-0  outline-none font-Poppins focus:ring-0 text-sm ${product.barcodeVisible ? "w-[100%] pl-[5px]" : "w-[40%]"}`}
                                      placeholder="0.00"
                                    />


                                    <div
                                      ref={labourDropdownRef}
                                      className={`relative w-[80px] border-[1px] border-[#dedede] rounded-[5px] shadow  items-center text-[#00000099] cursor-pointer ${product.barcodeVisible ? "hidden" : "flex"}`}
                                      onClick={() => setDropdownTypeOpen((prev) => !prev)}
                                    >
                                      <label
                                        htmlFor="labourType"
                                        className={`absolute left-[13px] font-Poppins pl-[4px] bg-[#fff] text-[14px] transition-all duration-200 ${selectedLabourType || labourFocused
                                          ? "text-[#000] -translate-y-[21px] hidden"
                                          : "text-[#8f8f8f] cursor-text flex"
                                          }`}
                                      >
                                        Type
                                      </label>
                                      <input
                                        type="text"
                                        name="labourType"
                                        id="labourType"
                                        value={selectedLabourType}
                                        className="w-full outline-none text-[15px] py-[9px] pl-[5px] font-Poppins font-[400] bg-transparent cursor-pointer"
                                        readOnly
                                        onFocus={() => setLabourFocused(true)}
                                        onBlur={() => setLabourFocused(false)}
                                      />
                                      <i
                                        className={
                                          dropdownTypeOpen
                                            ? "fa-solid fa-chevron-up text-[14px] pr-[10px]"
                                            : "fa-solid fa-chevron-down text-[14px] pr-[10px]"
                                        }
                                      ></i>
                                    </div>


                                    <AnimatePresence>
                                      {dropdownTypeOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="absolute mt-5 ml-[40px] bg-white w-[90px] border border-[#dedede] rounded-lg shadow-md z-50"
                                        >
                                          {labourTypes.map((labour, index) => (
                                            <div
                                              key={index}
                                              className="px-4 py-[4px] hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                              onClick={() => handleSelectLabourType(labour)}
                                            >
                                              {labour.type}
                                            </div>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </>
                                )}


                              </td> */}


                              <td className="py-2 px-2 border-r overflow-x-auto font-Poppins  w-[100%] flex border-gray-200">
                                <input
                                  type="number"
                                  value={product.labour}
                                  onChange={(e) => handleProductInputChange(e, index, "labour")}
                                  className="border-0 outline-none font-Poppins focus:ring-0 text-sm w-[40%]"
                                  placeholder="0.00"
                                />

                                {/* Show dropdown ONLY if the product was entered manually */}
                                {product.barcodeVisible && (
                                  <div
                                    ref={labourDropdownRef}
                                    className="relative w-[80px] border-[1px] border-[#dedede] rounded-[5px] shadow items-center text-[#00000099] cursor-pointer flex"
                                    onClick={() => setDropdownTypeOpen((prev) => !prev)}
                                  >
                                    <label
                                      htmlFor="labourType"
                                      className={`absolute left-[13px] font-Poppins pl-[4px] bg-[#fff] text-[14px] transition-all duration-200 ${selectedLabourType || labourFocused ? "text-[#000] -translate-y-[21px] hidden" : "text-[#8f8f8f] cursor-text flex"
                                        }`}
                                    >
                                      Type
                                    </label>
                                    <input
                                      type="text"
                                      name="labourType"
                                      id="labourType"
                                      value={selectedLabourType}
                                      className="w-full outline-none text-[15px] py-[9px] pl-[5px] font-Poppins font-[400] bg-transparent cursor-pointer"
                                      readOnly
                                      onFocus={() => setLabourFocused(true)}
                                      onBlur={() => setLabourFocused(false)}
                                    />
                                    <i className={dropdownTypeOpen ? "fa-solid fa-chevron-up text-[14px] pr-[10px]" : "fa-solid fa-chevron-down text-[14px] pr-[10px]"}></i>
                                  </div>
                                )}

                                <AnimatePresence>
                                  {dropdownTypeOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute mt-5 ml-[40px] bg-white w-[90px] border border-[#dedede] rounded-lg shadow-md z-50"
                                    >
                                      {labourTypes.map((labour, index) => (
                                        <div
                                          key={index}
                                          className="px-4 py-[4px] hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                          onClick={() => handleSelectLabourType(labour)}
                                        >
                                          {labour.type}
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </td>


                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                {/* <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                /> */}
                                {product?.labourRate}
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                {/* <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                /> */}
                                {parseFloat(product.hsnCode || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  value={product.extraRate}
                                  onChange={(e) => handleProductInputChange(e, index, "extraRate")}
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                />
                                {/* {product?.extraRate} */}
                              </td>
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                {/* <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                /> */}
                                {product?.GMEPrice}
                              </td>
                              {formData1.taxType === "tax" && (
                                <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                  <input
                                    type="number"
                                    value={product.gst}
                                    onChange={(e) => handleProductInputChange(e, index, "gst")}
                                    className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                    placeholder="0.00"
                                  />
                                  {/* {product?.gst} */}
                                </td>
                              )}
                              <td className="py-2 px-4 border-r font-Poppins  border-gray-200">
                                <input
                                  type="number"
                                  className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                  placeholder="0.00"
                                  value={product.totalPrice}
                                  onChange={(e) => handleProductInputChange(e, index, "totalPrice")}
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
                              {products.every((p) => p.barcodeVisible) && (
                                <>
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
                                      className="w-full border-0  outline-none font-Poppins focus:ring-0 text-sm"
                                      placeholder="0.00"
                                    />

                                  </td>
                                </>
                              )}
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
                          ))}
                        </tbody>
                      </table>

                      {/* <div className="px-4 py-3 w-[100%] relative flex justify-between items-center">
                        <input
                          type="text"
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          onKeyDown={handleBarcodeInput}
                          placeholder="Enter Barcode"
                          className="w-[70%] mr-4 py-2 px-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-Poppins"
                        />
                      </div> */}

                      <div className="px-4 py-3  w-[100%] relative flex  justify-between items-center">
                        <button
                          onClick={handleAddProduct}
                          className="w-[80%] mr-4 py-2 font-Poppins border-[1.5px] border-dashed border-[#60A5FA] text-[#60A5FA] rounded-sm hover:bg-blue-50 transition-colors"
                        >
                          ADD PRODUCT
                        </button>
                        {/* 
                          <button className="flex items-center gap-2 px-4 py-2 text-[#60A5FA] bg-blue-50 rounded-[4px] transition-colors">
                            <Scan className="w-5 h-5" />
                            <span className=" font-Poppins">Scan Barcode</span>
                            <Plus className="w-4 h-4" />
                          </button> */}
                      </div>

                      {/* Total Row */}

                      <div className="min-w-[2400px]">
                        <div className=" flex w-[100%]" >
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
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[94px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[96px]  border-r border-gray-200">

                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[120px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[91px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[93px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600  w-[80px]   border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600  w-[80px] border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[150px] border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600  w-[135px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[101px] border-r border-gray-200">

                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[105px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[102px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[103px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">

                            </th>

                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[104px]  border-r border-gray-200">

                            </th>
                            <th className="py-4 px-2 text-center text-[13px] font-medium font-Poppins text-gray-600 w-[100px]  border-r border-gray-200">

                            </th>

                          </tr>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className=" flex w-[100%]  justify-between gap-[20px]  mt-[19px] mb-[20px]">
                    <div className="flex w-[50%]  flex-col gap-[15px] ">
                      <div className="bg-white  w-[100%] rounded-lg shadow1-blue  ">
                        {/* <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="py-2 font-Poppins px-4 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                                  HSN/SAC
                                </th>
                                <th className="py-2  font-Poppins px-4 text-left text-sm font-medium text-gray-600 border-r border-gray-200">
                                  Taxable Value
                                </th>
                                <th
                                  colSpan="2"
                                  className="border-r font-Poppins border-gray-200"
                                >
                                  <div className="py-2 font-Poppins px-4 text-left text-sm font-medium text-gray-600">
                                    Central Tax
                                  </div>
                                  <div className="flex border-t border-gray-200">
                                    <div className="py-2  font-Poppins px-4 text-left text-sm font-medium text-gray-600 w-1/2 border-r border-gray-200">
                                      Rate
                                    </div>
                                    <div className="py-2 font-Poppins px-4 text-left text-sm font-medium text-gray-600 w-1/2">
                                      Amount
                                    </div>
                                  </div>
                                </th>
                                <th
                                  colSpan="2"
                                  className="border-r font-Poppins border-gray-200"
                                >
                                  <div className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                                    State Tax
                                  </div>
                                  <div className="flex border-t border-gray-200">
                                    <div className="py-2 px-4 text-left text-sm font-medium text-gray-600 w-1/2 border-r border-gray-200">
                                      Rate
                                    </div>
                                    <div className="py-2 px-4 text-left text-sm font-medium text-gray-600 w-1/2">
                                      Amount
                                    </div>
                                  </div>
                                </th>
                                <th className="py-2 font-Poppins text-center px-4 text-left text-sm font-medium text-gray-600">
                                  Total
                                  <br />
                                  Tax Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-200">
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4"></td>
                              </tr>
                              <tr className="bord border-gray-200">
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4"></td>
                              </tr>
                              <tr className="bord border-gray-200">
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4 border-r border-gray-200"></td>
                                <td className="py-6 px-4"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div> */}
                      </div>
                      {companyInfo?.map((item, index) => (
                        <div key={index} className="grid md:grid-cols-2 gap-4">
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
                                  {item?.holderName}
                                </span>
                              </div>
                              <div className="flex gap-[20px] justify-between items-center">
                                <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                  Account No :
                                </span>
                                <span className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">
                                  {item?.accountNo}
                                </span>
                              </div>
                              <div className="flex  items-center  gap-[20px] justify-between">
                                <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                  IFSC Code:
                                </span>
                                <span className="text-[#5d5b5b] text-[12px]  gap-[4px] flex fnt-[300] font-Poppins">
                                  {item?.IFSCCode}
                                </span>
                              </div>
                              <div className="flex gap-[20px] justify-between">
                                <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                  Bank Name:
                                </span>
                                <div className="flex items-center gap-1">
                                  {/* <img
                                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-20%20at%209.49.54%E2%80%AFAM-bp4n5M7G0uw5Cl2JjhtVKuMn5vn970.png"
                                  alt="ICICI Bank"
                                  className="h-5 object-contain"
                                /> */}
                                  <span className="text-[#5d5b5b] text-[12px] fnt-[300] font-Poppins">
                                    {item?.bankName}
                                  </span>
                                </div>
                              </div>
                              <div className="flex  i  gap-[20px] justify-between">
                                <span className="text-[#000000] text-[14px] fnt-[300] font-Poppins">
                                  Address:
                                </span>
                                <span className="text-[#5d5b5b] text-right text-[12px] fnt-[300] font-Poppins">
                                  {item?.bankAddress}
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
                                {item?.terms}
                              </li>
                              {/* <li className="text-[#5d5b5b]  text-[12px] fnt-[300] font-Poppins">
                                Payment due in 7 days from invoice date.
                              </li> */}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className=" flex w-[48%]">
                      <div className="bg-white  w-[100%]  rounded-lg  shadow1-blue p-6">
                        <div className="space-y-2">
                          {/* CGST */}
                          {/* Discount */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              Discount
                            </label>
                            <div className="flex  w-[320px]   gap-2">
                              <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                                <label
                                  htmlFor="indis"
                                  className={` absolute left-[13px] font-Poppins leading-3  px-[5px]  bg-[#fff] text-[13px]   transition-all duration-200 ${discountInFocused
                                    ? "text-[#000] -translate-y-[19px] hidden "
                                    : "text-[#8f8f8f] flex cursor-text"
                                    }`}
                                >
                                  Discount- in %
                                </label>
                                <input
                                  type="number"
                                  name="discount"
                                  id="indis"
                                  value={discountPercentage}
                                  // onChange={(e) => {
                                  //   setDiscountPercentage(Number(e.target.value).toFixed(2));
                                  //   setDiscountAmount(0); 
                                  // }}
                                  onChange={handleDiscountPercentageChange}
                                  onKeyDown={handleDiscountKeyPress}
                                  onFocus={() => setDiscountInFocused(true)}
                                  onBlur={() => setDiscountInFocused(false)}
                                  autocomplete="nasme"
                                  className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                                />
                              </div>
                              <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                                <span
                                  className={` absolute left-[13px] font-Poppins leading-3  px-[5px]  bg-[#fff] text-[13px]   transition-all duration-200 ${discountAmount || outFocused
                                    ? "text-[#000] -translate-y-[21px] "
                                    : "text-[#000000] -translate-y-[21px] "
                                    }`}
                                >
                                  Discount- Out ₹
                                </span>
                                <input
                                  type="number"
                                  name="discount"
                                  id="number"
                                  value={discountAmount}
                                  // onChange={(e) => {
                                  // setDiscountAmount(e.target.value);
                                  // setDiscountPercentage(0); // Reset percentage when manual discount is entered
                                  // }}  
                                  onChange={handleDiscountAmountChange}                             
                                  onKeyDown={handleDiscountKeyPress}   
                                  onFocus={() => setDiscountInFocused(true)}
                                  onBlur={() => setDiscountInFocused(false)}
                                  autocomplete="nasme"
                                  className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                                />
                                {/* <p
                                  onFocus={() => setOutocused(true)}
                                  onBlur={() => setOutocused(false)}
                                >
                              </p> */}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              CGST
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className={`relative w-full font-Poppins px-[15px] h-10 border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 
      ${formData1.taxType === "estimate" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "text-[#00000099]"}`}>
                                <p>{formData1.taxType === "tax" ? cgst.toFixed(2) : "-"}</p>
                              </div>
                            </div>
                          </div>

                          {/* SGST */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              SGST
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className={`relative w-full font-Poppins px-[15px] h-10 border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 
      ${formData1.taxType === "estimate" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "text-[#00000099]"}`}>
                                <p>{formData1.taxType === "tax" ? sgst.toFixed(2) : "-"}</p>
                              </div>
                            </div>
                          </div>

                          {/* IGST */}
                          {/* <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              IGST
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  font-Poppins px-[15px]  border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <p></p>
                              </div>
                            </div>
                          </div> */}

                          {/* Total Tax Amount */}
                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              Total Tax Amount
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className={`relative w-full font-Poppins px-[15px] h-10 border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 
      ${formData1.taxType === "estimate" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "text-[#00000099]"}`}>
                                <p>{formData1.taxType === "tax" ? totalTaxAmount.toFixed(2) : "-"}</p>
                              </div>
                            </div>
                          </div>


                          <div className="flex items-center justify-between gap-4">
                            <label className="text-gray-600 font-Poppins text-lg font-medium">
                              Cash Payment
                            </label>
                            <div className="flex-1 max-w-[320px]">
                              <div className=" relative w-full h-10 border-[1px]  border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer">
                                <input
                                  type="text"
                                  name="cashPayment"
                                  value={cashPayment}
                                  onChange={(e) => setCashPayment(e.target.value)}
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
                                  value={onlinePayment}
                                  onChange={(e) => setOnlinePayment(e.target.value)}
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
                                <p>{finalTotal.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className=" bs-spj  font-[500] font-Poppins text-[#fff] rounded-[8px] py-[5px] justify-center  text-[18px] mx-auto mt-[10px] flex w-[120px]"
                    onClick={handleSaveInvoice}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NextUIModal isOpen={partyModalopen}>
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
                    </div> */}

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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                    </AnimatePresence> */}
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
                        autocomplete="nasme"
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
      </AnimatePresence>
    </>
  );
}
