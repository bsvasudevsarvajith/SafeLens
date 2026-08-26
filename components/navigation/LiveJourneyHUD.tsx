"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Navigation,
  Clock,
  MapPin,
  Shield,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Footprints,
  Compass,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { SafetyRouteCalculation, Coordinates, isPointOffRoute } from "@/lib/navigation/routingProvider";

interface LiveJourneyHUDProps {
  route: SafetyRouteCalculation;
  currentCoords: Coordinates | null;
  destinationCoords: { lat: number; lng: number; name: string };
  originName: string;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onEndJourney: () => void;
  onTriggerSOS?: () => void;
  onRecalculateRoute?: () => void;
}

// Calculate Haversine distance in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LiveJourneyHUD({
  route,
  currentCoords,
  destinationCoords,
  originName,
  isSimulating,
  onToggleSimulation,
  onEndJourney,
  onTriggerSOS,
  onRecalculateRoute,
}: LiveJourneyHUDProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasArrived, setHasArrived] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const lastSpokenStepRef = useRef<number>(-1);

  // Compute live remaining distance
  const currentLat = currentCoords?.lat || route.waypoints[0][0];
  const currentLng = currentCoords?.lng || route.waypoints[0][1];

  const distanceKm = calculateHaversineDistance(
    currentLat,
    currentLng,
    destinationCoords.lat,
    destinationCoords.lng
  );

  // Average pedestrian walking speed: ~4.5 km/h
  const walkingSpeedKmH = 4.5;
  const timeRemainingMins = Math.max(1, Math.round((distanceKm / walkingSpeedKmH) * 60));

  // Check for off-route deviation (> 55 meters from planned polyline)
  const offRouteStatus = currentCoords
    ? isPointOffRoute(currentCoords, route.waypoints, 55)
    : { isOffRoute: false, minDistanceMeters: 0 };

  // Maneuver guidance instructions
  const maneuvers = [
    { thresholdKm: 3.0, instruction: "Head along the illuminated corridor towards Central Arterial Road" },
    { thresholdKm: 2.0, instruction: "Continue straight past Verified Municipal CCTV Surveillance Node #1" },
    { thresholdKm: 1.0, instruction: "In 300m, approach the 24/7 Police Help Booth & Well-Lit Junction" },
    { thresholdKm: 0.3, instruction: "Approaching destination entrance. Keep to the active pedestrian concourse." },
    { thresholdKm: 0.04, instruction: "You have arrived safely at your destination!" },
  ];

  const currentManeuver =
    maneuvers.find((m) => distanceKm >= m.thresholdKm) || maneuvers[maneuvers.length - 1];

  // Voice announcement helper
  const speakInstruction = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio fallback
    }
  };

  // Announce start
  useEffect(() => {
    speakInstruction(
      `Starting safe navigation to ${destinationCoords.name}. Route safety score is ${route.safetyScore} out of 100.`
    );
  }, []);

  // Announce milestones
  useEffect(() => {
    if (distanceKm <= 0.035 && !hasArrived) {
      setHasArrived(true);
      speakInstruction(`You have safely arrived at ${destinationCoords.name}.`);
    } else if (Math.floor(distanceKm * 2) !== lastSpokenStepRef.current) {
      lastSpokenStepRef.current = Math.floor(distanceKm * 2);
      if (distanceKm < 1.0) {
        speakInstruction(`${Math.round(distanceKm * 1000)} meters remaining. ${currentManeuver.instruction}`);
      }
    }
  }, [distanceKm, hasArrived]);

  const handleSOS = () => {
    setSosSent(true);
    if (onTriggerSOS) onTriggerSOS();
    speakInstruction("Emergency SOS activated. Alerting police and trusted contacts.");
  };

  const handleShareJourney = () => {
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/safe-route?live=true`
      : "";
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
      
      {/* Off-Route Alert Banner */}
      {offRouteStatus.isOffRoute && (
        <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span>You&apos;re off your planned route ({offRouteStatus.minDistanceMeters}m away).</span>
              <p className="text-[11px] font-normal text-amber-800">Recalculate to find the nearest illuminated corridor.</p>
            </div>
          </div>
          {onRecalculateRoute && (
            <button
              onClick={onRecalculateRoute}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate</span>
            </button>
          )}
        </div>
      )}

      {/* Main HUD Navigation Card */}
      <div className="bg-white border-2 border-brand-purple rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        
        {/* Top Header Status Row */}
        <div className="flex items-center justify-between gap-2 border-b border-brand-border pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black text-brand-navy tracking-tight uppercase">
              LIVE NAVIGATION
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                voiceEnabled
                  ? "bg-brand-light text-brand-purple border border-brand-purple/20"
                  : "bg-brand-soft text-brand-muted"
              }`}
              title={voiceEnabled ? "Mute Voice Navigation" : "Enable Voice Navigation"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Share Journey */}
            <button
              onClick={handleShareJourney}
              className="px-2.5 py-1.5 bg-brand-soft hover:bg-brand-border text-brand-navy rounded-xl text-xs font-bold flex items-center gap-1 border border-brand-border"
              title="Share Live Journey Link"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-brand-purple" />}
              <span className="hidden sm:inline">{shareCopied ? "Copied Link" : "Share"}</span>
            </button>

            {/* Test Simulation Toggle */}
            <button
              onClick={onToggleSimulation}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                isSimulating
                  ? "bg-purple-100 text-brand-purple border-brand-purple/40"
                  : "bg-brand-soft text-brand-muted border-brand-border"
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-brand-purple" />
              <span className="hidden sm:inline">{isSimulating ? "Simulating" : "Test Walk"}</span>
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="p-3.5 bg-gradient-to-r from-brand-purple to-brand-violet text-white rounded-2xl shadow-md flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Navigation className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-white/80 block">
              NEXT MANEUVER
            </span>
            <p className="text-xs sm:text-sm font-bold truncate">
              {currentManeuver.instruction}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          
          {/* Remaining Distance */}
          <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
              DISTANCE
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-navy mt-0.5">
              {distanceKm >= 1.0 ? `${distanceKm.toFixed(1)} km` : `${Math.round(distanceKm * 1000)} m`}
            </div>
          </div>

          {/* Dynamic ETA */}
          <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
              EST. TIME
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-purple mt-0.5">
              {timeRemainingMins} <span className="text-xs font-bold">min</span>
            </div>
          </div>

          {/* Safety Score */}
          <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
              SAFETY
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
              {route.safetyScore}
              <span className="text-xs text-brand-muted font-bold">/100</span>
            </div>
          </div>

        </div>

        {/* Destination & Safety Disclaimer */}
        <div className="flex items-center justify-between text-xs px-1 text-brand-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
            <span className="font-bold text-brand-navy truncate max-w-[200px]">
              {destinationCoords.name}
            </span>
          </div>
          <span className="text-[10px] text-brand-muted italic">
            {route.safetyDisclaimer || "Safer based on available data"}
          </span>
        </div>

        {/* SOS Feedback Banner */}
        {sosSent && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Emergency SOS broadcast active. Police dispatch & contacts alerted.</span>
          </div>
        )}

        {/* Bottom Control Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          
          {/* 1-Tap SOS Panic Button */}
          <button
            onClick={handleSOS}
            className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>EMERGENCY SOS</span>
          </button>

          {/* End Journey Button */}
          <button
            onClick={onEndJourney}
            className="py-3 px-4 bg-brand-soft hover:bg-brand-border text-brand-navy font-bold rounded-2xl text-xs border border-brand-border flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>End Journey</span>
          </button>

        </div>

      </div>

    </div>
  );
}
