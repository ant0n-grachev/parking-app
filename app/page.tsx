"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/context/AppContext";
import { mockLocationSuggestions } from "@/lib/mockData";
import { format, addHours } from "date-fns";
import { BottomNav } from "@/components/BottomNav";

export default function SearchPage() {
  const router = useRouter();
  const { setSearchParams } = useApp();

  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addHours(new Date(), 1));
  const [coveredOnly, setCoveredOnly] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<"from" | "to" | null>(null);

  const handleSearch = () => {
    const selectedLocation = mockLocationSuggestions.find(
      (loc) => loc.name === location
    ) || mockLocationSuggestions[0];

    setSearchParams({
      location: selectedLocation.name,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      from: fromDate,
      to: toDate,
      filters: { coveredOnly },
    });

    router.push("/map");
  };

  const handleClear = () => {
    setLocation("");
    setFromDate(new Date());
    setToDate(addHours(new Date(), 1));
    setCoveredOnly(false);
  };

  const filteredSuggestions = mockLocationSuggestions.filter((loc) =>
    loc.name.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-white pb-16">
      {/* Top App Bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            P
          </div>
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
          Search
        </h1>
        <Button variant="ghost" onClick={handleClear} className="text-sm text-blue-600">
          Clear
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-4">
          {/* Location Field */}
          <div className="relative space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Enter pick up location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 h-12 text-base"
              />
              {location && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2"
                  onClick={() => setLocation("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && location && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.name}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50"
                    onClick={() => {
                      setLocation(suggestion.name);
                      setShowSuggestions(false);
                    }}
                  >
                    <Search className="mt-1 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Pick up Row */}
          <button
            className="flex w-full items-center justify-between py-3 text-left"
            onClick={() => setShowTimePicker("from")}
          >
            <span className="text-base">Pick up</span>
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-base font-medium">
                Today, {format(fromDate, "h:mm a")}
              </span>
            </div>
          </button>

          <Separator />

          {/* Drop off Row */}
          <button
            className="flex w-full items-center justify-between py-3 text-left"
            onClick={() => setShowTimePicker("to")}
          >
            <span className="text-base">Drop off</span>
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-base font-medium">
                Today, {format(toDate, "h:mm a")}
              </span>
            </div>
          </button>

          <Separator />

          {/* Toggle Option - Show unavailable */}
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-base font-medium">Show unavailable spots</span>
              <p className="text-sm text-muted-foreground">Include spots that are booked</p>
            </div>
            <button
              onClick={() => setCoveredOnly(!coveredOnly)}
              className={`relative h-8 w-14 rounded-full transition-colors ${
                coveredOnly ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  coveredOnly ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <Separator />

          {/* New Badge and Show delivery toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="rounded bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                New
              </div>
              <div>
                <span className="text-base font-medium">Show delivery</span>
                <p className="text-sm text-muted-foreground">Include spots available for delivery</p>
              </div>
            </div>
            <button
              onClick={() => setShowDelivery(!showDelivery)}
              className={`relative h-8 w-14 rounded-full transition-colors ${
                showDelivery ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  showDelivery ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <Separator />

          {/* Spot Type */}
          <button
            className="flex w-full items-center justify-between py-3 text-left"
            onClick={() => {}}
          >
            <span className="text-base">Spot type</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-base">All Types</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-16 left-0 right-0 border-t bg-white p-4">
        <Button
          onClick={handleSearch}
          disabled={!location}
          className="w-full rounded-full bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
        >
          Search
        </Button>
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full rounded-t-3xl bg-white p-6">
            <div className="mb-4 flex justify-center gap-4">
              <button
                className={`flex-1 rounded-full py-3 text-sm font-medium ${
                  showTimePicker === "from"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setShowTimePicker("from")}
              >
                Pick up<br />
                <span className="font-bold">Today, {format(fromDate, "h:mm a")}</span>
              </button>
              <button
                className={`flex-1 rounded-full py-3 text-sm font-medium ${
                  showTimePicker === "to"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setShowTimePicker("to")}
              >
                Drop off<br />
                <span className="font-bold">Today, {format(toDate, "h:mm a")}</span>
              </button>
            </div>

            {/* Simple Time Display */}
            <div className="my-8 text-center">
              <div className="text-6xl font-light">
                {showTimePicker === "from"
                  ? format(fromDate, "h:mm")
                  : format(toDate, "h:mm")}
              </div>
              <div className="mt-2 text-2xl text-muted-foreground">
                {showTimePicker === "from"
                  ? format(fromDate, "a")
                  : format(toDate, "a")}
              </div>
            </div>

            <Button
              onClick={() => setShowTimePicker(null)}
              className="w-full rounded-full bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
            >
              Confirm time
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
