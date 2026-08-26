// Modular Multi-Factor Safety Engine & Crowd Activity Calculator

export interface CrowdAnalysisResult {
  sourceType: "video" | "image" | "cctv";
  cameraId?: string;
  regionName: string;
  areaName: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  peopleCount: number;
  averagePeopleCount?: number;
  peakPeopleCount?: number;
  minimumPeopleCount?: number;
  crowdDensity: number; // 0 - 100%
  activityLevel: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  confidence: number; // 0.0 - 1.0
  timestamp: string;
  predictions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    bbox: [number, number, number, number];
    class: string;
  }>;
  timeSeries?: Array<{
    sample_index: number;
    timestamp_seconds: number;
    people_count: number;
    crowd_density: number;
    activity_level: string;
  }>;
}

export interface MultiFactorSafetyAssessment {
  overallScore: number; // 0 - 100
  status: "FAVORABLE" | "MODERATE" | "CAUTION";
  statusColor: string;
  statusBadge: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  crowdActivityScore: number; // 0 - 100
  publicPlaceDensityScore: number; // 0 - 100
  roadConnectivityScore: number; // 0 - 100
  timeFactorScore: number; // 0 - 100
  safetyReportsScore: number; // 0 - 100
  cameraActivityScore: number; // 0 - 100
  estimatedPeople: number;
  activityLevel: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH";
  recommendation: string;
  disclaimer: string;
}

export const SAFETY_DISCLAIMER_NOTICE = {
  header: "Safety Indicator Notice",
  body: "Crowd activity is one indicator and does not guarantee personal safety. Stay alert, avoid unlit or isolated paths, and contact local authorities or emergency helplines when needed.",
  prohibitedTermsNotice:
    "System metrics are algorithmic activity indicators, not absolute safety guarantees.",
};

/**
 * Calculates human activity level classification based on person count:
 *   0 - 5: LOW
 *   6 - 15: MODERATE
 *   16 - 30: HIGH
 *   31+: VERY HIGH
 */
export function getCrowdActivityLevel(count: number): "LOW" | "MODERATE" | "HIGH" | "VERY HIGH" {
  if (count <= 5) return "LOW";
  if (count <= 15) return "MODERATE";
  if (count <= 30) return "HIGH";
  return "VERY HIGH";
}

/**
 * Converts person count into a normalized 0 - 100 activity score.
 */
export function calculateActivityScore(peopleCount: number): number {
  if (peopleCount <= 0) return 15;
  if (peopleCount <= 5) return Math.round(20 + peopleCount * 5); // 20 - 45
  if (peopleCount <= 15) return Math.round(45 + (peopleCount - 5) * 3); // 45 - 75
  if (peopleCount <= 30) return Math.round(75 + (peopleCount - 15) * 1.3); // 75 - 95
  return Math.min(100, Math.round(95 + (peopleCount - 30) * 0.5)); // 95 - 100
}

/**
 * Calculates time of day safety factor (e.g. daytime has higher visibility factor).
 */
export function calculateTimeOfDayFactor(hour?: number): number {
  const currentHour = hour !== undefined ? hour : new Date().getHours();
  // Daytime: 07:00 to 19:00 -> Score 85 - 95
  // Evening: 19:00 to 22:00 -> Score 70 - 80
  // Night: 22:00 to 05:00 -> Score 40 - 55
  // Early Morning: 05:00 to 07:00 -> Score 65 - 75
  if (currentHour >= 7 && currentHour < 19) {
    return 90;
  } else if (currentHour >= 19 && currentHour < 22) {
    return 75;
  } else if (currentHour >= 22 || currentHour < 5) {
    return 48;
  } else {
    return 70;
  }
}

/**
 * Multi-Factor Safety Engine:
 * Combines:
 *  1. Crowd Activity (Weight: 25%)
 *  2. Public Place Density (Weight: 20%)
 *  3. Road Connectivity / Streetlighting (Weight: 20%)
 *  4. Time of Day Visibility (Weight: 15%)
 *  5. Safety Reports & Community Feedback (Weight: 10%)
 *  6. Camera Surveillance Presence (Weight: 10%)
 */
export function computeMultiFactorSafety(params: {
  peopleCount?: number;
  crowdActivityScore?: number;
  publicPlaceDensity?: number;
  roadConnectivity?: number;
  timeHour?: number;
  safetyReportsFactor?: number;
  nearbyCameraCount?: number;
  areaName?: string;
  regionName?: string;
}): MultiFactorSafetyAssessment {
  const people = params.peopleCount !== undefined ? params.peopleCount : 24;
  const crowdScore = params.crowdActivityScore !== undefined ? params.crowdActivityScore : calculateActivityScore(people);
  const publicDensity = params.publicPlaceDensity !== undefined ? params.publicPlaceDensity : 78;
  const roadConnectivity = params.roadConnectivity !== undefined ? params.roadConnectivity : 82;
  const timeFactor = calculateTimeOfDayFactor(params.timeHour);
  const reportsScore = params.safetyReportsFactor !== undefined ? params.safetyReportsFactor : 80;
  
  const camCount = params.nearbyCameraCount !== undefined ? params.nearbyCameraCount : 3;
  const camScore = Math.min(100, Math.max(30, camCount * 25));

  // Weighted multi-factor calculation
  const compositeScore = Math.round(
    crowdScore * 0.25 +
    publicDensity * 0.20 +
    roadConnectivity * 0.20 +
    timeFactor * 0.15 +
    reportsScore * 0.10 +
    camScore * 0.10
  );

  const finalScore = Math.min(100, Math.max(10, compositeScore));

  let status: "FAVORABLE" | "MODERATE" | "CAUTION" = "MODERATE";
  let statusColor = "text-amber-400";
  let statusBadge = "🟡 Moderate";
  let riskLevel: "LOW" | "MODERATE" | "HIGH" = "MODERATE";

  if (finalScore >= 75) {
    status = "FAVORABLE";
    statusColor = "text-emerald-400";
    statusBadge = "🟢 Favorable";
    riskLevel = "LOW";
  } else if (finalScore < 50) {
    status = "CAUTION";
    statusColor = "text-red-400";
    statusBadge = "🔴 Caution";
    riskLevel = "HIGH";
  }

  const activityLevel = getCrowdActivityLevel(people);
  const locationDesc = params.areaName ? `${params.areaName}, ${params.regionName || "Karur"}` : "this location";

  let recommendation = "";
  if (status === "FAVORABLE") {
    recommendation = `This area currently shows healthy estimated human activity (${people} people) with good surveillance connectivity and favorable conditions.`;
  } else if (status === "MODERATE") {
    recommendation = `Moderate human activity detected in ${locationDesc}. Main road corridors are advised over unlit internal pathways.`;
  } else {
    recommendation = `Low activity or elevated caution score for ${locationDesc}. Travel with companions or stick to well-lit transit arteries with camera coverage.`;
  }

  return {
    overallScore: finalScore,
    status,
    statusColor,
    statusBadge,
    riskLevel,
    crowdActivityScore: crowdScore,
    publicPlaceDensityScore: publicDensity,
    roadConnectivityScore: roadConnectivity,
    timeFactorScore: timeFactor,
    safetyReportsScore: reportsScore,
    cameraActivityScore: camScore,
    estimatedPeople: people,
    activityLevel,
    recommendation,
    disclaimer: "Crowd activity is one indicator and does not guarantee personal safety."
  };
}
