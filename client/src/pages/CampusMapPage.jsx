import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BUILDINGS, CAMPUS_GEOJSON } from '../data/campusMapData';

// The full MapLibre style object — background, grass, water, roads, footpaths
const MAP_STYLE = {
  version: 8,
  name: 'IIT Indore Campus',
  metadata: {},
  sources: {
    'campus': {
      type: 'geojson',
      data: CAMPUS_GEOJSON
    }
  },
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  layers: [
    // 1. Light green background
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#d4edda'
      }
    },
    // 2. Grass areas
    {
      id: 'campus-grass',
      type: 'fill',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'grass'],
      paint: {
        'fill-color': '#a8d5a2',
        'fill-opacity': 0.6
      }
    },
    // 3. Sports fields
    {
      id: 'campus-sports',
      type: 'fill',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'sports_field'],
      paint: {
        'fill-color': '#7bc47f',
        'fill-outline-color': '#5aad5e',
        'fill-opacity': 0.85
      }
    },
    // 4. Water / lakes
    {
      id: 'campus-water',
      type: 'fill',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'water'],
      paint: {
        'fill-color': '#7ec8e3',
        'fill-opacity': 0.85
      }
    },
    // 5. Footpath borders
    {
      id: 'campus-footpath-border',
      type: 'line',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'footpath'],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#c0cad8',
        'line-width': 6
      }
    },
    // 6. Footpaths
    {
      id: 'campus-footpath',
      type: 'line',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'footpath'],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#eef2f6',
        'line-width': 3.5
      }
    },
    // 7. Road borders (outer stroke)
    {
      id: 'campus-road-border',
      type: 'line',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'road'],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#9ba8b8',
        'line-width': 14
      }
    },
    // 8. Roads (inner fill)
    {
      id: 'campus-road',
      type: 'line',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'road'],
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': '#f5f7fa',
        'line-width': 10
      }
    },
    // 9. Road labels
    {
      id: 'campus-road-labels',
      type: 'symbol',
      source: 'campus',
      filter: ['==', ['get', 'type'], 'road'],
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-font': ['Open Sans Regular'],
        'text-allow-overlap': false
      },
      paint: {
        'text-color': '#6b7a8d',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5
      }
    }
  ]
};

export default function CampusMapPage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // already initialized

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [75.9220, 22.5185],
      zoom: 15.5,
      pitch: 0,
      bearing: 0,
      minZoom: 14,
      maxZoom: 18,
      dragRotate: false
    });

    // Disable rotation via keyboard/touch
    map.touchZoomRotate.disableRotation();

    // Add zoom controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    // Add building markers once map loads
    map.on('load', () => {
      BUILDINGS.forEach((building) => {
        // Create the marker container element
        const el = document.createElement('div');
        el.className = 'campus-building-marker';
        el.style.width = `${building.width}px`;
        el.style.height = `${building.height}px`;

        // Create the inner element for styling and hover effects
        const inner = document.createElement('div');
        inner.style.cssText = `
          width: 100%;
          height: 100%;
          background-image: url(${building.img});
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease;
          filter: drop-shadow(2px 4px 8px rgba(0,0,0,0.35));
          border-radius: 4px;
        `;
        
        el.appendChild(inner);

        el.addEventListener('mouseenter', () => {
          inner.style.transform = 'scale(1.08)';
          inner.style.filter = 'drop-shadow(3px 6px 12px rgba(0,0,0,0.45))';
        });
        el.addEventListener('mouseleave', () => {
          inner.style.transform = 'scale(1)';
          inner.style.filter = 'drop-shadow(2px 4px 8px rgba(0,0,0,0.35))';
        });

        // Create marker
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(building.coordinates)
          .addTo(map);

        // Click handler
        el.addEventListener('click', (e) => {
          e.stopPropagation();

          // Remove existing popup
          if (popupRef.current) {
            popupRef.current.remove();
          }

          const popup = new maplibregl.Popup({
            offset: [0, -building.height],
            closeButton: true,
            closeOnClick: false,
            maxWidth: '260px'
          })
            .setLngLat(building.coordinates)
            .setHTML(`
              <div style="font-family: 'Inter', 'Segoe UI', sans-serif; padding: 6px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                  ${building.name}
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.4;">
                  Tap "Explore" to view memories, photos, and events linked to this place.
                </p>
                <button 
                  id="explore-${building.id}"
                  style="
                    width: 100%; padding: 9px 0; 
                    background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
                    color: white; border: none; border-radius: 8px;
                    cursor: pointer; font-size: 13px; font-weight: 600;
                    letter-spacing: 0.3px;
                    transition: opacity 0.2s;
                  "
                  onmouseover="this.style.opacity='0.85'"
                  onmouseout="this.style.opacity='1'"
                >
                  ✨ Explore Building
                </button>
              </div>
            `)
            .addTo(map);

          popupRef.current = popup;

          // Attach click to the button inside the popup after it renders
          setTimeout(() => {
            const btn = document.getElementById(`explore-${building.id}`);
            if (btn) {
              btn.addEventListener('click', () => {
                alert(`🏛️ Running custom action for: ${building.name}\n\nThis is where you'd open the memories/photos page, fetch data, etc.`);
              });
            }
          }, 50);
        });
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Title overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        padding: '16px 24px',
        borderRadius: '14px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        border: '1px solid rgba(0,0,0,0.06)'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
          🗺️ IIT Indore Memory Map
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
          Drag to explore · Scroll to zoom · Click a building
        </p>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: 20,
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        padding: '14px 18px',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '12px',
        color: '#475569',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#a8d5a2', display: 'inline-block' }} /> Green Space
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#7ec8e3', display: 'inline-block' }} /> Water
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 20, height: 4, borderRadius: 2, background: '#f5f7fa', border: '1px solid #9ba8b8', display: 'inline-block' }} /> Road
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 20, height: 3, borderRadius: 2, background: '#eef2f6', border: '1px solid #c0cad8', display: 'inline-block' }} /> Path
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: '#7bc47f', display: 'inline-block' }} /> Sports
        </span>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
