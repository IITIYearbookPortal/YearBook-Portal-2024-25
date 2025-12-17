// src/data/CampusData.js

export const campusLocations = [
  { id: 'amul', name: 'Amul', type: 'cafe', description: 'Ice cream and milkshakes spot', x: 5, y: 7, width: 10, height: 12 },
  { id: 'mess', name: 'Mess', type: 'mess', description: 'The heart of campus food', x: 17, y: 7, width: 13, height: 12 },
  { id: 'mph', name: 'MPH', type: 'landmark', description: 'Multi-Purpose Hall', x: 32, y: 7, width: 10, height: 10 },
  { id: 'jc', name: 'JC', type: 'cafe', description: 'Juice Corner hangout', x: 31, y: 18, width: 11, height: 6 },
  { id: 'tea-post', name: 'Tea Post', type: 'cafe', description: 'Chai and conversations', x: 44, y: 7, width: 8, height: 10 },
  { id: 'makerspace', name: 'Makerspace', type: 'pod', description: 'Innovation and prototyping hub', x: 68, y: 7, width: 12, height: 10 },
  { id: 'citc', name: 'CITC', type: 'pod', description: 'Central IT Center', x: 83, y: 7, width: 12, height: 10 },

  { id: 'hjb-hostel', name: 'HJB Hostel', type: 'hostel', description: 'HJB Vibes', x: 2, y: 24, width: 8, height: 14 },
  { id: 'ground', name: 'Ground', type: 'ground', description: 'Sports ground', x: 11, y: 24, width: 8, height: 14 },
  { id: 'apj-hostel', name: 'APJ Hostel', type: 'hostel', description: 'AC Hostel', x: 20, y: 24, width: 9, height: 14 },
  { id: 'apj-ground', name: 'APJ Ground', type: 'ground', description: 'APJ Hostel playground', x: 30, y: 25, width: 12, height: 25 },
  { id: 'pod-1b', name: 'POD 1B', type: 'pod', description: 'Academic block', x: 44, y: 20, width: 11, height: 19 },
  { id: 'pod-1a', name: 'POD 1A', type: 'pod', description: 'Academic block', x: 58, y: 18, width: 11, height: 14 },
  { id: 'lhc', name: 'LHC', type: 'lecture_hall', description: 'Lecture Hall Complex', x: 80, y: 18, width: 16, height: 50 },

  { id: 'cvr-hostel', name: 'CVR Hostel', type: 'hostel', description: 'CVR block memories', x: 2, y: 42, width: 8, height: 14 },
  { id: 'vsb-hostel', name: 'VSB Hostel', type: 'hostel', description: 'VSB community', x: 11, y: 42, width: 8, height: 14 },
  { id: 'da-hostel', name: 'DA Hostel', type: 'hostel', description: 'DA hostel vibes', x: 20, y: 42, width: 9, height: 14 },
  { id: 'la-fresco', name: 'La Fresco', type: 'cafe', description: 'Quick food and memories', x: 30, y: 60, width: 11, height: 12 },
  { id: 'nescafe', name: 'Nescafe', type: 'cafe', description: 'Coffee and evening chats', x: 58, y: 34, width: 11, height: 10 },

  { id: 'pod-1c', name: 'POD 1C', type: 'pod', description: 'Academic block', x: 44, y: 44, width: 11, height: 19 },
  { id: 'pod-1d', name: 'POD 1D', type: 'pod', description: 'Academic block', x: 56, y: 46, width: 10, height: 16 },
  { id: 'pod-1e', name: 'POD 1E', type: 'pod', description: 'Academic block', x: 67, y: 46, width: 10, height: 16 },

  { id: 'as-canteen', name: 'AS Canteen', type: 'cafe', description: 'Affordable snacks', x: 7, y: 60, width: 11, height: 10 },
  { id: 'yewale', name: 'Yewale', type: 'cafe', description: 'Famous tea spot', x: 19, y: 60, width: 10, height: 10 },
  { id: 'lrc', name: 'LRC', type: 'library', description: 'Learning Resource Center', x: 45, y: 66, width: 32, height: 10 },
  { id: 'sports-complex', name: 'Sports Complex', type: 'sports', description: 'Indoor sports facilities', x: 8, y: 72, width: 20, height: 14 },
  { id: 'lake', name: 'Lake', type: 'lake', description: 'Peaceful lake views', x: 48, y: 80, width: 25, height: 14 },
];

