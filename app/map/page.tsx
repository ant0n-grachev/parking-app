"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/context/AppContext";
import { mockSpots } from "@/lib/mockData";
import { format } from "date-fns";
import { ParkingSpot } from "@/lib/types";

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
                      ? "bg-green-600 text-white"
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
            <ChevronLeft className="h-5 w-5" />
            <div className="text-sm">
              {searchParams && (
                <>
                  <span className="font-medium">
                    {format(searchParams.from, "MMM d, h:mm a")} -{" "}
                    {format(searchParams.to, "h:mm a")}
                  </span>
                  <span className="text-muted-foreground"> · {searchParams.location}</span>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Search This Area Button */}
      <div className="absolute left-1/2 top-20 -translate-x-1/2">
        <Button
          variant="secondary"
          className="rounded-full shadow-lg"
          size="sm"
        >
          Search this area
        </Button>
      </div>

      {/* Locate Me Button */}
      <div className="absolute bottom-48 right-4">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom Sheet - Horizontal Carousel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent pb-8 pt-20">
        <div className="overflow-x-auto px-4">
          <div className="flex gap-3 pb-4">
            {filteredSpots.map((spot) => (
              <Card
                key={spot.id}
                className={`min-w-[320px] cursor-pointer overflow-hidden transition-all ${
                  selectedSpotId === spot.id ? "ring-2 ring-green-600" : ""
                }`}
                onClick={() => handleCardClick(spot)}
              >
                <div className="flex gap-3 p-3">
                  {/* Placeholder */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-green-400 to-blue-500">
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="font-semibold text-sm leading-tight">
                          {spot.address}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {spot.walkingDistance} min
                        </div>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {spot.name}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm">
                        ${calculateTotal(spot).toFixed(2)} total
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {searchParams &&
                          format(searchParams.from, "h:mm")}
                        -
                        {searchParams &&
                          format(searchParams.to, "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
