// CampusMap.jsx
import React from 'react';
import { campusLocations, getMemoryCountForLocation } from '../../data/CampusData';
import BuildingMarker from './BuildingMarker';
import './CampusMap.css';

function CampusMap({ selectedSeniorId, onLocationClick, selectedLocationId }) {
  return (
    <div className="cm-map relative w-full cm-aspect bg-map-grass rounded-2xl overflow-hidden shadow-elevated">
      {/* Decorative campus elements */}
      <svg
        className="cm-svg absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Paths/Roads */}
        <path d="M 0 50 Q 25 48 50 50 T 100 50" fill="none" stroke="var(--map-path)" strokeWidth="3" opacity="0.8" />
        <path d="M 50 0 Q 48 25 50 50 T 50 100" fill="none" stroke="var(--map-path)" strokeWidth="3" opacity="0.8" />
        <path d="M 25 0 L 25 100" fill="none" stroke="var(--map-path)" strokeWidth="2" opacity="0.5" />
        <path d="M 75 0 L 75 100" fill="none" stroke="var(--map-path)" strokeWidth="2" opacity="0.5" />

        {/* Decorative trees (circles) */}
        {[
          { x: 3, y: 5 }, { x: 95, y: 8 }, { x: 3, y: 85 },
          { x: 22, y: 8 }, { x: 22, y: 92 }, { x: 95, y: 35 },
          { x: 28, y: 56 }, { x: 56, y: 58 }, { x: 93, y: 92 },
        ].map((pos, i) => (
          <circle key={i} cx={pos.x} cy={pos.y} r="2" fill="hsl(120 25% 45%)" opacity="0.6" />
        ))}
      </svg>

      {/* Title label */}
      {/* <div className="cm-title top-0 left-1/2 -translate-x-1/2 z-10">
        <div className="cm-title-card">
          <h3 className="cm-title-text">Campus Memory Map</h3>
        </div>
      </div> */}

      {/* Compass */}
      {/* <div className="cm-compass absolute top-4 right-4 z-10">
        <div className="cm-compass-card">
          <div className="cm-compass-inner relative w-8 h-8">
            <div className="cm-compass-n absolute inset-0 flex items-center justify-center">
              <span className="cm-compass-n-text">N</span>
            </div>
            <svg viewBox="0 0 24 24" className="cm-compass-svg" aria-hidden>
              <path d="M12 2 L14 10 L12 8 L10 10 Z" fill="var(--primary)" />
              <path d="M12 22 L14 14 L12 16 L10 14 Z" fill="var(--muted-foreground)" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div> */}

      {/* Buildings */}
      {campusLocations.map((location) => {
        const memoryCount = getMemoryCountForLocation(location.id, selectedSeniorId);
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

      {/* Legend */}
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
