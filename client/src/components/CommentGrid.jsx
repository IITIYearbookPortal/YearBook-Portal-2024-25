import React from "react";

/**
 * Shared responsive 2-column grid for approved comments and archived senior
 * testimonials. Cards scroll long messages internally while keeping the author
 * attribution pinned at the bottom.
 */
const CommentGrid = ({
  title,
  items = [],
  emptyText = "No items yet.",
  isDarkMode = false,
  footer,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white text-center mb-6 sm:mb-8">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 text-sm sm:text-base py-6">
          {emptyText}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={item.id || `${item.author || "item"}-${index}`}
              className={`w-full max-w-lg mx-auto md:max-w-none rounded-2xl p-4 sm:p-5 shadow-md border border-gray-700/70 flex flex-col h-48 sm:h-52 overflow-hidden ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-500"
                  : "bg-[#111827] text-white"
              }`}
            >
              <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed break-words whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
              {item.author && (
                <p className="shrink-0 mt-3 pt-2.5 border-t border-gray-700/60 text-xs sm:text-sm font-medium text-emerald-400 text-right break-words">
                  — {item.author}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {footer}
    </div>
  );
};

export default CommentGrid;
