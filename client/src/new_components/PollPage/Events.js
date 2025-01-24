import React, { useState } from 'react';
import './Events.css';

// EventCard Component
const EventCard = ({ image, title, description, rollNo, name, branch, department }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`event-card ${isHovered ? 'active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="event-card-inner">
        <div className="event-front">
          <img src={image}  className="event-image" />
        </div>
        <div className="event-back">
          <h3 className="event-name">{title}</h3>
          <p className="event-description">{description}</p>
          <div className="event-details">
            <p><strong>Roll No:</strong> {rollNo}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Branch:</strong> {branch}</p>
            <p><strong>Department:</strong> {department}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Events Component (only displays one event card)
const Events = ({ event }) => {
  return (
    
      <div >
        {event ? (
          <EventCard
            image={event.image}
            title={event.title}
            description={event.description}
            rollNo={event.rollNo}
            name={event.name}
            branch={event.branch}
            department={event.department}
          />
        ) : (
          <p>No event available.</p>
        )}
      </div>
    
  );
};

export { Events };
