"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/context/AppContext";
import { format } from "date-fns";

export default function ConfirmPage() {
  const router = useRouter();
  const { booking } = useApp();

  if (!booking) {
    router.push("/");
    return null;
  }

  const handleConfirm = () => {
    // In a real app, this would process the payment and create the booking
    alert("Booking confirmed! (This is a demo)");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-3 text-base font-medium">Review & confirm</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="overflow-hidden">
            <div className="flex gap-3 p-4">
              {/* Placeholder */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-green-400 to-blue-500">
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="font-semibold leading-tight">
                    {booking.spot.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.spot.address}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(booking.from, "EEE, MMM d")} ·{" "}
                  {format(booking.from, "h:mm a")} -{" "}
                  {format(booking.to, "h:mm a")}
                </p>
              </div>
            </div>
          </Card>

          {/* Cost Breakdown */}
          <div>
            <h2 className="mb-3 font-semibold">Booking cost</h2>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parking fee</span>
                  <span>${booking.parkingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>${booking.serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${booking.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Policy Text */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">
              You can cancel up to 15 minutes before start for a full refund.
              By confirming, you agree to the parking spot owner's house rules
              and cancellation policy.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleConfirm}
          className="w-full rounded-full bg-green-600 py-6 text-base font-semibold hover:bg-green-700"
        >
          Confirm reservation
        </Button>
      </div>
    </div>
  );
}
