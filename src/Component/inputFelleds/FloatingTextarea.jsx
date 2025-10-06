import React, { useState } from 'react'
 
const FloatingTextarea = ({ label, name }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full border-[1px] border-[#dedede] shadow rounded-lg flex items-center text-[#43414199] h-[100px]">
      <label
        htmlFor={name}
        className={`absolute left-[13px] px-[5px] bg-[#fff] text-[14px] font-Poppins transition-all duration-200
          ${focused || value ? "top-[-9px] text-[12px] text-[#00b4d8]" : "top-[14px] text-[#43414199]"}
        `}
      >
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        className="w-full outline-none text-[14px] font-Poppins font-[400] bg-transparent pt-[20px] px-[10px] h-full resize-none"
      ></textarea>
    </div>
  );
};

export default FloatingTextarea;