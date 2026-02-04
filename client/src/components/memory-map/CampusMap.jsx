import React from 'react';
import { campusLocations } from '../../data/CampusData';
import { useCampusData } from './memoryMapContext';
import BuildingMarker from './BuildingMarker';
import './CampusMap.css';

function CampusMap({ selectedSeniorIds, onLocationClick, selectedLocationId }) {
  const { getMemoryCountForLocation } = useCampusData();

  return (
    <div className="cm-map relative w-full cm-aspect bg-map-grass rounded-2xl overflow-hidden shadow-elevated">
      <svg
        className="cm-svg absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M 0 50 Q 25 48 50 50 T 100 50" fill="none" stroke="var(--map-path)" strokeWidth="3" opacity="0.8" />
        <path d="M 50 0 Q 48 25 50 50 T 50 100" fill="none" stroke="var(--map-path)" strokeWidth="3" opacity="0.8" />
        <path d="M 25 0 L 25 100" fill="none" stroke="var(--map-path)" strokeWidth="2" opacity="0.5" />
        <path d="M 75 0 L 75 100" fill="none" stroke="var(--map-path)" strokeWidth="2" opacity="0.5" />

        {[
          { x: 3, y: 5 }, { x: 95, y: 8 }, { x: 3, y: 85 },
          { x: 22, y: 8 }, { x: 22, y: 92 }, { x: 95, y: 35 },
          { x: 28, y: 56 }, { x: 56, y: 58 }, { x: 93, y: 92 },
        ].map((pos, i) => (
          <circle key={i} cx={pos.x} cy={pos.y} r="2" fill="hsl(120 25% 45%)" opacity="0.6" />
        ))}
      </svg>

      {campusLocations.map((location) => {
        const memoryCount = getMemoryCountForLocation(
          location.id,
          selectedSeniorIds // CHANGED
        );

        return (
          <BuildingMarker
            key={location.id}
            location={location}
            memoryCount={memoryCount}
            isSelected={selectedLocationId === location.id}
            onClick={() => onLocationClick(location)}
          />
        );
      })}

      <div className="cm-legend absolute bottom-2 left-4 z-10">
        <div className="cm-legend-card">
          <p className="cm-legend-title">Legend</p>
          <div className="cm-legend-items">
            <div className="cm-legend-row">
              <div className="cm-legend-swatch cm-swatch-building" />
              <span className="cm-legend-text">Building</span>
            </div>
            <div className="cm-legend-row">
              <div className="cm-legend-swatch cm-swatch-marker" />
              <span className="cm-legend-text">Has memories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampusMap;