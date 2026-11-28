import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Expand } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import './MemoryCard.css';

function MemoryCard({ memory, className = '' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const timeAgo = formatDistanceToNow(new Date(memory.createdAt), {
    addSuffix: true,
  });

  return (
    <article className={`mc-card ${className}`}>
      
      {/* Author Info */}
      <header className="mc-header">
        <div className="mc-avatar">
          <span className="mc-avatar-text">
            {memory.authorName.charAt(0)}
          </span>
        </div>

        <div>
          <p className="mc-author">{memory.authorName}</p>
          <p className="mc-time">{timeAgo}</p>
        </div>
      </header>

      {/* Content */}
      <p className="mc-content">
        {memory.content}
      </p>

      {/* Images */}
      {memory.images && memory.images.length > 0 && (
        <div
          className={`mc-image-grid ${
            memory.images.length === 1 ? 'mc-image-grid-single' : ''
          }`}
        >
          {memory.images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className="mc-image-box"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View full image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Memory image ${idx + 1}`}
                className="mc-image"
              />
              <span className="mc-image-expand" aria-hidden="true">
                <Expand className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={memory.images || []}
          initialIndex={lightboxIndex}
          caption={`Memory by ${memory.authorName}`}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Decorative quote icon */}
      <div className="mc-quote">
        <svg className="mc-quote-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
      </div>
    </article>
  );
}

export default MemoryCard;