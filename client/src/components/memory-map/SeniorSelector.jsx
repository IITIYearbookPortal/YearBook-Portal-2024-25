import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Check, GraduationCap, Search } from 'lucide-react';
import './SeniorSelector.css';

function SeniorSelector({ seniors = [], selectedSeniors = [], onChange, loggedInUser }) {
  const [query, setQuery] = useState('');

  // Filter seniors based on search query
  const filteredSeniors = useMemo(() => {
    if (!seniors.length) return [];

    if (query) {
      // Search filtering
      return seniors.filter((s) =>
        s?.name?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // No search: sort all seniors by createdAt
    return seniors.sort((a, b) => b.createdAt - a.createdAt);
  }, [seniors, query]);

  const isAllSelected = selectedSeniors.length === 0;

  // Toggle selection for a senior
  const toggleSenior = (senior) => {
    const exists = selectedSeniors.some((s) => s.id === senior.id);
    if (exists) {
      onChange(selectedSeniors.filter((s) => s.id !== senior.id));
    } else {
      onChange([...selectedSeniors, senior]);
    }
  };

  // Separate logged-in user from others
  const otherSeniors = filteredSeniors.filter((s) => s.id !== loggedInUser?.id);

  return (
    <div className="ss-card">
      {/* Header */}
      <div className="ss-header">
        <GraduationCap className="ss-cap-icon" />
        <h3 className="ss-title">Select Seniors</h3>
      </div>

      <p className="ss-sub">
        Search and select one or more graduating seniors
      </p>

      {/* Search input */}
      <div className="ss-search">
        <Search className="ss-search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search seniors..."
          className="ss-search-input"
        />
      </div>

      {/* Senior list */}
      <div className="ss-list">
        {/* "All Seniors" button */}
        <button
          type="button"
          onClick={() => onChange([])}
          className={cn(
            'ss-item',
            isAllSelected ? 'ss-item-selected' : 'ss-item-default'
          )}
        >
          <div
            className={cn(
              'ss-avatar',
              isAllSelected ? 'ss-avatar-selected' : 'ss-avatar-muted'
            )}
          >
            <span className="ss-avatar-text">All</span>
          </div>

          <div className="ss-meta">
            <p className="ss-name">All Seniors</p>
            <p className="ss-note">View memories for everyone</p>
          </div>

          {isAllSelected && <Check className="ss-check" />}
        </button>

        {/* Logged-in user (always visible after All Seniors) */}
        {loggedInUser && (
          <button
            type="button"
            onClick={() => toggleSenior(loggedInUser)}
            className={cn(
              'ss-item',
              selectedSeniors.some((s) => s.id === loggedInUser.id)
                ? 'ss-item-selected'
                : 'ss-item-default'
            )}
          >
            <div
              className={cn(
                'ss-avatar ss-avatar-gradient',
                selectedSeniors.some((s) => s.id === loggedInUser.id)
                  ? 'ss-avatar-selected'
                  : 'ss-avatar-secondary'
              )}
            >
              <span className="ss-avatar-text">
                {loggedInUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            </div>

            <div className="ss-meta">
              <p className="ss-name">{loggedInUser.name}</p>
              <p className="ss-note">
                {loggedInUser.department} • Class of {loggedInUser.graduationYear}
              </p>
            </div>

            {selectedSeniors.some((s) => s.id === loggedInUser.id) && (
              <Check className="ss-check" />
            )}
          </button>
        )}

        {/* Other seniors */}
        {otherSeniors.filter(Boolean).map((senior) => {
          const initials = senior.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          const isSelected = selectedSeniors.some((s) => s.id === senior.id);

          return (
            <button
              key={senior.id}
              type="button"
              onClick={() => toggleSenior(senior)}
              className={cn(
                'ss-item',
                isSelected ? 'ss-item-selected' : 'ss-item-default'
              )}
            >
              <div
                className={cn(
                  'ss-avatar ss-avatar-gradient',
                  isSelected ? 'ss-avatar-selected' : 'ss-avatar-secondary'
                )}
              >
                <span className="ss-avatar-text">{initials}</span>
              </div>

              <div className="ss-meta">
                <p className="ss-name">{senior.name}</p>
                <p className="ss-note">
                  {senior.department} • Class of {senior.graduationYear}
                </p>
              </div>

              {isSelected && <Check className="ss-check" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SeniorSelector;