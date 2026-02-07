import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../../components/ui/button';
import { useCampusData } from './memoryMapContext';
import MemoryCard from './MemoryCard';
import AddMemoryForm from './AddMemoryForm';
import { Plus, MapPin, X } from 'lucide-react';
import './MemoryModal.css';

function MemoryModal({ location, seniors, isOpen, onClose, onAddMemory }) {
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const { getMemoriesForLocation } = useCampusData();
  const seniorIds = useMemo(
    () => seniors.map((s) => s.id),
    [seniors]
  );

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const memories = location
    ? getMemoriesForLocation(location.id, seniorIds)
    : [];

  const handleAddMemory = async (formData) => {
  if (seniorIds.length === 0) return;

  formData.append('locationId', location?.id || '');
  formData.append('seniorIds', JSON.stringify(seniorIds));

  await onAddMemory(formData);
  setIsAddingMemory(false);
};

  const headerText =
    seniorIds.length === 0
      ? 'All Seniors'
      : seniorIds.length === 1
      ? seniors[0]?.name
      : `${seniorIds.length} Seniors`;

  const content = (
    <div className="mmodal-portal">
      <div
        className="mmodal-overlay"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setIsAddingMemory(false);
            onClose();
          }
        }}
      />
      <div
        className="mmodal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={location?.name || 'Memory modal'}
      >
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
              {location && (
                <p className="mmodal-senior">
                  Memories for{' '}
                  <span className="mmodal-senior-name">{headerText}</span>
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
                    Be the first to share a memory at{' '}
                    {location?.name || 'this location'}!
                  </p>
                  <Button
                    onClick={() => setIsAddingMemory(true)}
                    className="mmodal-btn-primary"
                  >
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
            <Button
              onClick={() => setIsAddingMemory(true)}
              className="mmodal-btn-primary full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Memory
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(content, document.body)
    : null;
}

export default MemoryModal;