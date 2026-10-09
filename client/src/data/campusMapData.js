/**
 * IIT INDORE CAMPUS MAP DATA
 * 
 * Comprehensive campus layout with all buildings, roads, footpaths,
 * water bodies, sports fields, and green spaces.
 * 
 * Campus is centered around [75.9220, 22.5200]
 * 
 * Layout zones (roughly):
 *   NORTH:  Hostels (HJB, APJ), Grounds, Amul, Mess, MPH
 *   CENTER: Academic Pods (1A-1E), JC, Nescafe, Tea Post, Makerspace, CITC
 *   SOUTH:  LRC, LHC, La Fresco, AS Canteen, Yewale
 *   EAST:   Lake, Sports Complex
 *   WEST:   Hostels (CVR, VSB, DA)
 */

// ────────────────────────────────────────
// COLOR PALETTE (for building marker backgrounds)
// ────────────────────────────────────────
const COLORS = {
  hostel:     '#c2185b',  // deep pink
  academic:   '#e65100',  // deep orange
  dining:     '#4a148c',  // deep purple
  cafe:       '#00695c',  // teal
  library:    '#1565c0',  // blue
  landmark:   '#37474f',  // blue-grey
  sports:     '#2e7d32',  // green
  lab:        '#4527a0',  // deep purple
  lecture:    '#ad1457',  // pink
};

