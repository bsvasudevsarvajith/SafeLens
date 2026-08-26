import { KARUR_NEW_BUS_STAND } from "./geo/karurBounds";
import { CrowdAnalysisResult } from "./safety/safetyScorer";

export interface UserRecord {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
  createdAt: string;
  status: "active" | "disabled";
}

export interface CameraRecord {
  id: string;
  cameraName: string;
  regionName: string;
  areaName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  cameraType: "Fixed CCTV" | "PTZ Camera" | "Dome CCTV" | "IP Camera" | "Demo Camera";
  streamType: "RTSP" | "HLS" | "WebRTC" | "Demo";
  streamUrl?: string; // Kept server-side/admin only
  status: "active" | "warning" | "offline";
  description: string;
  peopleCount: number;
  crowdDensity: number;
  activityLevel: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  confidence: number;
  lastAnalysisTimestamp: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface RegionRecord {
  id: string;
  name: string;
  state: string;
  district: string;
  totalCameras: number;
  activeCameras: number;
  estimatedPeople: number;
  averageCrowdDensity: number;
  activityLevel: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  centerLat: number;
  centerLng: number;
}

export interface CrowdMeasurement {
  id: string;
  cameraId: string;
  regionName: string;
  areaName: string;
  timestamp: string; // ISO string
  timeLabel: string; // e.g. "10:00"
  peopleCount: number;
  crowdDensity: number;
  activityLevel: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  confidence: number;
}

export interface VideoRecord {
  id: string;
  fileName: string;
  storagePath: string;
  locationId?: string;
  regionName: string;
  areaName: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  cameraName: string;
  uploadedBy: string;
  uploadedAt: string;
  durationSeconds: number;
  fileSizeMb: number;
  status: "uploaded" | "analyzing" | "completed" | "failed";
  peopleDetected?: number;
  averagePeople?: number;
  peakPeople?: number;
  minimumPeople?: number;
  crowdDensity?: number;
  activityLevel?: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  averageConfidence?: number;
}

export interface SafetyReportRecord {
  id: string;
  locationName: string;
  regionName: string;
  areaName: string;
  latitude: number;
  longitude: number;
  category: "Poor Lighting" | "Isolated Area" | "Harassment Concern" | "Broken Infrastructure" | "Safe Zone";
  description: string;
  severity: "Low" | "Medium" | "High";
  reportedAt: string;
  status: "Verified" | "Under Review" | "Resolved";
  upvotes: number;
}

// Initial Admin
export const INITIAL_ADMIN_USER: UserRecord = {
  uid: "admin-wsrs-001",
  name: "System Administrator",
  email: "admin@wsrs.in",
  phone: "+91 98765 43210",
  role: "admin",
  createdAt: "2026-08-20T10:00:00Z",
  status: "active",
};

// Initial Users
export const INITIAL_USERS: UserRecord[] = [
  INITIAL_ADMIN_USER,
  {
    uid: "user-001",
    name: "Kavitha Rajan",
    email: "kavitha@example.com",
    phone: "+91 98421 11223",
    role: "user",
    createdAt: "2026-08-20T14:22:00Z",
    status: "active",
  },
  {
    uid: "user-002",
    name: "Priya Senthil",
    email: "priya@example.com",
    phone: "+91 98422 33445",
    role: "user",
    createdAt: "2026-08-21T09:15:00Z",
    status: "active",
  },
  {
    uid: "user-003",
    name: "Anitha Murugan",
    email: "anitha@example.com",
    phone: "+91 98423 55667",
    role: "user",
    createdAt: "2026-08-22T16:45:00Z",
    status: "active",
  },
];

// Initial Regions
export const INITIAL_REGIONS: RegionRecord[] = [
  {
    id: "region-karur",
    name: "Karur",
    state: "Tamil Nadu",
    district: "Karur",
    totalCameras: 8,
    activeCameras: 7,
    estimatedPeople: 247,
    averageCrowdDensity: 72,
    activityLevel: "HIGH",
    centerLat: 10.9601,
    centerLng: 78.0766,
  },
  {
    id: "region-kulithalai",
    name: "Kulithalai",
    state: "Tamil Nadu",
    district: "Karur",
    totalCameras: 3,
    activeCameras: 3,
    estimatedPeople: 86,
    averageCrowdDensity: 48,
    activityLevel: "MODERATE",
    centerLat: 10.9344,
    centerLng: 78.4187,
  },
  {
    id: "region-aravakurichi",
    name: "Aravakurichi",
    state: "Tamil Nadu",
    district: "Karur",
    totalCameras: 2,
    activeCameras: 1,
    estimatedPeople: 34,
    averageCrowdDensity: 28,
    activityLevel: "LOW",
    centerLat: 10.7712,
    centerLng: 77.9125,
  }
];

// Initial CCTV Cameras (with Demo Cameras clearly labeled)
export const INITIAL_CAMERAS: CameraRecord[] = [
  {
    id: "cam-karur-01",
    cameraName: "Karur Bus Stand Camera 01",
    regionName: "Karur",
    areaName: "Bus Stand",
    landmark: "Main Entrance Concourse",
    latitude: 10.9601,
    longitude: 78.0766,
    cameraType: "Demo Camera",
    streamType: "Demo",
    streamUrl: "/demo_karur_camera.mp4",
    status: "active",
    description: "Main bus terminal entry & passenger concourse surveillance camera (Demo Feed).",
    peopleCount: 37,
    crowdDensity: 81,
    activityLevel: "VERY HIGH",
    confidence: 0.91,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-20T08:00:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "cam-karur-02",
    cameraName: "Karur Railway Station Camera 01",
    regionName: "Karur",
    areaName: "Railway Station",
    landmark: "Platform 1 Link",
    latitude: 10.9582,
    longitude: 78.0825,
    cameraType: "Demo Camera",
    streamType: "Demo",
    streamUrl: "/demo_karur_camera.mp4",
    status: "active",
    description: "Railway Station northern gate & approach corridor (Demo Feed).",
    peopleCount: 26,
    crowdDensity: 65,
    activityLevel: "HIGH",
    confidence: 0.89,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-20T08:30:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "cam-karur-03",
    cameraName: "Karur Market Camera 01",
    regionName: "Karur",
    areaName: "Jawahar Bazaar",
    landmark: "Market Clock Tower",
    latitude: 10.9615,
    longitude: 78.0792,
    cameraType: "Demo Camera",
    streamType: "Demo",
    streamUrl: "/demo_karur_camera.mp4",
    status: "active",
    description: "Bazaar commercial intersection pedestrian lane (Demo Feed).",
    peopleCount: 31,
    crowdDensity: 78,
    activityLevel: "VERY HIGH",
    confidence: 0.93,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "cam-karur-04",
    cameraName: "Collectorate Roundabout Camera 02",
    regionName: "Karur",
    areaName: "Thanthonimalai",
    landmark: "Collector Office Junction",
    latitude: 10.9425,
    longitude: 78.0815,
    cameraType: "Fixed CCTV",
    streamType: "HLS",
    status: "warning",
    description: "Main arterial roundabout connecting Kovai Road & Collectorate complex.",
    peopleCount: 14,
    crowdDensity: 38,
    activityLevel: "MODERATE",
    confidence: 0.86,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-21T10:00:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: false,
  },
  {
    id: "cam-karur-05",
    cameraName: "Pasupatheeswarar Temple South Gate",
    regionName: "Karur",
    areaName: "Town Center",
    landmark: "South Car Street",
    latitude: 10.9575,
    longitude: 78.0742,
    cameraType: "Dome CCTV",
    streamType: "RTSP",
    status: "active",
    description: "Heritage shrine perimeter walkway & public lighting coverage zone.",
    peopleCount: 22,
    crowdDensity: 55,
    activityLevel: "HIGH",
    confidence: 0.90,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-21T11:30:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: false,
  },
  {
    id: "cam-karur-06",
    cameraName: "Kovai Road Bypass Camera 03",
    regionName: "Karur",
    areaName: "West Bypass",
    landmark: "Overbridge Junction",
    latitude: 10.9665,
    longitude: 78.0645,
    cameraType: "Fixed CCTV",
    streamType: "RTSP",
    status: "offline",
    description: "Highway transit link overbridge (Feed maintenance).",
    peopleCount: 0,
    crowdDensity: 0,
    activityLevel: "LOW",
    confidence: 0.0,
    lastAnalysisTimestamp: new Date().toISOString(),
    createdAt: "2026-08-22T14:00:00Z",
    updatedAt: new Date().toISOString(),
    isDemo: false,
  }
];

// Initial Time-Series Measurements (e.g. 10:00 -> 18, 11:00 -> 25, 12:00 -> 31, 13:00 -> 42)
export const INITIAL_CROWD_MEASUREMENTS: CrowdMeasurement[] = [
  {
    id: "meas-01",
    cameraId: "cam-karur-01",
    regionName: "Karur",
    areaName: "Bus Stand",
    timestamp: "2026-08-26T04:30:00Z",
    timeLabel: "10:00",
    peopleCount: 18,
    crowdDensity: 45,
    activityLevel: "HIGH",
    confidence: 0.92,
  },
  {
    id: "meas-02",
    cameraId: "cam-karur-01",
    regionName: "Karur",
    areaName: "Bus Stand",
    timestamp: "2026-08-26T05:30:00Z",
    timeLabel: "11:00",
    peopleCount: 25,
    crowdDensity: 62,
    activityLevel: "HIGH",
    confidence: 0.90,
  },
  {
    id: "meas-03",
    cameraId: "cam-karur-01",
    regionName: "Karur",
    areaName: "Bus Stand",
    timestamp: "2026-08-26T06:30:00Z",
    timeLabel: "12:00",
    peopleCount: 31,
    crowdDensity: 78,
    activityLevel: "VERY HIGH",
    confidence: 0.94,
  },
  {
    id: "meas-04",
    cameraId: "cam-karur-01",
    regionName: "Karur",
    areaName: "Bus Stand",
    timestamp: "2026-08-26T07:30:00Z",
    timeLabel: "13:00",
    peopleCount: 42,
    crowdDensity: 95,
    activityLevel: "VERY HIGH",
    confidence: 0.91,
  },
  {
    id: "meas-05",
    cameraId: "cam-karur-01",
    regionName: "Karur",
    areaName: "Bus Stand",
    timestamp: "2026-08-26T08:30:00Z",
    timeLabel: "14:00",
    peopleCount: 37,
    crowdDensity: 81,
    activityLevel: "VERY HIGH",
    confidence: 0.91,
  }
];

// Initial Uploaded Videos
export const INITIAL_VIDEOS: VideoRecord[] = [
  {
    id: "video-001",
    fileName: "karur_bus_stand_concourse_01.mp4",
    storagePath: "videos/karur_bus_stand_concourse_01.mp4",
    regionName: "Karur",
    areaName: "Bus Stand",
    landmark: "Main Entrance",
    latitude: 10.9601,
    longitude: 78.0766,
    cameraName: "Karur Bus Stand Camera 01",
    uploadedBy: "admin@wsrs.in",
    uploadedAt: "2026-08-23T11:00:00Z",
    durationSeconds: 120,
    fileSizeMb: 18.5,
    status: "completed",
    peopleDetected: 37,
    averagePeople: 28,
    peakPeople: 45,
    minimumPeople: 14,
    crowdDensity: 81,
    activityLevel: "VERY HIGH",
    averageConfidence: 0.91,
  },
  {
    id: "video-002",
    fileName: "karur_kovai_road_entry_02.mp4",
    storagePath: "videos/karur_kovai_road_entry_02.mp4",
    regionName: "Karur",
    areaName: "Kovai Road",
    landmark: "West Gate Crossing",
    latitude: 10.9620,
    longitude: 78.0720,
    cameraName: "Camera 02 - Kovai Road Gate",
    uploadedBy: "admin@wsrs.in",
    uploadedAt: "2026-08-23T11:30:00Z",
    durationSeconds: 90,
    fileSizeMb: 14.2,
    status: "completed",
    peopleDetected: 18,
    averagePeople: 18,
    peakPeople: 28,
    minimumPeople: 9,
    crowdDensity: 52,
    activityLevel: "HIGH",
    averageConfidence: 0.88,
  }
];

// Initial Safety Reports
export const INITIAL_SAFETY_REPORTS: SafetyReportRecord[] = [
  {
    id: "rep-001",
    locationName: "Karur Railway North Approach",
    regionName: "Karur",
    areaName: "Railway Station",
    latitude: 10.9592,
    longitude: 78.0835,
    category: "Poor Lighting",
    description: "Streetlights along the northern pedestrian footpath are flickering after 8 PM.",
    severity: "Medium",
    reportedAt: "2026-08-24T19:30:00Z",
    status: "Under Review",
    upvotes: 8,
  },
  {
    id: "rep-002",
    locationName: "Jawahar Bazaar Cross 3",
    regionName: "Karur",
    areaName: "Town Center",
    latitude: 10.9610,
    longitude: 78.0785,
    category: "Safe Zone",
    description: "Well lit commercial stretch with continuous public presence and active CCTV.",
    severity: "Low",
    reportedAt: "2026-08-25T14:15:00Z",
    status: "Verified",
    upvotes: 19,
  }
];

// Initial Seed Camera Areas in Karur
export const INITIAL_AREAS = [
  { id: "area-01", name: "Bus Stand - Main Entrance Concourse", locationId: "karur-new-bus-stand" },
  { id: "area-02", name: "Kovai Road - West Gate Crossing", locationId: "karur-new-bus-stand" },
  { id: "area-03", name: "Railway Station - Northern Link", locationId: "karur-railway-station" },
  { id: "area-04", name: "Jawahar Bazaar - Clock Tower", locationId: "karur-bazaar" },
];

export interface SystemSettings {
  aiApiEndpoint: string;
  aiModelIdentifier: string;
  confidenceThreshold: number;
  detectionIntervalSeconds: number;
  safetyWeightActivity: number;
  safetyWeightRoute: number;
  updatedAt: string;
}

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  aiApiEndpoint: "http://127.0.0.1:8000",
  aiModelIdentifier: "people-detection-o4rdr/12",
  confidenceThreshold: 0.5,
  detectionIntervalSeconds: 1,
  safetyWeightActivity: 0.7,
  safetyWeightRoute: 0.3,
  updatedAt: new Date().toISOString(),
};

