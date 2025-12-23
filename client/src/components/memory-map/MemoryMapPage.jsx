import React, { useState } from 'react';
import { mockSeniors, mockMemories } from '../../data/CampusData';
import CampusMap from './CampusMap';
import SeniorSelector from './SeniorSelector';
import MemoryModal from './MemoryModal';
import PrintSummary from './PrintSummary';
import { Button } from '../../components/ui/button';
import { Printer, MapPin, Heart } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import './MemoryMapPage.css';

function MemoryMapPage() {
  const [selectedSenior, setSelectedSenior] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [memories, setMemories] = useState(mockMemories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
    console.log('Location clicked:', location)
  };

  const handleAddMemory = (newMemory) => {
    const memory = {
      ...newMemory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [...prev, memory]);

    toast({
      title: 'Memory added! 💫',
      description: 'Your memory has been saved to the map.',
    });
  };

  const handlePrint = () => {
    if (!selectedSenior) {
      toast({
        title: 'Select a senior first',
        description: 'Please select a senior to print their memory summary.',
        variant: 'destructive',
      });
      return;
    }
    window.print();
  };

  const seniorMemories = selectedSenior
    ? memories.filter((m) => m.seniorId === selectedSenior.id)
    : memories;

  return (
    <div className="mm-page min-h-screen">
      {/* Header */}
      {/* <header className="mm-header no-print">
        <div className="mm-container">
          <div className="mm-header-inner">
            <div className="mm-brand">
              <div className="mm-logo">
                <MapPin className="mm-logo-icon" />
              </div>
              <div>
                <h1 className="mm-title">Memory Map</h1>
                <p className="mm-sub">College Yearbook • Class of 2025</p>
              </div>
            </div>

            <Button onClick={handlePrint} variant="outline" className="mm-print-btn">
              <Printer className="w-4 h-4" />
              <span className="mm-print-text">Print Summary</span>
            </Button>
          </div>
        </div>
      </header> */}

      {/* Main content */}
      <main className="mm-main mm-container no-print">
        {/* Hero */}
        <div className="mm-hero">
          <h2 className="mm-hero-title">Memory Map- Where Memories Live</h2>
          <p className="mm-hero-sub">
            Click on any location to view memories or add your own. Each marker shows
            where stories have been shared about our graduating seniors.
          </p>
        </div>

        <div className="mm-grid">
          {/* Sidebar */}
          <aside className="mm-aside">
            <div className="mm-sticky">
              {/* <SeniorSelector
                seniors={mockSeniors}
                selectedSenior={selectedSenior}
                onSelect={setSelectedSenior}
              /> */}

              <div className="mm-stats-card">
                <div className="mm-stats-header">
                  <Heart className="mm-heart-icon" />
                  <h4 className="mm-stats-title">Memory Stats</h4>
                </div>
                <div className="mm-stats-grid">
                  <div>
                    <p className="mm-stats-number">{seniorMemories.length}</p>
                    <p className="mm-stats-label">Total Memories</p>
                  </div>
                  <div>
                    <p className="mm-stats-number">
                      {new Set(seniorMemories.map((m) => m.locationId)).size}
                    </p>
                    <p className="mm-stats-label">Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Map area */}
          <section className="mm-map-area">
            <div className="mm-map-wrapper">
              <CampusMap
                selectedSeniorId={selectedSenior?.id}
                onLocationClick={handleLocationClick}
                selectedLocationId={selectedLocation?.id}
              />
            </div>

            <div className="mm-instructions">
              <div className="mm-instr-item"><span className="mm-swatch mm-swatch-hostel" /> Hostels</div>
              <div className="mm-instr-item"><span className="mm-swatch mm-swatch-academic" /> Academic</div>
              <div className="mm-instr-item"><span className="mm-swatch mm-swatch-food" /> Food & Social</div>
              <div className="mm-instr-item"><span className="mm-swatch mm-swatch-sports" /> Sports</div>
              {/* <div className="mm-instr-item"><span className="mm-swatch mm-swatch-landmark" /> Landmarks</div> */}
              <div className="mm-instr-item"><span className="mm-swatch mm-swatch-labs" /> Labs</div>

            </div>
          </section>
        </div>
      </main>

      {/* Memory Modal */}
      <MemoryModal
        location={selectedLocation}
        senior={selectedSenior}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLocation(null);
        }}
        onAddMemory={handleAddMemory}
      />

      {/* Print Summary (only rendered if senior selected) */}
      {selectedSenior && (
        <PrintSummary senior={selectedSenior} memories={seniorMemories} />
      )}
    </div>
  );
}

export default MemoryMapPage;
