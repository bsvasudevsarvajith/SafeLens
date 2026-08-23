// Modular Safety Indicator & Activity Calculation Engine

export interface VideoAnalysisResult {
  videoId: string;
  locationId: string;
  areaId: string;
  cameraName?: string;
  averagePersonCount: number;
  maximumPersonCount: number;
  minimumPersonCount: number;
  activityLevel: "HIGH" | "MEDIUM" | "LOW";
  analyzedAt: string;
  modelName: string;
  modelVersion: string;
  totalFramesAnalyzed?: number;
  confidenceThreshold?: number;
}

export interface RouteSafetyMetrics {
  routeId: string;
  activityScore: number; // 0-100
  routeFactor: number;   // 0-100
  safetyScore: number;   // 0-100
  activityLevel: "HIGH" | "MEDIUM" | "LOW";
  isRecommended: boolean;
  scoreBreakdown: {
    humanDensityWeight: number; // e.g. 70%
    routeLightingWeight: number; // e.g. 30%
  };
}

export const SAFETY_DISCLAIMER_NOTICE = {
  header: "Safety Indicator Notice",
  body: "This recommendation is based on available human activity and route data. It does not guarantee personal safety. Stay alert and contact emergency services when necessary.",
  prohibitedTermsNotice:
    "System metrics are activity indicators, not absolute guarantees.",
};

/**
 * Converts raw average person count into a normalized 0 - 100 activity score.
 * Example:
 * 0 - 5 people -> Low Activity (Score 20 - 45)
 * 6 - 19 people -> Medium Activity (Score 46 - 75)
 * 20+ people -> High Activity (Score 76 - 100)
 */
export function calculateActivityScore(avgPersonCount: number): {
  score: number;
  level: "HIGH" | "MEDIUM" | "LOW";
} {
  let score = 0;
  let level: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (avgPersonCount >= 20) {
    score = Math.min(100, Math.round(75 + (avgPersonCount - 20) * 1.25));
    level = "HIGH";
  } else if (avgPersonCount >= 8) {
    score = Math.round(50 + (avgPersonCount - 8) * 2.0);
    level = "MEDIUM";
  } else {
    score = Math.max(10, Math.round(avgPersonCount * 6.25));
    level = "LOW";
  }

  return { score, level };
}

/**
 * Modular Safety Indicator calculation combining Activity Score with Route factors.
 */
export function computeRouteSafetyScore(
  activityScore: number,
  lightingFactor: number = 80,
  activityWeight: number = 0.7,
  routeWeight: number = 0.3
): number {
  const score = activityScore * activityWeight + lightingFactor * routeWeight;
  return Math.min(100, Math.max(0, Math.round(score)));
}
