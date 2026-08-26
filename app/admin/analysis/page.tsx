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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Roboflow Model: people-detection-o4rdr/12</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            <span>AI Monitoring & Inference Log</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Detailed person detection metrics and crowd activity outputs generated from municipal feeds and uploaded video corridors.
          </p>
        </div>
      </div>

      {/* Corridor Video Analyses Grid */}
      <div className="space-y-3">
        <h2 className="font-bold text-white text-base flex items-center gap-2">
          <Video className="w-4 h-4 text-emerald-400" />
          <span>Analyzed Corridor Video Feeds</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((item, idx) => (
            <div key={item.id || idx} className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-navy-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md">
                    people-detection-o4rdr/12
                  </span>
                  <h3 className="font-bold text-white text-base mt-1">
                    {item.cameraName}
                  </h3>
                  <p className="text-xs text-gray-400">{item.regionName} • {item.areaName}</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border uppercase ${
                  item.activityLevel === "HIGH" || item.activityLevel === "VERY HIGH"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }`}>
                  {item.activityLevel || "HIGH"}
                </span>
              </div>

              {/* Statistics Display */}
              <div className="grid grid-cols-3 gap-2 bg-navy-900/90 p-3.5 rounded-2xl text-center border border-navy-700">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Average</span>
                  <span className="text-xl font-extrabold text-emerald-400">{item.averagePeople || 28}</span>
                  <span className="text-[9px] text-gray-500 block">people</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Peak</span>
                  <span className="text-xl font-extrabold text-red-400">{item.peakPeople || 45}</span>
                  <span className="text-[9px] text-gray-500 block">people</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Density</span>
                  <span className="text-xl font-extrabold text-blue-400">{item.crowdDensity || 81}%</span>
                  <span className="text-[9px] text-gray-500 block">estimated</span>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="pt-2 text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-semibold text-white">{Math.round((item.averageConfidence || 0.91) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>GPS Position:</span>
                  <span className="font-mono text-[11px] text-gray-300">
                    {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* CCTV Nodes AI Inference Grid */}
      <div className="space-y-3 pt-4">
        <h2 className="font-bold text-white text-base flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-400" />
          <span>Real-time CCTV Stream Inference Nodes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cameras.map((cam) => (
            <div key={cam.id} className="bg-navy-800 border border-navy-700 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>📹</span>
                    <span>{cam.cameraName}</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">{cam.regionName} • {cam.areaName}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                  cam.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}>
                  {cam.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-navy-900/80 p-2.5 rounded-xl text-center text-xs">
                <div>
                  <span className="text-[9px] text-gray-400 block">People</span>
                  <span className="font-bold text-white text-sm">{cam.peopleCount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block">Density</span>
                  <span className="font-bold text-emerald-400 text-sm">{cam.crowdDensity}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block">Activity</span>
                  <span className="font-bold text-blue-400 text-sm">{cam.activityLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
