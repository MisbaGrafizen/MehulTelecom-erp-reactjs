import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";


import { FaChevronDown, FaPlus } from "react-icons/fa";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,

  Button,
} from "@nextui-org/react";
import FloatingInput from "./FloatingInput";
import FloatingTextarea from "./FloatingTextarea";

const MotionDropdown = ({ label = "Select Farmer", options = [] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [partyModalOpen, setPartyModalOpen] = useState(false);
  const inputRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  // Modal Form Data
  const [formData, setFormData] = useState({
    state: "",
    address: "",
  });

  const handlePartyInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="relative w-full">
        {/* Floating Label Input */}
        <div
          className="relative w-full border border-[#dedede] shadow rounded-lg bg-white h-[40px] flex items-center px-3 text-[#00000099] cursor-text"
          onClick={() => {
            inputRef.current.focus();
            setOpen(true);
          }}
        >
          <label
            className={`absolute left-[13px] bg-white px-[5px] font-Poppins transition-all duration-200
              ${
                open || selected
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
              setOpen(true);
              setSelected("");
            }}
            className="w-full outline-none text-[14px] font-Poppins font-[400] bg-transparent"
            placeholder=""
          />

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="text-[#00b4d8] text-[12px]" />
          </motion.div>
        </div>

        {/* Dropdown */}
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

    <Modal
        isOpen={partyModalOpen}
        onClose={() => setPartyModalOpen(false)}
        size="3xl"
        className="rounded-2xl"
      >
        <ModalContent className="shadow-none bg-transparent">
          <div className="bg-white rounded-2xl p-[25px] mt-[10px]">
            <div className="flex justify-between items-center mb-[15px]">
              <h1 className="font-[600] font-Poppins text-[22px]">
                Create New Party
              </h1>
              <i
                className="text-[28px] text-red-500 cursor-pointer fa-solid fa-circle-xmark"
                onClick={() => setPartyModalOpen(false)}
              ></i>
            </div>

            <div className="flex flex-wrap gap-[20px]">
              {/* Left Column */}
              <div className="flex flex-col gap-[16px] w-full md:w-[48%]">
                <FloatingInput
                  label="Party Name"
                  name="name"
                  value={formData.name}
                  onChange={handlePartyInputChange}
                />
                <FloatingTextarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="GST Number"
                  name="GST"
                  type="number"
                  value={formData.GST}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="PAN Number"
                  name="panNo"
                  type="number"
                  value={formData.panNo}
                  onChange={handlePartyInputChange}
                />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-[16px] w-full md:w-[48%]">
                <FloatingInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Pin Code"
                  name="pinCode"
                  type="number"
                  value={formData.pinCode}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Mobile Number"
                  name="mobileNumber"
                  type="number"
                  value={formData.mobileNumber}
                  onChange={handlePartyInputChange}
                />
                <FloatingInput
                  label="Email ID"
                  name="email"
                  value={formData.email}
                  onChange={handlePartyInputChange}
                />
              </div>
            </div>

            <div className="flex justify-center mt-[20px]">
              <Button
                color="primary"
                onPress={() => {
                  console.log("New Party Added:", formData);
                  setPartyModalOpen(false);
                }}
                className="bg-[#00b4d8] text-white font-[500] font-Poppins text-[16px] rounded-[8px] w-[120px]"
              >
                Save
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
   
      </>
  );
};

export default MotionDropdown;
