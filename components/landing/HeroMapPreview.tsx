"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Search,
  Users,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Navigation,
  Info
} from "lucide-react";

export default function HeroMapPreview() {
  const [searchQuery, setSearchQuery] = useState("Karur, Tamil Nadu");
  const [selectedPoint, setSelectedPoint] = useState({
    name: "Karur New Bus Stand",
    lat: 10.9601,
    lng: 78.0766,
    score: 82,
    status: "Favorable",
    crowd: "High",
    confidence: "87%",
  });

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Outer Card with Soft Shadow & Border */}
      <div className="relative bg-white rounded-3xl p-3 sm:p-4 border border-brand-border shadow-hover transition-all">
        
        {/* Mock Map View Container */}
        <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden bg-[#EBF0F8] border border-brand-border/60">
          
          {/* Simulated Map Canvas Texture & Grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(#6D35E8 0.75px, transparent 0.75px), radial-gradient(#6D35E8 0.75px, #EBF0F8 0.75px)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
          />

          {/* Stylized Map Roads / Geometry */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" xmlns="http://www.w3.org/2000/svg">
            <path d="M-50 120 C 150 140, 300 80, 600 130" stroke="#CBD5E1" strokeWidth="18" fill="none" />
            <path d="M-50 120 C 150 140, 300 80, 600 130" stroke="#FFFFFF" strokeWidth="12" fill="none" />
            
            <path d="M120 -50 C 140 200, 260 300, 320 550" stroke="#CBD5E1" strokeWidth="16" fill="none" />
            <path d="M120 -50 C 140 200, 260 300, 320 550" stroke="#FFFFFF" strokeWidth="10" fill="none" />

            <path d="M280 100 C 350 250, 480 320, 600 400" stroke="#CBD5E1" strokeWidth="12" fill="none" />
            <path d="M280 100 C 350 250, 480 320, 600 400" stroke="#FFFFFF" strokeWidth="8" fill="none" />

            {/* Active Safe Route Corridor Line */}
            <path
              d="M 160 380 Q 240 280 300 210"
              stroke="#6D35E8"
              strokeWidth="5"
              strokeDasharray="8 6"
              fill="none"
            />
          </svg>

          {/* Activity Radius Zones */}
          <div className="absolute top-[210px] left-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Radar Pulsing Rings */}
            <div className="absolute -inset-16 rounded-full bg-brand-purple/10 animate-radar" />
            <div className="absolute -inset-10 rounded-full bg-emerald-500/15 animate-ping duration-1000" />
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center" />
          </div>

          {/* Center Purple Lens Marker */}
          <div className="absolute top-[210px] left-[300px] -translate-x-1/2 -translate-y-full z-20 cursor-pointer group">
            <div className="relative flex flex-col items-center">
              <div className="px-2.5 py-1 bg-brand-navy text-white text-[11px] font-bold rounded-lg shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
                <span>📍</span>
                <span>{selectedPoint.name}</span>
              </div>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-violet text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                <Shield className="w-5 h-5 fill-white/20" />
              </div>
              <div className="w-2 h-2 bg-brand-purple rotate-45 -mt-1" />
            </div>
          </div>

          {/* Top Search Overlay */}
          <div className="absolute top-3 left-3 right-3 z-30">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-brand-border shadow-card">
              <Search className="w-4 h-4 text-brand-purple flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full text-xs font-semibold text-brand-navy bg-transparent outline-none placeholder:text-brand-muted"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-light text-brand-purple px-2 py-0.5 rounded-md flex-shrink-0">
                LIVE DEMO
              </span>
            </div>
          </div>

          {/* Floating Safety Assessment Card (Right/Bottom) */}
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 z-30">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-brand-border shadow-hover space-y-3">
              
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-muted block">
                    SELECTED LOCATION
                  </span>
                  <h4 className="text-xs font-extrabold text-brand-navy leading-tight">
                    {selectedPoint.name}
                  </h4>
                  <p className="text-[10px] text-brand-muted font-mono">
                    Lat: {selectedPoint.lat}° N • Lng: {selectedPoint.lng}° E
                  </p>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {selectedPoint.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-brand-border/60">
                <div className="bg-brand-soft p-2 rounded-xl">
                  <span className="text-[9px] text-brand-muted font-semibold uppercase block">Safety Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-brand-purple">{selectedPoint.score}</span>
                    <span className="text-[10px] text-brand-muted">/100</span>
                  </div>
                </div>

                <div className="bg-brand-soft p-2 rounded-xl">
                  <span className="text-[9px] text-brand-muted font-semibold uppercase block">Crowd Activity</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-emerald-600">{selectedPoint.crowd}</span>
                    <span className="text-[10px] text-brand-muted">({selectedPoint.confidence})</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2 bg-gradient-to-r from-brand-purple to-brand-violet hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Open Full Safety Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Map Legend Overlay (Top Left below search) */}
          <div className="absolute top-16 left-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-brand-border/70 text-[10px] font-semibold text-brand-navy shadow-sm space-y-1">
            <span className="text-[9px] font-bold text-brand-muted uppercase block">Map Legend</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>High Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Caution</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
