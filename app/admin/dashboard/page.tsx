"use client";

import React, { useState, useEffect } from "react";
import { getLocalSeedState } from "@/lib/seedData";
import { Users, Video, Cpu, MapPin, CheckCircle2, Activity, ArrowUpRight, Shield } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    usersCount: 125,
    videosCount: 42,
    analysesCount: 39,
    locationsCount: 1,
  });

  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [aiServerStatus, setAiServerStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    const seed = getLocalSeedState();
    setStats({
      usersCount: seed.users ? seed.users.length : 0,
      videosCount: seed.videos ? seed.videos.length : 0,
      analysesCount: seed.analyses ? seed.analyses.length : 0,
      locationsCount: 1,
    });
    setRecentAnalyses(seed.analyses || []);

    // Check FastAPI AI Service Health
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
              Admin Overview
            </span>
            <span className="text-xs text-gray-400">Karur District System</span>
          </div>
          <h1 className="text-2xl font-bold text-white">System Operations Dashboard</h1>
        </div>

        {/* System Status Pill */}
        <div className="flex items-center gap-3 bg-navy-900 border border-navy-700 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              aiServerStatus === "online" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}></span>
            <span className="text-xs font-semibold text-gray-300">FastAPI AI Server:</span>
            <span className={`text-xs font-bold ${
              aiServerStatus === "online" ? "text-emerald-400" : "text-amber-400"
            }`}>
              {aiServerStatus === "online" ? "ONLINE (YOLOv8)" : "STANDBY"}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Total Users</span>
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.usersCount}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> Registered Accounts
          </div>
        </div>

        {/* Total Videos */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Uploaded Videos</span>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.videosCount}</div>
          <div className="text-[11px] text-gray-400 font-medium">Firebase Storage</div>
        </div>

        {/* Analyzed Videos */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Analyzed Videos</span>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.analysesCount}</div>
          <div className="text-[11px] text-purple-400 font-medium">YOLO Person Density</div>
        </div>

        {/* Supported Locations */}
        <div className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Supported Locations</span>
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.locationsCount}</div>
          <div className="text-[11px] text-red-400 font-medium">Karur New Bus Stand</div>
        </div>

      </div>

      {/* Recent AI Analysis Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Recent AI Video Analysis Log</h2>
          </div>
          <span className="text-xs text-gray-400">Model: YOLOv8n</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-gray-400 border-b border-navy-700 uppercase tracking-wider">
              <tr>
                <th className="p-3">Camera / Area</th>
                <th className="p-3">Avg Persons</th>
                <th className="p-3">Max Persons</th>
                <th className="p-3">Min Persons</th>
                <th className="p-3">Activity Level</th>
                <th className="p-3">Analysis Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-gray-200">
              {recentAnalyses.map((item, idx) => (
                <tr key={idx} className="hover:bg-navy-700/40 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    {item.cameraName || `Camera ${idx + 1} - Karur Bay`}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{item.averagePersonCount}</td>
                  <td className="p-3 text-gray-300">{item.maximumPersonCount}</td>
                  <td className="p-3 text-gray-400">{item.minimumPersonCount}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.activityLevel === "HIGH"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}>
                      {item.activityLevel}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">
                    {new Date(item.analyzedAt).toLocaleString()}
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
