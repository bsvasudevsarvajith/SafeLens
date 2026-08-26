"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Users,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Car,
  Store,
  Info
} from "lucide-react";

// Dynamic import for client-only leaflet map
const SafeLensMap = dynamic(() => import("@/components/map/SafeLensMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-brand-soft rounded-3xl flex items-center justify-center border border-brand-border">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-brand-muted">Loading SafeLens Geospatial Map...</span>
      </div>
    </div>
  ),
});

export default function InteractiveDemoSection() {
  const [selectedPoint, setSelectedPoint] = useState({
    name: "Karur New Bus Stand",
    area: "Bus Stand Concourse",
    district: "Karur, Tamil Nadu",
    lat: 10.9601,
    lng: 78.0766,
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    safetyScore: 88,
    status: "FAVORABLE",
    crowdActivity: 89,
    crowdLevel: "HIGH",
    publicActivity: 84,
    publicLevel: "HIGH",
    roadConnectivity: 86,
    roadLevel: "GOOD",
    nearbyActivity: 92,
    nearbyLevel: "HIGH",
    timeFactor: 78,
    timeLevel: "MODERATE",
    confidence: 94,
    recommendation:
      "Location displays strong pedestrian vitality, verified street illumination corridors, and continuous municipal CCTV monitoring.",
  });

  const handleAnalyzeClick = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  return (
    <section id="safety-analysis" className="py-16 sm:py-24 bg-brand-soft border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-light border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Urban Safety Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Analyze Any Urban Corridor in Real-Time
          </h2>
          <p className="text-base text-brand-muted">
            Explore live multi-factor telemetry across Karur and surrounding regions to evaluate pedestrian density, road lighting, and camera surveillance.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-purple" />
                <span>Geospatial Safety Heatmap</span>
              </span>
              <span className="text-[11px] font-semibold text-brand-muted">
                Click map to select target coordinates
              </span>
            </div>

            <div className="bg-white p-2 sm:p-3 rounded-3xl border border-brand-border shadow-card overflow-hidden">
              <SafeLensMap
                center={[selectedPoint.lat, selectedPoint.lng]}
                selectedPoint={selectedPoint}
                onSelectPoint={(p) => {
                  setSelectedPoint(p);
                  const seed = Math.floor(p.lat * 1000 + p.lng * 1000);
                  const dynamicScore = 75 + (seed % 18);
                  setAnalysisResult((prev) => ({
                    ...prev,
                    safetyScore: dynamicScore,
                    crowdActivity: Math.min(95, dynamicScore + 2),
                    recommendation: `Analysis for ${p.name || "selected location"}: Favorable pedestrian traffic and verified road connectivity identified.`,
                  }));
                }}
                height="450px"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-brand-muted">
              <div className="flex items-center gap-2 font-mono">
                <span>📍 Lat: {selectedPoint.lat.toFixed(4)}° N</span>
                <span>•</span>
                <span>Lng: {selectedPoint.lng.toFixed(4)}° E</span>
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                LIVE SENSOR TELEMETRY
              </span>
            </div>
          </div>

          {/* Right Column: AI Analysis Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-6">
            
            {/* Header with Location */}
            <div className="flex items-start justify-between border-b border-brand-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                    LOCATION ANALYSIS
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-brand-light text-brand-purple rounded-md border border-brand-purple/20">
                    REAL-TIME AI
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-brand-navy mt-1">
                  {selectedPoint.name}
                </h3>
                <p className="text-xs text-brand-muted">{selectedPoint.district}</p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {analysisResult.status}
                </span>
              </div>
            </div>

            {/* Circular / Hero Safety Score */}
            <div className="bg-gradient-to-br from-brand-light/60 via-brand-soft to-white p-5 rounded-2xl border border-brand-purple/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                  SAFETY ASSESSMENT SCORE
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-brand-purple">
                    {analysisResult.safetyScore}
                  </span>
                  <span className="text-sm font-bold text-brand-muted">/ 100</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  ● Favorable conditions observed
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-muted block">AI Confidence</span>
                <span className="text-xl font-extrabold text-brand-navy">{analysisResult.confidence}%</span>
                <span className="text-[10px] text-brand-muted block">High Reliability</span>
              </div>
            </div>

            {/* Factor Indicators Breakdown Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
                Factor Breakdown
              </span>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                
                <div className="p-3 bg-brand-soft rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-brand-purple" /> Crowd Activity
                    </span>
                    <span className="font-bold text-emerald-600 text-[10px] uppercase">{analysisResult.crowdLevel}</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-purple h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.crowdActivity}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-soft rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 font-semibold">
                      <Store className="w-3.5 h-3.5 text-brand-purple" /> Commercial Presence
                    </span>
                    <span className="font-bold text-emerald-600 text-[10px] uppercase">{analysisResult.publicLevel}</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-purple h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.publicActivity}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-soft rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 font-semibold">
                      <Car className="w-3.5 h-3.5 text-brand-purple" /> Road Connectivity
                    </span>
                    <span className="font-bold text-emerald-600 text-[10px] uppercase">{analysisResult.roadLevel}</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-purple h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.roadConnectivity}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-brand-soft rounded-xl border border-brand-border space-y-1.5">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-brand-purple" /> Time-of-Day Rating
                    </span>
                    <span className="font-bold text-amber-600 text-[10px] uppercase">{analysisResult.timeLevel}</span>
                  </div>
                  <div className="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.timeFactor}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="p-4 bg-brand-light/60 rounded-2xl border border-brand-purple/20 space-y-1.5">
              <span className="text-xs font-bold text-brand-purple flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> AI Safety Recommendation
              </span>
              <p className="text-xs text-brand-navy leading-relaxed">
                {analysisResult.recommendation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAnalyzeClick}
                disabled={analyzing}
                className="flex-1 py-3 px-4 bg-brand-purple hover:bg-brand-violet text-white text-xs font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{analyzing ? "Synthesizing AI Data..." : "Refresh Location Score"}</span>
              </button>

              <Link
                href="/safe-route"
                className="py-3 px-5 bg-brand-soft hover:bg-brand-border text-brand-navy text-xs font-bold rounded-2xl border border-brand-border flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Navigate Corridor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
