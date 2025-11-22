"use client";

import React, { createContext, useContext, useState } from "react";
import { SearchParams, Booking, ParkingSpot } from "../types";

interface AppContextType {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  selectedSpot: ParkingSpot | null;
  setSelectedSpot: (spot: ParkingSpot | null) => void;
  booking: Booking | null;
  setBooking: (booking: Booking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  return (
    <AppContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedSpot,
        setSelectedSpot,
        booking,
        setBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
