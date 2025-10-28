import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { Modal, ModalContent } from "@nextui-org/react";
import FloatingInput from "./FloatingInput";
import FloatingTextarea from "./FloatingTextarea";
import { ApiPost } from "../../helper/axios";
import { Plus, X } from "lucide-react";
import uploadToHPanel from "../../helper/hpanelUpload"; // ✅ import your HPanel uploader

const MotionDropdown = ({
  label = "Select Party",
  options = [],
  onChange,
  onPartyCreated,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [partyModalOpen, setPartyModalOpen] = useState(false);
  const inputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImages, setSavedImages] = useState([]);

  // ✅ Match backend model
  const [formData, setFormData] = useState({
    partyName: "",
    phoneNumber: "",
    email: "",
    billingAddress: "",
    creditLimit: "",
    balance: "",
    document: null,
    documentUrl: "",
    additionalFields: {},
  });

  // ✅ Handle input change
  const handlePartyInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Upload image to HPanel
  const handleUpload = async () => {
    if (!formData.document) return alert("Please select an image first!");

    try {
      const uploadedUrl = await uploadToHPanel(formData.document);
      if (uploadedUrl) {
        setSavedImages((prev) => [...prev, uploadedUrl]);
        setFormData((prev) => ({ ...prev, documentUrl: uploadedUrl }));
        setSelectedImage(null);
      } else {
        alert("Failed to upload image ❌");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while uploading");
    }
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, document: file }));
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // ✅ Remove uploaded image
  const handleRemove = (index) => {
    setSavedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Save new party to backend
  const handlePartySave = async () => {
    try {
      if (!formData.partyName) return alert("Party name is required");

      // 🧠 Fix: Ensure billingAddress is always a string
      const formatAddress = (addr) => {
        if (!addr) return "";
        if (typeof addr === "string") return addr.trim();
        if (typeof addr === "object") {
          return Object.values(addr).filter(Boolean).join(", ");
        }
        return "";
      };

      const payload = {
        partyName: formData.partyName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        billingAddress: formatAddress(formData.billingAddress),
        creditLimit: Number(formData.creditLimit) || 0,
        balance: Number(formData.balance) || 0,
        documentUrl: formData.documentUrl || "",
        additionalFields: formData.additionalFields,
      };

      const res = await ApiPost("/admin/party", payload);

      if (res?.data) {
        setPartyModalOpen(false);

        // Reset form
        setFormData({
          partyName: "",
          phoneNumber: "",
          email: "",
          billingAddress: "",
          creditLimit: "",
          balance: "",
          document: null,
          documentUrl: "",
          additionalFields: {},
        });
        setSavedImages([]);

        // Notify parent
        if (onPartyCreated) onPartyCreated(res.data);
      }
    } catch (error) {
      console.error("Error creating party:", error);
      alert("Failed to create party ❌");
    }
  };

  // Filter options
  const filteredOptions = options.filter((opt) =>
    opt?.toLowerCase()?.includes(query?.toLowerCase())
  );

  return (
    <>
      {/* Dropdown Field */}
      <div className="relative w-full">
        <div
          className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 text-[#00000099] cursor-text"
          onClick={() => {
            inputRef.current.focus();
            setOpen(true);
          }}
        >
          <label
            className={`absolute left-[13px] bg-white px-[5px] font-Poppins transition-all duration-200
              ${open || selected
                ? "top-[-9px] text-[12px] text-[#00b4d8]"
                : "top-[9px] text-[14px] text-[#43414199]"
              }`}
          >
            {label}
          </label>

          <input
            ref={inputRef}
            type="text"
            value={query || selected}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected("");
            }}
            className="w-full outline-none text-[14px] font-Poppins font-[400] bg-transparent"
          />

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="text-[#00b4d8] text-[12px]" />
          </motion.div>
        </div>

        {/* Dropdown Options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[60px] font-Poppins left-0 w-full bg-white border border-[#dedede] shadow-lg rounded-lg z-20"
            >
              <div className="max-h-[180px] overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ backgroundColor: "#e6f9ff" }}
                      onClick={() => {
                        setSelected(opt);
                        setQuery(opt);
                        setOpen(false);
                        if (onChange) onChange(opt);
                      }}
                      className="px-4 py-2 text-[14px] cursor-pointer hover:text-[#00b4d8]"
                    >
                      {opt}
                    </motion.div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-[13px]">
                    No results found
                  </div>
                )}
              </div>

              {/* Add Party Button */}
              <div
                className="flex items-center gap-2 px-4 py-2 border-t border-[#eee] text-[#00b4d8] hover:bg-[#e6f9ff] cursor-pointer text-[14px] font-medium"
                onClick={() => {
                  setPartyModalOpen(true);
                  setOpen(false);
                }}
              >
                <FaPlus className="text-[12px]" />
                Add Party
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Party Modal */}
      <Modal isOpen={partyModalOpen} size="3xl" className="rounded-2xl">
        <ModalContent className="shadow-none font-Poppins bg-transparent">
          <div className="bg-white rounded-2xl p-[25px] mt-[10px]">
            <div className="flex justify-between items-center mb-[15px]">
              <h1 className="font-[600] font-Poppins text-[22px]">
                Create New Party
              </h1>
              <i
                className="text-[28px] text-red-500 cursor-pointer right-[10px] top-[20px] absolute fa-solid fa-circle-xmark"
                onClick={() => setPartyModalOpen(false)}
              ></i>
            </div>

            <div className="flex flex-wrap gap-[20px]">
              {/* Left Column */}
              <div className="flex flex-col gap-[16px] w-full md:w-[48%]">
                <FloatingInput
                  label="Party Name"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Email ID"
                  name="email"
                  value={formData.email}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Credit Limit"
                  name="creditLimit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Balance"
                  name="balance"
                  type="number"
                  value={formData.balance}
                  onChange={handlePartyInputChange}
                />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-[10px] w-full md:w-[48%]">
                <FloatingTextarea
                  label="Billing Address"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handlePartyInputChange}
                />

                {/* Document Upload */}
                <div className="flex flex-wrap items-center gap-2">
                  <div>
                    <label className="font-medium text-gray-700">
                      Document Upload
                    </label>

                    <div
                      className="w-[150px] h-[150px] border-[1.2px] border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
                      onClick={() =>
                        document.getElementById("imageInput").click()
                      }
                    >
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Plus className="w-10 h-10 text-gray-400" />
                      )}
                    </div>

                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedImage && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-4 w-[100%] py-1 rounded-lg mt-2 hover:bg-blue-700 transition"
                      >
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Uploaded images */}
                  {savedImages.length > 0 &&
                    savedImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-[140px] h-[140px] group border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Uploaded ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemove(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mt-[20px]">
              <button
                onClick={handlePartySave}
                className="bg-[#00b4d8] text-white font-[500] font-Poppins text-[16px] py-[5px] rounded-[8px] w-[120px]"
              >
                Save
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MotionDropdown;
