"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import {
  Shield,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Share2
} from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// Client-only Map
const SafeLensMap = dynamic(() => import("@/components/map/SafeLensMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-brand-soft rounded-3xl flex items-center justify-center border border-brand-border">
      <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function SharedJourneyPage() {
  const params = useParams();
  const journeyId = params?.id as string;

  const [journey, setJourney] = useState<any>({
    destination: { name: "Karur New Bus Stand", lat: 10.9601, lng: 78.0766 },
    origin: { name: "Karur Railway Station", lat: 10.9582, lng: 78.0825 },
    routeDistance: 4.2,
    estimatedDuration: 14,
    safetyScore: 89,
    status: "ACTIVE",
    lastLocation: { lat: 10.9592, lng: 78.0805 },
    lastLocationUpdatedAt: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchJourney() {
      if (!journeyId) return;
      try {
        const docSnap = await getDoc(doc(db, "journeys", journeyId));
        if (docSnap.exists()) {
          setJourney(docSnap.data());
        }
      } catch (err) {
        console.warn("[Shared Journey] Fetch note:", err);
      }
    }
    fetchJourney();
  }, [journeyId]);

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between">
        <SafeLensLogo size="sm" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Shared Journey</span>
        </span>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider block">
                SAFE NAVIGATION MONITOR
              </span>
              <h1 className="text-xl font-black text-brand-navy mt-0.5">
                Journey to {journey.destination?.name || "Destination"}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xl font-black text-emerald-600 block">
                {journey.safetyScore || 89}<span className="text-xs text-brand-muted">/100</span>
              </span>
              <span className="text-[10px] font-bold text-brand-muted">Safety Score</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
              <span className="text-brand-muted block text-[10px] font-bold uppercase">Distance</span>
              <span className="text-base font-black text-brand-navy">{journey.routeDistance} km</span>
            </div>
            <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
              <span className="text-brand-muted block text-[10px] font-bold uppercase">Est. Time</span>
              <span className="text-base font-black text-brand-purple">{journey.estimatedDuration} min</span>
            </div>
            <div className="p-3 bg-brand-soft rounded-2xl border border-brand-border">
              <span className="text-brand-muted block text-[10px] font-bold uppercase">Status</span>
              <span className="text-base font-black text-emerald-600">{journey.status || "ACTIVE"}</span>
            </div>
          </div>
        </div>

        {/* Live Map Display */}
        <div className="bg-white p-3 rounded-3xl border border-brand-border shadow-card overflow-hidden">
          <SafeLensMap
            center={[journey.lastLocation?.lat || 10.9601, journey.lastLocation?.lng || 78.0766]}
            selectedPoint={{
              name: journey.destination?.name || "Destination",
              lat: journey.lastLocation?.lat || 10.9601,
              lng: journey.lastLocation?.lng || 78.0766,
            }}
            height="420px"
          />
        </div>

        {/* Advisory */}
        <div className="p-4 bg-brand-light/70 border border-brand-purple/20 rounded-2xl text-xs text-brand-navy flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-purple shrink-0" />
            <span>Shared journey telemetry updates automatically every 10 seconds.</span>
          </div>
          <a
            href="tel:112"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
        </div>

      </main>
    </div>
  );
}
