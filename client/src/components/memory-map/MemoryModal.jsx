import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../../components/ui/button';
import { useCampusData } from './memoryMapContext';
import MemoryCard from './MemoryCard';
import AddMemoryForm from './AddMemoryForm';
import { Plus, MapPin, X } from 'lucide-react';
import './MemoryModal.css';

function MemoryModal({location, senior, isOpen, onClose, onAddMemory }) {
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const { getMemoriesForLocation } = useCampusData();
  // Keep local scroll lock while modal open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Only render when open (or when adding/loading)
  if (!isOpen) return null;

  const memories = location ? getMemoriesForLocation(location.id, senior?.id) : [];

  const handleAddMemory = (data) => {
    onAddMemory({
      locationId: location?.id || '',
      seniorId: senior?.id || '',
      ...data,
    });
    setIsAddingMemory(false);
  };

  const content = (
    <div className="mmodal-portal">
      <div
        className="mmodal-overlay"
        onMouseDown={(e) => {
          // close when clicking overlay (but not when clicking inside the panel)
          if (e.target === e.currentTarget) {
            setIsAddingMemory(false);
            onClose();
          }
        }}
      />
      <div className="mmodal-panel" role="dialog" aria-modal="true" aria-label={location?.name || 'Memory modal'}>
        <button
          className="mmodal-close"
          aria-label="Close"
          onClick={() => {
            setIsAddingMemory(false);
            onClose();
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <header className="mmodal-header">
          <div className="mmodal-header-inner">
            <div>
              <h2 className="mmodal-title">{location?.name}</h2>
              <div className="mmodal-sub">
                <MapPin className="mmodal-pin" />
                <span className="mmodal-desc">{location?.description}</span>
              </div>
              {senior && location && (
                <p className="mmodal-senior">
                  Memories for <span className="mmodal-senior-name">{senior.name}</span>
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="mmodal-body">
          {isAddingMemory ? (
            <div className="mmodal-add">
              <AddMemoryForm
                onSubmit={handleAddMemory}
                onCancel={() => setIsAddingMemory(false)}
              />
            </div>
          ) : (
            <>
              {!location || memories.length === 0 ? (
                <div className="mmodal-empty">
                  <div className="mmodal-empty-icon">
                    <MapPin className="mmodal-empty-pin" />
                  </div>
                  <h3 className="mmodal-empty-title">No memories here yet</h3>
                  <p className="mmodal-empty-text">
                    Be the first to share a memory about {senior?.name || 'this senior'} at {location?.name || 'this location'}!
                  </p>
                  <Button onClick={() => setIsAddingMemory(true)} className="mmodal-btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Memory
                  </Button>
                </div>
              ) : (
                <div className="mmodal-list">
                  {memories.map((memory, index) => (
                    <div
                      key={memory.id}
                      className="mmodal-list-item"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <MemoryCard memory={memory} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!isAddingMemory && memories.length > 0 && (
          <div className="mmodal-footer">
            <Button onClick={() => setIsAddingMemory(true)} className="mmodal-btn-primary full">
              <Plus className="w-4 h-4 mr-2" />
              Add Your Memory
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Render portal into document.body
  return typeof document !== 'undefined' ? ReactDOM.createPortal(content, document.body) : null;
}

export default MemoryModal;
