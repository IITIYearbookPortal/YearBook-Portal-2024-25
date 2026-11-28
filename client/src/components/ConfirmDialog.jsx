import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

/**
 * Reusable theme-matched confirmation dialog replacing native window.confirm.
 * Supports configurable title, message, button labels, variant ('default' | 'danger'),
 * keyboard navigation (Escape to cancel), and async loading states.
 */
const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descId = useId();
  const cancelBtnRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      if (variant === "danger") {
        cancelBtnRef.current?.focus();
      } else {
        confirmBtnRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (
        previousFocusRef.current instanceof HTMLElement &&
        previousFocusRef.current.isConnected
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [open, loading, variant, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-[135000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? descId : undefined}
        className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700/80 shadow-2xl text-white overflow-hidden"
      >
        <div className="flex items-start gap-3 px-5 pt-5 pb-2 sm:px-6 sm:pt-6">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger
                ? "bg-red-500/15 text-red-400"
                : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {isDanger ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <h3
              id={titleId}
              className="text-base sm:text-lg font-semibold text-white leading-snug"
            >
              {title}
            </h3>
          </div>

          <button
            type="button"
            aria-label="Close confirmation dialog"
            disabled={loading}
            onClick={() => onCancel?.()}
            className="p-1.5 -mr-1.5 -mt-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {message && (
          <div className="px-5 pb-4 sm:px-6 pl-[4.25rem] sm:pl-[4.5rem]">
            <p
              id={descId}
              className="text-sm text-gray-300 leading-relaxed break-words"
            >
              {message}
            </p>
          </div>
        )}

        <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6 flex items-center justify-end gap-2.5 bg-gray-900/60">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={loading}
            onClick={() => onCancel?.()}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            disabled={loading}
            onClick={() => onConfirm?.()}
            className={`px-4 py-2 text-sm font-medium rounded-xl text-white transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isDanger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/**
 * Convenience hook managing open/loading state for <ConfirmDialog />.
 */
export const useConfirmDialog = () => {
  const [state, setState] = useState({
    open: false,
    title: "Confirm Action",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "default",
    loading: false,
  });
  const onConfirmRef = useRef(null);

  const openConfirm = useCallback(
    ({
      title = "Confirm Action",
      message = "",
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant = "default",
      onConfirm,
    }) => {
      onConfirmRef.current = onConfirm || null;
      setState({
        open: true,
        title,
        message,
        confirmLabel,
        cancelLabel,
        variant,
        loading: false,
      });
    },
    [],
  );

  const closeConfirm = useCallback(() => {
    onConfirmRef.current = null;
    setState((prev) => ({ ...prev, open: false, loading: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    const fn = onConfirmRef.current;
    if (!fn) {
      closeConfirm();
      return;
    }
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await fn();
    } finally {
      closeConfirm();
    }
  }, [closeConfirm]);

  const dialogProps = {
    open: state.open,
    title: state.title,
    message: state.message,
    confirmLabel: state.confirmLabel,
    cancelLabel: state.cancelLabel,
    variant: state.variant,
    loading: state.loading,
    onConfirm: handleConfirm,
    onCancel: closeConfirm,
  };

  return { openConfirm, closeConfirm, dialogProps };
};

export default ConfirmDialog;
