import React, { useState, useEffect, useRef } from "react";
import Header from "../../Component/header/Header";
import SideBar from "../../Component/sidebar/SideBar";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "../../helper/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import FloatingInput from "../../Component/inputFelleds/FloatingInput";
import FloatingTextarea from "../../Component/inputFelleds/FloatingTextarea";
import { accordionDetailsClasses } from "@mui/material";

export default function CompanyListing() {
  const [activeTab, setActiveTab] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [branchData, setBranchData] = useState({
    name: "",
    company: "",
    address: "",
  });

  // ✅ Fetch company data
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await ApiGet("/admin/info");
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setCompanies(res.data.data);
      } else if (Array.isArray(res?.data)) {
        setCompanies(res.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    } accordionDetailsClasses
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await ApiGet("/admin/branch");
      console.log('res', res)
      if (res?.status && Array.isArray(res.data)) {
        setBranches(res.data);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    fetchBranches();
  }, []);

  // ✅ Handlers
  const handleCompanyClick = () => setActiveTab(true);
  const handleBranchClick = () => setActiveTab(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBranch = async () => {
    // if (!branchData.name || !branchData.company || !branchData.address) {
    //   alert("Please fill all fields.");
    //   return;
    // }

    try {
      const companyObj = companies.find(c => c.firmName === branchData.company);
      if (!companyObj?._id) {
        alert("Invalid company selected.");
        return;
      }

      const payload = {
        name: branchData.name,
        company: companyObj._id,
        address: branchData.address,
      };

      if (editIndex !== null && branches[editIndex]?._id) {
        // ✅ Update branch
        await ApiPut(`/admin/branch/${branches[editIndex]._id}`, payload);
      } else {
        // ✅ Create new branch
        await ApiPost("/admin/branch", payload);
      }

      await fetchBranches(); // Refresh after save
      setBranchData({ name: "", company: "", address: "" });
      setModalOpen(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving branch:", error);
      alert(error?.response?.data?.error || "Failed to save branch.");
    }
  };


  const handleEditBranch = (index) => {
    const b = branches[index];
    setEditIndex(index);
    setBranchData({
      name: b.name || "",
      company: b.company?.firmName || "",
      address: b.address || "",
    });
    setModalOpen(true);
  };


  const handleDeleteBranch = async (index) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;

    try {
      const id = branches[index]?._id;
      if (id) await ApiDelete(`/admin/branch/${id}`);
      await fetchBranches(); // refresh after delete
    } catch (error) {
      console.error("Error deleting branch:", error);
      alert("Failed to delete branch");
    }
  };


  // ✅ Framer Motion Dropdown Component
  const MotionDropdown = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const filtered = options.filter((opt) =>
      opt.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="relative w-full font-Poppins">
        <div
          className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[45px] flex items-center px-3 text-[#00000099] cursor-text"
          onClick={() => {
            ref.current.focus();
            setOpen(true);
          }}
        >
          <label
            className={`absolute left-[13px] bg-white px-[5px] text-[14px] transition-all duration-200
              ${open || value ? "top-[-9px] text-[12px] text-[#00b4d8]" : "top-[10px] text-[#43414199]"}`}
          >
            {label}
          </label>
          <input
            ref={ref}
            value={query || value}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            className="w-full outline-none bg-transparent text-[14px]"
          />
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="text-[#00b4d8] text-[12px]" />
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[50px] w-full bg-white border border-[#dedede] rounded-lg shadow-md z-20"
            >
              {filtered.length > 0 ? (
                filtered.map((opt, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ backgroundColor: "#e6f9ff" }}
                    className="px-4 py-2 text-[14px] cursor-pointer"
                    onClick={() => {
                      onChange(opt);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-2 text-[13px] text-gray-400">
                  No results found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section className="flex w-[100%] h-[100%] select-none p-[15px] overflow-hidden">
      <div className="flex w-[100%] flex-col gap-[14px] h-[96vh]">
        <Header pageName="Company & Branch Management" />
        <div className="flex gap-[10px] w-[100%] h-[100%]">
          <SideBar />
          <div className="flex flex-col w-[100%] max-h-[90%] pb-[50px] pr-[15px] overflow-y-auto gap-[30px] rounded-[10px]">

            {/* Tabs */}
            <div className="relative flex shadow1-blue rounded-[10px] border-[#122f97] w-fit p-1 bg-gray-200">
              <div
                className={`absolute top-0 left-0 h-full w-[130px] rounded-[8px] transition-transform duration-300 ${activeTab
                  ? "translate-x-0 bg-[#28c723]"
                  : "bg-[#ff8000] translate-x-[120px]"
                  }`}
              ></div>
              <button
                onClick={handleCompanyClick}
                className={`flex w-[130px] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] ${activeTab ? "text-[#fff]" : "text-[#000]"
                  }`}
              >
                Company&apos;s
              </button>
              <button
                onClick={handleBranchClick}
                className={`flex w-[110px] py-[3px] justify-center items-center rounded-[8px] z-10 font-Poppins font-[600] ${activeTab ? "text-[#000]" : "text-[#fff]"
                  }`}
              >
                Branches
              </button>
            </div>

            {/* ✅ Companies Table */}
            {activeTab ? (
              <div className="bg-white w-[100%] rounded-[10px] overflow-hidden shadow1-blue flex-shrink-0 ">
                {loading ? (
                  <p className="font-Poppins text-gray-500">Loading companies...</p>
                ) : companies.length === 0 ? (
                  <p className="font-Poppins text-gray-500">No companies found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-Poppins">
                      <thead>
                        <tr className="bg-[#f5f7ff] text-[#122f97] font-[400] text-left">
                          <th className="p-2 border-b text-[14px] font-[600]">Firm Name</th>
                          <th className="p-2 border-b text-[14px] font-[600]">City</th>
                          <th className="p-2 border-b text-[14px] font-[600]">State</th>
                          <th className="p-2 border-b text-[14px] font-[600]">GST</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((company, index) => (
                          <tr key={index} className="hover:bg-[#f7faff] border-b text-[13px] text-gray-700">
                            <td className="p-3">{company?.firmName || "-"}</td>
                            <td className="p-3">{company?.city || "-"}</td>
                            <td className="p-3">{company?.state || "-"}</td>
                            <td className="p-3">{company?.gstNumber || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ✅ Branch Section */}
                <div className="flex justify-between items-center">
                  <h2 className="font-Poppins text-[18px] font-[600] text-[#122f97]">
                    Branches
                  </h2>
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      setBranchData({ name: "", company: "", address: "" });
                      setEditIndex(null);
                    }}
                    className="bg-[#00b4d8] text-white px-4 py-2 rounded-lg font-Poppins font-[500] text-[14px]"
                  >
                    + Create Branch
                  </button>
                </div>

                {/* ✅ Branch Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                  {branches.length === 0 ? (
                    <p className="text-gray-500 font-Poppins">No branches created yet.</p>
                  ) : (
                    branches.map((branch, index) => (
                      <div key={index} className="bg-white border border-[#dedede] rounded-xl shadow p-4 relative">
                        <h3 className="text-[16px] font-[600] text-[#122f97]">
                          {branch.name}
                        </h3>
                        <p className="text-[13px] text-gray-700 mt-1">
                          <b>Company:</b> {branch.company?.firmName}
                        </p>
                        <p className="text-[13px] text-gray-700">
                          <b>Address:</b> {branch.address}
                        </p>

                        <div className="absolute top-2 right-3 flex gap-3 text-[15px]">
                          <i
                            className="fa-solid fa-pen text-blue-500 cursor-pointer"
                            onClick={() => handleEditBranch(index)}
                          ></i>
                          <i
                            className="fa-solid fa-trash text-red-500 cursor-pointer"
                            onClick={() => handleDeleteBranch(index)}
                          ></i>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modal with Framer Motion Dropdown */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="sm" className="rounded-2xl min-h-[380px]">
        <ModalContent>
          <ModalHeader className="font-Poppins font-[600] text-[18px] flex justify-between items-center">
            {editIndex !== null ? "Edit Branch" : "Create Branch"}
            <i
              className="fa-solid fa-circle-xmark text-[20px] right-[9px] top-[10px] absolute text-red-500 cursor-pointer"
              onClick={() => setModalOpen(false)}
            ></i>
          </ModalHeader>

          <ModalBody className="flex flex-col gap-[23px] font-Poppins">
            <FloatingInput
              label="Name"
              name="name"
              value={branchData.name}
              onChange={handleInputChange}

            />

            <MotionDropdown
              label="Select Company"
              options={companies.map((c) => c.firmName)}
              value={branchData.company}
              onChange={(val) =>
                setBranchData((prev) => ({ ...prev, company: val }))
              }
            />

            <FloatingTextarea
              label="Address"
              name="address"
              value={branchData.address}
              onChange={(value) =>
                setBranchData((prev) => ({ ...prev, address: value }))
              }
            />

            <button

              onClick={handleSaveBranch}
              className=" bg-[#00b4d8] text-white w-[120px] mx-auto px-4 py-2 rounded-lg font-Poppins font-[500] text-[14px] "
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}
