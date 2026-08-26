"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
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
  X,
  Sparkles,
  ChevronDown
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
      locationName: locationName || "Karur Location",
      regionName: "Karur",
      areaName: areaName || "Karur Area",
      latitude: 10.9601,
      longitude: 78.0766,
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
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Community Verified Safety Feed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Safety Reports & Alerts
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Report infrastructure hazards, isolated routes, or verified safe zones to alert other women travelers in Karur.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Safety Report</span>
            </button>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <NoticeDisclaimer variant="banner" />

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-brand-border shadow-subtle">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-brand-navy text-sm">Community Reports</span>
              <span className="px-2 py-0.5 bg-brand-light text-brand-purple font-bold text-xs rounded-full border border-brand-purple/20">
                {filteredReports.length} Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-muted" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-brand-soft border border-brand-border rounded-xl px-3 py-1.5 text-xs text-brand-navy focus:outline-none focus:border-brand-purple font-bold"
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
                className="bg-white border border-brand-border hover:border-brand-purple/40 rounded-3xl p-5 shadow-card hover:shadow-hover transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                        r.category === "Safe Zone"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : r.category === "Poor Lighting"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}>
                        {r.category}
                      </span>
                      <h3 className="font-extrabold text-brand-navy text-base mt-2">{r.locationName}</h3>
                      <p className="text-[11px] text-brand-muted flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-brand-purple" />
                        {r.areaName}, {r.regionName}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-brand-muted bg-brand-soft px-2.5 py-1 rounded-xl border border-brand-border">
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-brand-navy/80 leading-relaxed font-normal pt-1">
                    {r.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs">
                  <span className="text-[11px] text-brand-muted flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-muted" />
                    {new Date(r.reportedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleUpvote(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-light hover:bg-brand-purple hover:text-white border border-brand-purple/20 rounded-xl text-brand-purple text-xs font-bold transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-purple" />
                <span>Submit Safety Report</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-brand-muted hover:text-brand-navy rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy font-semibold focus:outline-none focus:border-brand-purple"
                >
                  <option value="Poor Lighting">Poor Lighting</option>
                  <option value="Isolated Area">Isolated Area</option>
                  <option value="Harassment Concern">Harassment Concern</option>
                  <option value="Broken Infrastructure">Broken Infrastructure</option>
                  <option value="Safe Zone">Safe Zone</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Location / Landmark Name</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Railway North Footbridge"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Area Name</label>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g. Karur Central / Thanthonimalai"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy font-semibold focus:outline-none focus:border-brand-purple"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the safety situation, lighting conditions, or recommended caution..."
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted font-medium focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-brand-soft hover:bg-brand-border text-brand-navy rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 transition-colors"
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
