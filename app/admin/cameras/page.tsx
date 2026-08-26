"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import LocationPicker, { GeoLocationSelection } from "@/components/map/LocationPicker";
import CCTVMap from "@/components/map/CCTVMap";
import { getLocalSeedState, saveLocalSeedState, CameraRecord } from "@/lib/seedData";
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Video,
  Shield,
  Search,
  Sliders,
  X
} from "lucide-react";

export default function AdminCamerasPage() {
  const [cameras, setCameras] = useState<CameraRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCameraId, setEditingCameraId] = useState<string | null>(null);

  // Form State
  const [cameraName, setCameraName] = useState("");
  const [regionName, setRegionName] = useState("Karur");
  const [areaName, setAreaName] = useState("Bus Stand");
  const [landmark, setLandmark] = useState("Main Entrance");
  const [latitude, setLatitude] = useState(10.9601);
  const [longitude, setLongitude] = useState(78.0766);
  const [cameraType, setCameraType] = useState<CameraRecord["cameraType"]>("Fixed CCTV");
  const [streamType, setStreamType] = useState<CameraRecord["streamType"]>("RTSP");
  const [streamUrl, setStreamUrl] = useState("rtsp://admin:pass@192.168.1.100:554/live");
  const [status, setStatus] = useState<CameraRecord["status"]>("active");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    setCameras(seed.cameras);
  }, []);

  const resetForm = () => {
    setEditingCameraId(null);
    setCameraName("");
    setRegionName("Karur");
    setAreaName("Bus Stand");
    setLandmark("Main Entrance");
    setLatitude(10.9601);
    setLongitude(78.0766);
    setCameraType("Fixed CCTV");
    setStreamType("RTSP");
    setStreamUrl("rtsp://admin:pass@192.168.1.100:554/live");
    setStatus("active");
    setDescription("");
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleLocationSelect = (loc: GeoLocationSelection) => {
    setLatitude(loc.lat);
    setLongitude(loc.lng);
    if (loc.name) {
      setCameraName(cameraName || `${loc.name} Camera 01`);
    }
  };

  const handleSaveCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const newCam: CameraRecord = {
      id: editingCameraId || `cam-${Date.now()}`,
      cameraName: cameraName || `${areaName} Camera`,
      regionName: regionName || "Karur",
      areaName: areaName || "Central Area",
      landmark: landmark || "Main Intersection",
      latitude: parseFloat(latitude.toString()),
      longitude: parseFloat(longitude.toString()),
      cameraType: cameraType,
      streamType: streamType,
      streamUrl: streamUrl,
      status: status,
      description: description || "Authorized municipal CCTV camera node.",
      peopleCount: Math.floor(18 + Math.random() * 20),
      crowdDensity: Math.floor(40 + Math.random() * 45),
      activityLevel: "HIGH",
      confidence: 0.91,
      lastAnalysisTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: streamType === "Demo",
    };

    let updatedList: CameraRecord[];
    if (editingCameraId) {
      updatedList = cameras.map((c) => (c.id === editingCameraId ? newCam : c));
      setMessage(`Camera "${newCam.cameraName}" updated successfully.`);
    } else {
      updatedList = [newCam, ...cameras];
      setMessage(`Camera "${newCam.cameraName}" registered successfully.`);
    }

    setCameras(updatedList);
    saveLocalSeedState({ cameras: updatedList });

    // Also notify backend API
    try {
      await fetch("/api/cameras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCam),
      });
    } catch {
      // Local seed persists
    }

    setModalOpen(false);
    resetForm();
    setTimeout(() => setMessage(null), 4000);
  };

  const handleDeleteCamera = async (id: string) => {
    if (!confirm("Are you sure you want to remove this camera node?")) return;
    const updated = cameras.filter((c) => c.id !== id);
    setCameras(updated);
    saveLocalSeedState({ cameras: updated });

    try {
      await fetch(`/api/cameras?id=${id}`, { method: "DELETE" });
    } catch {
      // Local seed handles
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header */}
          <div className="bg-navy-800 border border-navy-700/80 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Authorized Camera Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                🛠️ CCTV Camera Management
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Register authorized CCTV nodes, connect stream protocols (RTSP, HLS, WebRTC, Demo), and map GPS coordinates.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New CCTV Camera</span>
            </button>
          </div>

          {message && (
            <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Registered Cameras Table */}
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-base">Registered Surveillance Nodes ({cameras.length})</h2>
              <span className="text-xs text-gray-400">Authorized Municipal Network</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-900/80 text-gray-400 border-b border-navy-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Camera Name / Node</th>
                    <th className="p-3.5">Region / Area</th>
                    <th className="p-3.5">GPS Coordinates</th>
                    <th className="p-3.5">Protocol</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Crowd Level</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/60 text-gray-200">
                  {cameras.map((c) => (
                    <tr key={c.id} className="hover:bg-navy-700/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>📹</span>
                          <span>{c.cameraName}</span>
                          {c.isDemo && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded">
                              DEMO
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">{c.landmark}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-gray-200">{c.regionName}</div>
                        <div className="text-gray-400 text-[11px]">{c.areaName}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-gray-300">
                        {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-navy-900 border border-navy-600 rounded text-[10px] font-mono text-gray-300">
                          {c.streamType}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          c.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : c.status === "warning"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-emerald-400">{c.peopleCount} people</span>
                        <div className="text-[10px] text-gray-400">{c.crowdDensity}% density</div>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteCamera(c.id)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded-lg inline-flex"
                          title="Delete Camera Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Add / Edit Camera Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>{editingCameraId ? "Edit CCTV Camera Node" : "Register Authorized CCTV Camera"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCamera} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Camera Name</label>
                  <input
                    type="text"
                    required
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    placeholder="e.g. Karur Bus Stand Camera 01"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Region / City</label>
                  <input
                    type="text"
                    required
                    value={regionName}
                    onChange={(e) => setRegionName(e.target.value)}
                    placeholder="e.g. Karur"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Area Name</label>
                  <input
                    type="text"
                    required
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="e.g. Bus Stand / Kovai Road"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Main Entrance Concourse"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Camera Type</label>
                  <select
                    value={cameraType}
                    onChange={(e) => setCameraType(e.target.value as any)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Fixed CCTV">Fixed CCTV</option>
                    <option value="PTZ Camera">PTZ Camera</option>
                    <option value="Dome CCTV">Dome CCTV</option>
                    <option value="IP Camera">IP Camera</option>
                    <option value="Demo Camera">Demo Camera</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Stream Protocol</label>
                  <select
                    value={streamType}
                    onChange={(e) => setStreamType(e.target.value as any)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="RTSP">RTSP (Real-Time Streaming Protocol)</option>
                    <option value="HLS">HLS (HTTP Live Streaming)</option>
                    <option value="WebRTC">WebRTC</option>
                    <option value="Demo">Demo Sample Video</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-semibold text-gray-300">Stream URL (Kept Server-Side / Admin Only)</label>
                  <input
                    type="text"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    placeholder="rtsp://user:pass@camera.local:554/feed"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">🟢 Active</option>
                    <option value="warning">🟡 Warning / Low Bitrate</option>
                    <option value="offline">🔴 Offline</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Passenger concourse entry surveillance"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Quick GPS Location Picker map helper */}
              <div className="pt-2">
                <LocationPicker
                  selectedLocation={{
                    lat: latitude,
                    lng: longitude,
                    name: cameraName || "Camera Pin",
                    region: regionName,
                    area: areaName,
                    landmark: landmark,
                  }}
                  onSelectLocation={handleLocationSelect}
                  onUpdateDetails={(d) => {
                    setRegionName(d.region);
                    setAreaName(d.area);
                    setLandmark(d.landmark);
                  }}
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
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Save Camera Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
