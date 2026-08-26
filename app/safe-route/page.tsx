"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import dynamic from "next/dynamic";
import LiveJourneyHUD from "@/components/navigation/LiveJourneyHUD";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
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
  AlertTriangle,
  Play,
  Footprints,
  RotateCcw,
  Compass,
  PhoneCall,
  Flame
} from "lucide-react";

import {
  SafetyRouteCalculation,
  Coordinates,
  getSafetyAwareRoutes,
  calculateHaversineDistance
} from "@/lib/navigation/routingProvider";
import { KARUR_NEW_BUS_STAND } from "@/lib/geo/karurBounds";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

// Client-only Route Map
const RouteMap = dynamic(() => import("@/components/map/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] sm:h-[520px] bg-brand-soft rounded-3xl flex items-center justify-center border border-brand-border">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-brand-muted">Loading Safety-Aware Map...</span>
      </div>
    </div>
  ),
});

function SafeRouteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const startLat = parseFloat(searchParams.get("startLat") || "10.9582");
  const startLng = parseFloat(searchParams.get("startLng") || "78.0825");
  const [originName, setOriginName] = useState(searchParams.get("name") || "Karur Railway Station");
  const [destinationName, setDestinationName] = useState("Karur New Bus Stand");
  
  const [routes, setRoutes] = useState<SafetyRouteCalculation[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-safer");
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  // ================= LIVE NAVIGATION STATES =================
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentUserCoords, setCurrentUserCoords] = useState<Coordinates | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);

  const simulationStepRef = useRef(0);
  const simulationTimerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const destinationLocation = {
    lat: KARUR_NEW_BUS_STAND.lat,
    lng: KARUR_NEW_BUS_STAND.lng,
    name: destinationName,
  };

  // 1. Fetch & Calculate Safety-Aware Routes on mount
  useEffect(() => {
    async function loadRoutes() {
      setLoadingRoutes(true);
      const calculated = await getSafetyAwareRoutes(
        { lat: startLat, lng: startLng },
        destinationLocation
      );
      setRoutes(calculated);
      setLoadingRoutes(false);
    }
    loadRoutes();
  }, [startLat, startLng]);

  // 2. Check for active journey in localStorage upon refresh
  useEffect(() => {
    const savedJourney = localStorage.getItem("wsrs_active_journey");
    if (savedJourney) {
      try {
        const parsed = JSON.parse(savedJourney);
        if (parsed.isNavigating && parsed.route) {
          setIsNavigating(true);
          setSelectedRouteId(parsed.route.id);
          setActiveJourneyId(parsed.journeyId);
          if (parsed.currentCoords) {
            setCurrentUserCoords(parsed.currentCoords);
          }
          startLocationWatcher();
        }
      } catch {
        localStorage.removeItem("wsrs_active_journey");
      }
    }
  }, []);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Start real GPS watcher
  const startLocationWatcher = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentUserCoords(coords);
          setPermissionDenied(false);

          // Update local & firestore journey state
          if (activeJourneyId) {
            try {
              const journeyRef = doc(db, "journeys", activeJourneyId);
              setDoc(journeyRef, {
                lastLocation: coords,
                lastLocationUpdatedAt: new Date().toISOString(),
              }, { merge: true });
            } catch {
              // ignore
            }
          }
        },
        (err) => {
          console.warn("[GPS Watcher] Geolocation warning:", err.message);
          if (err.code === err.PERMISSION_DENIED) {
            setPermissionDenied(true);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000,
        }
      );
      watchIdRef.current = id;
    }
  };

  // Handle Start Journey Flow
  const handleInitiateJourney = () => {
    // Check geolocation permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          executeStartJourney({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setPermissionModalOpen(true);
          } else {
            // fallback to route start point
            executeStartJourney({ lat: activeRoute.waypoints[0][0], lng: activeRoute.waypoints[0][1] });
          }
        },
        { timeout: 5000 }
      );
    } else {
      executeStartJourney({ lat: activeRoute.waypoints[0][0], lng: activeRoute.waypoints[0][1] });
    }
  };

  const executeStartJourney = async (initialCoords: Coordinates) => {
    setPermissionModalOpen(false);
    setIsNavigating(true);
    setCurrentUserCoords(initialCoords);

    const journeyId = `journey-${Date.now()}`;
    setActiveJourneyId(journeyId);

    // Save to Firestore
    try {
      const session = localStorage.getItem("wsrs_session");
      const user = session ? JSON.parse(session) : null;
      const journeyRecord = {
        journeyId: journeyId,
        userId: user?.uid || "anonymous-traveler",
        origin: { name: originName, lat: startLat, lng: startLng },
        destination: destinationLocation,
        routeDistance: activeRoute.distanceKm,
        estimatedDuration: activeRoute.durationMins,
        safetyScore: activeRoute.safetyScore,
        status: "ACTIVE",
        startedAt: new Date().toISOString(),
        lastLocation: initialCoords,
        lastLocationUpdatedAt: new Date().toISOString(),
      };

      const journeyDocRef = doc(db, "journeys", journeyId);
      await setDoc(journeyDocRef, journeyRecord, { merge: true });
    } catch (err) {
      console.warn("[Firestore] Journey log note:", err);
    }

    // Persist to localStorage
    localStorage.setItem("wsrs_active_journey", JSON.stringify({
      isNavigating: true,
      journeyId: journeyId,
      route: activeRoute,
      currentCoords: initialCoords,
      startedAt: new Date().toISOString(),
    }));

    startLocationWatcher();
  };

  // Toggle Test Walk Simulation
  const handleToggleSimulation = () => {
    if (isSimulating) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simulationStepRef.current = 0;
      simulationTimerRef.current = setInterval(() => {
        if (!activeRoute) return;
        const totalWaypoints = activeRoute.waypoints.length;
        simulationStepRef.current = (simulationStepRef.current + 1) % totalWaypoints;
        const nextCoord = activeRoute.waypoints[simulationStepRef.current];
        setCurrentUserCoords({ lat: nextCoord[0], lng: nextCoord[1] });
      }, 2500);
    }
  };

  // End Journey
  const handleEndJourney = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }

    if (activeJourneyId) {
      try {
        const journeyDocRef = doc(db, "journeys", activeJourneyId);
        await setDoc(journeyDocRef, {
          status: "COMPLETED",
          endedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // ignore
      }
    }

    localStorage.removeItem("wsrs_active_journey");
    setIsNavigating(false);
    setIsSimulating(false);
    setCurrentUserCoords(null);
    setActiveJourneyId(null);
  };

  // Recalculate route
  const handleRecalculateRoute = async () => {
    if (!currentUserCoords) return;
    setLoadingRoutes(true);
    const newRoutes = await getSafetyAwareRoutes(currentUserCoords, destinationLocation);
    setRoutes(newRoutes);
    setSelectedRouteId("route-safer");
    setLoadingRoutes(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex pb-20 md:pb-0">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          
          {/* Top Header Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Safety-Aware Corridor Routing</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight flex items-center gap-2">
                <span>SafeRoute Navigation</span>
                {isNavigating && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full animate-pulse">
                    Live GPS Active
                  </span>
                )}
              </h1>
              <p className="text-xs text-brand-muted">
                Origin: <strong>{originName}</strong> ➔ Destination: <strong>{destinationName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-3.5 py-2 bg-brand-soft hover:bg-brand-border text-brand-navy text-xs font-bold rounded-2xl border border-brand-border flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* Location Permission Modal */}
          {permissionModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-brand-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-purple flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-brand-navy">Location Permission</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    SafeRoute uses your live location to provide turn-by-turn safe navigation, calculate distance to go, and update your journey in real time.
                  </p>
                </div>

                <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border text-[11px] text-brand-muted space-y-1">
                  <span className="font-bold text-brand-navy block">Why we require GPS:</span>
                  <p>• Live route deviation & off-route alerts</p>
                  <p>• Emergency SOS coordinate broadcasting</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setPermissionModalOpen(false)}
                    className="py-2.5 bg-brand-soft hover:bg-brand-border text-brand-navy text-xs font-bold rounded-xl border border-brand-border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => executeStartJourney({ lat: activeRoute.waypoints[0][0], lng: activeRoute.waypoints[0][1] })}
                    className="py-2.5 bg-brand-purple hover:bg-brand-violet text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Allow & Start
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Permission Denied Warning */}
          {permissionDenied && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>GPS permission denied. Enable location services in your browser settings for accurate live tracking.</span>
              </div>
              <button
                onClick={startLocationWatcher}
                className="font-bold underline text-amber-900 shrink-0 ml-2"
              >
                Retry GPS
              </button>
            </div>
          )}

          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            
            {/* Map Column (Occupies major screen space) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="bg-white p-2 sm:p-3 rounded-3xl border border-brand-border shadow-card overflow-hidden">
                {activeRoute ? (
                  <RouteMap
                    routes={routes as any}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={(id) => setSelectedRouteId(id)}
                    startLocation={{ lat: startLat, lng: startLng, name: originName }}
                    destinationLocation={destinationLocation}
                    currentUserCoords={currentUserCoords}
                    isNavigating={isNavigating}
                  />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-xs text-brand-muted">
                    Calculating route geometry...
                  </div>
                )}
              </div>

              {/* Map Footer Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-brand-muted">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>📍 GPS: {currentUserCoords ? `${currentUserCoords.lat.toFixed(4)}, ${currentUserCoords.lng.toFixed(4)}` : `${startLat.toFixed(4)}, ${startLng.toFixed(4)}`}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ● MUNICIPAL CCTV MONITORED CORRIDOR
                </span>
              </div>
            </div>

            {/* Right Controls Column / HUD Column */}
            <div className="lg:col-span-4 space-y-4">
              
              {isNavigating && activeRoute ? (
                /* LIVE JOURNEY NAVIGATION HUD */
                <LiveJourneyHUD
                  route={activeRoute}
                  currentCoords={currentUserCoords}
                  destinationCoords={destinationLocation}
                  originName={originName}
                  isSimulating={isSimulating}
                  onToggleSimulation={handleToggleSimulation}
                  onEndJourney={handleEndJourney}
                  onTriggerSOS={() => router.push("/emergency")}
                  onRecalculateRoute={handleRecalculateRoute}
                />
              ) : (
                /* ROUTE SELECTION & START JOURNEY CONTROLLER */
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-card space-y-5">
                  
                  <div>
                    <h2 className="font-extrabold text-brand-navy text-base">Select Route Preference</h2>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Choose between highest safety score or shortest travel time.
                    </p>
                  </div>

                  {/* Route Options List */}
                  <div className="space-y-3">
                    {routes.map((r) => {
                      const isSelected = selectedRouteId === r.id;
                      const isSafer = r.type === "SAFER";
                      return (
                        <div
                          key={r.id}
                          onClick={() => setSelectedRouteId(r.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2.5 ${
                            isSelected
                              ? "border-brand-purple bg-brand-light/60 shadow-sm"
                              : "border-brand-border bg-brand-soft hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-black ${isSafer ? "text-brand-purple" : "text-brand-navy"}`}>
                                  {r.name}
                                </span>
                                {isSafer && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                                    SAFER
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-brand-muted mt-0.5">{r.via}</p>
                            </div>

                            {/* Safety Badge */}
                            <div className="text-right">
                              <span className="text-base font-black text-emerald-600 block">
                                {r.safetyScore}<span className="text-[10px] text-brand-muted">/100</span>
                              </span>
                              <span className="text-[9px] font-bold text-brand-muted block">Safety Score</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold text-brand-navy pt-1 border-t border-brand-border/60">
                            <span>🛣️ {r.distanceKm} km</span>
                            <span>⏱️ {r.durationMins} mins</span>
                            <span className="text-emerald-700 text-[11px]">📹 CCTV Verified</span>
                          </div>

                          <p className="text-[10px] text-brand-muted leading-relaxed">
                            {r.recommendationReason}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Start Journey Button */}
                  <button
                    type="button"
                    onClick={handleInitiateJourney}
                    className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-violet hover:opacity-95 text-white font-black rounded-2xl text-sm shadow-lg shadow-brand-purple/25 flex items-center justify-center gap-2.5 transition-all active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>START JOURNEY</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <NoticeDisclaimer variant="compact" />

                </div>
              )}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default function SafeRoutePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-soft flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SafeRouteContent />
    </Suspense>
  );
}
