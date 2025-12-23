import { createContext, useContext, useMemo } from 'react';
import { campusLocations } from '../../data/CampusData';

const CampusDataContext = createContext(null);

export function CampusDataProvider({ seniors, memories, children }) {
  const value = useMemo(() => {
    const locationMap = new Map(campusLocations.map(l => [l.id, l]));
    const seniorMap = new Map(seniors.map(s => [s.id, s]));

    const getLocationById = (id) => locationMap.get(id) || null;

    const getSeniorById = (id) => seniorMap.get(id) || null;

    const getMemoriesForLocation = (locationId, seniorId) =>
      memories.filter(
        m =>
          m.locationId === locationId &&
          (!seniorId || m.seniorId === seniorId)
      );

    const getMemoryCountForLocation = (locationId, seniorId) =>
      getMemoriesForLocation(locationId, seniorId).length;

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

