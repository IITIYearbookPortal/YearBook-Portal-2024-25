import React from 'react';
import { format } from 'date-fns';
import { useCampusData } from './memoryMapContext';
import './PrintSummary.css';

// function PrintSummary({ senior, memories }) {
//   // Group memories by location
//   const {getLocationById }= useCampusData();
//   const memoriesByLocation = memories.reduce((acc, memory) => {
//     const locationId = memory.locationId;
//     if (!acc[locationId]) acc[locationId] = [];
//     acc[locationId].push(memory);
//     return acc;
//   }, {});

//   return (
//     <div className="ps-print-container">
//       {/* Header */}
//       <header className="ps-header">
//         <h1 className="ps-title">Memory Map</h1>
//         <h2 className="ps-subtitle">{senior.name}</h2>
//         <p className="ps-meta">
//           {senior.department} • Class of {senior.graduationYear}
//         </p>
//         <p className="ps-generated">Generated on {format(new Date(), 'MMMM d, yyyy')}</p>
//       </header>

//       {/* Memories grouped by location */}
//       <div className="ps-locations">
//         {Object.entries(memoriesByLocation).map(([locationId, locationMemories]) => {
//           const location = getLocationById(locationId);
//           if (!location) return null;

//           return (
//             <section key={locationId} className="ps-location-section">
//               <div className="ps-location-header">
//                 <div className="ps-location-accent" />
//                 <div>
//                   <h3 className="ps-location-name">{location.name}</h3>
//                   <p className="ps-location-desc">{location.description}</p>
//                 </div>
//               </div>

//               <div className="ps-memories-list">
//                 {locationMemories.map((memory) => (
//                   <article key={memory.id} className="ps-memory">
//                     <div className="ps-memory-head">
//                       <p className="ps-author">{memory.authorName}</p>
//                       <p className="ps-date">{format(new Date(memory.createdAt), 'MMM d, yyyy')}</p>
//                     </div>
//                     <p className="ps-memory-content">{memory.content}</p>
//                   </article>
//                 ))}
//               </div>
//             </section>
//           );
//         })}
//       </div>

//       {/* Footer */}
//       <footer className="ps-footer">
//         <p>With love from your college family ❤️</p>
//       </footer>
//     </div>
//   );
// }


function PrintSummary({ seniors, memories }) {

  if (!seniors || seniors.length === 0) return null;

  return (
    <div className="ps-print-container">
      <header className="ps-header">
        <h1 className="ps-title">Memory Map</h1>
        <p className="ps-generated">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </header>

      {seniors.map((senior) => {

        const seniorMemories = memories.filter(
          (m) => m.seniorId === senior.id
        );

        if (seniorMemories.length === 0) return null;

        return (
          <section key={senior.id} className="ps-senior-section">
            <h2 className="ps-senior-name">{senior.name}</h2>
            <p className="ps-meta">
              {senior.department} • Class of {senior.graduationYear}
            </p>

            {seniorMemories.map((memory) => (
              <article key={memory.id} className="ps-memory">
                <div className="ps-memory-head">
                  <p className="ps-author">{memory.authorName}</p>
                  <p className="ps-date">
                    {format(new Date(memory.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <p>{memory.content}</p>
              </article>
            ))}
          </section>
        );
      })}

      <footer className="ps-footer">
        <p>With love from your college family ❤️</p>
      </footer>
    </div>
  );
}


export default PrintSummary;