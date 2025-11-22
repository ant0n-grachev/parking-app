"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/context/AppContext";
import { mockSpots } from "@/lib/mockData";
import { format, differenceInHours } from "date-fns";

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
        <div className="flex-1" />
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header Placeholder */}
        <div className="relative h-64 w-full bg-gradient-to-br from-green-400 to-blue-500">
        </div>

        {/* Main Info */}
        <div className="space-y-6 p-4">
          {/* Name and Location */}
          <div>
            <h1 className="text-xl font-bold">{spot.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {spot.address} · {spot.walkingDistance} min walk
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            {spot.features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* Availability Section */}
          <div>
            <h2 className="mb-3 font-semibold">Today's availability</h2>
            <div className="mb-3 flex gap-1 overflow-x-auto pb-2">
              {todayAvailability?.timeBlocks.map((block) => {
                const isSelected =
                  searchParams &&
                  block.hour >= searchParams.from.getHours() &&
                  block.hour < searchParams.to.getHours();

                return (
                  <div
                    key={block.hour}
                    className={`flex h-12 min-w-[44px] flex-col items-center justify-center rounded ${
                      isSelected
                        ? "bg-green-600 text-white"
                        : block.available
                        ? "bg-green-100 text-green-900"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {block.hour % 12 || 12}
                      {block.hour < 12 ? "a" : "p"}
                    </div>
                  </div>
                );
              })}
            </div>
            {searchParams && (
              <p className="text-sm text-muted-foreground">
                {format(searchParams.from, "h:mm a")} -{" "}
                {format(searchParams.to, "h:mm a")} · {hours} hour
                {hours !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <Separator />

          {/* Price Section */}
          <Card className="p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                ${totalCost.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                total for this stay
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              ${spot.pricePerHour.toFixed(2)} per hour
            </p>
          </Card>

          <Separator />

          {/* Location Details */}
          <div>
            <h2 className="mb-3 font-semibold">Location details</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {spot.instructions.split(". ").map((instruction, idx) => (
                <p key={idx}>{instruction.trim()}.</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleReserve}
          className="w-full rounded-full bg-green-600 py-6 text-base font-semibold hover:bg-green-700"
        >
          Reserve spot
        </Button>
      </div>
    </div>
  );
}
