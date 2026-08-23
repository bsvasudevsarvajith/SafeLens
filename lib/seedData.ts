import { KARUR_NEW_BUS_STAND } from "./geo/karurBounds";
import { VideoAnalysisResult } from "./safety/safetyScorer";

export interface UserRecord {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  status: "active" | "disabled";
}

export interface VideoRecord {
  id: string;
  fileName: string;
  storagePath: string;
  locationId: string;
  areaId: string;
  cameraName: string;
  uploadedBy: string;
  uploadedAt: string;
  durationSeconds: number;
  fileSizeMb: number;
  status: "uploaded" | "analyzing" | "completed" | "failed";
}

export interface SystemSettings {
  aiApiEndpoint: string;
  aiModelIdentifier: string;
  confidenceThreshold: number;
  detectionIntervalSeconds: number;
  safetyWeightActivity: number;
  safetyWeightRoute: number;
  updatedAt: string;
}

// Initial Admin User Credentials & Record
export const INITIAL_ADMIN_USER: UserRecord = {
  uid: "admin-wsrs-001",
  name: "System Administrator",
  email: "admin@wsrs.in",
  role: "admin",
  createdAt: "2026-08-23T10:00:00Z",
  status: "active",
};

// Initial Seed Users for Demo
export const INITIAL_USERS: UserRecord[] = [
  INITIAL_ADMIN_USER,
  {
    uid: "user-001",
    name: "Kavitha Rajan",
    email: "kavitha@example.com",
    role: "user",
    createdAt: "2026-08-20T14:22:00Z",
    status: "active",
  },
  {
    uid: "user-002",
    name: "Priya Senthil",
    email: "priya@example.com",
    role: "user",
    createdAt: "2026-08-21T09:15:00Z",
    status: "active",
  },
  {
    uid: "user-003",
    name: "Anitha Murugan",
    email: "anitha@example.com",
    role: "user",
    createdAt: "2026-08-22T16:45:00Z",
    status: "active",
  },
];

// Initial Seed Camera Areas in Karur
export const INITIAL_AREAS = [
  { id: "area-01", name: "Area A - Main Bus Bay Concourse", locationId: "karur-new-bus-stand" },
  { id: "area-02", name: "Area B - West Kovai Road Entry", locationId: "karur-new-bus-stand" },
  { id: "area-03", name: "Area C - Commercial Taxi & Auto Stand", locationId: "karur-new-bus-stand" },
  { id: "area-04", name: "Area D - Collectorate Link Crossing", locationId: "karur-new-bus-stand" },
];

// Initial Uploaded Video Records
export const INITIAL_VIDEOS: VideoRecord[] = [
  {
    id: "video-001",
    fileName: "karur_bus_stand_concourse_01.mp4",
    storagePath: "videos/karur_bus_stand_concourse_01.mp4",
    locationId: "karur-new-bus-stand",
    areaId: "area-01",
    cameraName: "Camera 01 - Main Concourse",
    uploadedBy: "admin@wsrs.in",
    uploadedAt: "2026-08-23T11:00:00Z",
    durationSeconds: 120,
    fileSizeMb: 18.5,
    status: "completed",
  },
  {
    id: "video-002",
    fileName: "karur_kovai_road_entry_02.mp4",
    storagePath: "videos/karur_kovai_road_entry_02.mp4",
    locationId: "karur-new-bus-stand",
    areaId: "area-02",
    cameraName: "Camera 02 - Kovai Road Gate",
    uploadedBy: "admin@wsrs.in",
    uploadedAt: "2026-08-23T11:30:00Z",
    durationSeconds: 90,
    fileSizeMb: 14.2,
    status: "completed",
  },
  {
    id: "video-003",
    fileName: "karur_collectorate_link_03.mp4",
    storagePath: "videos/karur_collectorate_link_03.mp4",
    locationId: "karur-new-bus-stand",
    areaId: "area-04",
    cameraName: "Camera 04 - Collectorate Crossing",
    uploadedBy: "admin@wsrs.in",
    uploadedAt: "2026-08-23T12:00:00Z",
    durationSeconds: 150,
    fileSizeMb: 22.8,
    status: "completed",
  },
];

