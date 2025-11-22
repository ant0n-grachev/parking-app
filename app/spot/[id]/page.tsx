"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/context/AppContext";
import { mockSpots } from "@/lib/mockData";
import { format, differenceInHours } from "date-fns";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { searchParams, selectedSpot, setBooking } = useApp();

  const spot = selectedSpot || mockSpots.find((s) => s.id === params.id);

  if (!spot) {
    router.push("/");
    return null;
  }

  const hours = searchParams
    ? differenceInHours(searchParams.to, searchParams.from)
    : 1;
  const parkingFee = spot.pricePerHour * hours;
  const serviceFee = parkingFee * 0.15;
  const totalCost = parkingFee + serviceFee;

  const handleReserve = () => {
    if (!searchParams) return;

    setBooking({
      spotId: spot.id,
      spot,
      from: searchParams.from,
      to: searchParams.to,
      totalCost,
      parkingFee,
      serviceFee,
    });

    router.push("/confirm");
  };

  // Get today's availability
  const todayAvailability = spot.availability.find(
    (a) => a.date === "2025-11-22"
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Time Selection */}
        <div className="border-b p-4">
          <div className="mb-3 text-sm text-muted-foreground">
            Availability for {format(new Date(), "MMM d")}
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {todayAvailability?.timeBlocks.slice(15, 24).map((block) => {
              const isSelected =
                searchParams &&
                block.hour >= searchParams.from.getHours() &&
                block.hour < searchParams.to.getHours();

              return (
                <div
                  key={block.hour}
                  className={`flex min-w-[44px] flex-col items-center justify-center rounded-lg border-2 px-3 py-2 ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : block.available
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-gray-200 bg-gray-100 text-gray-400"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {block.hour % 12 || 12} {block.hour < 12 ? "PM" : "PM"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pick up / Drop off times */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base">Pick up</span>
              <span className="font-medium text-blue-600">
                {searchParams && format(searchParams.from, "EEEE, h:mm a")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base">Drop off</span>
              <span className="font-medium text-blue-600">
                {searchParams && format(searchParams.to, "EEEE, h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="p-4">
          <h2 className="mb-3 text-xl font-bold">Location details</h2>

          {/* Map */}
          <div className="mb-4 h-48 overflow-hidden rounded-lg">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
              <Map
                mapId="parkshare-spot-map"
                defaultCenter={{ lat: spot.lat, lng: spot.lng }}
                defaultZoom={16}
                disableDefaultUI
                className="h-full w-full"
              >
                <AdvancedMarker position={{ lat: spot.lat, lng: spot.lng }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg">
                    P
                  </div>
                </AdvancedMarker>
              </Map>
            </APIProvider>
          </div>

          {/* Location Name */}
          <h3 className="mb-2 text-lg font-bold">{spot.name}</h3>
          <p className="mb-4 text-base text-muted-foreground">
            {spot.instructions}
          </p>

          {/* Photo Thumbnails */}
          <div className="mb-6 flex gap-2 overflow-x-auto">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"
              >
                {idx === 4 && (
                  <div className="flex h-full w-full items-center justify-center bg-black/50 text-xl font-bold text-white">
                    +1
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t p-4">
          <h2 className="mb-4 text-xl font-bold">Features</h2>
          <div className="space-y-3">
            {spot.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Info className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Walking Distance */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-base">{spot.address}</span>
            </div>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-lg">🚶</span>
              {spot.walkingDistance} min
            </span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">${totalCost.toFixed(2)} total</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleReserve}
          className="w-full rounded-full bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
