import React, { useState, useEffect } from 'react';

const FloatingTextarea = ({ label, name, value = "", onChange }) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  // ✅ Keep internal value in sync with parent prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    // ✅ Pass updated value to parent
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative w-full border-[1px] border-[#dedede] shadow rounded-lg flex items-center text-[#00000099] h-[100px]">
      <label
        htmlFor={name}
        className={`absolute left-[13px] px-[5px] bg-[#fff] text-[14px] font-Poppins transition-all duration-200
          ${focused || internalValue
            ? "top-[-9px] text-[12px] text-[#00b4d8]"
            : "top-[14px] text-[#43414199]"}
        `}
      >
        {label}
      </label>

      <textarea
        name={name}
        id={name}
        value={internalValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        className="w-full outline-none text-[14px] font-Poppins font-[400] bg-transparent pt-[20px] px-[10px] h-full resize-none"
      />
    </div>
  );
};

export default FloatingTextarea;
