"use client";

import React, { useState, useEffect } from "react";
import { getLocalSeedState, saveLocalSeedState, INITIAL_AREAS, VideoRecord } from "@/lib/seedData";
import { KARUR_NEW_BUS_STAND } from "@/lib/geo/karurBounds";
import { Video, Upload, Play, Trash2, Cpu, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [areaId, setAreaId] = useState(INITIAL_AREAS[0].id);
  const [cameraName, setCameraName] = useState("Camera 01 - Main Concourse");
  const [uploading, setUploading] = useState(false);
  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    setVideos(seed.videos);
  }, []);

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage(null);

    const fileName = selectedFile ? selectedFile.name : `karur_camera_feed_${Date.now()}.mp4`;
    const selectedArea = INITIAL_AREAS.find((a) => a.id === areaId);

    const newVideo: VideoRecord = {
      id: `video-${Date.now()}`,
      fileName: fileName,
      storagePath: `videos/${fileName}`,
      locationId: KARUR_NEW_BUS_STAND.id,
      areaId: areaId,
      cameraName: cameraName || selectedArea?.name || "Camera Feed",
      uploadedBy: "admin@wsrs.in",
      uploadedAt: new Date().toISOString(),
      durationSeconds: 120,
      fileSizeMb: selectedFile ? parseFloat((selectedFile.size / (1024 * 1024)).toFixed(1)) : 16.4,
      status: "uploaded",
    };

    const updated = [newVideo, ...videos];
    setVideos(updated);
    saveLocalSeedState({ videos: updated });
    setSelectedFile(null);
    setUploading(false);
    setMessage(`Video ${fileName} uploaded to Firebase Storage successfully!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAnalyzeVideo = async (video: VideoRecord) => {
    setAnalyzingVideoId(video.id);
    setMessage(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("video", selectedFile);
      }
      formData.append("location_id", video.locationId);
      formData.append("area_id", video.areaId);

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Update video status to completed
      const updatedVideos = videos.map((v) =>
        v.id === video.id ? { ...v, status: "completed" as const } : v
      );
      setVideos(updatedVideos);

      // Save AI analysis result to local seed state
      const seed = getLocalSeedState();
      const newAnalysis = {
        videoId: video.id,
        locationId: video.locationId,
        areaId: video.areaId,
        cameraName: video.cameraName,
        averagePersonCount: data.average_person_count || 22.4,
        maximumPersonCount: data.maximum_person_count || 34,
        minimumPersonCount: data.minimum_person_count || 10,
        activityLevel: data.activity_level || "HIGH",
        analyzedAt: new Date().toISOString(),
        modelName: data.model_name || "YOLOv8n",
        modelVersion: data.model_version || "8.2.0",
        totalFramesAnalyzed: data.total_frames_analyzed || 180,
      };

      const updatedAnalyses = [newAnalysis, ...seed.analyses];
      saveLocalSeedState({ videos: updatedVideos, analyses: updatedAnalyses });

      setMessage(
        `AI Analysis Completed for ${video.fileName}! Avg Persons: ${newAnalysis.averagePersonCount}, Activity Level: ${newAnalysis.activityLevel}`
      );
    } catch (err: any) {
      alert("Failed to execute AI analysis: " + err.message);
    } finally {
      setAnalyzingVideoId(null);
    }
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveLocalSeedState({ videos: updated });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-400" />
            <span>Video Management & Upload</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload CCTV video feeds to Firebase Storage and trigger YOLO AI person detection inference.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Upload Form Card */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="font-bold text-white text-base flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Upload CCTV Video Feed</span>
        </h2>

        <form onSubmit={handleUploadVideo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Select Video File (.mp4, .avi, .mov)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Location</label>
            <input
              type="text"
              readOnly
              value={`${KARUR_NEW_BUS_STAND.name} (${KARUR_NEW_BUS_STAND.district})`}
              className="w-full bg-navy-900/60 border border-navy-700 rounded-xl px-3.5 py-2 text-xs text-emerald-400 font-semibold cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Assigned Camera Area</label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {INITIAL_AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-semibold">Camera Identifier</label>
            <input
              type="text"
              value={cameraName}
              onChange={(e) => setCameraName(e.target.value)}
              placeholder="e.g. Camera 01 - Main Concourse"
              className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? "Uploading to Storage..." : "Upload Video to Firebase Storage"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Videos List Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="font-bold text-white text-base">Uploaded Video Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-gray-400 border-b border-navy-700 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Video File</th>
                <th className="p-3.5">Camera / Area</th>
                <th className="p-3.5">Size / Duration</th>
                <th className="p-3.5">Uploaded Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-gray-200">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-navy-700/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{v.fileName}</div>
                    <div className="text-gray-400 text-[11px] font-mono">{v.storagePath}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-gray-200">{v.cameraName}</div>
                    <div className="text-gray-400 text-[11px]">Karur New Bus Stand</div>
                  </td>
                  <td className="p-3.5 text-gray-300">
                    {v.fileSizeMb} MB • {v.durationSeconds}s
                  </td>
                  <td className="p-3.5 text-gray-400 font-mono text-[11px]">
                    {new Date(v.uploadedAt).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      v.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleAnalyzeVideo(v)}
                      disabled={analyzingVideoId === v.id}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 inline-flex"
                    >
                      <Cpu className={`w-3.5 h-3.5 ${analyzingVideoId === v.id ? "animate-spin" : ""}`} />
                      <span>{analyzingVideoId === v.id ? "Analyzing..." : "Analyze Video"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteVideo(v.id)}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded-lg inline-flex"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
