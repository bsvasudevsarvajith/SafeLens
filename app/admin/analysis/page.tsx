"use client";

import React, { useState, useEffect } from "react";
import { getLocalSeedState, VideoRecord, CameraRecord } from "@/lib/seedData";
import { Cpu, Activity, ShieldCheck, CheckCircle2, Sparkles, Video, Camera } from "lucide-react";

export default function AdminAnalysisPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [cameras, setCameras] = useState<CameraRecord[]>([]);

  useEffect(() => {
    const seed = getLocalSeedState();
    setVideos(seed.videos || []);
    setCameras(seed.cameras || []);
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-3xl p-6 shadow-card">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deep Learning Crowd Detection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-purple" />
            <span>AI Monitoring & Inference Log</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Detailed person detection metrics and crowd activity outputs generated from municipal feeds and uploaded video corridors.
          </p>
        </div>
      </div>

      {/* Corridor Video Analyses Grid */}
      <div className="space-y-3">
        <h2 className="font-extrabold text-brand-navy text-base flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-600" />
          <span>Analyzed Corridor Video Feeds</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((item, idx) => (
            <div key={item.id || idx} className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-brand-border pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple bg-brand-light border border-brand-purple/20 px-2 py-0.5 rounded-md">
                    Inference Completed
                  </span>
                  <h3 className="font-extrabold text-brand-navy text-base mt-1">
                    {item.cameraName}
                  </h3>
                  <p className="text-xs text-brand-muted font-medium">{item.regionName} • {item.areaName}</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border uppercase ${
                  item.activityLevel === "HIGH" || item.activityLevel === "VERY HIGH"
                    ? "bg-purple-50 text-brand-purple border-brand-purple/20"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {item.activityLevel}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Avg People</span>
                  <div className="text-xl font-black text-brand-navy">{item.averagePeople || 0}</div>
                </div>
                <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Peak</span>
                  <div className="text-xl font-black text-red-600">{item.peakPeople || 0}</div>
                </div>
                <div className="p-3 bg-brand-soft border border-brand-border rounded-2xl">
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Density</span>
                  <div className="text-xl font-black text-emerald-700">{item.crowdDensity || 0}%</div>
                </div>
              </div>

              <div className="text-[11px] text-brand-muted flex items-center justify-between pt-1">
                <span>Duration: {item.durationSeconds}s</span>
                <span className="font-mono">{new Date(item.uploadedAt).toLocaleDateString()}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
