"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import dynamic from "next/dynamic";
import {
  Shield,
  MapPin,
  ArrowLeft,
  Clock,
  Navigation,
  CheckCircle2,
  Award,
  Sparkles,
  Search,
  ArrowRight,
  Info,
  Car,
  AlertTriangle
} from "lucide-react";

import { RouteOption } from "@/lib/geo/routingService";

// Client-only Route Map
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-brand-soft rounded-3xl flex items-center justify-center border border-brand-border">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-brand-muted">Generating Route Geometry...</span>
      </div>
    </div>
  ),
});

const DEFAULT_ROUTES: RouteOption[] = [
  {
    id: "route-a",
    name: "Route A — Via Kovai Main Road & Central Junction",
    via: "Well-illuminated 4-lane arterial road with continuous public transit",
    distanceKm: 4.2,
    durationMins: 18,
    activityScore: 85,
    safetyScore: 87,
    activityLevel: "HIGH",
    isRecommended: true,
    recommendationReason:
      "Route A provides the highest estimated commercial activity, active surveillance nodes, and optimal street lighting despite a 0.5 km extra distance.",
    waypoints: [
      [10.9582, 78.0825],
      [10.9600, 78.0810],
      [10.9615, 78.0790],
      [10.9601, 78.0766],
    ],
    segments: [
      { name: "Kovai Main Road", personCountAvg: 28, lightingScore: 90, activityLevel: "HIGH" },
      { name: "Central Junction", personCountAvg: 34, lightingScore: 95, activityLevel: "HIGH" },
    ],
  },
  {
    id: "route-b",
    name: "Route B — Via Northern Bypass Link",
    via: "Secondary connecting corridor through residential sector",
    distanceKm: 3.7,
    durationMins: 15,
    activityScore: 62,
    safetyScore: 68,
    activityLevel: "MEDIUM",
    isRecommended: false,
    recommendationReason:
      "Route B is shorter by 3 minutes, but has intermittent lighting and lower foot traffic after 8 PM.",
    waypoints: [
      [10.9582, 78.0825],
      [10.9640, 78.0800],
      [10.9630, 78.0750],
      [10.9601, 78.0766],
    ],
    segments: [
      { name: "Northern Bypass", personCountAvg: 14, lightingScore: 65, activityLevel: "MEDIUM" },
    ],
  },
  {
    id: "route-c",
    name: "Route C — Via South Canal Road Alley",
    via: "Narrow isolated connector along industrial drainage stretch",
    distanceKm: 3.8,
    durationMins: 16,
    activityScore: 35,
    safetyScore: 52,
    activityLevel: "LOW",
    isRecommended: false,
    recommendationReason:
      "Route C exhibits significantly lower public presence and sparse illumination. Not recommended for solitary nighttime travel.",
    waypoints: [
      [10.9582, 78.0825],
      [10.9530, 78.0810],
      [10.9550, 78.0750],
      [10.9601, 78.0766],
    ],
    segments: [
      { name: "South Canal Road Alley", personCountAvg: 4, lightingScore: 40, activityLevel: "LOW" },
    ],
  },
];

function SafeRouteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startLat = parseFloat(searchParams.get("startLat") || "10.9582");
  const startLng = parseFloat(searchParams.get("startLng") || "78.0825");
  const [originName, setOriginName] = useState(searchParams.get("name") || "Karur Railway Station");
  const [destinationName, setDestinationName] = useState("Karur New Bus Stand");
  
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-a");

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-purple mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Area Analysis</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Safer Route Intelligence
          </h1>
          <p className="text-xs text-brand-muted">
            Compare alternative paths based on estimated safety indicators, lighting presence, and transit duration.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 bg-brand-light text-brand-purple border border-brand-purple/20 rounded-xl self-start sm:self-auto">
          AI Multi-Route Engine
        </span>
      </div>

      {/* Origin -> Destination Search Inputs */}
      <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <div className="md:col-span-5 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-brand-muted block">
            Origin Location
          </label>
          <div className="flex items-center gap-2 bg-brand-soft px-3.5 py-2.5 rounded-2xl border border-brand-border">
            <MapPin className="w-4 h-4 text-brand-purple flex-shrink-0" />
            <input
              type="text"
              value={originName}
              onChange={(e) => setOriginName(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-brand-light text-brand-purple flex items-center justify-center font-bold text-xs">
            →
          </div>
        </div>

        <div className="md:col-span-5 space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-brand-muted block">
            Destination
          </label>
          <div className="flex items-center gap-2 bg-brand-soft px-3.5 py-2.5 rounded-2xl border border-brand-border">
            <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <input
              type="text"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-brand-navy outline-none"
            />
          </div>
        </div>

      </div>

      {/* Main Grid: Route Comparison Cards (Left) + Route Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Route Alternatives */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Available Route Alternatives ({routes.length})
            </span>
            <span className="text-[11px] font-bold text-brand-purple">
              AI Evaluated
            </span>
          </div>

          {/* Recommended Route Card Banner */}
          {routes.find((r) => r.isRecommended) && (
            <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-brand-light rounded-3xl border border-emerald-300 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>RECOMMENDED ROUTE</span>
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  Score 87/100
                </span>
              </div>
              <h3 className="text-base font-extrabold text-brand-navy">
                {routes.find((r) => r.isRecommended)?.name}
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                <strong>Why Recommended:</strong> {routes.find((r) => r.isRecommended)?.recommendationReason}
              </p>
            </div>
          )}

          {/* Route Options List */}
          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-white border-brand-purple shadow-hover ring-2 ring-brand-purple/20"
                      : "bg-white border-brand-border hover:border-brand-purple/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-brand-navy text-sm">
                          {route.name}
                        </h4>
                        {route.isRecommended && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                            Best Safety
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5">{route.via}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-brand-purple">
                        {route.safetyScore}
                        <span className="text-xs text-brand-muted">/100</span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase ${
                        route.safetyScore >= 80 ? "text-emerald-600" : route.safetyScore >= 60 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {route.safetyScore >= 80 ? "Favorable" : route.safetyScore >= 60 ? "Moderate" : "Caution"}
                      </span>
                    </div>
                  </div>

                  {/* Route Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-border text-xs">
                    <div>
                      <span className="text-[10px] text-brand-muted block">Distance</span>
                      <span className="font-bold text-brand-navy">{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted block">Est. Time</span>
                      <span className="font-bold text-brand-navy">{route.durationMins} min</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted block">Activity Level</span>
                      <span className={`font-bold ${
                        route.activityLevel === "HIGH" ? "text-emerald-600" : route.activityLevel === "MEDIUM" ? "text-amber-600" : "text-red-600"
                      }`}>
                        {route.activityLevel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Route Map Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-brand-border shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-brand-purple" />
                <span>Route Visualizer Map</span>
              </span>
              <span className="text-xs font-bold text-brand-purple">
                Viewing: {activeRoute.name.split("—")[0]}
              </span>
            </div>

            <RouteMap
              startLocation={{
                lat: startLat,
                lng: startLng,
                name: originName,
              }}
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
            />
          </div>
        </div>

      </div>

    </main>
  );
}

export default function SafeRoutePage() {
  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SafeRouteContent />
        </Suspense>
      </div>
    </div>
  );
}
