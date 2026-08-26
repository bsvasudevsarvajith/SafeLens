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
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-3xl p-6 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-brand-light text-brand-purple border border-brand-purple/20 rounded-full text-xs font-bold">
              Admin Command Overview
            </span>
            <span className="text-xs text-brand-muted font-medium">Karur District Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">SafeLens Operations Console</h1>
        </div>

        {/* System Status Pill */}
        <div className="flex items-center gap-3 bg-brand-soft border border-brand-border p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-brand-navy">AI Detection Model:</span>
            <span className="text-xs font-mono font-bold text-brand-purple">
              Active / Ready
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cameras */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted">CCTV Cameras</span>
            <div className="p-2 bg-brand-light border border-brand-purple/20 rounded-xl text-brand-purple">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{stats.camerasCount}</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Authorized Nodes
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted">Registered Users</span>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{stats.usersCount}</div>
          <div className="text-[11px] text-brand-muted font-medium">Verified Accounts</div>
        </div>

        {/* Video Uploads */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted">Corridor Feeds</span>
            <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl text-brand-purple">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{stats.videosCount}</div>
          <div className="text-[11px] text-brand-purple font-bold">AI Inferred Records</div>
        </div>

        {/* Safety Reports */}
        <div className="bg-white border border-brand-border rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-muted">Safety Reports</span>
            <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-brand-navy">{stats.reportsCount}</div>
          <div className="text-[11px] text-amber-700 font-bold">Community Alerts</div>
        </div>

      </div>

      {/* Surveillance Nodes Table */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-brand-navy text-base">Active CCTV Surveillance Nodes</h2>
          </div>
          <Link
            href="/admin/cameras"
            className="px-3.5 py-1.5 bg-brand-purple hover:bg-brand-violet text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Cameras</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-soft text-brand-muted border-b border-brand-border uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Camera / Node</th>
                <th className="p-3.5">Region / Area</th>
                <th className="p-3.5">People Count</th>
                <th className="p-3.5">Density</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-navy font-medium">
              {recentCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-brand-soft/60 transition-colors">
                  <td className="p-3.5 font-bold text-brand-navy flex items-center gap-2">
                    <span>📹</span>
                    <span>{cam.cameraName}</span>
                  </td>
                  <td className="p-3.5 text-brand-muted">{cam.regionName} - {cam.areaName}</td>
                  <td className="p-3.5 font-extrabold text-emerald-700">{cam.peopleCount}</td>
                  <td className="p-3.5 text-brand-navy font-semibold">{cam.crowdDensity}%</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      cam.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {cam.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-brand-muted font-mono text-[11px]">
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
