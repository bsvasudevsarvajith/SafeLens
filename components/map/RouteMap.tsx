"use client";

import React, { useEffect, useState } from "react";
import { KARUR_NEW_BUS_STAND, KARUR_POLYGON, isWithinKarurDistrict } from "@/lib/geo/karurBounds";
import { RouteOption } from "@/lib/geo/routingService";

interface RouteMapProps {
  startLocation: { lat: number; lng: number; name: string } | null;
  routes?: RouteOption[];
  selectedRouteId?: string;
  onSelectStartLocation?: (location: { lat: number; lng: number; name: string }) => void;
  onSelectRoute?: (routeId: string) => void;
}

export default function RouteMap({
  startLocation,
  routes = [],
  selectedRouteId,
  onSelectStartLocation,
  onSelectRoute,
}: RouteMapProps) {
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

    const mapContainer = document.getElementById("wsrs-leaflet-map");
    if (!mapContainer) return;

    // Reset container if re-initializing
    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const defaultLat = startLocation?.lat || 10.9582;
    const defaultLng = startLocation?.lng || 78.0766;

    const map = L.map("wsrs-leaflet-map", {
      center: [defaultLat, defaultLng],
      zoom: 13,
      zoomControl: true,
    });

    // Dark style tile layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Draw Karur District Boundary Polygon
    const polyCoords = KARUR_POLYGON.map((p) => [p.lat, p.lng]);
    L.polygon(polyCoords, {
      color: "#3b82f6",
      weight: 2,
      dashArray: "6, 6",
      fillColor: "#3b82f6",
      fillOpacity: 0.05,
    }).addTo(map);

    // Destination Marker: Karur New Bus Stand
    const busStandIcon = L.divIcon({
      className: "custom-bus-stand-marker",
      html: `<div style="background: linear-gradient(135deg, #ef4444, #b91c1c); width: 36px; height: 36px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(239,68,68,0.6);"><span style="color: white; font-weight: bold; font-size: 14px;">🚌</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const busStandMarker = L.marker([KARUR_NEW_BUS_STAND.lat, KARUR_NEW_BUS_STAND.lng], {
      icon: busStandIcon,
    }).addTo(map);

    busStandMarker.bindPopup(`
      <div style="color: #0b1329; font-family: sans-serif; padding: 4px;">
        <b style="font-size: 14px;">${KARUR_NEW_BUS_STAND.name}</b><br/>
        <span style="font-size: 12px; color: #4b5563;">Supported Destination in Karur District</span><br/>
        <a href="${KARUR_NEW_BUS_STAND.googleMapsUrl}" target="_blank" style="color: #2563eb; font-size: 11px; text-decoration: underline;">Google Maps Reference</a>
      </div>
    `);

    // Start Location Marker if selected
    if (startLocation) {
      const startIcon = L.divIcon({
        className: "custom-start-marker",
        html: `<div style="background: linear-gradient(135deg, #10b981, #047857); width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(16,185,129,0.7);"><span style="color: white; font-weight: bold; font-size: 14px;">📍</span></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const startMarker = L.marker([startLocation.lat, startLocation.lng], {
        icon: startIcon,
      }).addTo(map);

      startMarker.bindPopup(`
        <div style="color: #0b1329; font-family: sans-serif;">
          <b>Start Location:</b> ${startLocation.name}<br/>
          <span style="font-size: 11px; color: #6b7280;">${startLocation.lat.toFixed(4)}, ${startLocation.lng.toFixed(4)}</span>
        </div>
      `).openPopup();
    }

    // Render candidate route polylines
    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        const isSelected = selectedRouteId ? route.id === selectedRouteId : route.isRecommended;
        const color = route.isRecommended ? "#06b6d4" : isSelected ? "#3b82f6" : "#8b5cf6";
        const weight = isSelected ? 6 : 4;
        const opacity = isSelected ? 0.9 : 0.6;

        const polyline = L.polyline(route.waypoints, {
          color: color,
          weight: weight,
          opacity: opacity,
          dashArray: route.isRecommended ? undefined : "5, 5",
        }).addTo(map);

        polyline.on("click", () => {
          if (onSelectRoute) onSelectRoute(route.id);
        });

        polyline.bindTooltip(
          `<b>${route.name} (${route.via})</b><br/>Safety Indicator: ${route.safetyScore}/100 | ${route.distanceKm} km`,
          { sticky: true }
        );
      });

      // Fit map bounds to encompass all waypoints
      const allPoints: [number, number][] = [];
      routes.forEach((r) => allPoints.push(...r.waypoints));
      if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [40, 40] });
      }
    }

    // Handle map click to set new start location
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      const isKarur = isWithinKarurDistrict(lat, lng);
      const name = isKarur ? `Karur Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : `Outside Karur (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      if (onSelectStartLocation) {
        onSelectStartLocation({ lat, lng, name });
      }
    });

    return () => {
      map.remove();
    };
  }, [mounted, L, startLocation, routes, selectedRouteId]);

  if (!mounted) {
    return (
      <div className="w-full h-[450px] bg-navy-800 rounded-2xl border border-navy-700 flex flex-col items-center justify-center text-gray-400 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading Interactive Karur Map Interface...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] rounded-2xl border border-navy-700 overflow-hidden shadow-2xl">
      {/* Leaflet CSS CDN link fallback */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <div id="wsrs-leaflet-map" className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-navy-900/90 border border-navy-700 p-3 rounded-xl backdrop-blur-md text-xs text-gray-300 space-y-1.5 shadow-lg">
        <div className="font-semibold text-white mb-1">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span>Start Location (Selected)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span>Destination: Karur New Bus Stand</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-cyan-400 rounded-full"></span>
          <span>Recommended Route (High Activity)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-purple-400 rounded-full border-t border-dashed"></span>
          <span>Alternative Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-blue-500"></span>
          <span>Karur District Boundary</span>
        </div>
      </div>
    </div>
  );
}
