"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { KARUR_BOUNDS } from "@/lib/geo/karurBounds";
import { Shield, MapPin, Navigation, Sparkles, Layers, Info } from "lucide-react";

// Fix Leaflet Default Icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom SafeLens Purple Marker Icon
const createSafeLensIcon = () =>
  L.divIcon({
    className: "custom-safelens-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="width: 38px; height: 38px; border-radius: 14px; background: linear-gradient(135deg, #6D35E8 0%, #8B5CF6 100%); border: 3px solid #ffffff; box-shadow: 0 8px 20px rgba(109,53,232,0.4); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <circle cx="12" cy="11" r="3"/>
          </svg>
        </div>
        <div style="width: 8px; height: 8px; background: #6D35E8; transform: rotate(45deg); margin-top: -4px; border: 1.5px solid white;"></div>
      </div>
    `,
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -42],
  });

// Demo Safety Zones for heatmap overlay
const DEMO_HEATMAP_ZONES = [
  { lat: 10.9601, lng: 78.0766, radius: 450, color: "#16A34A", name: "Bus Stand High Activity Zone", level: "🟢 Favorable" },
  { lat: 10.9582, lng: 78.0825, radius: 400, color: "#16A34A", name: "Railway Station Commercial Hub", level: "🟢 Favorable" },
  { lat: 10.9645, lng: 78.0720, radius: 350, color: "#F59E0B", name: "West Bypass Residential Link", level: "🟡 Moderate" },
  { lat: 10.9510, lng: 78.0890, radius: 300, color: "#EF4444", name: "South Industrial Isolated Stretch", level: "🔴 Caution" },
  { lat: 10.9670, lng: 78.0850, radius: 380, color: "#16A34A", name: "Jawahar Bazaar Market Stretch", level: "🟢 Favorable" },
];

function MapClickHandler({ onSelectPoint }: { onSelectPoint: (point: any) => void }) {
  useMapEvents({
    click(e) {
      const lat = parseFloat(e.latlng.lat.toFixed(5));
      const lng = parseFloat(e.latlng.lng.toFixed(5));
      onSelectPoint({
        lat,
        lng,
        name: `Selected Location (${lat}, ${lng})`,
        area: "Karur Area Node",
        district: "Karur, Tamil Nadu",
      });
    },
  });
  return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface SafeLensMapProps {
  center?: [number, number];
  zoom?: number;
  selectedPoint?: {
    lat: number;
    lng: number;
    name?: string;
    area?: string;
    district?: string;
  };
  onSelectPoint?: (point: any) => void;
  showHeatmap?: boolean;
  height?: string;
}

export default function SafeLensMap({
  center = [10.9601, 78.0766],
  zoom = 14,
  selectedPoint,
  onSelectPoint,
  showHeatmap = true,
  height = "520px",
}: SafeLensMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(showHeatmap);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div style={{ height }} className="w-full bg-brand-soft rounded-2xl flex items-center justify-center border border-brand-border">
        <div className="flex flex-col items-center gap-2">
          <div className="w-7 h-7 border-3 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-brand-muted">Initializing SafeLens Map...</span>
        </div>
      </div>
    );
  }

  const currentCenter = selectedPoint ? [selectedPoint.lat, selectedPoint.lng] as [number, number] : center;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-brand-border shadow-inner" style={{ height }}>
      
      {/* Map Layer Toggle Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setHeatmapVisible(!heatmapVisible)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md border transition-all ${
            heatmapVisible
              ? "bg-white text-brand-purple border-brand-purple/30 shadow-brand-purple/10"
              : "bg-white/90 text-brand-muted border-brand-border hover:text-brand-navy"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{heatmapVisible ? "Zones: Visible" : "Zones: Hidden"}</span>
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-border shadow-card text-[11px] text-brand-navy space-y-1">
        <span className="text-[10px] font-bold text-brand-muted uppercase block">AI Activity Assessment</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold">Favorable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-semibold">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="font-semibold">Requires Caution</span>
        </div>
      </div>

      <MapContainer
        center={currentCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        {/* Crisp Modern Clean Light Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapUpdater center={currentCenter} />
        {onSelectPoint && <MapClickHandler onSelectPoint={onSelectPoint} />}

        {/* Heatmap / Safety Zones Circles */}
        {heatmapVisible &&
          DEMO_HEATMAP_ZONES.map((zone, idx) => (
            <Circle
              key={idx}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.12,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="font-bold text-brand-navy">{zone.name}</div>
                  <div className="text-[10px] text-brand-muted">Assessment: <strong>{zone.level}</strong></div>
                  <div className="text-[9px] text-brand-purple font-semibold">Demo AI Estimated Signals</div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Selected Location Purple Lens Marker */}
        {selectedPoint && (
          <Marker
            position={[selectedPoint.lat, selectedPoint.lng]}
            icon={createSafeLensIcon()}
          >
            <Popup>
              <div className="p-1 space-y-1 text-xs min-w-[180px]">
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-purple uppercase">
                  <Shield className="w-3 h-3" /> SafeLens Selected Target
                </div>
                <div className="font-extrabold text-brand-navy text-sm">
                  {selectedPoint.name || "Target Coordinates"}
                </div>
                <div className="text-[10px] text-brand-muted font-mono">
                  {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                </div>
                <div className="pt-1 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready for AI Analysis
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