// ────────────────────────────────────────
// BUILDINGS — all campus locations
// ────────────────────────────────────────
export const BUILDINGS = [
  // ── HOSTELS ──
  {
    id: 'hjb-hostel',
    name: 'HJB Hostel',
    description: 'HJB Vibes',
    category: 'hostel',
    coordinates: [75.9148, 22.5232],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=HJB`,
    width: 80,
    height: 65
  },
  {
    id: 'apj-hostel',
    name: 'APJ Hostel',
    description: 'AC Hostel',
    category: 'hostel',
    coordinates: [75.9172, 22.5232],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=APJ`,
    width: 80,
    height: 65
  },
  {
    id: 'hostel-cv',
    name: 'CVR Hostel',
    description: 'CVR block memories',
    category: 'hostel',
    coordinates: [75.9148, 22.5205],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=CVR`,
    width: 80,
    height: 65
  },
  {
    id: 'vsb-hostel',
    name: 'VSB Hostel',
    description: 'VSB community',
    category: 'hostel',
    coordinates: [75.9172, 22.5205],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=VSB`,
    width: 80,
    height: 65
  },
  {
    id: 'da-hostel',
    name: 'DA Hostel',
    description: 'DA hostel vibes',
    category: 'hostel',
    coordinates: [75.9195, 22.5205],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=DA`,
    width: 80,
    height: 65
  },
  {
    id: 'hostel-hj',
    name: 'Homi Bhabha Hostel',
    description: 'Homi Bhabha community',
    category: 'hostel',
    coordinates: [75.9195, 22.5232],
    img: `https://placehold.co/100x80/${COLORS.hostel.slice(1)}/FFFFFF?text=Homi+Bhabha`,
    width: 90,
    height: 65
  },

  // ── DINING & CAFES ──
  {
    id: 'mess',
    name: 'Central Dining Facility',
    description: 'The heart of campus food',
    category: 'dining',
    coordinates: [75.9170, 22.5248],
    img: `https://placehold.co/120x70/${COLORS.dining.slice(1)}/FFFFFF?text=Mess`,
    width: 100,
    height: 60
  },
  {
    id: 'amul',
    name: 'Amul',
    description: 'Ice cream and milkshakes spot',
    category: 'cafe',
    coordinates: [75.9148, 22.5248],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=Amul`,
    width: 60,
    height: 50
  },
  {
    id: 'tea-post',
    name: 'Tea Post',
    description: 'Chai and conversations',
    category: 'cafe',
    coordinates: [75.9220, 22.5240],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=Tea+Post`,
    width: 65,
    height: 50
  },
  {
    id: 'jc',
    name: 'JC (Juice Corner)',
    description: 'Juice Corner hangout',
    category: 'cafe',
    coordinates: [75.9232, 22.5218],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=JC`,
    width: 60,
    height: 50
  },
  {
    id: 'nescafe',
    name: 'Nescafe',
    description: 'Coffee and evening chats',
    category: 'cafe',
    coordinates: [75.9250, 22.5192],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=Nescafe`,
    width: 65,
    height: 50
  },
  {
    id: 'la-fresco',
    name: 'La Fresco',
    description: 'Quick food and memories',
    category: 'cafe',
    coordinates: [75.9210, 22.5155],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=La+Fresco`,
    width: 70,
    height: 50
  },
  {
    id: 'as-canteen',
    name: 'AS Canteen',
    description: 'Affordable snacks',
    category: 'cafe',
    coordinates: [75.9155, 22.5162],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=AS+Canteen`,
    width: 70,
    height: 50
  },
  {
    id: 'yewale',
    name: 'Yewale',
    description: 'Famous tea spot',
    category: 'cafe',
    coordinates: [75.9180, 22.5162],
    img: `https://placehold.co/70x60/${COLORS.cafe.slice(1)}/FFFFFF?text=Yewale`,
    width: 65,
    height: 50
  },

  // ── ACADEMIC PODS ──
  {
    id: 'pod-1a',
    name: 'POD 1A',
    description: 'Academic block',
    category: 'academic',
    coordinates: [75.9240, 22.5215],
    img: `https://placehold.co/80x80/${COLORS.academic.slice(1)}/FFFFFF?text=POD+1A`,
    width: 70,
    height: 70
  },
  {
    id: 'pod-1b',
    name: 'POD 1B',
    description: 'Academic block',
    category: 'academic',
    coordinates: [75.9258, 22.5215],
    img: `https://placehold.co/80x80/${COLORS.academic.slice(1)}/FFFFFF?text=POD+1B`,
    width: 70,
    height: 70
  },
  {
    id: 'pod-1c',
    name: 'POD 1C',
    description: 'Academic block',
    category: 'academic',
    coordinates: [75.9240, 22.5192],
    img: `https://placehold.co/80x80/${COLORS.academic.slice(1)}/FFFFFF?text=POD+1C`,
    width: 70,
    height: 70
  },
  {
    id: 'pod-1d',
    name: 'POD 1D',
    description: 'Academic block',
    category: 'academic',
    coordinates: [75.9258, 22.5192],
    img: `https://placehold.co/80x80/${COLORS.academic.slice(1)}/FFFFFF?text=POD+1D`,
    width: 70,
    height: 70
  },
  {
    id: 'pod-1e',
    name: 'POD 1E',
    description: 'Academic block',
    category: 'academic',
    coordinates: [75.9275, 22.5192],
    img: `https://placehold.co/80x80/${COLORS.academic.slice(1)}/FFFFFF?text=POD+1E`,
    width: 70,
    height: 70
  },

  // ── LHC ──
  {
    id: 'lhc',
    name: 'Lecture Hall Complex (LHC)',
    description: 'Lecture Hall Complex',
    category: 'lecture',
    coordinates: [75.9295, 22.5210],
    img: '/images/map/lhc.png',
    width: 140,
    height: 100
  },

  // ── LRC / LIBRARY ──
  {
    id: 'lrc',
    name: 'Learning Resource Center (LRC)',
    description: 'Central Library',
    category: 'library',
    coordinates: [75.9250, 22.5160],
    img: `https://placehold.co/150x80/${COLORS.library.slice(1)}/FFFFFF?text=LRC`,
    width: 130,
    height: 70
  },

  // ── LANDMARKS ──
  {
    id: 'mph',
    name: 'MPH',
    description: 'Multi-Purpose Hall',
    category: 'landmark',
    coordinates: [75.9200, 22.5248],
    img: `https://placehold.co/80x70/${COLORS.landmark.slice(1)}/FFFFFF?text=MPH`,
    width: 70,
    height: 60
  },
  {
    id: 'abhinandan',
    name: 'Abhinandan Bhavan',
    description: 'Admin & visitor center',
    category: 'landmark',
    coordinates: [75.9220, 22.5270],
    img: `https://placehold.co/110x70/${COLORS.landmark.slice(1)}/FFFFFF?text=Abhinandan`,
    width: 95,
    height: 60
  },

  // ── TECH / INNOVATION ──
  {
    id: 'makerspace',
    name: 'Makerspace',
    description: 'Innovation and prototyping hub',
    category: 'lab',
    coordinates: [75.9275, 22.5235],
    img: `https://placehold.co/90x70/${COLORS.lab.slice(1)}/FFFFFF?text=Makerspace`,
    width: 80,
    height: 60
  },
  {
    id: 'citc',
    name: 'CITC',
    description: 'Central IT Center',
    category: 'lab',
    coordinates: [75.9300, 22.5235],
    img: `https://placehold.co/90x70/${COLORS.lab.slice(1)}/FFFFFF?text=CITC`,
    width: 80,
    height: 60
  },

  // ── SPORTS ──
  {
    id: 'sports-complex',
    name: 'Sports Complex',
    description: 'Indoor sports facilities',
    category: 'sports',
    coordinates: [75.9150, 22.5162],
    img: `https://placehold.co/100x60/${COLORS.sports.slice(1)}/FFFFFF?text=Sports`,
    width: 0,  // hidden - shown as polygon
    height: 0
  },
];


