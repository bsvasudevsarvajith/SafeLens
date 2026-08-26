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
  Compass
} from "lucide-react";
import { RouteOption } from "@/lib/geo/routingService";

interface LiveJourneyHUDProps {
  route: RouteOption;
  currentCoords: { lat: number; lng: number } | null;
  destinationCoords: { lat: number; lng: number; name: string };
  originName: string;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onEndJourney: () => void;
  onTriggerSOS?: () => void;
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
}: LiveJourneyHUDProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasArrived, setHasArrived] = useState(false);
  const [sosSent, setSosSent] = useState(false);
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

  // Average pedestrian walking speed: ~4.8 km/h (~12.5 mins per km)
  const walkingSpeedKmH = 4.8;
  const timeRemainingMins = Math.max(1, Math.round((distanceKm / walkingSpeedKmH) * 60));

  // Determine current maneuver instruction based on distance remaining
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

  // Announce initial start
  useEffect(() => {
    speakInstruction(
      `Starting safe navigation towards ${destinationCoords.name}. Route safety score is ${route.safetyScore} out of 100.`
    );
  }, []);

  // Announce distance & maneuver milestones
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
    speakInstruction("Emergency SOS triggered. Sharing live coordinates with emergency responders.");
  };

  return (
    <div className="space-y-4">
      
      {/* Live Navigation Primary HUD Card */}
      <div className="bg-white border-2 border-brand-purple rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
        
        {/* Top Header Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black text-brand-navy tracking-tight uppercase">
              Live Safe Navigation Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (!voiceEnabled) speakInstruction("Voice navigation enabled.");
              }}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                voiceEnabled
                  ? "bg-brand-light border-brand-purple/30 text-brand-purple"
                  : "bg-brand-soft border-brand-border text-brand-muted"
              }`}
              title="Toggle Voice Guidance"
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{voiceEnabled ? "Voice On" : "Muted"}</span>
            </button>

            {/* Test Simulation Button */}
            <button
              onClick={onToggleSimulation}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSimulating
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-brand-soft border-brand-border text-brand-navy hover:bg-brand-light"
              }`}
              title="Test journey movement on desktop"
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Footprints className="w-3.5 h-3.5 text-brand-purple" />}
              <span>{isSimulating ? "Pause Walk Sim" : "Test Walk (Simulation)"}</span>
            </button>

            {/* SOS Trigger */}
            <button
              onClick={handleSOS}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Panic</span>
            </button>
          </div>
        </div>

        {/* SOS Sent Banner */}
        {sosSent && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Emergency SOS dispatched! Live GPS location shared with emergency contacts & Karur Police.</span>
            </div>
            <button
              onClick={() => setSosSent(false)}
              className="text-[10px] underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Distance & ETA Dashboard Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Distance To Go */}
          <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider block">
              Distance to Go
            </span>
            <div className="text-2xl sm:text-3xl font-black text-brand-navy">
              {distanceKm >= 1 ? `${distanceKm.toFixed(1)} km` : `${Math.round(distanceKm * 1000)} m`}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider block">
              Est. Time Remaining
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {timeRemainingMins} <span className="text-xs text-brand-muted font-bold">min</span>
            </div>
          </div>

          {/* Live Safety Level */}
          <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider block">
              Corridor Safety
            </span>
            <div className="text-2xl sm:text-3xl font-black text-brand-purple">
              {route.safetyScore}<span className="text-xs text-brand-muted font-bold">/100</span>
            </div>
          </div>

          {/* Activity / Illumination */}
          <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-brand-muted tracking-wider block">
              Active Monitoring
            </span>
            <div className="text-lg font-black text-emerald-700 mt-1 flex items-center justify-center gap-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>High Activity</span>
            </div>
          </div>

        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="p-4 bg-brand-light border border-brand-purple/20 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-brand-purple text-white rounded-xl shadow-md shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple block">
              Next Turn-by-Turn Maneuver
            </span>
            <p className="text-xs sm:text-sm font-black text-brand-navy">
              {currentManeuver.instruction}
            </p>
          </div>
        </div>

        {/* Navigation Footer Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-brand-muted font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-purple" />
            <span>Target: <b>{destinationCoords.name}</b></span>
          </div>

          <button
            onClick={onEndJourney}
            className="px-5 py-2 bg-brand-soft hover:bg-red-50 text-brand-navy hover:text-red-700 border border-brand-border hover:border-red-200 rounded-xl text-xs font-bold transition-all"
          >
            End Navigation
          </button>
        </div>

      </div>

      {/* Arrival Celebration Modal */}
      {hasArrived && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-brand-navy">Safe Arrival Completed!</h3>
              <p className="text-xs text-brand-muted">
                You have reached <strong>{destinationCoords.name}</strong> via the verified safe corridor.
              </p>
            </div>

            <div className="p-4 bg-brand-soft border border-brand-border rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Total Distance:</span>
                <span className="font-black text-brand-navy">{route.distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Average Safety Score:</span>
                <span className="font-black text-emerald-700">{route.safetyScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Monitored Zones:</span>
                <span className="font-black text-brand-purple">Active CCTV Corridors</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onEndJourney}
                className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs shadow-md shadow-brand-purple/20 transition-all"
              >
                Finish & Close Journey
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
