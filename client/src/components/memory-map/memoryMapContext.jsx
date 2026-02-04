import { createContext, useContext, useMemo } from 'react';
import { campusLocations } from '../../data/CampusData';

const CampusDataContext = createContext(null);

export function CampusDataProvider({ seniors, memories, children }) {
  const value = useMemo(() => {
    const locationMap = new Map(campusLocations.map(l => [l.id, l]));
    const seniorMap = new Map(seniors.map(s => [s.id, s]));

    const getLocationById = (id) => locationMap.get(id) || null;
    const getSeniorById = (id) => seniorMap.get(id) || null;

    const getMemoriesForLocation = (locationId, seniorIds = []) => {
      const seenGroups = new Map();
      for (const m of memories) {
        if (m.locationId !== locationId) continue;
        if (seniorIds.length > 0 && !seniorIds.includes(m.seniorId)) continue;
        if (!seenGroups.has(m.groupId)) {
          seenGroups.set(m.groupId, m);
        }
      }
      return Array.from(seenGroups.values());
    };

    const getMemoryCountForLocation = (locationId, seniorIds = []) =>
      getMemoriesForLocation(locationId, seniorIds).length;

    return {
      locations: campusLocations,
      seniors,
      memories,
      getLocationById,
      getSeniorById,
      getMemoriesForLocation,
      getMemoryCountForLocation,
    };
  }, [seniors, memories]);

  return (
    <CampusDataContext.Provider value={value}>
      {children}
    </CampusDataContext.Provider>
  );
}

export const useCampusData = () => {
  const ctx = useContext(CampusDataContext);
  if (!ctx) {
    throw new Error('useCampusData must be used inside CampusDataProvider');
  }
  const {
    locations,
    seniors,
    memories,
    getLocationById,
    getSeniorById,
    getMemoriesForLocation,
    getMemoryCountForLocation,
  } = ctx;
  return {
    locations,
    seniors,
    memories,
    getLocationById,
    getSeniorById,
    getMemoriesForLocation,
    getMemoryCountForLocation,
  };
};

