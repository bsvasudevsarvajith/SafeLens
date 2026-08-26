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
  Navigation
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
      
      {/* Header Banner */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Factor Risk Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Location Safety & Crowd Analysis
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Real-time algorithmic safety evaluation integrating CCTV camera feeds, public density, and corridor connectivity.
          </p>
        </div>

        <button
          onClick={() => router.push(`/safe-route?startLat=${selectedLoc.lat}&startLng=${selectedLoc.lng}&name=${encodeURIComponent(selectedLoc.name)}`)}
          className="px-5 py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all self-start md:self-auto"
        >
          <Navigation className="w-4 h-4" />
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
            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-brand-muted uppercase tracking-wider">Multi-Factor Assessment</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                  assessment.statusBadge.includes("Favorable") || assessment.overallScore >= 75
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {assessment.statusBadge.replace(/^[🟢🟡🔴]\s*/, "")}
                </span>
              </div>

              {/* Overall Score Banner */}
              <div className="p-4 bg-brand-soft rounded-2xl border border-brand-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Safety Score</span>
                  <div className="text-3xl font-black text-brand-navy mt-0.5">
                    {assessment.overallScore}<span className="text-sm text-brand-muted font-bold">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Risk Level</span>
                  <div className={`text-base font-extrabold mt-0.5 ${
                    assessment.riskLevel === "LOW" ? "text-emerald-700" : "text-amber-700"
                  }`}>
                    {assessment.riskLevel}
                  </div>
                </div>
              </div>

              {/* 5 Input Factors */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/60">
                  <span className="text-brand-navy font-semibold flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Crowd Activity ({assessment.activityLevel})
                  </span>
                  <span className="font-extrabold text-brand-navy">{assessment.crowdActivityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/60">
                  <span className="text-brand-navy font-semibold flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-purple" />
                    Public Place Density
                  </span>
                  <span className="font-extrabold text-brand-navy">{assessment.publicPlaceDensityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/60">
                  <span className="text-brand-navy font-semibold flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Road Connectivity & Lighting
                  </span>
                  <span className="font-extrabold text-brand-navy">{assessment.roadConnectivityScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-brand-border/60">
                  <span className="text-brand-navy font-semibold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Time of Day Factor
                  </span>
                  <span className="font-extrabold text-brand-navy">{assessment.timeFactorScore}/100</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-brand-navy font-semibold flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-teal-600" />
                    Surveillance Camera Presence
                  </span>
                  <span className="font-extrabold text-brand-navy">{assessment.cameraActivityScore}/100</span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-4 bg-brand-light border border-brand-purple/20 rounded-2xl text-xs text-brand-navy leading-relaxed font-medium">
                <strong className="text-brand-purple">Recommendation:</strong> {assessment.recommendation}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Location Map & Nearby CCTV View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-brand-border shadow-subtle">
            <h2 className="text-xs font-bold text-brand-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-purple" />
              <span>Surveillance Grid for <strong>{selectedLoc.name}</strong></span>
            </h2>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <LocationAnalysisContent />
        </Suspense>
      </div>
    </div>
  );
}
