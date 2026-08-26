"use client";

import React, { useEffect, useState } from "react";
import { CameraRecord } from "@/lib/seedData";
import { KARUR_POLYGON } from "@/lib/geo/karurBounds";

interface CCTVMapProps {
  cameras: CameraRecord[];
  selectedCameraId?: string;
  onSelectCamera?: (camera: CameraRecord) => void;
  center?: [number, number];
  zoom?: number;
  interactiveSelection?: boolean;
  onMapClickLocation?: (loc: { lat: number; lng: number }) => void;
}

export default function CCTVMap({
  cameras = [],
  selectedCameraId,
  onSelectCamera,
  center = [10.9601, 78.0766],
  zoom = 13,
  interactiveSelection = false,
  onMapClickLocation,
}: CCTVMapProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  useEffect(() => {
    if (!mounted || !L) return;

    // Fix leaflet default icon URLs
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const mapContainer = document.getElementById("wsrs-cctv-map");
    if (!mapContainer) return;

    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("wsrs-cctv-map", {
      center: center,
      zoom: zoom,
      zoomControl: true,
    });

    // Dark style tile layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Karur District Boundary Polygon
    const polyCoords = KARUR_POLYGON.map((p) => [p.lat, p.lng]);
    L.polygon(polyCoords, {
      color: "#3b82f6",
      weight: 2,
      dashArray: "6, 6",
      fillColor: "#3b82f6",
      fillOpacity: 0.04,
    }).addTo(map);

    // Plot CCTV camera markers
    cameras.forEach((cam) => {
      let bgGradient = "linear-gradient(135deg, #10b981, #059669)"; // 🟢 Active
      let borderColor = "#34d399";
      let statusBadgeText = "ACTIVE";
      let statusEmoji = "🟢";

      if (cam.status === "warning") {
        bgGradient = "linear-gradient(135deg, #f59e0b, #d97706)"; // 🟡 Warning
        borderColor = "#fbbf24";
        statusBadgeText = "WARNING";
        statusEmoji = "🟡";
      } else if (cam.status === "offline") {
        bgGradient = "linear-gradient(135deg, #ef4444, #b91c1c)"; // 🔴 Offline
        borderColor = "#f87171";
        statusBadgeText = "OFFLINE";
        statusEmoji = "🔴";
      }

      const isSelected = selectedCameraId === cam.id;
      const size = isSelected ? 42 : 32;

      const camIcon = L.divIcon({
        className: `cctv-cam-marker-${cam.id}`,
        html: `
          <div style="
            background: ${bgGradient};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid ${isSelected ? '#ffffff' : borderColor};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${cam.status === 'active' ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'};
            transition: transform 0.2s;
            cursor: pointer;
          ">
            <span style="font-size: ${isSelected ? '16px' : '13px'}; line-height: 1;">📹</span>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([cam.latitude, cam.longitude], { icon: camIcon }).addTo(map);

      // Popup Content exactly per requirements
      const popupHtml = `
        <div style="color: #0f172a; font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">📹 ${cam.cameraName}</strong>
            <span style="font-size: 10px; font-weight: bold; background: #f1f5f9; padding: 2px 6px; border-radius: 12px; border: 1px solid #cbd5e1;">
              ${statusEmoji} ${statusBadgeText}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            <div><b>Region:</b> ${cam.regionName} | <b>Area:</b> ${cam.areaName}</div>
            <div style="font-size: 10px; color: #64748b;">${cam.landmark}</div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; font-size: 11px; margin-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span><b>People Count:</b></span>
              <span style="color: #0f172a; font-weight: bold;">${cam.peopleCount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span><b>Crowd Density:</b></span>
              <span style="color: ${cam.crowdDensity > 70 ? '#b91c1c' : '#047857'}; font-weight: bold;">${cam.crowdDensity}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span><b>Activity Level:</b></span>
              <span style="color: #2563eb; font-weight: bold;">${cam.activityLevel}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><b>Confidence:</b></span>
              <span style="color: #0f172a; font-weight: bold;">${Math.round(cam.confidence * 100)}%</span>
            </div>
          </div>
          
          ${cam.isDemo ? '<div style="font-size: 9px; color: #94a3b8; text-align: center; font-weight: bold; margin-top: 4px;">DEMO CAMERA FEED</div>' : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        if (onSelectCamera) {
          onSelectCamera(cam);
        }
      });
    });

    if (interactiveSelection) {
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        if (onMapClickLocation) {
          onMapClickLocation({ lat, lng });
        }
      });
    }

    return () => {
      map.remove();
    };
  }, [mounted, L, cameras, selectedCameraId, center, zoom, interactiveSelection]);

  if (!mounted) {
    return (
      <div className="w-full h-[460px] bg-navy-800 rounded-2xl border border-navy-700 flex flex-col items-center justify-center text-gray-400 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs">Loading CCTV Surveillance Map...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] rounded-2xl border border-navy-700/80 overflow-hidden shadow-2xl">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <div id="wsrs-cctv-map" className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-navy-900/90 border border-navy-700/90 p-3 rounded-xl backdrop-blur-md text-xs text-gray-300 space-y-1.5 shadow-xl">
        <div className="font-bold text-white text-[11px] mb-1">CCTV Monitoring Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span>Active Surveillance ({cameras.filter((c) => c.status === "active").length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
          <span>Warning / Low Frame ({cameras.filter((c) => c.status === "warning").length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span>Offline ({cameras.filter((c) => c.status === "offline").length})</span>
        </div>
      </div>
    </div>
  );
}
