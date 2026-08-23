"use client";

import React, { useState } from "react";
import { KARUR_SAMPLE_LOCATIONS } from "@/lib/geo/routingService";
import { isWithinKarurDistrict } from "@/lib/geo/karurBounds";
import { MapPin, Search, Navigation, Check, AlertTriangle } from "lucide-react";

interface LocationPickerProps {
  selectedLocation: { lat: number; lng: number; name: string } | null;
  onSelectLocation: (loc: { lat: number; lng: number; name: string }) => void;
}

export default function LocationPicker({
  selectedLocation,
  onSelectLocation,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleSelectSample = (sample: typeof KARUR_SAMPLE_LOCATIONS[0]) => {
    onSelectLocation({
      lat: sample.lat,
      lng: sample.lng,
      name: sample.name,
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = "My Current Location";
        onSelectLocation({ lat, lng, name });
      },
      (err) => {
        setIsLocating(false);
        alert("Could not access location. Please select a location on the map or from presets.");
      },
      { timeout: 10000 }
    );
  };

  const isCurrentKarur = selectedLocation
    ? isWithinKarurDistrict(selectedLocation.lat, selectedLocation.lng)
    : true;

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>Select Your Starting Location</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Locating..." : "Use Current GPS"}</span>
        </button>
      </div>

      {/* Preset Karur Locations */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-400">Quick Select (Karur District Hubs):</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {KARUR_SAMPLE_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation?.name === loc.name;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectSample(loc)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-navy-900/60 border-navy-700/80 text-gray-300 hover:bg-navy-700 hover:text-white"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <div className="text-[10px] text-gray-400">{loc.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isCurrentKarur
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {isCurrentKarur ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold">{selectedLocation.name}</span>
              <div className="text-[11px] opacity-80">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase">
            {isCurrentKarur ? "In Karur" : "Outside Karur"}
          </span>
        </div>
      )}
    </div>
  );
}
