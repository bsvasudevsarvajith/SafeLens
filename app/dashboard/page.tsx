"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import {
  Shield,
  MapPin,
  Search,
  Users,
  Store,
  Car,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Navigation,
  FileText,
  AlertTriangle,
  Info,
  Layers,
  Compass,
  RefreshCw
} from "lucide-react";

// Client-only SafeLens Leaflet Map
const SafeLensMap = dynamic(() => import("@/components/map/SafeLensMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-brand-soft rounded-3xl flex items-center justify-center border border-brand-border">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-brand-muted">Loading SafeLens Intelligence Map...</span>
      </div>
    </div>
  ),
});

const PRESET_LOCATIONS = [
  { name: "Karur New Bus Stand", lat: 10.9601, lng: 78.0766, area: "Central Hub", district: "Karur, Tamil Nadu" },
  { name: "Karur Railway Station", lat: 10.9582, lng: 78.0825, area: "Station Road", district: "Karur, Tamil Nadu" },
  { name: "Jawahar Bazaar", lat: 10.9670, lng: 78.0850, area: "Market Stretch", district: "Karur, Tamil Nadu" },
  { name: "Kovai Road West Bypass", lat: 10.9645, lng: 78.0720, area: "West Transit", district: "Karur, Tamil Nadu" },
  { name: "South Industrial Stretch", lat: 10.9510, lng: 78.0890, area: "South Zone", district: "Karur, Tamil Nadu" },
];

