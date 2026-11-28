import React, { useEffect, useMemo, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import { findMatchingDepartments, matchesMemberQuery } from "../utils/memberSearch";

const getDisplayName = (person) => person?.name || person?.full_name || "";
const getAvatarSrc = (person) => person?.profile_img || person?.profile_pic;

/**
 * Shared searchable, paginated member directory table/cards UI used by both
 * Friends Directory (`UserList.js`) and Yearbook Archive (`PreviousYrBook.jsx`).
 */
const MemberDirectory = ({
  title,
  itemLabel = "seniors",
  emptyDropdownText = "No matching seniors or departments found.",
  users = [],
  onSelectUser,
  usersPerPage = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredUsers = useMemo(
    () => users.filter((u) => matchesMemberQuery(u, searchQuery)),
    [users, searchQuery],
  );

  const matchingDepartments = useMemo(
    () => findMatchingDepartments(searchQuery, 4),
    [searchQuery],
  );

  const suggestedUsers = useMemo(() => {
    if (!normalizedQuery) return [];
    return filteredUsers.slice(0, 7);
  }, [filteredUsers, normalizedQuery]);

  const totalSuggestions = matchingDepartments.length + suggestedUsers.length;
  const totalFilteredPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
    setActiveIndex(-1);
  }, [normalizedQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalFilteredPages)));
  };

  const selectDepartment = (dept) => {
    setSearchQuery(dept);
    setShowSuggestions(false);
  };

  const triggerSelectUser = (person) => {
    setShowSuggestions(false);
    onSelectUser?.(person);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || totalSuggestions === 0) {
      if (e.key === "Escape") setShowSuggestions(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalSuggestions);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? totalSuggestions - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < matchingDepartments.length) {
        selectDepartment(matchingDepartments[activeIndex].name);
      } else if (activeIndex >= matchingDepartments.length) {
        const person = suggestedUsers[activeIndex - matchingDepartments.length];
        if (person) triggerSelectUser(person);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-8 sm:py-12 font-custom">
      {/* Header Row: Title on Left, Unified Pill Search on Right */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#EEEEEE]">
            {title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#EEEEEE]/70">
            Showing {filteredUsers.length} of {users.length} {itemLabel}
          </p>
        </div>

        <div
          ref={searchBoxRef}
          className="relative w-full md:max-w-md lg:max-w-lg md:ml-auto"
        >
          <SearchBar
            className="h-12"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(val) => {
              setSearchQuery(val);
              setShowSuggestions(true);
            }}
            onClear={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, roll no, or department..."
          />

          {/* Live Suggestions Dropdown Below Input */}
          {showSuggestions && normalizedQuery.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl bg-[#111827] border border-gray-700/80 shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
              {totalSuggestions === 0 ? (
                <div className="px-4 py-5 text-center text-sm text-gray-400">
                  {emptyDropdownText}
                </div>
              ) : (
                <>
                  {matchingDepartments.length > 0 && (
                    <div className="border-b border-gray-800">
                      <div className="px-4 pt-2.5 pb-1 text-[11px] uppercase tracking-wider font-bold text-[#76ABAE]">
                        Departments
                      </div>
                      {matchingDepartments.map((dept, i) => (
                        <button
                          key={dept.name}
                          type="button"
                          onClick={() => selectDepartment(dept.name)}
                          className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 text-sm text-gray-100 transition-colors ${
                            activeIndex === i
                              ? "bg-[#76ABAE]/20"
                              : "hover:bg-gray-800/80"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Building2 className="w-4 h-4 text-[#76ABAE] shrink-0" />
                            <span className="truncate">{dept.name}</span>
                          </div>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-800 text-[#76ABAE] border border-gray-700 shrink-0">
                            {dept.short}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {suggestedUsers.length > 0 && (
                    <div>
                      <div className="px-4 pt-2.5 pb-1 text-[11px] uppercase tracking-wider font-bold text-[#76ABAE]">
                        People
                      </div>
                      {suggestedUsers.map((person, idx) => {
                        const flatIndex = matchingDepartments.length + idx;
                        const displayName = getDisplayName(person);
                        return (
                          <button
                            key={person._id || person.roll_no || idx}
                            type="button"
                            onClick={() => triggerSelectUser(person)}
                            className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors ${
                              activeIndex === flatIndex
                                ? "bg-[#76ABAE]/20"
                                : "hover:bg-gray-800/80"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar
                                src={getAvatarSrc(person)}
                                alt={displayName}
                                className="w-8 h-8 rounded-full border border-gray-700"
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-100 truncate">
                                  {displayName}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                  {person.department}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 text-[#76ABAE] border border-gray-700 shrink-0">
                              {person.roll_no}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {normalizedQuery && (
            <div className="mt-2 px-3 flex justify-end text-xs">
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#76ABAE] hover:underline font-semibold"
              >
                Reset filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-700/80 shadow-xl bg-[#111827]">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-950/60 border-b border-gray-700/80">
              <th className="w-1/3 p-4 text-left font-bold text-[#76ABAE]">
                Name
              </th>
              <th className="w-1/3 p-4 text-center font-bold text-[#76ABAE]">
                Department
              </th>
              <th className="w-1/3 p-4 text-center font-bold text-[#76ABAE]">
                Roll No
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-10 text-center text-gray-400 text-base"
                >
                  No {itemLabel} match "{searchQuery}".
                </td>
              </tr>
            ) : (
              currentUsers.map((person, index) => {
                const displayName = getDisplayName(person);
                return (
                  <tr
                    key={person._id || person.roll_no || index}
                    className="border-b border-gray-800/80 last:border-b-0 hover:bg-gray-800/75 transition-colors cursor-pointer text-gray-100"
                    onClick={() => triggerSelectUser(person)}
                  >
                    <td className="w-1/3 p-4 font-medium subpixel-antialiased">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={getAvatarSrc(person)}
                          alt={displayName}
                          className="w-9 h-9 rounded-full border border-gray-700"
                        />
                        <span>{displayName}</span>
                      </div>
                    </td>
                    <td className="w-1/3 p-4 text-center text-gray-300">
                      {person.department}
                    </td>
                    <td className="w-1/3 p-4 text-center font-mono text-[#76ABAE]">
                      {person.roll_no}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {currentUsers.length === 0 ? (
          <div className="rounded-2xl bg-[#111827] border border-gray-700/80 p-8 text-center text-gray-400">
            No {itemLabel} match "{searchQuery}".
          </div>
        ) : (
          currentUsers.map((person, index) => {
            const displayName = getDisplayName(person);
            return (
              <div
                key={person._id || person.roll_no || index}
                onClick={() => triggerSelectUser(person)}
                className="rounded-2xl bg-[#111827] border border-gray-700/80 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#76ABAE]/60 hover:bg-gray-900/90 transition-colors text-gray-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={getAvatarSrc(person)}
                    alt={displayName}
                    className="w-10 h-10 rounded-full border border-gray-700"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-base truncate">
                      {displayName}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {person.department}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-gray-800 text-[#76ABAE] border border-gray-700 shrink-0">
                  {person.roll_no}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          type="button"
          className={`px-3.5 py-1.5 border border-gray-700/80 bg-[#111827] text-gray-200 rounded-lg transition-colors ${
            currentPage === 1
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-[#76ABAE] hover:text-gray-900 hover:border-[#76ABAE]"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalFilteredPages}
        </span>
        <button
          type="button"
          className={`px-3.5 py-1.5 border border-gray-700/80 bg-[#111827] text-gray-200 rounded-lg transition-colors ${
            currentPage >= totalFilteredPages
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-[#76ABAE] hover:text-gray-900 hover:border-[#76ABAE]"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalFilteredPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MemberDirectory;
