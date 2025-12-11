import React from "react";
import "./button.css";

/**
 * Simple Button component with variants and sizes handled via className.
 * Usage: <Button variant="outline" size="sm">Click</Button>
 */
function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  return (
    <button
      className={`btn ${variant} ${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
export default Button;
