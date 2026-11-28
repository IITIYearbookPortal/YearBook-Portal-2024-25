import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Check, GraduationCap } from 'lucide-react';
import SearchBar from '../SearchBar';
import { matchesMemberQuery } from '../../utils/memberSearch';
import './SeniorSelector.css';

function SeniorSelector({ seniors = [], selectedSeniors = [], onChange, loggedInUser }) {
  const [query, setQuery] = useState('');

  // Filter seniors across name, roll no, and department (including short forms)
  const filteredSeniors = useMemo(() => {
    if (!seniors.length) return [];

    if (query.trim()) {
      return seniors.filter((s) => matchesMemberQuery(s, query));
    }

    // No search: sort a shallow copy by createdAt
    return [...seniors].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
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

      {/* Search input (matches Friends Directory unified search) */}
      <div className="ss-search">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search name, roll no, or dept..."
        />
      </div>

      {/* Senior list */}
      <div className="ss-list">
        {!query.trim() && (
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
        )}

        {/* Logged-in user */}
        {loggedInUser && matchesMemberQuery(loggedInUser, query) && (
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
                  {senior.department}
                  {senior.roll_no ? ` • ${senior.roll_no}` : ''} • Class of {senior.graduationYear}
                </p>
              </div>

              {isSelected && <Check className="ss-check" />}
            </button>
          );
        })}

        {query.trim() &&
          otherSeniors.length === 0 &&
          !(loggedInUser && matchesMemberQuery(loggedInUser, query)) && (
            <div className="ss-empty">No matching seniors found.</div>
          )}
      </div>
    </div>
  );
}

export default SeniorSelector;