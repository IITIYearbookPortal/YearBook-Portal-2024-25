import React from "react";
import "./input.css";

function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`input ${className}`}
      {...props}
    />
  );
}

export { Input };
export default Input;
