import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const NormalDropdown = ({
  label = "Select Option",
  options = [],
  value,              // ✅ controlled value from parent
  onChange,
  defaultValue = "",  // ✅ optional fallback
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || defaultValue);
  const dropdownRef = useRef(null);

  // ✅ Sync internal selected when parent value changes
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    setSelected(opt);
    setOpen(false);
    if (onChange) onChange(opt);
  };

  return (
    <div ref={dropdownRef} className="relative w-full font-Poppins">
      {/* Trigger */}
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
          <FaChevronDown className="text-[#083aef] text-[12px]" />
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
                    onClick={() => handleSelect(opt)}
                    className={`px-4 py-2 text-[14px] cursor-pointer hover:text-[#305af3] ${
                      selected === opt ? "text-[#305af3] font-medium" : ""
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
