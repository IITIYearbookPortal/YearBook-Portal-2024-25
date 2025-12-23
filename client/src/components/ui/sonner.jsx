import React from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import "./sonner.css";

/**
 * Toaster wrapper for Sonner (no next-themes dependency).
 *
 * Theme resolution order:
 * 1. explicit `theme` prop passed to <Toaster theme="dark" />
 * 2. value in localStorage key "theme" (if present)
 * 3. OS preference (prefers-color-scheme)
 * 4. fallback to "light"
 */
function resolveTheme(explicitTheme) {
  if (explicitTheme) return explicitTheme;

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored) return stored;
    } catch (e) {
      // ignore localStorage access errors
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  return "light";
}

function Toaster({ theme: themeProp, ...props }) {
  const theme = resolveTheme(themeProp);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Sonner will apply these class names on the generated nodes:
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, sonnerToast as toast };
