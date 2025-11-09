

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full mb-4">
      {/* Label */}
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative w-full">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400"
        />

        {/* Password toggle icon */}
        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <FaRegEye size={20} color="black"/>
            ) : (
              <FaRegEyeSlash size={20} color="black"/>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
