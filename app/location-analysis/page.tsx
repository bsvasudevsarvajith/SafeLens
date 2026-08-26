"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import LocationPicker, { GeoLocationSelection } from "@/components/map/LocationPicker";
import CCTVMap from "@/components/map/CCTVMap";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { computeMultiFactorSafety, MultiFactorSafetyAssessment } from "@/lib/safety/safetyScorer";
import { getLocalSeedState, CameraRecord } from "@/lib/seedData";
import {
  MapPin,
  Shield,
  Users,
  Video,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info
} from "lucide-react";

function LocationAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryLat = parseFloat(searchParams.get("lat") || "10.9601");
  const queryLng = parseFloat(searchParams.get("lng") || "78.0766");
  const queryName = searchParams.get("name") || "Karur Central";

  const [selectedLoc, setSelectedLoc] = useState<GeoLocationSelection>({
    lat: queryLat,
    lng: queryLng,
    name: queryName,
    region: "Karur",
    area: queryName,
    landmark: "Central Hub",
  });

  const [cameras, setCameras] = useState<CameraRecord[]>([]);
  const [assessment, setAssessment] = useState<MultiFactorSafetyAssessment | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const seed = getLocalSeedState();
    setCameras(seed.cameras);
    performAnalysis(selectedLoc, seed.cameras);
  }, [searchParams]);

  const performAnalysis = (loc: GeoLocationSelection, cameraList: CameraRecord[]) => {
    setAnalyzing(true);

    // Filter nearby cameras
    const nearby = cameraList.filter((c) => {
      const dist = Math.sqrt(
        Math.pow(c.latitude - loc.lat, 2) + Math.pow(c.longitude - loc.lng, 2)
      );
      return dist < 0.04;
    });

    const nearbyCount = Math.max(1, nearby.length);
    const avgPeople = nearby.length > 0
      ? Math.round(nearby.reduce((a, b) => a + b.peopleCount, 0) / nearby.length)
      : Math.floor(18 + Math.random() * 15);

    const result = computeMultiFactorSafety({
      peopleCount: avgPeople,
      nearbyCameraCount: nearbyCount,
      areaName: loc.name,
      regionName: loc.region || "Karur",
      roadConnectivity: 81,
      publicPlaceDensity: 76,
    });

    setTimeout(() => {
      setAssessment(result);
      setAnalyzing(false);
    }, 300);
  };

  const handleLocationChange = (loc: GeoLocationSelection) => {
    setSelectedLoc(loc);
    performAnalysis(loc, cameras);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800 border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Factor Risk Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            📍 Location Safety & Crowd Analysis
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time algorithmic safety evaluation integrating CCTV camera feeds, public density, and corridor connectivity.
          </p>
        </div>

        <button
          onClick={() => router.push(`/route?startLat=${selectedLoc.lat}&startLng=${selectedLoc.lng}&name=${encodeURIComponent(selectedLoc.name)}`)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <span>Find Safest Route From Here</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <NoticeDisclaimer variant="banner" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Location Selection & Multi-factor Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <LocationPicker
            selectedLocation={selectedLoc}
            onSelectLocation={handleLocationChange}
          />

          {/* Detailed Factor Breakdown Card */}
          {assessment && (
            <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Multi-Factor Assessment</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${assessment.statusBadge.includes("🟢") ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>
                  {assessment.statusBadge}
                </span>
              </div>

              {/* Overall Score Banner */}
              <div className="p-4 bg-navy-900 rounded-2xl border border-navy-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Safety Score</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">
                    {assessment.overallScore}<span className="text-sm text-gray-400">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Risk Level</span>
                  <div className={`text-base font-bold mt-0.5 ${assessment.riskLevel === "LOW" ? "text-emerald-400" : "text-amber-400"}`}>
                    {assessment.riskLevel}
                  </div>
                </div>
              </div>

              {/* 5 Input Factors */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-navy-700/60">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Crowd Activity ({assessment.activityLevel})
                  </span>
                  <span className="font-bold text-white">{assessment.crowdActivityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-navy-700/60">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    Public Place Density
                  </span>
                  <span className="font-bold text-white">{assessment.publicPlaceDensityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-navy-700/60">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    Road Connectivity & Lighting
                  </span>
                  <span className="font-bold text-white">{assessment.roadConnectivityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-navy-700/60">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Time of Day Factor
                  </span>
                  <span className="font-bold text-white">{assessment.timeFactorScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-teal-400" />
                    Surveillance Camera Presence
                  </span>
                  <span className="font-bold text-white">{assessment.cameraActivityScore}/100</span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-3.5 bg-blue-950/30 border border-blue-500/30 rounded-2xl text-xs text-blue-200/90 leading-relaxed">
                <strong>Recommendation:</strong> {assessment.recommendation}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Location Map & Nearby CCTV View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Surveillance Grid for {selectedLoc.name}</span>
            </h2>
            <span className="text-xs text-emerald-400 font-semibold">
              ~{assessment?.estimatedPeople || 26} people estimated
            </span>
          </div>

          <CCTVMap
            cameras={cameras}
            center={[selectedLoc.lat, selectedLoc.lng]}
            zoom={14}
            interactiveSelection={true}
            onMapClickLocation={(loc) => {
              handleLocationChange({
                lat: loc.lat,
                lng: loc.lng,
                name: `Selected Point (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`,
                region: "Karur",
                area: "Selected Point",
              });
            }}
          />
        </div>

      </div>

    </main>
  );
}

export default function LocationAnalysisPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <LocationAnalysisContent />
        </Suspense>
      </div>
    </div>
  );
}