// Initial AI Analysis Results
export const INITIAL_ANALYSIS_RESULTS: VideoAnalysisResult[] = [
  {
    videoId: "video-001",
    locationId: "karur-new-bus-stand",
    areaId: "area-01",
    cameraName: "Camera 01 - Main Concourse",
    averagePersonCount: 24.5,
    maximumPersonCount: 37,
    minimumPersonCount: 12,
    activityLevel: "HIGH",
    analyzedAt: "2026-08-23T11:05:00Z",
    modelName: "YOLOv8n",
    modelVersion: "8.2.0",
    totalFramesAnalyzed: 3600,
    confidenceThreshold: 0.5,
  },
  {
    videoId: "video-002",
    locationId: "karur-new-bus-stand",
    areaId: "area-02",
    cameraName: "Camera 02 - Kovai Road Gate",
    averagePersonCount: 18.2,
    maximumPersonCount: 28,
    minimumPersonCount: 9,
    activityLevel: "HIGH",
    analyzedAt: "2026-08-23T11:32:00Z",
    modelName: "YOLOv8n",
    modelVersion: "8.2.0",
    totalFramesAnalyzed: 2700,
    confidenceThreshold: 0.5,
  },
  {
    videoId: "video-003",
    locationId: "karur-new-bus-stand",
    areaId: "area-04",
    cameraName: "Camera 04 - Collectorate Crossing",
    averagePersonCount: 11.4,
    maximumPersonCount: 19,
    minimumPersonCount: 4,
    activityLevel: "MEDIUM",
    analyzedAt: "2026-08-23T12:03:00Z",
    modelName: "YOLOv8n",
    modelVersion: "8.2.0",
    totalFramesAnalyzed: 4500,
    confidenceThreshold: 0.5,
  },
];

// Default System Settings
export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  aiApiEndpoint: process.env.AI_API_URL || "http://127.0.0.1:8000",
  aiModelIdentifier: "YOLOv8n",
  confidenceThreshold: 0.5,
  detectionIntervalSeconds: 1,
  safetyWeightActivity: 0.7,
  safetyWeightRoute: 0.3,
  updatedAt: "2026-08-23T10:00:00Z",
};

// Local storage state persistence for seamless demonstration execution
export function getLocalSeedState() {
  if (typeof window === "undefined") {
    return {
      users: INITIAL_USERS,
      videos: INITIAL_VIDEOS,
      analyses: INITIAL_ANALYSIS_RESULTS,
      settings: INITIAL_SYSTEM_SETTINGS,
    };
  }

  const usersStr = localStorage.getItem("wsrs_users");
  const videosStr = localStorage.getItem("wsrs_videos");
  const analysesStr = localStorage.getItem("wsrs_analyses");
  const settingsStr = localStorage.getItem("wsrs_settings");

  return {
    users: usersStr ? JSON.parse(usersStr) : INITIAL_USERS,
    videos: videosStr ? JSON.parse(videosStr) : INITIAL_VIDEOS,
    analyses: analysesStr ? JSON.parse(analysesStr) : INITIAL_ANALYSIS_RESULTS,
    settings: settingsStr ? JSON.parse(settingsStr) : INITIAL_SYSTEM_SETTINGS,
  };
}

export function saveLocalSeedState(state: {
  users?: UserRecord[];
  videos?: VideoRecord[];
  analyses?: VideoAnalysisResult[];
  settings?: SystemSettings;
}) {
  if (typeof window === "undefined") return;
  if (state.users) localStorage.setItem("wsrs_users", JSON.stringify(state.users));
  if (state.videos) localStorage.setItem("wsrs_videos", JSON.stringify(state.videos));
  if (state.analyses) localStorage.setItem("wsrs_analyses", JSON.stringify(state.analyses));
  if (state.settings) localStorage.setItem("wsrs_settings", JSON.stringify(state.settings));
}
