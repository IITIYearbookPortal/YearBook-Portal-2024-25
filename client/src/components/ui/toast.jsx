import React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";
import "./toast.css";

const ToastProvider = ToastPrimitives.Provider;

/* Viewport (where toasts are mounted) */
const ToastViewport = React.forwardRef(function ToastViewport(props, ref) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "toast-viewport",
        props.className
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = "ToastViewport";

/* Simple variant mapper (replaces cva/TypeScript usage) */
function toastVariants({ variant = "default" } = {}) {
  return variant === "destructive" ? "toast toast-destructive" : "toast toast-default";
}

/* Toast root */
const Toast = React.forwardRef(function Toast({ className, variant, ...props }, ref) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

/* Toast Action */
const ToastAction = React.forwardRef(function ToastAction({ className, ...props }, ref) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn("toast-action", className)}
      {...props}
    />
  );
});
ToastAction.displayName = "ToastAction";

/* Toast Close (X) */
const ToastClose = React.forwardRef(function ToastClose({ className, ...props }, ref) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn("toast-close", className)}
      toast-close=""
      {...props}
    >
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

/* Exports (no TypeScript types) */
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
