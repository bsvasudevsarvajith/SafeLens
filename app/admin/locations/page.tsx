"use client";

import React, { useState } from "react";
import { KARUR_NEW_BUS_STAND } from "@/lib/geo/karurBounds";
import { MapPin, Plus, CheckCircle2, ExternalLink, X } from "lucide-react";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([
    {
      id: KARUR_NEW_BUS_STAND.id,
      name: KARUR_NEW_BUS_STAND.name,
      district: KARUR_NEW_BUS_STAND.district,
      state: KARUR_NEW_BUS_STAND.state,
      country: KARUR_NEW_BUS_STAND.country,
      supported: KARUR_NEW_BUS_STAND.isSupported,
      googleMapsUrl: KARUR_NEW_BUS_STAND.googleMapsUrl,
      lat: KARUR_NEW_BUS_STAND.lat,
      lng: KARUR_NEW_BUS_STAND.lng,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocName, setNewLocName] = useState("");
  const [newLocDistrict, setNewLocDistrict] = useState("Karur");

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;

    const newLoc = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      district: newLocDistrict.trim(),
      state: "Tamil Nadu",
      country: "India",
      supported: true,
      googleMapsUrl: "https://maps.google.com",
      lat: 10.96,
      lng: 78.07,
    };

    setLocations([...locations, newLoc]);
    setShowAddModal(false);
    setNewLocName("");
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-3xl p-6 shadow-card">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-purple" />
            <span>Location & Destination Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Configure supported destination hubs across Karur District and manage expandable location geofences.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location Hub</span>
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Fully Supported
                </span>
                <h3 className="font-extrabold text-brand-navy text-base mt-2">{loc.name}</h3>
                <p className="text-xs text-brand-muted font-medium">{loc.district}, {loc.state}</p>
              </div>

              <div className="p-2 bg-brand-light border border-brand-purple/20 rounded-2xl text-brand-purple">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl font-mono text-[11px] text-brand-muted space-y-1">
              <div><b>GPS:</b> {loc.lat}, {loc.lng}</div>
              <div><b>Country:</b> {loc.country}</div>
            </div>

            <a
              href={loc.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 bg-brand-soft hover:bg-brand-border border border-brand-border text-brand-navy font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-lg font-black text-brand-navy flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-purple" />
                <span>Add Destination Hub</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-brand-muted hover:text-brand-navy rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLocation} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">Location / Hub Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. Karur Railway Station Junction"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-brand-navy">District</label>
                <input
                  type="text"
                  required
                  value={newLocDistrict}
                  onChange={(e) => setNewLocDistrict(e.target.value)}
                  placeholder="e.g. Karur"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-brand-muted hover:text-brand-navy rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 transition-colors"
                >
                  Add Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
