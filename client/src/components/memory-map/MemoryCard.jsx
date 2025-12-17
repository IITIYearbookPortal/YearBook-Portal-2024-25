import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import './MemoryCard.css';

function MemoryCard({ memory, className = '' }) {
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
        <div className="mc-image-grid">
          {memory.images.map((img, idx) => (
            <div key={idx} className="mc-image-box">
              <img 
                src={img}
                alt={`Memory image ${idx + 1}`}
                className="mc-image"
              />
            </div>
          ))}
        </div>
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
