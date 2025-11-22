export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  images: string[];
  features: string[];
  description: string;
  instructions: string;
  walkingDistance: number; // in minutes
  availability: {
    date: string;
    timeBlocks: TimeBlock[];
  }[];
}

export interface TimeBlock {
  hour: number; // 0-23
  available: boolean;
}

export interface SearchParams {
  location: string;
  lat?: number;
  lng?: number;
  from: Date;
  to: Date;
  filters?: {
    coveredOnly?: boolean;
  };
}

export interface Booking {
  spotId: string;
  spot: ParkingSpot;
  from: Date;
  to: Date;
  totalCost: number;
  parkingFee: number;
  serviceFee: number;
}
