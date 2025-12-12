import React from "react";
import "./textarea.css";

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`textarea ${className}`}
      {...props}
    />
  );
}

export { Textarea };
export default Textarea;
