import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const NormalDropdown = ({
  label = "Select Option",
  options = [],
  onChange,
  defaultValue = "",
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full font-Poppins">
      {/* Dropdown Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full h-[40px] border border-[#dedede] shadow-sm rounded-lg bg-white flex items-center justify-between px-3 cursor-pointer text-[14px] text-gray-700"
      >
        <span className={`${!selected ? "text-gray-400" : ""}`}>
          {selected || label}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="text-[#00b4d8] text-[12px]" />
        </motion.div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[45px] left-0 w-full bg-white border border-[#dedede] shadow-lg rounded-lg z-20"
          >
            <div className="max-h-[180px] overflow-y-auto">
              {options.length > 0 ? (
                options.map((opt, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ backgroundColor: "#e6f9ff" }}
                    onClick={() => {
                      setSelected(opt);
                      setOpen(false);
                      if (onChange) onChange(opt);
                    }}
                    className={`px-4 py-2 text-[14px] cursor-pointer hover:text-[#00b4d8] ${
                      selected === opt ? "text-[#00b4d8] font-medium" : ""
                    }`}
                  >
                    {opt}
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-[13px]">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NormalDropdown;
