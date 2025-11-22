import { ParkingSpot, TimeBlock } from "./types";

// Helper to generate time blocks for a day
const generateTimeBlocks = (availableHours: number[]): TimeBlock[] => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    available: availableHours.includes(i),
  }));
};

// Mock parking spots data
export const mockSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "Private driveway near Memorial Union",
    address: "Langdon St · Madison, WI",
    lat: 43.0766,
    lng: -89.3992,
    pricePerHour: 3.0,
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop",
    ],
    features: ["Covered", "EV charger", "Max height 2.1 m"],
    description: "Convenient covered parking spot close to Memorial Union and campus.",
    instructions: "Park in the left side of driveway. Do not block sidewalk. Owner may need to access garage.",
    walkingDistance: 3,
    availability: [
      {
        date: "2025-11-22",
        timeBlocks: generateTimeBlocks([14, 15, 16, 17, 18, 19, 20, 21]),
      },
    ],
  },
  {
    id: "2",
    name: "Campus garage spot",
    address: "University Ave · Madison, WI",
    lat: 43.0747,
    lng: -89.4012,
    pricePerHour: 4.5,
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
    ],
    features: ["Covered", "24/7 access"],
    description: "Secure garage parking with easy campus access.",
    instructions: "Enter through main gate. Spot #42 on level 2. Gate code: 1234.",
    walkingDistance: 6,
    availability: [
      {
        date: "2025-11-22",
        timeBlocks: generateTimeBlocks([13, 14, 15, 16, 17, 18, 19, 20, 21, 22]),
      },
    ],
  },
  {
    id: "3",
    name: "Street parking on State St",
    address: "State St · Madison, WI",
    lat: 43.0755,
    lng: -89.3890,
    pricePerHour: 2.5,
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
    ],
    features: ["Outdoor"],
    description: "Convenient street parking on State Street.",
    instructions: "Park along the curb. Check street signs for restrictions.",
    walkingDistance: 8,
    availability: [
      {
        date: "2025-11-22",
        timeBlocks: generateTimeBlocks([14, 15, 16, 17, 18]),
      },
    ],
  },
  {
    id: "4",
    name: "Private lot behind apartment",
    address: "Gorham St · Madison, WI",
    lat: 43.0780,
    lng: -89.3945,
    pricePerHour: 3.5,
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop",
    ],
    features: ["Outdoor", "Well-lit"],
    description: "Safe parking lot behind apartment building.",
    instructions: "Enter from alley. Any unmarked spot is fine.",
    walkingDistance: 5,
    availability: [
      {
        date: "2025-11-22",
        timeBlocks: generateTimeBlocks([15, 16, 17, 18, 19, 20]),
      },
    ],
  },
  {
    id: "5",
    name: "Covered garage near library",
    address: "Park St · Madison, WI",
    lat: 43.0730,
    lng: -89.4020,
    pricePerHour: 5.0,
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
    ],
    features: ["Covered", "EV charger", "24/7 access"],
    description: "Premium covered parking with EV charging.",
    instructions: "Level 1, spot A15. Charger available at spot.",
    walkingDistance: 4,
    availability: [
      {
        date: "2025-11-22",
        timeBlocks: generateTimeBlocks([14, 15, 16, 17, 18, 19]),
      },
    ],
  },
];

// Mock location suggestions
export const mockLocationSuggestions = [
  {
    name: "Memorial Union",
    address: "800 Langdon St, Madison, WI 53706",
    lat: 43.0766,
    lng: -89.3992,
  },
  {
    name: "University of Wisconsin-Madison",
    address: "500 Lincoln Dr, Madison, WI 53706",
    lat: 43.0747,
    lng: -89.4012,
  },
  {
    name: "State Street",
    address: "State St, Madison, WI 53703",
    lat: 43.0755,
    lng: -89.3890,
  },
  {
    name: "Camp Randall Stadium",
    address: "1440 Monroe St, Madison, WI 53711",
    lat: 43.0702,
    lng: -89.4124,
  },
  {
    name: "Capitol Square",
    address: "2 E Main St, Madison, WI 53703",
    lat: 43.0747,
    lng: -89.3842,
  },
];
