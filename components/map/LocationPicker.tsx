"use client";

import React, { useState, useEffect } from "react";
import { KARUR_SAMPLE_LOCATIONS } from "@/lib/geo/routingService";
import { isWithinKarurDistrict } from "@/lib/geo/karurBounds";
import { MapPin, Search, Navigation, Check, AlertTriangle, Crosshair } from "lucide-react";

export interface GeoLocationSelection {
  lat: number;
  lng: number;
  name: string;
  region?: string;
  area?: string;
  landmark?: string;
}

interface LocationPickerProps {
  selectedLocation: GeoLocationSelection | null;
  onSelectLocation: (loc: GeoLocationSelection) => void;
  showDetailsForm?: boolean;
  onUpdateDetails?: (details: { region: string; area: string; landmark: string }) => void;
}

export default function LocationPicker({
  selectedLocation,
  onSelectLocation,
  showDetailsForm = false,
  onUpdateDetails,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Reverse geocoding helper using OpenStreetMap Nominatim (Public & Free)
  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.district || "Karur";
        const suburb = address.suburb || address.neighbourhood || address.road || "Central Hub";
        const landmark = data.display_name?.split(",")[0] || "Selected Landmark";

        if (onUpdateDetails) {
          onUpdateDetails({
            region: city,
            area: suburb,
            landmark: landmark,
          });
        }
      }
    } catch (err) {
      console.warn("Reverse geocode fallback", err);
    }
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Prioritize Karur / Tamil Nadu search
      const query = searchQuery.toLowerCase().includes("karur")
        ? searchQuery
        : `${searchQuery}, Karur, Tamil Nadu`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const name = item.display_name.split(",")[0];

        const loc: GeoLocationSelection = {
          lat,
          lng,
          name: name || searchQuery,
          region: "Karur",
          area: searchQuery,
          landmark: name,
        };
        onSelectLocation(loc);
        handleReverseGeocode(lat, lng);
      } else {
        alert(`Location "${searchQuery}" not found. You can also click directly on the interactive map.`);
      }
    } catch {
      alert("Could not complete search. Please pick a preset or click on the map.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSample = (sample: typeof KARUR_SAMPLE_LOCATIONS[0]) => {
    const loc: GeoLocationSelection = {
      lat: sample.lat,
      lng: sample.lng,
      name: sample.name,
      region: "Karur",
      area: sample.name,
      landmark: sample.description,
    };
    onSelectLocation(loc);
    if (onUpdateDetails) {
      onUpdateDetails({
        region: "Karur",
        area: sample.name,
        landmark: sample.description,
      });
    }
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
        const name = "Current GPS Location";
        const loc: GeoLocationSelection = { lat, lng, name, region: "Karur", area: "Current Location", landmark: "GPS Pin" };
        onSelectLocation(loc);
        handleReverseGeocode(lat, lng);
      },
      () => {
        setIsLocating(false);
        alert("Could not access GPS. Please choose a location from presets or click the map.");
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
        <label className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>Location & GPS Selection</span>
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

      {/* Location Search Bar */}
      <form onSubmit={handleSearchLocation} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location in Karur (e.g. Bus Stand, Railway Station)..."
          className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-1.5 top-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Preset Hubs */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-gray-400">Quick Select Karur Transit Hubs:</p>
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

      {/* Selected Location Pill */}
      {selectedLocation && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isCurrentKarur
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCurrentKarur ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <div>
              <span className="font-bold text-white text-xs">{selectedLocation.name}</span>
              <div className="text-[11px] opacity-85 font-mono">
                📍 Lat: {selectedLocation.lat.toFixed(4)} | Lng: {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase">
            {isCurrentKarur ? "Karur District" : "Outside Boundary"}
          </span>
        </div>
      )}
    </div>
  );
}
