import React, { useEffect, useState } from "react";

/**
 * Renders a user profile image with a WhatsApp-style default user silhouette
 * whenever the image URL is missing or fails to load.
 */
const Avatar = ({ src, alt = "", className = "w-10 h-10 rounded-full", style }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || "Default profile avatar"}
        style={style}
        className={`${className} bg-[#6b7280] text-[#e5e7eb] flex items-center justify-center overflow-hidden select-none shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[62%] h-[62%] translate-y-[6%]"
        >
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.87 0-8 1.94-8 5.5V22h16v-2.5c0-3.56-4.13-5.5-8-5.5z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailed(true)}
      className={`${className} object-cover shrink-0`}
    />
  );
};

export default Avatar;
