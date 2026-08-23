"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import LocationPicker from "@/components/map/LocationPicker";
import RouteMap from "@/components/map/RouteMap";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { KARUR_NEW_BUS_STAND, isWithinKarurDistrict, UNSUPPORTED_LOCATION_MESSAGE } from "@/lib/geo/karurBounds";
import { MapPin, Navigation, Shield, ArrowRight, AlertTriangle, ExternalLink } from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  
  // Default start location: Karur Railway Station
  const [startLocation, setStartLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>({
    lat: 10.9582,
    lng: 78.0825,
    name: "Karur Railway Station",
  });

  const [unsupportedModalOpen, setUnsupportedModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (!session) {
      router.replace("/login");
    }
  }, [router]);

  const handleSelectLocation = (location: { lat: number; lng: number; name: string }) => {
    setStartLocation(location);
  };

  const handleFindSafestRoute = () => {
    if (!startLocation) return;

    // Check Karur District Boundary
    const isSupported = isWithinKarurDistrict(startLocation.lat, startLocation.lng);

    if (!isSupported) {
      setUnsupportedModalOpen(true);
      return;
    }

    setIsAnalyzing(true);

    // Navigate to Route Analysis screen with parameters
    const params = new URLSearchParams({
      startLat: startLocation.lat.toString(),
      startLng: startLocation.lng.toString(),
      name: startLocation.name,
    });

    setTimeout(() => {
      router.push(`/route?${params.toString()}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800 border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Karur District Demonstration Prototype</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Where do you want to go?
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Analyze AI-driven human activity and person density data along road corridors to identify recommended travel routes inside Karur District.
            </p>
          </div>
        </div>

        {/* Notice Disclaimer Banner */}
        <NoticeDisclaimer variant="banner" />

        {/* Main Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Destination & Start Location Selection */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Destination Selection Card */}
            <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination (Fixed V1)</span>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Supported Location
                </span>
              </div>

              <div className="p-3.5 bg-navy-900/90 border border-navy-600 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{KARUR_NEW_BUS_STAND.name}</h3>
                      <p className="text-xs text-gray-400">{KARUR_NEW_BUS_STAND.district}, {KARUR_NEW_BUS_STAND.state}</p>
                    </div>
                  </div>
                  <a
                    href={KARUR_NEW_BUS_STAND.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-lg text-blue-400 text-xs flex items-center gap-1 transition-colors"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Start Location Picker */}
            <LocationPicker
              selectedLocation={startLocation}
              onSelectLocation={handleSelectLocation}
            />

            {/* Submit Action Button */}
            <button
              onClick={handleFindSafestRoute}
              disabled={isAnalyzing}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-3 transition-all text-base hover:scale-[1.01]"
            >
              <Navigation className={`w-5 h-5 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Analyzing Route Activity..." : "Find Safest Route"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column: Interactive Karur Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Karur Interactive Map & Boundaries</span>
              </h2>
              <span className="text-xs text-gray-400">Click anywhere on map to pick origin</span>
            </div>

            <RouteMap
              startLocation={startLocation}
              onSelectStartLocation={handleSelectLocation}
            />
          </div>

        </div>

      </main>

      {/* Unsupported Location Warning Modal */}
      {unsupportedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">{UNSUPPORTED_LOCATION_MESSAGE.title}</h3>
              <p className="text-xs font-semibold text-red-400">{UNSUPPORTED_LOCATION_MESSAGE.subtitle}</p>
              <p className="text-xs text-gray-300 leading-relaxed pt-2">
                {UNSUPPORTED_LOCATION_MESSAGE.message}
              </p>
            </div>

            <div className="p-3 bg-navy-900 rounded-xl border border-navy-700 text-xs text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Supported Area:</span>
                <span className="font-semibold text-emerald-400">{UNSUPPORTED_LOCATION_MESSAGE.supportedArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Supported Destination:</span>
                <span className="font-semibold text-white">{UNSUPPORTED_LOCATION_MESSAGE.supportedDestination}</span>
              </div>
            </div>

            <button
              onClick={() => setUnsupportedModalOpen(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Understand & Select Karur Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
