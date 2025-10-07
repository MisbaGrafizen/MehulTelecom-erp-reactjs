import React, { useState, useEffect } from "react";

const FloatingInput = ({ label, type = "text", name, value = "", onChange }) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value) setFocused(true);
  }, [value]);

  return (
    <div className="relative w-full border-[1px] border-[#dedede] shadow rounded-lg flex items-center space-x-4 text-[#00000099] h-[40px]">
      <label
        htmlFor={name}
        className={`absolute left-[13px] px-[5px] bg-[#fff] text-[14px] font-Poppins transition-all duration-200
          ${
            focused || value
              ? "top-[-9px] text-[10px] text-[#00b4d8]"
              : "top-[9px] text-[#43414199]"
          }
        `}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        id={name}
        value={value || ""}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        className="w-full outline-none text-[14px] h-full py-[5px] font-Poppins font-[400] bg-transparent pr-[8px]"
      />
    </div>
  );
};

export default FloatingInput;