// Helper to access state in browser with fallback
export function getLocalSeedState() {
  if (typeof window === "undefined") {
    return {
      users: INITIAL_USERS,
      cameras: INITIAL_CAMERAS,
      regions: INITIAL_REGIONS,
      measurements: INITIAL_CROWD_MEASUREMENTS,
      videos: INITIAL_VIDEOS,
      reports: INITIAL_SAFETY_REPORTS,
      settings: INITIAL_SYSTEM_SETTINGS,
    };
  }

  const usersStr = localStorage.getItem("wsrs_users");
  const camerasStr = localStorage.getItem("wsrs_cameras");
  const regionsStr = localStorage.getItem("wsrs_regions");
  const measurementsStr = localStorage.getItem("wsrs_measurements");
  const videosStr = localStorage.getItem("wsrs_videos");
  const reportsStr = localStorage.getItem("wsrs_reports");
  const settingsStr = localStorage.getItem("wsrs_settings");

  return {
    users: usersStr ? JSON.parse(usersStr) : INITIAL_USERS,
    cameras: camerasStr ? JSON.parse(camerasStr) : INITIAL_CAMERAS,
    regions: regionsStr ? JSON.parse(regionsStr) : INITIAL_REGIONS,
    measurements: measurementsStr ? JSON.parse(measurementsStr) : INITIAL_CROWD_MEASUREMENTS,
    videos: videosStr ? JSON.parse(videosStr) : INITIAL_VIDEOS,
    reports: reportsStr ? JSON.parse(reportsStr) : INITIAL_SAFETY_REPORTS,
    settings: settingsStr ? JSON.parse(settingsStr) : INITIAL_SYSTEM_SETTINGS,
  };
}

export function saveLocalSeedState(state: {
  users?: UserRecord[];
  cameras?: CameraRecord[];
  regions?: RegionRecord[];
  measurements?: CrowdMeasurement[];
  videos?: VideoRecord[];
  reports?: SafetyReportRecord[];
  settings?: SystemSettings;
}) {
  if (typeof window === "undefined") return;
  if (state.users) localStorage.setItem("wsrs_users", JSON.stringify(state.users));
  if (state.cameras) localStorage.setItem("wsrs_cameras", JSON.stringify(state.cameras));
  if (state.regions) localStorage.setItem("wsrs_regions", JSON.stringify(state.regions));
  if (state.measurements) localStorage.setItem("wsrs_measurements", JSON.stringify(state.measurements));
  if (state.videos) localStorage.setItem("wsrs_videos", JSON.stringify(state.videos));
  if (state.reports) localStorage.setItem("wsrs_reports", JSON.stringify(state.reports));
  if (state.settings) localStorage.setItem("wsrs_settings", JSON.stringify(state.settings));
}
