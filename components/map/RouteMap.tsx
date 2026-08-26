"use client";

import React, { useEffect, useState, useRef } from "react";
import { KARUR_NEW_BUS_STAND, KARUR_POLYGON, isWithinKarurDistrict } from "@/lib/geo/karurBounds";
import { RouteOption } from "@/lib/geo/routingService";

interface RouteMapProps {
  startLocation: { lat: number; lng: number; name: string } | null;
  destinationLocation?: { lat: number; lng: number; name: string } | null;
  routes?: RouteOption[];
  selectedRouteId?: string;
  isNavigating?: boolean;
  currentUserCoords?: { lat: number; lng: number } | null;
  onSelectStartLocation?: (location: { lat: number; lng: number; name: string }) => void;
  onSelectRoute?: (routeId: string) => void;
}

export default function RouteMap({
  startLocation,
  destinationLocation,
  routes = [],
  selectedRouteId,
  isNavigating = false,
  currentUserCoords = null,
  onSelectStartLocation,
  onSelectRoute,
}: RouteMapProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

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

    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const defaultLat = currentUserCoords?.lat || startLocation?.lat || 10.9582;
    const defaultLng = currentUserCoords?.lng || startLocation?.lng || 78.0766;

    const map = L.map("wsrs-leaflet-map", {
      center: [defaultLat, defaultLng],
      zoom: isNavigating ? 16 : 14,
      zoomControl: true,
    });
    mapRef.current = map;

    // CartoDB Voyager Tile Layer (Clean modern styling suitable for SafeLens)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Draw Karur District Boundary Polygon
    const polyCoords = KARUR_POLYGON.map((p) => [p.lat, p.lng]);
    L.polygon(polyCoords, {
      color: "#6D35E8",
      weight: 1.5,
      dashArray: "6, 6",
      fillColor: "#6D35E8",
      fillOpacity: 0.03,
    }).addTo(map);

    // Destination Marker
    const destLat = destinationLocation?.lat || KARUR_NEW_BUS_STAND.lat;
    const destLng = destinationLocation?.lng || KARUR_NEW_BUS_STAND.lng;
    const destName = destinationLocation?.name || KARUR_NEW_BUS_STAND.name;

    const destIcon = L.divIcon({
      className: "custom-dest-marker",
      html: `<div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 38px; height: 38px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(239,68,68,0.4);"><span style="color: white; font-weight: bold; font-size: 16px;">🏁</span></div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const destMarker = L.marker([destLat, destLng], {
      icon: destIcon,
    }).addTo(map);

    destMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <b style="font-size: 13px; color: #0f172a;">${destName}</b><br/>
        <span style="font-size: 11px; color: #64748b;">Destination Hub</span>
      </div>
    `);

    // Start Location Marker (if not live navigating)
    if (startLocation && !isNavigating) {
      const startIcon = L.divIcon({
        className: "custom-start-marker",
        html: `<div style="background: linear-gradient(135deg, #10b981, #059669); width: 36px; height: 36px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16,185,129,0.4);"><span style="color: white; font-weight: bold; font-size: 15px;">📍</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const startMarker = L.marker([startLocation.lat, startLocation.lng], {
        icon: startIcon,
      }).addTo(map);

      startMarker.bindPopup(`
        <div style="font-family: sans-serif;">
          <b style="font-size: 13px; color: #0f172a;">${startLocation.name}</b><br/>
          <span style="font-size: 11px; color: #64748b;">Origin Point</span>
        </div>
      `);
    }

    // Render Routes
    if (routes && routes.length > 0) {
      routes.forEach((route) => {
        const isSelected = selectedRouteId ? route.id === selectedRouteId : route.isRecommended;
        const color = isSelected ? "#6D35E8" : route.isRecommended ? "#10b981" : "#94a3b8";
        const weight = isSelected ? 7 : 4;
        const opacity = isSelected ? 0.95 : 0.55;

        const polyline = L.polyline(route.waypoints, {
          color: color,
          weight: weight,
          opacity: opacity,
          lineJoin: "round",
          lineCap: "round",
          dashArray: isSelected ? undefined : "6, 6",
        }).addTo(map);

        polyline.on("click", () => {
          if (onSelectRoute) onSelectRoute(route.id);
        });

        polyline.bindTooltip(
          `<b>${route.name}</b><br/>Safety: ${route.safetyScore}/100 • ${route.distanceKm} km`,
          { sticky: true }
        );
      });

      // Fit map bounds if not in active live navigation
      if (!isNavigating) {
        const allPoints: [number, number][] = [];
        routes.forEach((r) => allPoints.push(...r.waypoints));
        if (allPoints.length > 0) {
          map.fitBounds(allPoints, { padding: [50, 50] });
        }
      }
    }

    // Live Navigation User Marker
    if (isNavigating && currentUserCoords) {
      const liveUserIcon = L.divIcon({
        className: "custom-live-user-marker",
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(109, 53, 232, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: #6D35E8; border: 3.5px solid #ffffff; box-shadow: 0 4px 14px rgba(109,53,232,0.6); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      userMarkerRef.current = L.marker([currentUserCoords.lat, currentUserCoords.lng], {
        icon: liveUserIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      map.panTo([currentUserCoords.lat, currentUserCoords.lng], { animate: true, duration: 0.8 });
    }

    // Map click handler
    map.on("click", (e: any) => {
      if (isNavigating) return;
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
  }, [mounted, L, startLocation, destinationLocation, routes, selectedRouteId, isNavigating]);

  // Update live marker position dynamically without re-creating map
  useEffect(() => {
    if (isNavigating && currentUserCoords && mapRef.current) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([currentUserCoords.lat, currentUserCoords.lng]);
      }
      mapRef.current.panTo([currentUserCoords.lat, currentUserCoords.lng], { animate: true, duration: 0.5 });
    }
  }, [currentUserCoords, isNavigating]);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-brand-soft rounded-3xl border border-brand-border flex flex-col items-center justify-center text-brand-muted gap-3">
        <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold">Initializing SafeLens Dynamic Map Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-3xl border border-brand-border overflow-hidden shadow-card">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <div id="wsrs-leaflet-map" className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 border border-brand-border p-3.5 rounded-2xl backdrop-blur-md text-xs text-brand-navy space-y-1.5 shadow-md">
        <div className="font-extrabold text-brand-navy text-[11px] mb-1">Map Indicators</div>
        {isNavigating ? (
          <div className="flex items-center gap-2 font-bold text-brand-purple">
            <span className="w-3 h-3 rounded-full bg-brand-purple animate-pulse"></span>
            <span>Live GPS Current Position</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
            <span>Origin Point</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 bg-brand-purple rounded-full"></span>
          <span>Active Safe Route</span>
        </div>
      </div>
    </div>
  );
}
