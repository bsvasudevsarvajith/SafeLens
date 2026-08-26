"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import CCTVMap from "@/components/map/CCTVMap";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { getLocalSeedState, CameraRecord, RegionRecord } from "@/lib/seedData";
import {
  Video,
  Radio,
  Users,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Building,
  CheckCircle2
} from "lucide-react";

export default function CCTVMonitoringPage() {
  const [cameras, setCameras] = useState<CameraRecord[]>([]);
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraRecord | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>("all");

  useEffect(() => {
    const seed = getLocalSeedState();
    setCameras(seed.cameras);
    setRegions(seed.regions);
    if (seed.cameras.length > 0) {
      setSelectedCamera(seed.cameras[0]);
    }
  }, []);

  const filteredCameras = filterRegion === "all"
    ? cameras
    : cameras.filter((c) => c.regionName.toLowerCase() === filterRegion.toLowerCase());

  const totalCameras = cameras.length;
  const activeCameras = cameras.filter((c) => c.status === "active").length;
  const offlineCameras = cameras.filter((c) => c.status === "offline").length;
  const highCrowdCameras = cameras.filter((c) => c.peopleCount >= 20 || c.crowdDensity >= 70).length;
  const highActivityRegions = regions.filter((r) => r.activityLevel === "HIGH" || r.activityLevel === "VERY HIGH").length;

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>Authorized Feeds • Karur District Command</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                CCTV Surveillance & Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Real-time camera network health, people density metrics, and region-level crowd aggregation.
              </p>
            </div>

            {/* Region Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted font-bold">Region:</span>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2 text-xs text-brand-navy focus:outline-none focus:border-brand-purple font-bold"
              >
                <option value="all">All Regions ({totalCameras})</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({cameras.filter((c) => c.regionName.toLowerCase() === r.name.toLowerCase()).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-card space-y-1">
              <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider">Total Cameras</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-navy">{totalCameras}</div>
              <p className="text-[10px] text-brand-muted font-medium">Surveillance nodes</p>
            </div>

            <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-card space-y-1">
              <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Active Feeds</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">{activeCameras}</div>
              <p className="text-[10px] text-emerald-700 font-medium">Online streaming</p>
            </div>

            <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-card space-y-1">
              <span className="text-[10px] text-red-600 uppercase font-bold tracking-wider">Offline Nodes</span>
              <div className="text-2xl sm:text-3xl font-black text-red-600">{offlineCameras}</div>
              <p className="text-[10px] text-brand-muted font-medium">Signal down/service</p>
            </div>

            <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-card space-y-1">
              <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">High Crowd</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">{highCrowdCameras}</div>
              <p className="text-[10px] text-brand-muted font-medium">Density &gt; 70%</p>
            </div>

            <div className="bg-white border border-brand-border rounded-3xl p-4 shadow-card space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-brand-purple uppercase font-bold tracking-wider">High Activity</span>
              <div className="text-2xl sm:text-3xl font-black text-brand-purple">{highActivityRegions} Regions</div>
              <p className="text-[10px] text-brand-muted font-medium">Urban transit hubs</p>
            </div>

          </div>

          <NoticeDisclaimer variant="banner" />

          {/* Main CCTV Map & Player Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive CCTV Map */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-brand-border shadow-subtle">
                <h2 className="text-xs font-bold text-brand-navy flex items-center gap-2">
                  <Video className="w-4 h-4 text-brand-purple" />
                  <span>Municipal CCTV Map ({filteredCameras.length} Cameras)</span>
                </h2>
                <span className="text-xs text-brand-muted">Click any marker to inspect feed</span>
              </div>

              <CCTVMap
                cameras={filteredCameras}
                selectedCameraId={selectedCamera?.id}
                onSelectCamera={(cam) => setSelectedCamera(cam)}
              />

              {/* Cameras List Bar */}
              <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-3">
                <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                  Registered Cameras in Selection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {filteredCameras.map((cam) => {
                    const isSelected = selectedCamera?.id === cam.id;
                    return (
                      <div
                        key={cam.id}
                        onClick={() => setSelectedCamera(cam)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-light border-brand-purple shadow-sm ring-1 ring-brand-purple"
                            : "bg-brand-soft border-brand-border hover:border-brand-purple/40 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-extrabold text-brand-navy text-xs flex items-center gap-1.5">
                              <span>📹</span>
                              <span>{cam.cameraName}</span>
                            </div>
                            <div className="text-[10px] text-brand-muted mt-0.5 font-medium">
                              {cam.regionName} • {cam.areaName}
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            cam.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {cam.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-2 mt-1.5 border-t border-brand-border/60">
                          <span className="text-brand-muted font-medium">People: <b className="text-brand-navy font-bold">{cam.peopleCount}</b></span>
                          <span className="text-emerald-700 font-bold">Density: {cam.crowdDensity}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Selected Camera Video Stream & Real-time Stats */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Live Video Stream</span>
                  {selectedCamera?.status === "active" ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      ONLINE FEED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full">
                      OFFLINE
                    </span>
                  )}
                </div>

                {/* Video Player */}
                <div className="relative aspect-video bg-brand-navy rounded-2xl overflow-hidden shadow-card flex items-center justify-center">
                  {selectedCamera?.status !== "offline" ? (
                    <video
                      src={selectedCamera?.streamUrl || "/demo_karur_camera.mp4"}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-gray-400">
                      <AlertTriangle className="w-10 h-10 mx-auto text-red-400" />
                      <p className="text-xs font-bold text-red-300">Camera Feed Unavailable</p>
                      <p className="text-[10px] text-gray-400">Surveillance node undergoing scheduled maintenance</p>
                    </div>
                  )}

                  {/* Camera Name Overlay */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-white border border-white/20">
                    📹 {selectedCamera?.cameraName || "Select Camera"}
                  </div>

                  {selectedCamera?.isDemo && (
                    <div className="absolute top-3 right-3 bg-brand-purple text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow border border-white/20">
                      DEMO CAMERA
                    </div>
                  )}
                </div>

                {/* Camera Details & Metrics Card */}
                {selectedCamera && (
                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-brand-soft rounded-2xl border border-brand-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-brand-navy text-sm">{selectedCamera.cameraName}</h3>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {selectedCamera.activityLevel} Activity
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted font-medium">{selectedCamera.description}</p>
                      <div className="text-[11px] text-brand-muted font-mono pt-1">
                        📍 GPS: {selectedCamera.latitude.toFixed(4)}, {selectedCamera.longitude.toFixed(4)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted uppercase font-bold">People</span>
                        <div className="text-xl font-black text-brand-navy mt-0.5">{selectedCamera.peopleCount}</div>
                      </div>
                      <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted uppercase font-bold">Density</span>
                        <div className="text-xl font-black text-emerald-700 mt-0.5">{selectedCamera.crowdDensity}%</div>
                      </div>
                      <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted uppercase font-bold">Confidence</span>
                        <div className="text-xl font-black text-brand-purple mt-0.5">
                          {Math.round(selectedCamera.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Region-Level Rollup Summary */}
              <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-3">
                <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-purple" />
                  <span>Region-Level Rollup (Karur District)</span>
                </h3>

                <div className="space-y-2">
                  {regions.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-extrabold text-brand-navy">{r.name} Region</div>
                        <div className="text-[11px] text-brand-muted font-medium">
                          {r.activeCameras}/{r.totalCameras} Active Cameras • ~{r.estimatedPeople} People
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          r.activityLevel === "HIGH" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-brand-light text-brand-purple border-brand-purple/20"
                        }`}>
                          {r.averageCrowdDensity}% Crowd
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
