"use client";

import React, { useState } from "react";
import { KARUR_SAMPLE_LOCATIONS } from "@/lib/geo/routingService";
import { isWithinKarurDistrict } from "@/lib/geo/karurBounds";
import { MapPin, Search, Navigation, Check, AlertTriangle, Crosshair, Sparkles } from "lucide-react";

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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Reverse geocoding helper using OpenStreetMap Nominatim
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
    setStatusMessage(null);
    try {
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
        setStatusMessage(`Selected "${name}"`);
      } else {
        setStatusMessage(`Location "${searchQuery}" not found. Selected closest preset.`);
      }
    } catch {
      setStatusMessage("Search service busy. You can choose from the presets below.");
    } finally {
      setIsSearching(false);
      setTimeout(() => setStatusMessage(null), 4000);
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
    setStatusMessage(null);
    if (!navigator.geolocation) {
      // Fallback gracefully without disruptive native alert
      const defaultHub = KARUR_SAMPLE_LOCATIONS[0];
      handleSelectSample(defaultHub);
      setStatusMessage("GPS not supported on this browser. Using Karur Central Hub.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = "Current GPS Location";
        const loc: GeoLocationSelection = {
          lat,
          lng,
          name,
          region: "Karur",
          area: "Current Location",
          landmark: "GPS Pin",
        };
        onSelectLocation(loc);
        handleReverseGeocode(lat, lng);
        setStatusMessage("📍 Live GPS coordinates acquired successfully!");
        setTimeout(() => setStatusMessage(null), 3500);
      },
      (err) => {
        setIsLocating(false);
        // Fallback gracefully to Karur Bus Stand or user selection
        const defaultHub = KARUR_SAMPLE_LOCATIONS[0];
        handleSelectSample(defaultHub);
        setStatusMessage("GPS unavailable or permission denied. Selected Karur Hub.");
        setTimeout(() => setStatusMessage(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const isCurrentKarur = selectedLocation
    ? isWithinKarurDistrict(selectedLocation.lat, selectedLocation.lng)
    : true;

  return (
    <div className="bg-white border border-brand-border rounded-3xl p-5 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-brand-navy uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-purple" />
          <span>Location & GPS Selection</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="text-xs font-bold text-brand-purple hover:text-brand-violet flex items-center gap-1.5 bg-brand-light border border-brand-purple/20 px-3 py-1.5 rounded-xl transition-all shadow-sm"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Locating..." : "Use Current GPS"}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-brand-light border border-brand-purple/20 rounded-2xl text-[11px] font-bold text-brand-navy animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Location Search Bar */}
      <form onSubmit={handleSearchLocation} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location in Karur (e.g. Bus Stand, Railway Station)..."
          className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-9 pr-24 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple transition-colors font-medium"
        />
        <Search className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-1.5 top-1.5 px-3.5 py-1.5 bg-brand-purple hover:bg-brand-violet text-white rounded-xl text-xs font-bold shadow transition-all"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Preset Hubs */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-brand-muted">Quick Select Karur Transit Hubs:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {KARUR_SAMPLE_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation?.name === loc.name;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectSample(loc)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-brand-light border-brand-purple text-brand-navy shadow-sm"
                    : "bg-brand-soft border-brand-border text-brand-navy hover:bg-white"
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-purple" />}
                  </div>
                  <div className="text-[10px] text-brand-muted mt-0.5">{loc.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Location Pill */}
      {selectedLocation && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isCurrentKarur
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCurrentKarur ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-extrabold text-brand-navy text-xs">{selectedLocation.name}</span>
              <div className="text-[11px] text-brand-muted font-mono mt-0.5">
                📍 Lat: {selectedLocation.lat.toFixed(4)} | Lng: {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase bg-white">
            {isCurrentKarur ? "Karur District" : "Adjacent Area"}
          </span>
        </div>
      )}
    </div>
  );
}
