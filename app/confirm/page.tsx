"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/context/AppContext";
import { format, differenceInHours } from "date-fns";

export default function ConfirmPage() {
  const router = useRouter();
  const { booking } = useApp();

  if (!booking) {
    router.push("/");
    return null;
  }

  const hours = differenceInHours(booking.to, booking.from);
  const hourlyRate = booking.spot.pricePerHour;
  const subtotal = hourlyRate * hours;
  const serviceFee = subtotal * 0.05;
  const stateTax = subtotal * 0.055;
  const countyTax = subtotal * 0.005;
  const total = subtotal + serviceFee + stateTax + countyTax;

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
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
          Review and pay
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-6">
          {/* Trip Cost Section */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Trip cost</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base">
                  ${hourlyRate.toFixed(2)} x {hours} hour{hours !== 1 ? "s" : ""}
                </span>
                <span className="text-base">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-base">Service Fee</span>
                </div>
                <span className="text-base">${serviceFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base">State Sales Tax</span>
                <span className="text-base">${stateTax.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base">County Sales Tax</span>
                <span className="text-base">${countyTax.toFixed(2)}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="rounded-2xl bg-green-100 p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-green-900" />
              <span className="text-base font-medium text-green-900">
                You're earning rewards on this trip!
              </span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="mb-3 text-xl font-bold">Cancellation policy</h2>
            <p className="text-base text-muted-foreground">
              You can change or cancel before{" "}
              {format(booking.from, "EEE, MMM d, h:mm a")} to receive a full
              refund.{" "}
              <button className="font-bold text-foreground underline">
                View policy
              </button>
            </p>
          </div>

          {/* Agreement Text */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-muted-foreground">
              By selecting the button below, I agree that the parking spot owner
              can charge my default payment method if I'm responsible for
              additional charges, such as damages, violations, and additional
              time over the reserved period. These charges may take days to
              appear.
            </p>
          </div>

          {/* Spot Details Card */}
          <div>
            <h2 className="mb-3 text-xl font-bold">Location details</h2>
            <Card className="overflow-hidden">
              <div className="relative h-32 w-full">
                <div className="h-full w-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{booking.spot.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.spot.address}
                </p>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pick up</span>
                    <span className="font-medium">
                      {format(booking.from, "EEE, h:mm a")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drop off</span>
                    <span className="font-medium">
                      {format(booking.to, "EEE, h:mm a")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button - Apple Pay Style */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleConfirm}
          className="w-full rounded-full bg-black py-6 text-base font-semibold hover:bg-gray-900"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Pay</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