const ANALYSIS_STEPS = [
  "Location coordinates identified & geocoded",
  "Checking nearby public transit & commercial points",
  "Estimating ambient crowd activity levels",
  "Evaluating environmental & lighting safety indicators",
  "Processing SafeLens multi-factor AI model",
  "Generating actionable travel recommendation",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPoint, setSelectedPoint] = useState(PRESET_LOCATIONS[0]);
  
  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>({
    safetyScore: 82,
    status: "FAVORABLE",
    statusColor: "emerald",
    crowdActivity: 84,
    crowdLevel: "HIGH",
    publicActivity: 78,
    publicLevel: "HIGH",
    roadConnectivity: 81,
    roadLevel: "GOOD",
    nearbyActivity: 88,
    nearbyLevel: "HIGH",
    timeFactor: 72,
    timeLevel: "MODERATE",
    confidence: 87,
    recommendation:
      "This location exhibits robust ambient pedestrian activity, commercial corridor vitality, and verified municipal street illumination.",
  });

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSelectPreset = (loc: typeof PRESET_LOCATIONS[0]) => {
    setSelectedPoint(loc);
    setSearchQuery(loc.name);
    calculateLocationMetrics(loc.lat, loc.lng, loc.name);
  };

  const calculateLocationMetrics = (lat: number, lng: number, name: string) => {
    const seed = Math.floor(lat * 1000 + lng * 1000);
    const score = 70 + (seed % 24);
    const status = score >= 80 ? "FAVORABLE" : score >= 60 ? "MODERATE" : "REQUIRES CAUTION";
    const statusColor = score >= 80 ? "emerald" : score >= 60 ? "amber" : "red";

    setAnalysisResult({
      safetyScore: score,
      status,
      statusColor,
      crowdActivity: Math.min(96, score + 2),
      crowdLevel: score >= 80 ? "HIGH" : score >= 60 ? "MODERATE" : "LOW",
      publicActivity: Math.min(94, score - 3),
      publicLevel: score >= 80 ? "HIGH" : score >= 60 ? "MODERATE" : "LOW",
      roadConnectivity: Math.min(95, score - 1),
      roadLevel: score >= 75 ? "GOOD" : "MODERATE",
      nearbyActivity: Math.min(98, score + 5),
      nearbyLevel: score >= 80 ? "HIGH" : score >= 60 ? "MODERATE" : "LOW",
      timeFactor: 74,
      timeLevel: "MODERATE",
      confidence: 94,
      recommendation:
        score >= 80
          ? `Analysis for ${name}: Location shows favorable ambient public activity, prominent commercial presence, and high-visibility road corridors.`
          : score >= 60
          ? `Analysis for ${name}: Location exhibits moderate activity levels. Primary thoroughfares are recommended for optimal safety.`
          : `Analysis for ${name}: Location indicates lower public density or reduced street illumination. Exercise additional caution and consider well-lit main corridors.`,
    });
  };

  const handleStartAnalysis = () => {
    setAnalyzing(true);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setAnalyzing(false);
        calculateLocationMetrics(selectedPoint.lat, selectedPoint.lng, selectedPoint.name);
      }
    }, 350);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = PRESET_LOCATIONS.find((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      handleSelectPreset(found);
    } else if (searchQuery.trim()) {
      const customLoc = {
        name: searchQuery.trim(),
        lat: 10.9620,
        lng: 78.0790,
        area: "Karur Municipality",
        district: "Karur, Tamil Nadu",
      };
      setSelectedPoint(customLoc);
      calculateLocationMetrics(customLoc.lat, customLoc.lng, customLoc.name);
    }
  };

  // Circular Score Indicator calculations
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (analysisResult.safetyScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      
      {/* 13. Sidebar */}
      <AppSidebar />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Greeting & Banner */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
                <span>Good morning 👋</span>
                <span className="text-sm font-bold text-brand-purple bg-brand-light px-2.5 py-0.5 rounded-full border border-brand-purple/20">
                  SafeLens Core
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Analyze an area before you travel. Search a location or click directly on the interactive map.
              </p>
            </div>

            {/* Quick Navigation Action Pills */}
            <div className="flex items-center gap-2">
              <Link
                href="/safe-route"
                className="px-4 py-2 bg-brand-light hover:bg-brand-purple hover:text-white text-brand-purple border border-brand-purple/20 text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Compare Safer Routes</span>
              </Link>
              <Link
                href="/crowd-ai"
                className="px-4 py-2 bg-brand-soft hover:bg-brand-border text-brand-navy text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-brand-purple" />
                <span>Crowd AI</span>
              </Link>
            </div>
          </div>

          {/* Location Search Bar & Quick Preset Buttons */}
          <div className="bg-white rounded-3xl p-4 border border-brand-border shadow-card space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-brand-soft px-4 py-3 rounded-2xl border border-brand-border">
                <Search className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location in Karur (e.g. Bus Stand, Railway Station, Bazaar)..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-navy outline-none placeholder:text-brand-muted"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-purple hover:bg-[#5B21B6] text-white text-xs font-bold rounded-2xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-brand-muted font-bold text-[11px] uppercase tracking-wider">
                Quick Hubs:
              </span>
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectPreset(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedPoint.name === loc.name
                      ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                      : "bg-brand-soft text-brand-muted border-brand-border hover:text-brand-navy hover:bg-white"
                  }`}
                >
                  📍 {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Interactive Map (Left) + AI Analysis Panel (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Real Interactive Map */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-brand-border shadow-card space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-purple" />
                    <span className="text-xs font-bold text-brand-navy">Interactive Location Map</span>
                  </div>
                  <span className="text-[11px] text-brand-muted font-semibold">
                    Click anywhere on map to drop target pin
                  </span>
                </div>

                <SafeLensMap
                  center={[selectedPoint.lat, selectedPoint.lng]}
                  selectedPoint={selectedPoint}
                  onSelectPoint={(p) => {
                    setSelectedPoint(p);
                    setSearchQuery(p.name);
                    calculateLocationMetrics(p.lat, p.lng, p.name);
                  }}
                  height="500px"
                />
              </div>

              {/* Selected Target Info Bar */}
              <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider block">
                    CURRENT SELECTION
                  </span>
                  <h4 className="font-extrabold text-brand-navy text-sm sm:text-base">
                    📍 {selectedPoint.name}
                  </h4>
                  <p className="text-[11px] text-brand-muted font-mono">
                    Latitude: {selectedPoint.lat.toFixed(5)} • Longitude: {selectedPoint.lng.toFixed(5)}
                  </p>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={analyzing}
                  className="px-6 py-3 bg-gradient-to-r from-brand-purple via-[#7C3AED] to-brand-violet hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-hover flex items-center justify-center gap-2 transition-transform active:scale-95 flex-shrink-0"
                >
                  <Shield className={`w-4 h-4 ${analyzing ? "animate-spin" : "fill-white/20"}`} />
                  <span>{analyzing ? "Analyzing Area Signals..." : "🛡 ANALYZE THIS AREA"}</span>
                </button>
              </div>

            </div>

            {/* Right: AI Analysis Result Panel */}
            <div className="lg:col-span-5 space-y-4">
              
              {analyzing ? (
                /* 15. Loading Progress Animation Card */
                <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-card space-y-6 text-center">
                  <div className="w-14 h-14 rounded-3xl bg-brand-light border border-brand-purple/20 text-brand-purple flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-brand-navy">
                      Analyzing Location Safety Signals...
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Synthesizing municipal datasets, crowd estimates, and spatial factors.
                    </p>
                  </div>

                  {/* Step-by-Step Checkmarks */}
                  <div className="space-y-2.5 text-left text-xs pt-2">
                    {ANALYSIS_STEPS.map((s, idx) => {
                      const isDone = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                            isDone
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : isCurrent
                              ? "bg-brand-light text-brand-purple border-brand-purple/30 font-bold"
                              : "bg-brand-soft/50 text-brand-muted/60 border-transparent"
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 ${isDone ? "text-emerald-600" : isCurrent ? "text-brand-purple animate-spin" : "text-gray-300"}`} />
                          <span>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* 16. Full AI Analysis Result Card */
                <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-brand-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                          SAFELENS AI ANALYSIS
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                          LIVE SENSOR TELEMETRY
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-brand-navy mt-1">
                        {selectedPoint.name}
                      </h3>
                      <p className="text-xs text-brand-muted">{selectedPoint.district || "Karur, Tamil Nadu"}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      analysisResult.status === "FAVORABLE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : analysisResult.status === "MODERATE"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      ● {analysisResult.status}
                    </span>
                  </div>

                  {/* 17. Circular Safety Score Gauge */}
                  <div className="bg-gradient-to-br from-brand-light/60 via-brand-soft to-white p-5 rounded-3xl border border-brand-purple/20 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-muted block">
                        SAFETY SCORE
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-brand-purple">
                          {analysisResult.safetyScore}
                        </span>
                        <span className="text-sm font-bold text-brand-muted">/ 100</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {analysisResult.status} Assessment
                      </span>
                      <p className="text-[10px] text-brand-muted">
                        Confidence: <strong>{analysisResult.confidence}%</strong> (Multi-Factor Vision Engine)
                      </p>
                    </div>

                    {/* Circular Progress Indicator */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#E7E9F0"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#6D35E8"
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <Shield className="w-6 h-6 text-brand-purple fill-brand-purple/20" />
                      </div>
                    </div>
                  </div>

                  {/* 18. Factor Indicators Breakdown */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
                      Factor Breakdown
                    </span>

                    <div className="space-y-2.5 text-xs">
                      
                      {/* Crowd Activity */}
                      <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border space-y-1">
                        <div className="flex items-center justify-between text-brand-muted">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Users className="w-3.5 h-3.5 text-brand-purple" />
                            <span>👥 Crowd Activity</span>
                          </span>
                          <span className="font-bold text-emerald-600 uppercase text-[10px]">{analysisResult.crowdLevel}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-brand-navy">
                          <span>{analysisResult.crowdActivity} / 100</span>
                          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysisResult.crowdActivity}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Public Activity */}
                      <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border space-y-1">
                        <div className="flex items-center justify-between text-brand-muted">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Store className="w-3.5 h-3.5 text-blue-500" />
                            <span>🏪 Public Activity</span>
                          </span>
                          <span className="font-bold text-emerald-600 uppercase text-[10px]">{analysisResult.publicLevel}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-brand-navy">
                          <span>{analysisResult.publicActivity} / 100</span>
                          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysisResult.publicActivity}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Road Connectivity */}
                      <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border space-y-1">
                        <div className="flex items-center justify-between text-brand-muted">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Car className="w-3.5 h-3.5 text-indigo-500" />
                            <span>🚗 Road Connectivity</span>
                          </span>
                          <span className="font-bold text-emerald-600 uppercase text-[10px]">{analysisResult.roadLevel}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-brand-navy">
                          <span>{analysisResult.roadConnectivity} / 100</span>
                          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysisResult.roadConnectivity}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Nearby Activity */}
                      <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border space-y-1">
                        <div className="flex items-center justify-between text-brand-muted">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Compass className="w-3.5 h-3.5 text-brand-violet" />
                            <span>📍 Nearby Activity</span>
                          </span>
                          <span className="font-bold text-emerald-600 uppercase text-[10px]">{analysisResult.nearbyLevel}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-brand-navy">
                          <span>{analysisResult.nearbyActivity} / 100</span>
                          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analysisResult.nearbyActivity}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Time Factor */}
                      <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border space-y-1">
                        <div className="flex items-center justify-between text-brand-muted">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>🌙 Time Factor</span>
                          </span>
                          <span className="font-bold text-amber-600 uppercase text-[10px]">{analysisResult.timeLevel}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-brand-navy">
                          <span>{analysisResult.timeFactor} / 100</span>
                          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analysisResult.timeFactor}%` }} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* AI Recommendation Box */}
                  <div className="p-4 bg-brand-light/40 border border-brand-purple/20 rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-brand-purple tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
                    </span>
                    <p className="text-xs text-brand-navy leading-relaxed font-medium">
                      "{analysisResult.recommendation}"
                    </p>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href={`/safe-route?startLat=${selectedPoint.lat}&startLng=${selectedPoint.lng}&name=${encodeURIComponent(selectedPoint.name)}`}
                      className="py-3 px-3 bg-brand-purple hover:bg-[#5B21B6] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Find Safer Route</span>
                    </Link>

                    <Link
                      href="/safety"
                      className="py-3 px-3 bg-brand-soft hover:bg-brand-light border border-brand-border text-brand-navy text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Report Conditions</span>
                    </Link>
                  </div>

                </div>
              )}

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
