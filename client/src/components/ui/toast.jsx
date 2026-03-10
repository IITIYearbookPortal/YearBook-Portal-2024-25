import React, { useState, useEffect } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import "./toast.css";

const ToastProvider = ToastPrimitives.Provider;

/* Viewport */
const ToastViewport = React.forwardRef(function ToastViewport(props, ref) {
  return <ToastPrimitives.Viewport ref={ref} className={cn("toast-viewport", props.className)} {...props} />;
});
ToastViewport.displayName = "ToastViewport";

/* Toast variant mapper */
function toastVariants({ variant = "default" } = {}) {
  return variant === "destructive" ? "toast toast-destructive" : "toast toast-default";
}

/* Toast root */
const Toast = React.forwardRef(function Toast({ className, variant, ...props }, ref) {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = "Toast";

/* Toast action */
const ToastAction = React.forwardRef(function ToastAction({ className, ...props }, ref) {
  return <ToastPrimitives.Action ref={ref} className={cn("toast-action", className)} {...props} />;
});
ToastAction.displayName = "ToastAction";

/* Toast close */
const ToastClose = React.forwardRef(function ToastClose({ className, ...props }, ref) {
  return (
    <ToastPrimitives.Close ref={ref} className={cn("toast-close", className)} {...props}>
      <X className="toast-close-icon" />
    </ToastPrimitives.Close>
  );
});
ToastClose.displayName = "ToastClose";

/* Title */
const ToastTitle = React.forwardRef(function ToastTitle({ className, ...props }, ref) {
  return <ToastPrimitives.Title ref={ref} className={cn("toast-title", className)} {...props} />;
});
ToastTitle.displayName = "ToastTitle";

/* Description */
const ToastDescription = React.forwardRef(function ToastDescription({ className, ...props }, ref) {
  return <ToastPrimitives.Description ref={ref} className={cn("toast-desc", className)} {...props} />;
});
ToastDescription.displayName = "ToastDescription";

/* Wrapper to show translucent background only when toast exists */
export function ToastWrapper({ children }) {
  const [hasToast, setHasToast] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const viewport = document.querySelector(".toast-viewport");
      setHasToast(viewport && viewport.children.length > 0);
    });
    const viewport = document.querySelector(".toast-viewport");
    if (viewport) observer.observe(viewport, { childList: true });
    return () => observer.disconnect();
  }, []);

  return <div className={cn("toast-wrapper", hasToast && "show")}>{children}</div>;
}

/* Exports */
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};