"use client";

import React, { useState } from "react";
import { KARUR_NEW_BUS_STAND } from "@/lib/geo/karurBounds";
import { MapPin, Plus, CheckCircle2, ExternalLink } from "lucide-react";

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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-400" />
            <span>Location & Destination Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure supported destination hubs across Karur District and prepare expandable locations schema for future release cycles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Locations Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{loc.name}</h3>
                  <p className="text-xs text-gray-400">{loc.district}, {loc.state}, {loc.country}</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supported V1
              </span>
            </div>

            <div className="p-3 bg-navy-900 border border-navy-700 rounded-xl space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Latitude / Longitude:</span>
                <span className="font-mono text-gray-200">{loc.lat}, {loc.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Google Maps Reference:</span>
                <a
                  href={loc.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Open Map Reference</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Destination Hub</h3>

            <form onSubmit={handleAddLocation} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Destination Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. Karur Central Railway Station"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">District</label>
                <input
                  type="text"
                  required
                  value={newLocDistrict}
                  onChange={(e) => setNewLocDistrict(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-navy-900 text-gray-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Add Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
