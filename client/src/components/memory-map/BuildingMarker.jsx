import React from "react";
import { cn } from "../../lib/utils"; // adjust path if your utils live elsewhere
import "./BuildingMarker.css";

// getLocationColor returns the same Tailwind class strings you had
const getLocationColor = (type) => {
  switch (type) {
    case 'hostel':
      return 'bg-blue-500/85 hover:bg-blue-500';
    case 'mess':
      return 'bg-rose-300/85 hover:bg-rose-300';
    case 'lecture_hall':
      return 'bg-violet-400/85 hover:bg-violet-400';
    case 'playground':
    case 'sports':
      return 'bg-emerald-400/85 hover:bg-emerald-400';
    case 'ground':
      return 'bg-green-500/85 hover:bg-green-500';
    case 'pod':
      return 'bg-red-500/85 hover:bg-red-500';
    case 'landmark':
      return 'bg-rose-300/85 hover:bg-rose-300';
    case 'cafe':
      return 'bg-red-400/85 hover:bg-red-400';
    case 'canteen':
      return 'bg-green-400/85 hover:bg-green-400';
    case 'library':
      return 'bg-violet-400/85 hover:bg-violet-400';
    case 'lake':
      return 'bg-cyan-400/85 hover:bg-cyan-400';
    default:
      return 'bg-rose-300/85 hover:bg-rose-300';
  }
};

const BuildingMarker = ({ location, memoryCount = 0, isSelected = false, onClick }) => {
  const hasMemories = memoryCount > 0;
  const isLake = location?.type === 'lake';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute transition-all duration-300 cursor-pointer group',
        'border-2 border-transparent',
        isLake ? 'rounded-[50%]' : 'rounded-lg',
        getLocationColor(location?.type),
        isSelected && 'ring-2 ring-accent ring-offset-2 ring-offset-map-grass scale-105 z-20',
        hasMemories && 'building-with-memories'
      )}
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
        // width: `${location.width}%`,
        // height: `${location.height}%`,

         width: `max(${location.width}%, 28px)`,
  height: `max(${location.height}%, 28px)`,
      }}
      aria-label={`${location.name}${hasMemories ? ` - ${memoryCount} memories` : ''}`}
    >
      {/* Building label (hover / selected) */}
      <div
        className={cn(
          'absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full',
          'bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-soft',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'pointer-events-none whitespace-nowrap z-30',
          isSelected && 'opacity-100'
        )}
      >
        <p className="text-xs font-medium text-foreground">{location.name}</p>
        {location.description && (
          <p className="text-[10px] text-muted-foreground">{location.description}</p>
        )}
      </div>

      {/* Memory count badge */}
      {hasMemories && (
        <div
          className="memory-badge"
          
        >
          {memoryCount}
        </div>
      )}

      {/* Building name on the building */}
      <div className="absolute inset-0 flex items-center justify-center p-1">
        <span className="bm-label">
          {location.name}
        </span>
      </div>
    </button>
  );
};

export default BuildingMarker;
