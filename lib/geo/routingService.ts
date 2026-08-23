import { KARUR_NEW_BUS_STAND, GeoPoint } from "./karurBounds";

export interface RouteOption {
  id: string;
  name: string;
  via: string;
  distanceKm: number;
  durationMins: number;
  activityScore: number; // 0 - 100
  safetyScore: number;   // 0 - 100
  activityLevel: "HIGH" | "MEDIUM" | "LOW";
  isRecommended: boolean;
  waypoints: [number, number][]; // [lat, lng] array for Leaflet polyline
  segments: {
    name: string;
    personCountAvg: number;
    lightingScore: number;
    activityLevel: "HIGH" | "MEDIUM" | "LOW";
  }[];
  recommendationReason: string;
}

// Key reference hubs inside Karur for testing
export const KARUR_SAMPLE_LOCATIONS = [
  {
    name: "Karur Railway Station",
    lat: 10.9582,
    lng: 78.0825,
    description: "Central Station, Karur City",
  },
  {
    name: "Karur Collectorate",
    lat: 10.9425,
    lng: 78.0645,
    description: "District Collectorate, Thanthonimalai",
  },
  {
    name: "Pasupatheeswarar Temple",
    lat: 10.9620,
    lng: 78.0792,
    description: "Temple Circle, North Karur",
  },
  {
    name: "Light House Corner",
    lat: 10.9555,
    lng: 78.0730,
    description: "Main Commercial Hub",
  },
  {
    name: "Velayuthampalayam Junction",
    lat: 11.0850,
    lng: 78.0120,
    description: "North Karur District Boundary",
  },
];

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateHaversineDistance(
  p1: GeoPoint,
  p2: GeoPoint
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Generates route alternatives from origin to Karur New Bus Stand
 */
export function generateRoutesToBusStand(
  origin: GeoPoint,
  originName: string = "Selected Origin"
): RouteOption[] {
  const dest = { lat: KARUR_NEW_BUS_STAND.lat, lng: KARUR_NEW_BUS_STAND.lng };
  const directDistance = calculateHaversineDistance(origin, dest);

  // Intermediate waypoint generation for realistic road geometry
  const midLat = (origin.lat + dest.lat) / 2;
  const midLng = (origin.lng + dest.lng) / 2;

  // Route A: Main Arterial Road (High Pedestrian Activity, Well lit)
  const routeAWaypoints: [number, number][] = [
    [origin.lat, origin.lng],
    [midLat + 0.002, midLng - 0.001],
    [midLat + 0.001, midLng + 0.002],
    [dest.lat, dest.lng],
  ];

  // Route B: Secondary Collector Road (Moderate Activity)
  const routeBWaypoints: [number, number][] = [
    [origin.lat, origin.lng],
    [midLat - 0.003, midLng + 0.004],
    [midLat + 0.002, midLng + 0.005],
    [dest.lat, dest.lng],
  ];

  // Route C: Outer Bypass (Lower Activity, Longer)
  const routeCWaypoints: [number, number][] = [
    [origin.lat, origin.lng],
    [midLat - 0.006, midLng - 0.005],
    [midLat - 0.004, midLng - 0.002],
    [dest.lat, dest.lng],
  ];

  const baseDist = Math.max(1.2, directDistance * 1.2);
  const baseTime = Math.round(baseDist * 3.2);

  const routes: RouteOption[] = [
    {
      id: "route-a",
      name: "Route A",
      via: "via Kovai Road & Main Commercial Corridor",
      distanceKm: parseFloat(baseDist.toFixed(1)),
      durationMins: baseTime,
      activityScore: 89,
      safetyScore: 87,
      activityLevel: "HIGH",
      isRecommended: true,
      waypoints: routeAWaypoints,
      segments: [
        {
          name: "Main Kovai Road Segment",
          personCountAvg: 26,
          lightingScore: 90,
          activityLevel: "HIGH",
        },
        {
          name: "Bus Stand Concourse Approach",
          personCountAvg: 34,
          lightingScore: 92,
          activityLevel: "HIGH",
        },
      ],
      recommendationReason:
        "Higher observed human activity and pedestrian presence along well-lit commercial thoroughfares.",
    },
    {
      id: "route-b",
      name: "Route B",
      via: "via Collectorate Bypass Road",
      distanceKm: parseFloat((baseDist + 0.5).toFixed(1)),
      durationMins: baseTime + 2,
      activityScore: 63,
      safetyScore: 65,
      activityLevel: "MEDIUM",
      isRecommended: false,
      waypoints: routeBWaypoints,
      segments: [
        {
          name: "Collectorate Link Road",
          personCountAvg: 14,
          lightingScore: 75,
          activityLevel: "MEDIUM",
        },
        {
          name: "South Terminal Approach",
          personCountAvg: 18,
          lightingScore: 78,
          activityLevel: "MEDIUM",
        },
      ],
      recommendationReason:
        "Moderate pedestrian activity with steady vehicular movement.",
    },
    {
      id: "route-c",
      name: "Route C",
      via: "via Outer Ring Bypass",
      distanceKm: parseFloat((baseDist + 1.2).toFixed(1)),
      durationMins: baseTime + 5,
      activityScore: 42,
      safetyScore: 48,
      activityLevel: "LOW",
      isRecommended: false,
      waypoints: routeCWaypoints,
      segments: [
        {
          name: "Outer Bypass Stretch",
          personCountAvg: 6,
          lightingScore: 50,
          activityLevel: "LOW",
        },
        {
          name: "Industrial Corridor Link",
          personCountAvg: 9,
          lightingScore: 55,
          activityLevel: "LOW",
        },
      ],
      recommendationReason:
        "Lower human activity observed; recommended primarily for heavy transport.",
    },
  ];

  return routes;
}
