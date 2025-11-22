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

export default function SearchPage() {
  const router = useRouter();
  const { setSearchParams } = useApp();

  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addHours(new Date(), 1));
  const [coveredOnly, setCoveredOnly] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top App Bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-xl font-semibold">P</div>
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
          Search parking
        </h1>
        <Button variant="ghost" onClick={handleClear} className="text-sm">
          Clear
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="space-y-4">
          {/* Location Field */}
          <div className="relative space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-9"
              />
              {location && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 -translate-y-1/2 px-2"
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

          {/* From Row */}
          <button
            className="flex w-full items-center justify-between py-3 text-left"
            onClick={() => {
              // In a real app, this would open a date/time picker modal
              const newDate = new Date();
              newDate.setHours(newDate.getHours() + 1);
              setFromDate(newDate);
            }}
          >
            <span className="font-medium">From</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">
                {format(fromDate, "MMM d, h:mm a")}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>

          <Separator />

          {/* To Row */}
          <button
            className="flex w-full items-center justify-between py-3 text-left"
            onClick={() => {
              // In a real app, this would open a date/time picker modal
              const newDate = new Date(fromDate);
              newDate.setHours(newDate.getHours() + 2);
              setToDate(newDate);
            }}
          >
            <span className="font-medium">To</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-sm">
                {format(toDate, "MMM d, h:mm a")}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>

          <Separator />

          {/* Toggle Option */}
          <div className="flex items-center justify-between py-3">
            <span className="font-medium">Show only covered spots</span>
            <button
              onClick={() => setCoveredOnly(!coveredOnly)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                coveredOnly ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  coveredOnly ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="border-t p-4">
        <Button
          onClick={handleSearch}
          disabled={!location}
          className="w-full rounded-full bg-green-600 py-6 text-base font-semibold hover:bg-green-700"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
