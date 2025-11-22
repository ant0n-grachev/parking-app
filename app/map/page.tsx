"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/context/AppContext";
import { mockSpots } from "@/lib/mockData";
import { format } from "date-fns";
import { ParkingSpot } from "@/lib/types";
import { BottomNav } from "@/components/BottomNav";

export default function MapPage() {
  const router = useRouter();
  const { searchParams, setSelectedSpot } = useApp();
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  // Filter spots based on search params
  const filteredSpots = mockSpots.filter((spot) => {
    if (searchParams?.filters?.coveredOnly) {
      return spot.features.includes("Covered");
    }
    return true;
  });

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpotId(spot.id);
    setSelectedSpot(spot);
  };

  const handleCardClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    router.push(`/spot/${spot.id}`);
  };

  const centerLat = searchParams?.lat || 43.0766;
  const centerLng = searchParams?.lng || -89.3992;

  const calculateTotal = (spot: ParkingSpot) => {
    if (!searchParams) return 0;
    const hours = Math.ceil(
      (searchParams.to.getTime() - searchParams.from.getTime()) / (1000 * 60 * 60)
    );
    return spot.pricePerHour * hours;
  };

  return (
    <div className="relative h-screen w-full">
      {/* Google Maps */}
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          mapId="parkshare-map"
          defaultCenter={{ lat: centerLat, lng: centerLng }}
          defaultZoom={15}
          disableDefaultUI
          className="h-full w-full"
        >
          {filteredSpots.map((spot) => (
            <AdvancedMarker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              onClick={() => handleSpotClick(spot)}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`rounded-full px-2.5 py-1 text-sm font-semibold shadow-lg ${
                    selectedSpotId === spot.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  ${calculateTotal(spot).toFixed(0)}
                </div>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {/* Top Floating Card */}
      <div className="absolute left-4 right-4 top-4">
        <Card
          className="flex cursor-pointer items-center justify-between px-4 py-3 shadow-lg"
          onClick={() => router.push("/")}
        >
          <div className="flex items-center gap-3">
            <div className="text-sm">
              {searchParams && (
                <>
                  <span className="font-medium">
                    Now · Nearby
                  </span>
                </>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 font-medium">
            List
          </Button>
        </Card>
      </div>

      {/* Search This Area Button */}
      <div className="absolute left-1/2 top-20 -translate-x-1/2">
        <Button
          variant="secondary"
          className="rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-900"
          size="sm"
        >
          Search this area
        </Button>
      </div>

      {/* Locate Me Button */}
      <div className="absolute bottom-32 right-4">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-50"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom Sheet - Horizontal Carousel */}
      <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black/5 to-transparent pb-4 pt-16">
        <div className="overflow-x-auto px-4">
          <div className="flex gap-3 pb-4">
            {filteredSpots.map((spot) => (
              <Card
                key={spot.id}
                className={`min-w-[280px] cursor-pointer overflow-hidden bg-white transition-all ${
                  selectedSpotId === spot.id ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => handleCardClick(spot)}
              >
                <div className="p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-semibold leading-tight">
                        {spot.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {spot.address}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>6 min</span>
                    <span className="mx-1">·</span>
                    <span>UW Madison</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-bold text-base">
                        ${calculateTotal(spot).toFixed(2)} total
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          ⚡ {spot.features.includes("EV charger") ? "67%" : "N/A"}
                        </span>
                        <span>🚗 A</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[15, 16, 17, 18, 19, 20, 21, 22].map((hour) => (
                        <div
                          key={hour}
                          className="h-6 w-1.5 rounded-full bg-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
