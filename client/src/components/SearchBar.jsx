import React, { useEffect, useRef } from "react";
import { Search, X as CloseIcon } from "lucide-react";
import "../new_components/SearchPill.css";

/**
 * Unified animated-perimeter search pill shared across Friends Directory
 * and Memory Map Senior Selector.
 */
const SearchBar = ({
  value = "",
  onChange,
  onFocus,
  onKeyDown,
  onClear,
  placeholder = "Search by name, roll no, or department...",
  className = "",
}) => {
  const pillRef = useRef(null);
  const inputRef = useRef(null);
  const animTimerRef = useRef(null);
  const blurTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  const stopBorderAnimation = () => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    pillRef.current?.classList.remove("is-animating");
  };

  const handleFocus = (e) => {
    if (onFocus) onFocus(e);
    const pill = pillRef.current;
    if (!pill) return;
    if ((value || "").trim() === "") {
      pill.classList.remove("is-animating");
      void pill.offsetWidth;
      pill.classList.add("is-animating");
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        pill.classList.remove("is-animating");
        animTimerRef.current = null;
      }, 2000);
    } else {
      stopBorderAnimation();
    }
  };

  const handleBlur = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    blurTimerRef.current = setTimeout(() => {
      if (!pillRef.current?.contains(document.activeElement)) {
        stopBorderAnimation();
      }
    }, 50);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange("");
    }
    inputRef.current?.focus();
  };

  return (
    <div
      ref={pillRef}
      onBlur={handleBlur}
      className={`yb-search-pill flex items-center w-full h-11 ${className}`}
    >
      <span className="pl-4 pr-2 text-[#76ABAE] pointer-events-none flex items-center z-10">
        <Search className="w-4 h-4" />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onFocus={handleFocus}
        onChange={(e) => onChange?.(e.target.value, e)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full h-full bg-transparent text-[#EEEEEE] placeholder-[#EEEEEE]/70 text-sm outline-none border-0 pr-10 rounded-full z-10"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className="absolute right-2.5 w-6 h-6 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-[#76ABAE]/30 flex items-center justify-center transition-colors z-10"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
