import { useEffect, useRef, useState } from "react";
import Header from "../../Component/header/Header";
import SideBar from "../../Component/sidebar/SideBar";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { getUserByIdAction } from "../../redux/action/userManagement";
import { addCompanyInfoAction } from "../../redux/action/generalManagement";

export default function CreateCompany() {
  const [isChecked, setIsChecked] = useState(false);

  const [NameFocused, setNameFocused] = useState(false);
  const [EmailFocused, setEmailFocused] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(false);
  const [firmFocused, setFirmFocused] = useState(false);
  const [typeFocused, setTypeFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [stateFocused, setStateFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [pinFocused, setPinFocused] = useState(false);
  const [gstFocused, setGstFocused] = useState(false);
  const [panFocused, setPanFocused] = useState(false);
  const [holderFocused, setHolderFocused] = useState(false);
  const [accountFocused, setAccountFocused] = useState(false);
  const [bankFocused, setBankFocused] = useState(false);
  const [ifscFocused, setIfscFocused] = useState(false);
  const [bankAddressFocused, setBankAddressFocused] = useState(false);
  const [financialFocused, setFinancialFocused] = useState(false);
  const [invoiceFocused, setInvoiceFocused] = useState(false);
  const [invoiceNumberFocused, setInvoiceNumberFocused] = useState(false);
  const [termsFocused, setTermsFocused] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedType, setSelectedType] = useState("");
  const userId = Cookies.get("user");
  const [formData, setFormData] = useState({
    firmName: "",
    firmType: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
    gstNumber: "",
    panNumber: "",
    holderName: "",
    accountNo: "",
    accountType: "saving",
    bankName: "",
    IFSCCode: "",
    bankAddress: "",
    beginingFrom: "",
    terms: "",
    invoicePrefix: "",
    invoiceNumber: "",
    TCSApply: false,
    dealerType: "regular",
    type: "jewellery",
    billType: "only",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.getUserById);

  useEffect(() => {
    if (userId) {
      dispatch(getUserByIdAction(userId));
    }
  }, [dispatch, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      userId,
    };
    dispatch(addCompanyInfoAction(payload));

    alert("Data created Successfully.");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className=" flex  w-[100%]  h-[100%] select-none *: p-[15px] overflow-hidden ">
        <div className=" flex w-[100%] flex-col gap-[14px]  h-[96vh] ">
          <Header pageName=" Create New Company" />
          <div className=" flex gap-[10px] w-[100%] h-[100%]">
            <SideBar />
            <div className=" flex w-[100%] max-h-[90%] pb-[20px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px] ">
              <div className=" flex flex-col gap-[10px] w-[50%]  ">
                <div className=" flex flex-col gap-[6px] w-[100%] ">
                  <h1 className=" flex  pl-[6px] font-Poppins text-[16px] text-[#427ae1]">
                    Personal Details
                  </h1>

                  <div className=" w-[100%]  flex gap-[16px] border-[1px] bg-white shadow1-blue py-[20px]  px-[20px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] flex-col gap-[16px]">
                      {/* <div className="relative w-full  input-box12 border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099]">
                      <span
                          className={`font-Roboto font-[500] text-[15px] }`}
                        >
                          First Name
                        </span>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={user?.name}
                          // placeholder="Your Name"
                          className="w-full outline-none text-[15px] py-[9px]  font-Poppins font-[400] bg-transparent"
                          onFocus={() => setNameFocused(true)}
                          onBlur={(e) => setNameFocused(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div> */}

                      <div className="relative w-full input-box12 border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="name1"
                          className={`absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.name || NameFocused
                              ? "text-[#000] -translate-y-[21px] hidden"
                              : "text-[#8f8f8f] cursor-text   flex"
                          }`}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name1"
                          value={user?.name}
                          className="w-full outline-none text-[15px] py-[9px] font-Poppins font-[400] bg-transparent"
                          onFocus={() => setNameFocused(true)}
                          onBlur={(e) => setNameFocused(e.target.value !== "")}
                          autoComplete="name"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                        <label
                          htmlFor="emailid"
                          className={`absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.email || EmailFocused
                              ? "text-[#000] -translate-y-[21px] hidden"
                              : "text-[#8f8f8f]  cursor-text  flex"
                          }`}
                        >
                          Email Id
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="emailid"
                          value={user?.email}
            
                          className="w-full outline-none text-[15px]   py-[9px] font-Poppins font-[400] bg-transparent"
                          onFocus={() => setEmailFocused(true)}
                          onBlur={(e) => setEmailFocused(e.target.value !== "")}
                          autocomplete="naqsme"
                        />
                      </div>
                    </div>
                    <div className=" flex w-[100%] flex-col gap-[16px]">
                      <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="Monumber"
                          className={`absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.mobileNumber || mobileNumber
                              ? "text-[#000] -translate-y-[21px] hidden"
                              : "text-[#8f8f8f] cursor-text  flex"
                          }`}
                        >
                          Mobile Number
                        </label>
                        <input
                          type="number"
                          name="number"
                          id="Monumber"
                          value={user?.mobileNumber}
                          className="w-full outline-none text-[15px]   py-[9px] font-Poppins font-[400] bg-transparent"
                          onFocus={() => setMobileNumber(true)}
                          onBlur={(e) => setMobileNumber(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" flex flex-col gap-[6px] w-[100%] ">
                  <h1 className=" flex  pl-[6px] font-Poppins text-[16px] text-[#427ae1]">
                    Company Details
                  </h1>

                  <div className=" w-[100%]  relative flex gap-[16px] border-[1px] bg-white shadow1-blue py-[20px]  px-[20px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] flex-col gap-[16px]">
                      <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="firmName"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.firmName || firmFocused
                              ? "text-[#000] -translate-y-[21px] hidden"
                              : "text-[#8f8f8f]  cursor-text flex"
                          }`}
                        >
                          Firm Name
                        </label>
                        <input
                          type="text"
                          name="firmName"
                          id="firmName"
                          value={formData?.firmName}
                          onChange={handleChange}
                          className="w-full outline-none text-[15px] py-[9px]  font-Poppins font-[400] bg-transparent"
                          onFocus={() => setFirmFocused(true)}
                          onBlur={(e) => setFirmFocused(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede]  h-[90px]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="address"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.address || addressFocused
                              ? "text-[#000] -translate-y-[45px] font-[] hidden"
                              : " text-[#8f8f8f]   -translate-y-[27px] flex cursor-text"
                          }`}
                        >
                          Buisness Address
                        </label>
                        <textarea
                          type="text"
                          name="address"
                          id="address"
                          value={formData?.address}
                          onChange={handleChange}
                          onFocus={() => setAddressFocused(true)}
                          onBlur={(e) =>
                            setAddressFocused(e.target.value !== "")
                          }
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] pt-[10px]  h-[100%] font-Poppins font-[400] bg-transparent"
                        ></textarea>
                      </div>

                      <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                        <label
                          htmlFor="state"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.state || stateFocused
                              ? "text-[#000] -translate-y-[21px] hidden "
                              : "text-[#8f8f8f] flex cursor-text"
                          }`}
                        >
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData?.state}
                          onChange={handleChange}
                          className="w-full outline-none text-[15px] py-[9px]  font-Poppins font-[400] bg-transparent"
                          onFocus={() => setStateFocused(true)}
                          onBlur={(e) => setStateFocused(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                        <label
                          htmlFor="city"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.city || cityFocused
                              ? "text-[#000] -translate-y-[21px] hidden "
                              : "text-[#8f8f8f] cursor-text flex"
                          }`}
                        >
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData?.city}
                          onChange={handleChange}
                          className="w-full outline-none text-[15px] py-[9px]  font-Poppins font-[400] bg-transparent"
                          onFocus={() => setCityFocused(true)}
                          onBlur={(e) => setCityFocused(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div>
                      <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                        <label
                          htmlFor="pin"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            user?.pinCode || pinFocused
                              ? "text-[#000] -translate-y-[21px] hidden "
                              : "text-[#8f8f8f] cursor-text flex"
                          }`}
                        >
                          Pin-Code
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          id="pin"
                          value={formData?.pinCode}
                          onChange={handleChange}
                          className="w-full outline-none text-[15px] py-[9px]  font-Poppins font-[400] bg-transparent"
                          onFocus={() => setPinFocused(true)}
                          onBlur={(e) => setPinFocused(e.target.value !== "")}
                          autocomplete="nasme"
                        />
                      </div>
                    </div>
                    <div className=" flex w-[100%] flex-col gap-[16px]">
                      <div
                        ref={dropdownRef}
                        className="relative w-full border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] cursor-pointer"
                        onClick={() => setDropdownOpen((prev) => !prev)} // Toggle dropdown on click
                      >
                        <label
                          htmlFor="type"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            selectedType || typeFocused
                              ? "text-[#000] -translate-y-[21px] hidden "
                              : "text-[#8f8f8f] cursor-text flex"
                          }`}
                          onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                          Firm Type
                        </label>
                        <input
                          type="text"
                          name="firmType"
                          id="type"
                          value={selectedType}
                          className="w-full outline-none text-[15px] py-[9px] font-Poppins font-[400] bg-transparent cursor-pointer"
                          readOnly
                          onFocus={() => setTypeFocused(true)}
                          onBlur={() => setTypeFocused(false)}
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
                            className="absolute  mt-[50px] bg-white w-[220px] border border-[#dedede] rounded-lg shadow-md z-10"
                          >
                            {[
                              "Sole Proprietorship",
                              "Partnership",
                              "LLC",
                              "Corporation",
                            ].map((type, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 font-Poppins cursor-pointer text-sm text-[#00000099]"
                                onClick={() => {
                                  setSelectedType(type);
                                  setDropdownOpen(false);
                                }}
                              >
                                {type}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="relative w-full border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="gst"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            formData?.gstNumber || gstFocused
                              ? "text-[#000] -translate-y-[21px] hidden "
                              : "text-[#8f8f8f] cursor-text flex"
                          }`}
                        >
                          GST Number
                        </label>
                        <input
                          type="text"
                          name="gstNumber"
                          id="gst"
                          value={formData?.gstNumber}
                          onChange={handleChange}
                          onFocus={() => setGstFocused(true)}
                          onBlur={() => setGstFocused(false)}
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                        />
                      </div>

                      <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="pannumber"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            formData?.panNumber|| panFocused
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
                          name="panNumber"
                          id="pannumber"
                          value={formData?.panNumber}
                          onChange={handleChange}
                          onFocus={() => setPanFocused(true)}
                          onBlur={() => setPanFocused(false)}
                          autocomplete="nasme"
                          className="w-full outline-none text-[14px] h-full  py-[9px] font-Poppins font-[400] bg-transparent"
                        />
                      </div>
                      <div className=" flex flex-col gap-[15px]">
                        <div className=" flex ">
                          <label className="flex cursor-pointer items-center gap-[10px]">
                            <p className="flex  select-none font-Poppins">
                              TCS Apply
                            </p>

                            {/* Hidden Checkbox */}
                            <input
                              type="checkbox"
                              id="custom-checkbox"
                              name="TCSApply"
                              style={{ display: "none" }}
                              checked={formData.TCSApply} // Bind state to the checkbox
                              onChange={handleChange} // Update state on change
                            />

                            {/* Custom Checkbox */}
                            <span
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  TCSApply: !prev.TCSApply,
                                }))
                              } // Handle click
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: isChecked ? "#ff8000" : "#fff", // Change background on state
                                borderRadius: "28%",
                                border: "1px   solid #ccc",
                                display: "inline-block",
                                position: "relative",
                                cursor: "pointer",
                              }}
                            >
                              {/* Tick Mark */}
                              {formData.TCSApply && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "3px",
                                    left: "5px",
                                    width: "6px",
                                    height: "10px",
                                    border: "solid white",
                                    borderWidth: "0 2px 2px 0",
                                    transform: "rotate(45deg)",
                                  }}
                                ></span>
                              )}
                            </span>
                          </label>
                        </div>
                        <div className=" flex ">
                          <label className="flex cursor-pointer flex-col justify-start ">
                            <p className="flex text-[14px]  select-none font-Poppins">
                              Dealer Type
                            </p>
                            <div className=" flex justify-between w-full gap-[20px]">
                              <label className="flex items-center gap-[5px] cursor-pointer group">
                                <div className="relative flex items-center justify-center w-7 h-7">
                                  <input
                                    type="radio"
                                    name="dealerType"
                                    value="regular"
                                    checked={formData.dealerType === "regular"}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        dealerType: e.target.value,
                                      }))
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                                  <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                </div>
                                <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                                  Regular
                                </span>
                              </label>

                              <label className="flex items-center gap-[5px] cursor-pointer group">
                                <div className="relative flex items-center justify-center w-7 h-7">
                                  <input
                                    type="radio"
                                    name="dealerType"
                                    value="composition"
                                    checked={
                                      formData.dealerType === "composition"
                                    }
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        dealerType: e.target.value,
                                      }))
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                                  <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                </div>
                                <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                                  Composition
                                </span>
                              </label>
                            </div>
                          </label>
                        </div>

                        <div className=" flex ">
                          <label className="flex cursor-pointer flex-col justify-start gap-[4px]">
                            <p className="flex text-[14px]  select-none font-Poppins">
                              Account Type
                            </p>
                            <div className=" flex justify-between w-full gap-[20px]">
                              <label className="flex items-center gap-[5px] cursor-pointer group">
                                <div className="relative flex items-center justify-center w-7 h-7">
                                  <input
                                    type="radio"
                                    name="type"
                                    value="jewellery"
                                    checked={formData.type === "jewellery"}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        accountType: e.target.value,
                                      }))
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                                  <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                </div>
                                <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                                  jewellery
                                </span>
                              </label>

                              <label className="flex items-center gap-[5px] cursor-pointer group">
                                <div className="relative flex items-center justify-center w-7 h-7">
                                  <input
                                    type="radio"
                                    name="type"
                                    value="others"
                                    checked={formData.type === "others"}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        accountType: e.target.value,
                                      }))
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                                  <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                </div>
                                <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                                  others jewellery
                                </span>
                              </label>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex w-[50%] flex-col gap-[16px] h-fit ">
                <div className=" flex flex-col gap-[6px] w-[100%] ">
                  <h1 className=" flex  pl-[6px] font-Poppins text-[16px] text-[#427ae1]">
                    Bank Details
                  </h1>

                  <div className=" w-[100%]  flex  flex-col gap-[14px] border-[1px] bg-white shadow1-blue py-[20px]  px-[20px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] gap-[16px]">
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                          <label
                          htmlFor="Holdername"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.holderName || holderFocused
                                ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            name="holderName"
                            id="Holdername"
                            value={formData?.holderName}
                            onChange={handleChange}
                            onFocus={() => setHolderFocused(true)}
                            onBlur={() => setHolderFocused(false)}
                            autocomplete="nasme"
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                          <label
                          htmlFor="accountno"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.accountNo|| accountFocused
                               ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            Account No
                          </label>
                          <input
                            type="number"
                            name="accountNo"
                            id="accountno"
                            value={formData?.accountNo}
                            onChange={handleChange}
                            onFocus={() => setAccountFocused(true)}
                            onBlur={() => setAccountFocused(false)}
                            autocomplete="nasme"
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" flex ">
                      <label className="flex cursor-pointer flex-col justify-start gap-[10px] ">
                        <p className="flex text-[14px] pl-[16px]  select-none font-Poppins">
                          Select aacount type{" "}
                        </p>
                        <div className=" flex justify-between w-full gap-[20px]">
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="bankType"
                                value="saving"
                                checked={formData.bankType === "saving"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bankType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              Saving
                            </span>
                          </label>

                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="bankType"
                                value="current"
                                checked={formData.bankType === "current"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bankType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              Current
                            </span>
                          </label>
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="bankType"
                                value="od"
                                checked={formData.bankType === "od"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bankType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              OD
                            </span>
                          </label>
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="bankType"
                                value="cc"
                                checked={formData.bankType === "cc"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bankType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              CC
                            </span>
                          </label>
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="bankType"
                                value="others"
                                checked={formData.bankType === "others"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    bankType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              Others
                            </span>
                          </label>
                        </div>
                      </label>
                    </div>
                    <div className=" flex w-[100%] gap-[20px]">
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                          <label
                          htmlFor="bankname"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.bankName || bankFocused
                        ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            Bank Name
                          </label>
                          <input
                            type="text"
                            name="bankName"
                            id="bankname"
                            value={formData?.bankName}
                            onChange={handleChange}
                            onFocus={() => setBankFocused(true)}
                            onBlur={() => setBankFocused(false)}
                            autocomplete="nasme"
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                          <label
                          htmlFor="ifsc"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.IFSCCode || ifscFocused
                                ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            name="IFSCCode"
                            autocomplete="nasme"
                            id="ifsc"
                            value={formData?.IFSCCode}
                            onChange={handleChange}
                            onFocus={() => setIfscFocused(true)}
                            onBlur={() => setIfscFocused(false)}
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full  border-[1px] border-[#dedede]  h-[90px]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                      htmlFor="bankaddress"
                        className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                          formData?.bankAddress || bankAddressFocused
                            ? "text-[#000] -translate-y-[45px]  hidden"
                            : "text-[#8f8f8f] -translate-y-[26px]  flex  cursor-text"
                        }`}
                      >
                        Bank address
                      </label>
                      <textarea
                        type="email"
                        name="bankAddress"
                        id="bankaddress"
                        value={formData?.bankAddress}
                        onChange={handleChange}
                        onFocus={() => setBankAddressFocused(true)}
                        onBlur={() => setBankAddressFocused(false)}
                        autoComplete="hkj"
                        className="w-full outline-none text-[14px] pt-[10px]  h-[100%] font-Poppins font-[400] bg-transparent"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className=" flex flex-col gap-[6px] w-[100%] ">
                  <h1 className=" flex  pl-[6px] font-Poppins text-[16px] text-[#427ae1]">
                    General Details
                  </h1>

                  <div className=" w-[100%]  flex  flex-col gap-[20px] border-[1px] bg-white shadow1-blue py-[20px]  px-[20px] rounded-[10px] h-fit">
                    <div className=" flex w-[100%] gap-[20px]">
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede] rounded-lg shadow flex items-center space-x-4 text-[#00000099] 
   bg-[#fff] ">
                          <label
                          htmlFor="finanace"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.beginingFrom || financialFocused
                               ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            Financial year Beginning From
                          </label>
                          <input
                            type="text"
                            name="beginingFrom"
                            id="finanace"
                            value={formData?.beginingFrom}
                            onChange={handleChange}
                            onFocus={() => setFinancialFocused(true)}
                            onBlur={() => setFinancialFocused(false)}
                            autoComplete="hkj"
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                      <div className=" flex w-[100%] flex-col gap-[20px]">
                        <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                          <label
                          htmlFor="invoice"
                            className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                              formData?.invoicePrefix || invoiceFocused
                           ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                            }`}
                          >
                            Invoice Prefix
                          </label>
                          <input
                            type="number"
                            name="invoicePrefix"
                            id="invoice"
                            value={formData?.invoicePrefix}
                            onChange={handleChange}
                            onFocus={() => setInvoiceFocused(true)}
                            onBlur={() => setInvoiceFocused(false)}
                            className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className=" flex  w-[100%] gap-[20px]">
                      <div className="relative w-[50%]  border-[1px] border-[#dedede]  h-[90px]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                        htmlFor="terms"
                          className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                            formData?.terms || termsFocused
                              ? "text-[#000] -translate-y-[44px]  hidden "
                              : "text-[#8f8f8f] -translate-y-[26px] flex cursor-text"
                          }`}
                        >
                          Term & Condition
                        </label>
                        <textarea
                          type="email"
                          name="terms"
                          id="terms"
                          value={formData?.terms}
                          onChange={handleChange}
                          onFocus={() => setTermsFocused(true)}
                          onBlur={() => setTermsFocused(false)}
                          className="w-full outline-none text-[14px] pt-[10px]  h-[100%] font-Poppins font-[400] bg-transparent"
                        ></textarea>
                      </div>

                      <div className=" flex flex-col gap-[20px] w-[50%]">
                        <div className=" flex w-[100%] flex-col gap-[20px]">
                          <div className="relative w-full  border-[1px] border-[#dedede]  shadow rounded-lg flex items-center space-x-4 text-[#00000099]">
                            <label
                            htmlFor="invoiceNumber"
                              className={` absolute left-[13px] font-Poppins   px-[5px]  bg-[#fff] text-[14px]   transition-all duration-200 ${
                                formData?.invoiceNumber || invoiceNumberFocused
                                                 ? "text-[#000] -translate-y-[21px] hidden "
                                : "text-[#8f8f8f] cursor-text flex"
                              }`}
                            >
                              Invoice Number
                            </label>
                            <input
                              type="number"
                              name="invoiceNumber"
                              id="invoiceNumber"
                              value={formData?.invoiceNumber}
                              onChange={handleChange}
                              onFocus={() => setInvoiceNumberFocused(true)}
                              onBlur={() => setInvoiceNumberFocused(false)}
                              className="w-full outline-none text-[12px]  py-[9px] font-Poppins font-[400] bg-transparent"
                            />
                          </div>
                        </div>
                        <div className=" flex gap-[20px]">
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="billType"
                                value="only"
                                checked={formData?.billType === "only"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    billType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              Only Bill
                            </span>
                          </label>
                          <label className="flex items-center gap-[5px] cursor-pointer group">
                            <div className="relative flex items-center justify-center w-7 h-7">
                              <input
                                type="radio"
                                name="billType"
                                value="inventory"
                                checked={formData?.billType === "inventory"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    billType: e.target.value,
                                  }))
                                }
                                className="sr-only peer"
                              />
                              <div className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-300" />
                              <div className="absolute w-[10px] h-[10px] rounded-full bg-[#ff8000] transform scale-0 peer-checked:scale-100 transition-transform duration-200" />
                            </div>
                            <span className="text-[12px] text-gray-700 font-Poppins group-hover:text-gray-900">
                              Bill with Inventory
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" w-[100%] flex justify-end">
                  <div
                    className=" flex font-Poppins text-[17px] font-[400]  h-[45px]  rounded-[7px] items-center justify-center  w-[150px]  text-[#fff] bs-spj "
                    onClick={handleSubmit}
                  >
                    <p>ADD COMPANY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
