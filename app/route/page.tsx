"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import RouteMap from "@/components/map/RouteMap";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { RouteOption } from "@/lib/geo/routingService";
import { KARUR_NEW_BUS_STAND } from "@/lib/geo/karurBounds";
import { Shield, MapPin, ArrowLeft, Clock, Navigation, CheckCircle2, Award, Info, Sparkles } from "lucide-react";

function RouteAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startLat = searchParams.get("startLat") || "10.9582";
  const startLng = searchParams.get("startLng") || "78.0825";
  const originName = searchParams.get("name") || "Karur Railway Station";

  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (!session) {
      router.replace("/login");
      return;
    }

    async function fetchRouteData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/routes/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startLat: parseFloat(startLat),
            startLng: parseFloat(startLng),
            originName: originName,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to calculate safety routes.");
        }

        setRoutes(data.routes || []);
        setSelectedRouteId(data.recommendedRouteId || data.routes[0]?.id || "");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred while analyzing routes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRouteData();
  }, [startLat, startLng, originName, router]);

  const recommendedRoute = routes.find((r) => r.isRecommended) || routes[0];
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || recommendedRoute;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-3 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-xl text-xs font-semibold text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Location Selection</span>
        </button>

        <span className="text-xs text-gray-400">
          Destination: <strong className="text-white">{KARUR_NEW_BUS_STAND.name}</strong>
        </span>
      </div>

      {/* Origin to Destination Flow */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400">Start Location</div>
            <div className="font-bold text-white text-sm sm:text-base">{originName}</div>
          </div>
        </div>

        <div className="hidden md:block text-gray-500 font-bold text-lg">→</div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400">Destination (Supported)</div>
            <div className="font-bold text-white text-sm sm:text-base">{KARUR_NEW_BUS_STAND.name}</div>
          </div>
        </div>

        <div className="p-2 bg-navy-900 border border-navy-700 rounded-xl text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Density Analysis Active</span>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <NoticeDisclaimer variant="banner" />

      {/* Content Layout */}
      {loading ? (
        <div className="bg-navy-800 border border-navy-700 rounded-3xl p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-300">Generating available routes & analyzing safety/activity data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-950/40 border border-red-500/40 rounded-3xl p-6 text-center space-y-3">
          <h3 className="text-lg font-bold text-red-300">Route Analysis Error</h3>
          <p className="text-xs text-gray-300">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
          >
            Try Another Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Ranked Routes List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-200">Available Route Alternatives</h2>
              <span className="text-xs text-gray-400">{routes.length} Routes Analyzed</span>
            </div>

            {/* Recommended Route Rationale Header */}
            {recommendedRoute && (
              <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-navy-800 border border-emerald-500/40 rounded-2xl space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Recommended Route
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Safety Score: {recommendedRoute.safetyScore}/100
                  </span>
                </div>
                <div className="font-bold text-white text-base">{recommendedRoute.name}</div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong>Reason:</strong> {recommendedRoute.recommendationReason}
                </p>
              </div>
            )}

            {/* Routes Cards List */}
            <div className="space-y-3">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "bg-navy-800 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                        : "bg-navy-800/60 border-navy-700/80 hover:border-navy-600 hover:bg-navy-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{route.name}</h3>
                          {route.isRecommended && (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{route.via}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-white">{route.safetyScore}<span className="text-xs text-gray-400">/100</span></div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Safety Score</div>
                      </div>
                    </div>

                    {/* Route Stats Pill */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy-700/60 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Distance</span>
                        <span className="font-semibold text-white">{route.distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Est. Time</span>
                        <span className="font-semibold text-white">{route.durationMins} min</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Activity Score</span>
                        <span className={`font-semibold ${
                          route.activityLevel === "HIGH" ? "text-emerald-400" : route.activityLevel === "MEDIUM" ? "text-amber-400" : "text-gray-400"
                        }`}>
                          {route.activityScore} ({route.activityLevel})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Route Map */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-200">Route Map Visualizer</h2>
              <span className="text-xs text-emerald-400 font-semibold">Active: {activeRoute.name}</span>
            </div>

            <RouteMap
              startLocation={{
                lat: parseFloat(startLat),
                lng: parseFloat(startLng),
                name: originName,
              }}
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => setSelectedRouteId(id)}
            />
          </div>

        </div>
      )}

    </main>
  );
}

export default function RouteAnalysisPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <RouteAnalysisContent />
        </Suspense>
      </div>
    </div>
  );
}
