import React from "react";
import "./label.css";

function Label({ className = "", ...props }) {
  return (
    <label className={`label ${className}`} {...props} />
  );
}

export { Label };
export default Label;
