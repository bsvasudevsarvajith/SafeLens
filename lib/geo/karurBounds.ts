// Karur District, Tamil Nadu, India Geographic Bounds & Polygon

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface KarurLocation {
  id: string;
  name: string;
  district: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  isSupported: boolean;
  address?: string;
  googleMapsUrl?: string;
}

// Exact reference for Karur New Bus Stand
export const KARUR_NEW_BUS_STAND: KarurLocation = {
  id: "karur-new-bus-stand",
  name: "Karur New Bus Stand",
  district: "Karur",
  state: "Tamil Nadu",
  country: "India",
  lat: 10.9602,
  lng: 78.0766,
  isSupported: true,
  address: "Karur New Bus Stand, Karur, Tamil Nadu 639001",
  googleMapsUrl: "https://maps.app.goo.gl/enLjgrFzX8LpUbS18",
};

// Karur District Bounding Box
export const KARUR_BOUNDS = {
  minLat: 10.65,
  maxLat: 11.25,
  minLng: 77.65,
  maxLng: 78.45,
};

// Karur District Approximate Polygon for boundary checking
export const KARUR_POLYGON: GeoPoint[] = [
  { lat: 11.18, lng: 77.85 },
  { lat: 11.15, lng: 78.25 },
  { lat: 10.95, lng: 78.40 },
  { lat: 10.72, lng: 78.30 },
  { lat: 10.68, lng: 77.95 },
  { lat: 10.82, lng: 77.72 },
  { lat: 11.05, lng: 77.75 },
];

/**
 * Validates whether a coordinate (lat, lng) is within Karur District.
 */
export function isWithinKarurDistrict(lat: number, lng: number): boolean {
  // Simple Bounding Box check first
  if (
    lat < KARUR_BOUNDS.minLat ||
    lat > KARUR_BOUNDS.maxLat ||
    lng < KARUR_BOUNDS.minLng ||
    lng > KARUR_BOUNDS.maxLng
  ) {
    return false;
  }

  // Ray-casting algorithm for polygon boundary check
  let inside = false;
  const poly = KARUR_POLYGON;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lat, yi = poly[i].lng;
    const xj = poly[j].lat, yj = poly[j].lng;

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

export const UNSUPPORTED_LOCATION_MESSAGE = {
  title: "Service Not Available",
  subtitle: "Location Not Supported",
  message:
    "Safety route analysis is currently available only within Karur District demonstration area. Please select a location within the supported area.",
  supportedArea: "Karur District, Tamil Nadu",
  supportedDestination: "Karur New Bus Stand",
};
