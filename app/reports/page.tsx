"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import LocationPicker, { GeoLocationSelection } from "@/components/map/LocationPicker";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { getLocalSeedState, saveLocalSeedState, SafetyReportRecord } from "@/lib/seedData";
import {
  FileText,
  Plus,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Shield,
  Filter,
  X
} from "lucide-react";

export default function SafetyReportsPage() {
  const [reports, setReports] = useState<SafetyReportRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Form State
  const [category, setCategory] = useState<SafetyReportRecord["category"]>("Poor Lighting");
  const [locationName, setLocationName] = useState("");
  const [areaName, setAreaName] = useState("Karur Town");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<SafetyReportRecord["severity"]>("Medium");
  const [locGps, setLocGps] = useState<GeoLocationSelection>({
    lat: 10.9601,
    lng: 78.0766,
    name: "Karur Bus Stand",
    region: "Karur",
    area: "Central",
  });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    setReports(seed.reports);
  }, []);

  const handleUpvote = (id: string) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
    );
    setReports(updated);
    saveLocalSeedState({ reports: updated });
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newRep: SafetyReportRecord = {
      id: `rep-${Date.now()}`,
      locationName: locationName || locGps.name || "Karur Location",
      regionName: "Karur",
      areaName: areaName || "Karur Area",
      latitude: locGps.lat,
      longitude: locGps.lng,
      category: category,
      description: description,
      severity: severity,
      reportedAt: new Date().toISOString(),
      status: "Under Review",
      upvotes: 1,
    };

    const updated = [newRep, ...reports];
    setReports(updated);
    saveLocalSeedState({ reports: updated });

    setModalOpen(false);
    setDescription("");
    setLocationName("");
    setMessage("Safety report submitted successfully! Thank you for helping keep Karur safe.");
    setTimeout(() => setMessage(null), 4000);
  };

  const filteredReports = filterCategory === "all"
    ? reports
    : reports.filter((r) => r.category === filterCategory);

  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="bg-navy-800 border border-navy-700/80 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Community Verified Safety Feed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                📊 Safety Reports & Alerts
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Report infrastructure hazards, isolated routes, or verified safe zones to alert other women travelers in Karur.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Safety Report</span>
            </button>
          </div>

          {message && (
            <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <NoticeDisclaimer variant="banner" />

          {/* Filter Row */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm">Community Reports ({filteredReports.length})</h2>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-navy-800 border border-navy-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="Poor Lighting">Poor Lighting</option>
                <option value="Isolated Area">Isolated Area</option>
                <option value="Harassment Concern">Harassment Concern</option>
                <option value="Broken Infrastructure">Broken Infrastructure</option>
                <option value="Safe Zone">Safe Zone</option>
              </select>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((r) => (
              <div
                key={r.id}
                className="bg-navy-800 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        r.category === "Safe Zone"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : r.category === "Poor Lighting"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>
                        {r.category}
                      </span>
                      <h3 className="font-bold text-white text-base mt-1.5">{r.locationName}</h3>
                      <p className="text-[11px] text-gray-400">{r.areaName}, {r.regionName}</p>
                    </div>

                    <span className="text-[10px] font-semibold text-gray-400 bg-navy-900 px-2 py-1 rounded-lg border border-navy-700">
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed pt-1">
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-700/60 text-xs">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(r.reportedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleUpvote(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-navy-900 hover:bg-navy-700 border border-navy-700 rounded-lg text-blue-400 text-xs font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote ({r.upvotes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Submit Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Submit Safety Report</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Poor Lighting">Poor Lighting</option>
                  <option value="Isolated Area">Isolated Area</option>
                  <option value="Harassment Concern">Harassment Concern</option>
                  <option value="Broken Infrastructure">Broken Infrastructure</option>
                  <option value="Safe Zone">Safe Zone</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Location / Landmark Name</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Railway North Footbridge"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Area Name</label>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g. Karur Central / Thanthonimalai"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-300">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the safety situation, lighting conditions, or recommended caution..."
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-gray-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