export const mockSeniors = [
  { id: 'senior-1', name: 'Priya Sharma', department: 'Computer Science', graduationYear: 2024 },
  { id: 'senior-2', name: 'Rahul Verma', department: 'Electrical Engineering', graduationYear: 2024 },
  { id: 'senior-3', name: 'Ananya Patel', department: 'Mechanical Engineering', graduationYear: 2024 },
  { id: 'senior-4', name: 'Arjun Reddy', department: 'Civil Engineering', graduationYear: 2024 },
];

export const mockMemories = [
  {
    id: 'mem-1',
    locationId: 'hjb-hostel',
    seniorId: 'senior-1',
    authorName: 'Neha Gupta',
    content: "Remember those late-night chai sessions on the terrace? We solved all the world's problems there, Priya! Your room was basically our unofficial hangout spot. Miss those days already. 💫",
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'mem-2',
    locationId: 'lhc',
    seniorId: 'senior-1',
    authorName: 'Amit Kumar',
    content: 'That presentation in LHC where your slides crashed and you delivered the entire thing from memory. Pure legend status! Professor was so impressed he gave you extra marks.',
    images: [],
    createdAt: '2024-03-14T15:20:00Z',
  },
  {
    id: 'mem-3',
    locationId: 'mess',
    seniorId: 'senior-2',
    authorName: 'Vikram Singh',
    content: "Rahul bhai, the mess will never be the same without your food reviews! \"Today's paneer is giving 3.5/5 vibes\" - iconic. Thanks for making meal times entertaining.",
    createdAt: '2024-03-13T19:45:00Z',
  },
  {
    id: 'mem-4',
    locationId: 'ground',
    seniorId: 'senior-2',
    authorName: 'Ravi Teja',
    content: 'That last-ball six in the inter-hostel finals! We carried you around the ground for an hour. The ground remembers, and so do we. What a player, what a captain! 🏏',
    createdAt: '2024-03-12T20:00:00Z',
  },
  {
    id: 'mem-5',
    locationId: 'lrc',
    seniorId: 'senior-3',
    authorName: 'Shruti Menon',
    content: "Ananya di, you literally had your reserved spot in the LRC. Section C, third row, corner seat. Whenever we needed motivation to study, we'd just look at you grinding. True inspiration!",
    createdAt: '2024-03-11T14:30:00Z',
  },
  {
    id: 'mem-6',
    locationId: 'nescafe',
    seniorId: 'senior-1',
    authorName: 'Karan Malhotra',
    content: "Every coffee at Nescafe reminds me of our startup brainstorming sessions. You'd sketch ideas on napkins and explain them with such passion. Some of those napkin ideas are now actual products!",
    createdAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'mem-7',
    locationId: 'sports-complex',
    seniorId: 'senior-4',
    authorName: 'Deepak Nair',
    content: "Arjun, teaching me badminton at 6 AM before classes - you had the patience of a saint! Still can't believe I went from \"which side do I hold the racket\" to actually winning a match.",
    createdAt: '2024-03-09T08:15:00Z',
  },
  {
    id: 'mem-8',
    locationId: 'lake',
    seniorId: 'senior-3',
    authorName: 'Maya Krishnan',
    content: "The sunset photography sessions at the lake were magical! You taught me that the golden hour isn't just about light - it's about being present. Those photos are now my most treasured possessions.",
    createdAt: '2024-03-08T18:30:00Z',
  },
  {
    id: 'mem-9',
    locationId: 'tea-post',
    seniorId: 'senior-2',
    authorName: 'Sanjay Kumar',
    content: "Tea Post gossip sessions with you were legendary! We'd sit there for hours just watching people and making up stories about them. Best stress relief ever.",
    createdAt: '2024-03-07T16:00:00Z',
  },
  {
    id: 'mem-10',
    locationId: 'makerspace',
    seniorId: 'senior-1',
    authorName: 'Pooja Iyer',
    content: "Remember when we stayed up 48 hours straight in Makerspace finishing our project? You kept everyone motivated with your energy. That prototype won first place!",
    createdAt: '2024-03-06T09:00:00Z',
  },
];

export function getMemoriesForLocation(locationId, seniorId) {
  return mockMemories.filter(m =>
    m.locationId === locationId &&
    (seniorId ? m.seniorId === seniorId : true)
  );
}

export function getMemoryCountForLocation(locationId, seniorId) {
  return getMemoriesForLocation(locationId, seniorId).length;
}

export function getLocationById(locationId) {
  return campusLocations.find(l => l.id === locationId);
}

export function getSeniorById(seniorId) {
  return mockSeniors.find(s => s.id === seniorId);
}
