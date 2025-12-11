import React from 'react';
import { cn } from '../../lib/utils';
import { Check, GraduationCap } from 'lucide-react';
import './SeniorSelector.css';

function SeniorSelector({ seniors, selectedSenior, onSelect }) {
  return (
    <div className="ss-card">
      <div className="ss-header">
        <GraduationCap className="ss-cap-icon" />
        <h3 className="ss-title">Select a Senior</h3>
      </div>

      <p className="ss-sub">
        View and add memories for a specific graduating senior
      </p>

      <div className="ss-list">
        {/* All seniors option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'ss-item',
            selectedSenior === null ? 'ss-item-selected' : 'ss-item-default'
          )}
        >
          <div className={cn('ss-avatar', selectedSenior === null ? 'ss-avatar-selected' : 'ss-avatar-muted')}>
            <span className="ss-avatar-text">All</span>
          </div>

          <div className="ss-meta">
            <p className="ss-name">All Seniors</p>
            <p className="ss-note">View all memories on the map</p>
          </div>

          {selectedSenior === null && <Check className="ss-check" />}
        </button>

        {/* Individual seniors */}
        {seniors.map((senior) => {
          const initials = senior.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

          const isSelected = selectedSenior?.id === senior.id;

          return (
            <button
              key={senior.id}
              type="button"
              onClick={() => onSelect(senior)}
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
                aria-hidden
              >
                <span className="ss-avatar-text">{initials}</span>
              </div>

              <div className="ss-meta">
                <p className="ss-name">{senior.name}</p>
                <p className="ss-note">{senior.department} • Class of {senior.graduationYear}</p>
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
