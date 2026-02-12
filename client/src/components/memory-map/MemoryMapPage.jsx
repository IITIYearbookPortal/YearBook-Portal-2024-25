import { useState, useContext, useMemo, useEffect } from 'react';
import CampusMap from './CampusMap';
import SeniorSelector from './SeniorSelector';
import MemoryModal from './MemoryModal';
import PrintSummary from './PrintSummary';
import { Button } from '../../components/ui/button';
import { Printer, MapPin, Heart } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import axios from 'axios';
import './MemoryMapPage.css';
import { LoginContext } from '../../helpers/Context';
import jwt_decode from 'jwt-decode';
import { CampusDataProvider } from './memoryMapContext';

function MemoryMapPage() {
  const [selectedSeniors, setSelectedSeniors] = useState([]); // CHANGED
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [memories, setMemories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let user = {};
  if (window.localStorage.getItem('token') !== null) {
    user = jwt_decode(window.localStorage.getItem('token'));
  }

  if (Object.keys(user).length === 0) {
    window.location.href = '/';
  }

  const authorName = user?.name;

  const { allUsers } = useContext(LoginContext);

  const seniors = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.map((u) => ({
      id: u.email,
      name: u.name,
      department: u.department,
      avatar: u.profile_img,
      graduationYear: 2025,
    }));
  }, [allUsers]);

  const selectedSeniorIds = useMemo(
    () => selectedSeniors.map((s) => s.id),
    [selectedSeniors]
  );

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/memories`
        );
        setMemories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMemories();
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleAddMemory = async (formData) => {
  try {
    formData.append('authorName', authorName);

    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/create-memory`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    setMemories((prev) => [...prev, res.data]);

    toast({
      title: 'Memory added 💫',
      description: 'Your memory has been saved.',
    });
  } catch (err) {
    console.error(err);
    toast({
      title: 'Error',
      description: 'Failed to save memory',
      variant: 'destructive',
    });
  }
};


  const handlePrint = () => {
    if (selectedSeniors.length === 0) {
      toast({
        title: 'Select seniors first',
        description: 'Please select at least one senior to print.',
        variant: 'destructive',
      });
      return;
    }
    window.print();
  };

  const seniorMemories = useMemo(() => {
    if (selectedSeniorIds.length === 0) return memories;
    return memories.filter((m) =>
      selectedSeniorIds.includes(m.seniorId)
    );
  }, [memories, selectedSeniorIds]);

  return (
    <CampusDataProvider seniors={seniors} memories={memories}>
      <div className="mm-page min-h-screen">
        <header className="mm-header no-print">
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

              <Button
                onClick={handlePrint}
                variant="outline"
                className="mm-print-btn"
              >
                <Printer className="w-4 h-4" />
                <span className="mm-print-text">Print Summary</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="mm-main mm-container no-print">
          <div className="mm-hero">
            <h2 className="mm-hero-title">Memory Map- Where Memories Live</h2>
            <p className="mm-hero-sub">
              Click on any location to view memories or add your own.
            </p>
          </div>

          <div className="mm-grid">
            <aside className="mm-aside">
              <div className="mm-sticky">
                <SeniorSelector
                  seniors={seniors}
                  selectedSeniors={selectedSeniors}
                  onChange={setSelectedSeniors}     
                />

                <div className="mm-stats-card">
                  <div className="mm-stats-header">
                    <Heart className="mm-heart-icon" />
                    <h4 className="mm-stats-title">Memory Stats</h4>
                  </div>
                  <div className="mm-stats-grid">
                    <div>
                      <p className="mm-stats-number">
                        {seniorMemories.length}
                      </p>
                      <p className="mm-stats-label">Total Memories</p>
                    </div>
                    <div>
                      <p className="mm-stats-number">
                        {
                          new Set(
                            seniorMemories.map((m) => m.locationId)
                          ).size
                        }
                      </p>
                      <p className="mm-stats-label">Locations</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="mm-map-area">
              <div className="mm-map-wrapper">
                <CampusMap
                  selectedSeniorIds={selectedSeniorIds}
                  onLocationClick={handleLocationClick}
                  selectedLocationId={selectedLocation?.id}
                />
              </div>

              <div className="mm-instructions">
                <div className="mm-instr-item"><span className="mm-swatch mm-swatch-hostel" /> Hostels</div>
                <div className="mm-instr-item"><span className="mm-swatch mm-swatch-academic" /> Academic</div>
                <div className="mm-instr-item"><span className="mm-swatch mm-swatch-food" /> Food & Social</div>
                <div className="mm-instr-item"><span className="mm-swatch mm-swatch-sports" /> Sports</div>
                <div className="mm-instr-item"><span className="mm-swatch mm-swatch-labs" /> Labs</div>
              </div>
            </section>
          </div>
        </main>

        <MemoryModal
          location={selectedLocation}
          seniors={selectedSeniors}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLocation(null);
          }}
          onAddMemory={handleAddMemory}
        />

        {/* {selectedSeniors.length > 0 && (
          <PrintSummary
            seniors={selectedSeniors}
            memories={seniorMemories}
          />
        )} */}

        {/* {selectedSeniors.length > 0 && (
  <PrintSummary
    senior={selectedSeniors[0]}
    memories={seniorMemories}
  />
)} */}
<PrintSummary
  seniors={seniors}
  memories={memories}
/>

      </div>
    </CampusDataProvider>
  );
}

export default MemoryMapPage;
