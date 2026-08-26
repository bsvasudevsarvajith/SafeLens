"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getLocalSeedState } from "@/lib/seedData";
import { Users, Video, Camera, Cpu, MapPin, CheckCircle2, Activity, ArrowUpRight, Shield, Radio, Plus } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    usersCount: 4,
    camerasCount: 6,
    videosCount: 2,
    reportsCount: 2,
    regionsCount: 3,
  });

  const [recentCameras, setRecentCameras] = useState<any[]>([]);
  const [aiServerStatus, setAiServerStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const seed = getLocalSeedState();
    setStats({
      usersCount: seed.users ? seed.users.length : 0,
      camerasCount: seed.cameras ? seed.cameras.length : 0,
      videosCount: seed.videos ? seed.videos.length : 0,
      reportsCount: seed.reports ? seed.reports.length : 0,
      regionsCount: seed.regions ? seed.regions.length : 0,
    });
    setRecentCameras(seed.cameras || []);

    // Check AI Service Health
    fetch("http://127.0.0.1:8000/health")
      .then((res) => (res.ok ? setAiServerStatus("online") : setAiServerStatus("offline")))
      .catch(() => setAiServerStatus("offline"));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
              Admin Command Overview
            </span>
            <span className="text-xs text-gray-400">Karur District Network</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SafeRoute Women Operations Console</h1>
        </div>

        {/* System Status Pill */}
        <div className="flex items-center gap-3 bg-navy-900 border border-navy-700 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              aiServerStatus === "online" ? "bg-emerald-400 animate-pulse" : "bg-emerald-400"
            }`}></span>
            <span className="text-xs font-semibold text-gray-300">Roboflow Model:</span>
            <span className="text-xs font-bold text-emerald-400">
              people-detection-o4rdr/12
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cameras */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">CCTV Cameras</span>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.camerasCount}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Authorized Nodes
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Registered Users</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.usersCount}</div>
          <div className="text-[11px] text-gray-400 font-medium">Firebase Auth</div>
        </div>

        {/* Video Uploads */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Corridor Videos</span>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.videosCount}</div>
          <div className="text-[11px] text-purple-400 font-medium">AI Inferred Records</div>
        </div>

        {/* Safety Reports */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Safety Reports</span>
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.reportsCount}</div>
          <div className="text-[11px] text-amber-400 font-medium">Community Alerts</div>
        </div>

      </div>

      {/* Surveillance Nodes Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Active CCTV Surveillance Nodes</h2>
          </div>
          <Link
            href="/admin/cameras"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Cameras</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-gray-400 border-b border-navy-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Camera / Node</th>
                <th className="p-3">Region / Area</th>
                <th className="p-3">People Count</th>
                <th className="p-3">Density</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-gray-200">
              {recentCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-navy-700/40 transition-colors">
                  <td className="p-3 font-semibold text-white flex items-center gap-2">
                    <span>📹</span>
                    <span>{cam.cameraName}</span>
                  </td>
                  <td className="p-3 text-gray-300">{cam.regionName} - {cam.areaName}</td>
                  <td className="p-3 font-bold text-emerald-400">{cam.peopleCount}</td>
                  <td className="p-3 text-gray-300">{cam.crowdDensity}%</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      cam.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}>
                      {cam.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">
                    {new Date(cam.lastAnalysisTimestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
