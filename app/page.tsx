"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Search, MapPin, Navigation, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useApp } from "@/lib/context/AppContext";
import { mockSpots, mockLocationSuggestions } from "@/lib/mockData";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { ParkingSpot } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { searchParams, setSearchParams, setSelectedSpot } = useApp();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [location, setLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(addHours(new Date(), 1));
  const [coveredOnly, setCoveredOnly] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [fromTimePickerOpen, setFromTimePickerOpen] = useState(false);
  const [toTimePickerOpen, setToTimePickerOpen] = useState(false);

  // Filter spots based on search params
  const filteredSpots = searchParams
    ? mockSpots.filter((spot) => {
        if (searchParams.filters?.coveredOnly) {
          return spot.features.includes("Covered");
        }
        return true;
      })
    : mockSpots;

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

    setShowSearchModal(false);
  };

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
    const from = searchParams?.from || fromDate;
    const to = searchParams?.to || toDate;
    const hours = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60));
    return spot.pricePerHour * hours;
  };

  const filteredSuggestions = mockLocationSuggestions.filter((loc) =>
    loc.name.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white">
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

      {/* Top Search Bar */}
      <div className="absolute left-4 right-4 top-4">
        <Card
          className="flex cursor-pointer items-center justify-between px-4 py-3 shadow-lg"
          onClick={() => setShowSearchModal(true)}
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              {searchParams ? (
                <>
                  <span className="font-medium">
                    {format(searchParams.from, "MMM d, h:mm a")} -{" "}
                    {format(searchParams.to, "h:mm a")}
                  </span>
                  <span className="text-muted-foreground"> · {searchParams.location}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Where are you going?</span>
              )}
            </div>
          </div>
        </Card>
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
                        {format(searchParams?.from || fromDate, "h:mm")}
                        -
                        {format(searchParams?.to || toDate, "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchModal(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-medium">Search parking</h1>
            <Button
              variant="ghost"
              onClick={() => {
                setLocation("");
                setFromDate(new Date());
                setToDate(addHours(new Date(), 1));
                setCoveredOnly(false);
              }}
              className="text-sm"
            >
              Clear
            </Button>
          </div>

          {/* Modal Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="space-y-4">
              {/* Location Field */}
              <div className="relative space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Where are you going?"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-9"
                    autoFocus
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
                  <div className="mt-1 rounded-lg border bg-white shadow-lg">
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

              {/* Date Picker */}
              <div className="flex flex-col gap-3 py-3">
                <span className="font-medium">Date</span>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {format(fromDate, "MMM d, yyyy")}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        if (date) {
                          setFromDate(
                            setMinutes(
                              setHours(date, fromDate.getHours()),
                              fromDate.getMinutes()
                            )
                          );
                          setToDate(
                            setMinutes(
                              setHours(date, toDate.getHours()),
                              toDate.getMinutes()
                            )
                          );
                        }
                        setDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              {/* From Time */}
              <div className="flex flex-col gap-3 py-3">
                <span className="font-medium">From</span>
                <Input
                  type="time"
                  value={format(fromDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    setFromDate(
                      setMinutes(setHours(fromDate, parseInt(hours)), parseInt(minutes))
                    );
                  }}
                  className="bg-background"
                />
              </div>

              <Separator />

              {/* To Time */}
              <div className="flex flex-col gap-3 py-3">
                <span className="font-medium">To</span>
                <Input
                  type="time"
                  value={format(toDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    setToDate(
                      setMinutes(setHours(toDate, parseInt(hours)), parseInt(minutes))
                    );
                  }}
                  className="bg-background"
                />
              </div>

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

          {/* Modal Bottom Button */}
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
      )}
    </div>
  );
}
