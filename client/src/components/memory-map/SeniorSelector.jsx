import React, { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Check, GraduationCap, Search } from 'lucide-react';
import './SeniorSelector.css';

function SeniorSelector({ seniors, selectedSeniors, onChange }) {
  const [query, setQuery] = useState('');

  const filteredSeniors = useMemo(() => {
    if (!query) return seniors;
    return seniors.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [seniors, query]);

  const isAllSelected = selectedSeniors.length === 0; // CHANGED

  const toggleSenior = (senior) => {
    const exists = selectedSeniors.some((s) => s.id === senior.id);
    if (exists) {
      onChange(selectedSeniors.filter((s) => s.id !== senior.id));
    } else {
      onChange([...selectedSeniors, senior]);
    }
  };

  return (
    <div className="ss-card">
      <div className="ss-header">
        <GraduationCap className="ss-cap-icon" />
        <h3 className="ss-title">Select Seniors</h3>
      </div>

      <p className="ss-sub">
        Search and select one or more graduating seniors
      </p>

      {/* Search bar */}
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

      <div className="ss-list">
        {/* All seniors */}
        <button
          type="button"
          onClick={() => onChange([])} // CHANGED
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

        {/* Individual seniors */}
        {filteredSeniors.map((senior) => {
          const initials = senior.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          const isSelected = selectedSeniors.some(
            (s) => s.id === senior.id
          ); // CHANGED

          return (
            <button
              key={senior.id}
              type="button"
              onClick={() => toggleSenior(senior)} // CHANGED
              className={cn(
                'ss-item',
                isSelected ? 'ss-item-selected' : 'ss-item-default'
              )}
            >
              <div
                className={cn(
                  'ss-avatar ss-avatar-gradient',
                  isSelected
                    ? 'ss-avatar-selected'
                    : 'ss-avatar-secondary'
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