// ────────────────────────────────────────
// CAMPUS GEOJSON — roads, water, grounds, green areas
// ────────────────────────────────────────
export const CAMPUS_GEOJSON = {
  type: 'FeatureCollection',
  features: [

    // ═══════════════════════════════════════
    // GREEN / GRASS AREAS
    // ═══════════════════════════════════════
    {
      type: 'Feature',
      properties: { type: 'grass', name: 'Campus Bounds' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9080, 22.5300],
          [75.9380, 22.5300],
          [75.9380, 22.5100],
          [75.9080, 22.5100],
          [75.9080, 22.5300]
        ]]
      }
    },
    // Hostel lawn
    {
      type: 'Feature',
      properties: { type: 'grass', name: 'Hostel Green' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9143, 22.5245],
          [75.9200, 22.5245],
          [75.9200, 22.5198],
          [75.9143, 22.5198],
          [75.9143, 22.5245]
        ]]
      }
    },
    // Academic lawn
    {
      type: 'Feature',
      properties: { type: 'grass', name: 'Academic Green' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9230, 22.5225],
          [75.9305, 22.5225],
          [75.9305, 22.5180],
          [75.9230, 22.5180],
          [75.9230, 22.5225]
        ]]
      }
    },

    // ═══════════════════════════════════════
    // WATER BODIES
    // ═══════════════════════════════════════
    // Main Lake (east-south of campus)
    {
      type: 'Feature',
      properties: { type: 'water', name: 'Campus Lake' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9270, 22.5148],
          [75.9280, 22.5155],
          [75.9300, 22.5158],
          [75.9318, 22.5155],
          [75.9325, 22.5145],
          [75.9320, 22.5132],
          [75.9305, 22.5125],
          [75.9285, 22.5124],
          [75.9272, 22.5128],
          [75.9265, 22.5138],
          [75.9270, 22.5148]
        ]]
      }
    },
    // Small pond near hostels
    {
      type: 'Feature',
      properties: { type: 'water', name: 'Hostel Pond' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9135, 22.5195],
          [75.9142, 22.5198],
          [75.9148, 22.5196],
          [75.9146, 22.5190],
          [75.9138, 22.5188],
          [75.9133, 22.5192],
          [75.9135, 22.5195]
        ]]
      }
    },

    // ═══════════════════════════════════════
    // SPORTS FIELDS
    // ═══════════════════════════════════════
    // Main Cricket/Football Ground (north of hostels)
    {
      type: 'Feature',
      properties: { type: 'sports_field', name: 'Main Ground' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9155, 22.5262],
          [75.9190, 22.5262],
          [75.9190, 22.5252],
          [75.9155, 22.5252],
          [75.9155, 22.5262]
        ]]
      }
    },
    // APJ Ground (between hostels)
    {
      type: 'Feature',
      properties: { type: 'sports_field', name: 'APJ Ground' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9208, 22.5230],
          [75.9225, 22.5230],
          [75.9225, 22.5205],
          [75.9208, 22.5205],
          [75.9208, 22.5230]
        ]]
      }
    },
    // Sports Complex Area (south-west)
    {
      type: 'Feature',
      properties: { type: 'sports_field', name: 'Sports Complex' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9130, 22.5172],
          [75.9170, 22.5172],
          [75.9170, 22.5152],
          [75.9130, 22.5152],
          [75.9130, 22.5172]
        ]]
      }
    },

    // ═══════════════════════════════════════
    // BUILDING FOOTPRINTS (subtle fill polygons)
    // ═══════════════════════════════════════
    // LRC building footprint
    {
      type: 'Feature',
      properties: { type: 'building', name: 'LRC' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9235, 22.5167],
          [75.9268, 22.5167],
          [75.9268, 22.5155],
          [75.9235, 22.5155],
          [75.9235, 22.5167]
        ]]
      }
    },
    // LHC building footprint
    {
      type: 'Feature',
      properties: { type: 'building', name: 'LHC' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.9285, 22.5222],
          [75.9310, 22.5222],
          [75.9310, 22.5200],
          [75.9285, 22.5200],
          [75.9285, 22.5222]
        ]]
      }
    },

    // ═══════════════════════════════════════
    // MAIN ROADS
    // ═══════════════════════════════════════

    // --- Ring Road (the main loop around campus) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Ring Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9120, 22.5200],
          [75.9125, 22.5240],
          [75.9140, 22.5265],
          [75.9170, 22.5280],
          [75.9220, 22.5290],
          [75.9270, 22.5280],
          [75.9310, 22.5265],
          [75.9330, 22.5240],
          [75.9340, 22.5200],
          [75.9330, 22.5160],
          [75.9310, 22.5135],
          [75.9280, 22.5118],
          [75.9240, 22.5110],
          [75.9200, 22.5118],
          [75.9170, 22.5135],
          [75.9140, 22.5155],
          [75.9125, 22.5175],
          [75.9120, 22.5200]
        ]
      }
    },

    // --- Central Avenue (north-south spine) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Central Avenue' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5290],
          [75.9220, 22.5270],
          [75.9220, 22.5248],
          [75.9220, 22.5225],
          [75.9220, 22.5200],
          [75.9220, 22.5175],
          [75.9220, 22.5155],
          [75.9220, 22.5130],
          [75.9220, 22.5110]
        ]
      }
    },

    // --- Hostel Road (west side, connecting hostels) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Hostel Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9140, 22.5265],
          [75.9143, 22.5248],
          [75.9143, 22.5230],
          [75.9143, 22.5210],
          [75.9143, 22.5195],
          [75.9140, 22.5175],
          [75.9140, 22.5155]
        ]
      }
    },

    // --- Academic Road (east side, connecting pods & LHC) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Academic Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9310, 22.5265],
          [75.9310, 22.5245],
          [75.9310, 22.5225],
          [75.9310, 22.5205],
          [75.9310, 22.5180],
          [75.9310, 22.5160],
          [75.9310, 22.5135]
        ]
      }
    },

    // --- Cross Road North (connecting hostel area to academic area) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'North Cross Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9143, 22.5248],
          [75.9170, 22.5248],
          [75.9200, 22.5248],
          [75.9220, 22.5248],
          [75.9250, 22.5248],
          [75.9280, 22.5248],
          [75.9310, 22.5245]
        ]
      }
    },

    // --- Cross Road South (connecting sports to lake) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'South Cross Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9140, 22.5155],
          [75.9170, 22.5162],
          [75.9200, 22.5165],
          [75.9220, 22.5168],
          [75.9250, 22.5168],
          [75.9280, 22.5165],
          [75.9310, 22.5160]
        ]
      }
    },

    // --- Pod Connector Road (horizontal through academic zone) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Pod Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5205],
          [75.9235, 22.5205],
          [75.9250, 22.5205],
          [75.9265, 22.5205],
          [75.9280, 22.5205],
          [75.9295, 22.5205],
          [75.9310, 22.5205]
        ]
      }
    },

    // --- Gate Road (main entrance) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Gate Road' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5290],
          [75.9220, 22.5310],
          [75.9220, 22.5330]
        ]
      }
    },

    // --- Hostel Cross Road (horizontal between hostel blocks) ---
    {
      type: 'Feature',
      properties: { type: 'road', name: 'Hostel Cross' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9143, 22.5220],
          [75.9160, 22.5220],
          [75.9175, 22.5220],
          [75.9195, 22.5220],
          [75.9210, 22.5220],
          [75.9220, 22.5220]
        ]
      }
    },

    // ═══════════════════════════════════════
    // FOOTPATHS
    // ═══════════════════════════════════════

    // Hostel to Mess walk
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Mess Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9150, 22.5235],
          [75.9160, 22.5240],
          [75.9165, 22.5245]
        ]
      }
    },

    // POD walkway (connecting all pods)
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'POD Walkway' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9232, 22.5220],
          [75.9245, 22.5220],
          [75.9260, 22.5220],
          [75.9275, 22.5220],
          [75.9290, 22.5220]
        ]
      }
    },

    // Lake promenade
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Lake Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9260, 22.5168],
          [75.9268, 22.5160],
          [75.9275, 22.5150],
          [75.9285, 22.5142],
          [75.9298, 22.5138],
          [75.9310, 22.5140],
          [75.9318, 22.5148],
          [75.9322, 22.5158],
          [75.9310, 22.5160]
        ]
      }
    },

    // Nescafe path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Nescafe Path' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9250, 22.5205],
          [75.9252, 22.5198],
          [75.9252, 22.5192]
        ]
      }
    },

    // JC path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'JC Path' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5225],
          [75.9228, 22.5222],
          [75.9232, 22.5218]
        ]
      }
    },

    // Tea Post path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Tea Post Path' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5248],
          [75.9222, 22.5243],
          [75.9222, 22.5240]
        ]
      }
    },

    // Makerspace & CITC path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Innovation Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9275, 22.5248],
          [75.9278, 22.5242],
          [75.9278, 22.5238],
          [75.9290, 22.5238],
          [75.9300, 22.5238]
        ]
      }
    },

    // LRC path from academic area
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Library Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9250, 22.5185],
          [75.9250, 22.5175],
          [75.9250, 22.5168]
        ]
      }
    },

    // La Fresco path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'La Fresco Path' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5168],
          [75.9215, 22.5162],
          [75.9212, 22.5158]
        ]
      }
    },

    // AS Canteen & Yewale path
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Canteen Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9143, 22.5175],
          [75.9150, 22.5170],
          [75.9155, 22.5165],
          [75.9165, 22.5165],
          [75.9180, 22.5165]
        ]
      }
    },

    // Sports Complex path from hostel road
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Sports Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9143, 22.5195],
          [75.9140, 22.5185],
          [75.9140, 22.5175],
          [75.9145, 22.5168]
        ]
      }
    },

    // Abhinandan to Gate
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Gate Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9220, 22.5270],
          [75.9215, 22.5278],
          [75.9218, 22.5288]
        ]
      }
    },

    // Ground to Mess
    {
      type: 'Feature',
      properties: { type: 'footpath', name: 'Ground Walk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [75.9170, 22.5252],
          [75.9172, 22.5255],
          [75.9172, 22.5260]
        ]
      }
    },
  ]
};
