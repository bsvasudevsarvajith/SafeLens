"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import LocationPicker, { GeoLocationSelection } from "@/components/map/LocationPicker";
import CCTVMap from "@/components/map/CCTVMap";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { getLocalSeedState, saveLocalSeedState, CameraRecord, VideoRecord } from "@/lib/seedData";
import {
  Users,
  Image as ImageIcon,
  Video,
  Camera,
  Upload,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react";

export default function CrowdAIPage() {
  const [activeTab, setActiveTab] = useState<"image" | "video" | "cctv">("image");
  const [cameras, setCameras] = useState<CameraRecord[]>([]);

  // ---------------- IMAGE ANALYSIS STATE ----------------
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageLocation, setImageLocation] = useState<GeoLocationSelection>({
    lat: 10.9601,
    lng: 78.0766,
    name: "Karur Bus Stand Main Entrance",
    region: "Karur",
    area: "Bus Stand",
    landmark: "Main Entrance",
  });
  const [imageAnalyzing, setImageAnalyzing] = useState(false);
  const [imageResult, setImageResult] = useState<any>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---------------- VIDEO ANALYSIS STATE ----------------
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLocation, setVideoLocation] = useState<GeoLocationSelection>({
    lat: 10.9601,
    lng: 78.0766,
    name: "Karur Bus Stand",
    region: "Karur",
    area: "Bus Stand",
    landmark: "Main Entrance Concourse",
  });
  const [videoAnalyzing, setVideoAnalyzing] = useState(false);
  const [videoResult, setVideoResult] = useState<any>(null);
  const [sampleRateFps, setSampleRateFps] = useState<number>(1);
  const [videoMessage, setVideoMessage] = useState<string | null>(null);

  // ---------------- CCTV ANALYSIS STATE ----------------
  const [selectedCameraId, setSelectedCameraId] = useState<string>("cam-karur-01");
  const [cctvAnalyzing, setCctvAnalyzing] = useState(false);
  const [cctvResult, setCctvResult] = useState<any>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    setCameras(seed.cameras);
  }, []);

  // ---------------- IMAGE ANALYSIS HANDLER ----------------
  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setImageResult(null);
    }
  };

  const handleAnalyzeImage = async () => {
    setImageAnalyzing(true);
    setImageResult(null);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("region", imageLocation.region || "Karur");
      formData.append("area", imageLocation.area || "Bus Stand");
      formData.append("landmark", imageLocation.landmark || "Main Concourse");
      formData.append("latitude", imageLocation.lat.toString());
      formData.append("longitude", imageLocation.lng.toString());

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageResult(data);
        drawBoundingBoxes(data.predictions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImageAnalyzing(false);
    }
  };

  const drawBoundingBoxes = (predictions: any[]) => {
    if (!imagePreviewUrl || !imageCanvasRef.current) return;
    const canvas = imageCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imagePreviewUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      predictions.forEach((pred: any) => {
        const x = pred.x - pred.width / 2;
        const y = pred.y - pred.height / 2;

        ctx.strokeStyle = "#6D35E8";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, pred.width, pred.height);

        ctx.fillStyle = "#6D35E8";
        ctx.font = "bold 14px Inter, sans-serif";
        const label = `Person (${Math.round((pred.confidence || 0.9) * 100)}%)`;
        ctx.fillText(label, x, y > 15 ? y - 5 : y + 15);
      });
    };
  };

  // ---------------- VIDEO ANALYSIS HANDLER ----------------
  const handleAnalyzeVideo = async () => {
    setVideoAnalyzing(true);
    setVideoResult(null);
    setVideoMessage(null);

    try {
      const formData = new FormData();
      if (videoFile) {
        formData.append("video", videoFile);
      }
      formData.append("region", videoLocation.region || "Karur");
      formData.append("area", videoLocation.area || "Bus Stand");
      formData.append("landmark", videoLocation.landmark || "Main Concourse");
      formData.append("latitude", videoLocation.lat.toString());
      formData.append("longitude", videoLocation.lng.toString());
      formData.append("sampleRateFps", sampleRateFps.toString());

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setVideoResult(data);
        setVideoMessage("Corridor analysis completed & logged to Karur surveillance records.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVideoAnalyzing(false);
    }
  };

  // ---------------- CCTV LIVE FRAME HANDLER ----------------
  const handleAnalyzeCCTV = async () => {
    setCctvAnalyzing(true);
    setCctvResult(null);

    try {
      const res = await fetch("/api/cctv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId: selectedCameraId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCctvResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCctvAnalyzing(false);
    }
  };

  const currentCamera = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header & Tabs */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Learning People Detection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Crowd AI Analytics Studio
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Run deep learning people detection on uploaded images, video corridors, and live CCTV feeds.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center p-1.5 bg-brand-soft border border-brand-border rounded-2xl gap-1">
              <button
                onClick={() => setActiveTab("image")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "image"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>IMAGE</span>
              </button>

              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "video"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>VIDEO</span>
              </button>

              <button
                onClick={() => setActiveTab("cctv")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cctv"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>CCTV</span>
              </button>
            </div>
          </div>

          <NoticeDisclaimer variant="banner" />

          {/* TAB 1: IMAGE ANALYSIS */}
          {activeTab === "image" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Upload & Location Form */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-purple" />
                    <span>Upload Image for People Detection</span>
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs text-brand-navy font-bold block">Select Image (.jpg, .png, .webp)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadChange}
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3 py-2 text-xs text-brand-navy file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-purple file:text-white hover:file:bg-brand-violet"
                    />
                  </div>

                  <LocationPicker
                    selectedLocation={imageLocation}
                    onSelectLocation={(loc) => setImageLocation(loc)}
                  />

                  <button
                    onClick={handleAnalyzeImage}
                    disabled={imageAnalyzing}
                    className="w-full py-3.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all"
                  >
                    <Cpu className={`w-4 h-4 ${imageAnalyzing ? "animate-spin" : ""}`} />
                    <span>{imageAnalyzing ? "Running AI Inference..." : "Analyze People in Image"}</span>
                  </button>

                  <div className="p-3.5 bg-brand-light border border-brand-purple/20 rounded-2xl text-[11px] text-brand-muted space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-navy font-bold">
                      <Info className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Privacy Guaranteed:</span>
                    </div>
                    <p>No facial recognition or identity tracking is performed. Only anonymous person bounding boxes are extracted.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visualizer & Results */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-purple" />
                      <span>Bounding Box Visualizer & Person Count</span>
                    </h2>
                    {imageResult && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Inference Completed
                      </span>
                    )}
                  </div>

                  {/* Canvas / Preview Container */}
                  <div className="relative w-full min-h-[340px] bg-brand-soft border border-brand-border rounded-2xl flex items-center justify-center overflow-hidden">
                    {imagePreviewUrl ? (
                      <canvas
                        ref={imageCanvasRef}
                        className="max-w-full max-h-[460px] object-contain rounded-xl"
                      />
                    ) : (
                      <div className="text-center p-8 space-y-2 text-brand-muted">
                        <ImageIcon className="w-12 h-12 mx-auto text-brand-border" />
                        <p className="text-xs font-semibold">Upload an image or sample photo to view detected person boxes</p>
                      </div>
                    )}
                  </div>

                  {/* Results Metrics Row */}
                  {imageResult && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">People Detected</span>
                        <div className="text-2xl font-black text-brand-navy">{imageResult.people_count}</div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Confidence</span>
                        <div className="text-2xl font-black text-emerald-700">
                          {Math.round((imageResult.average_confidence || 0.91) * 100)}%
                        </div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Crowd Level</span>
                        <div className="text-2xl font-black text-brand-purple">{imageResult.activity_level}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIDEO ANALYSIS */}
          {activeTab === "video" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Video Upload & GPS Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Upload Corridor Video Feed</span>
                  </h2>

                  <div className="space-y-2">
                    <label className="text-xs text-brand-navy font-bold block">Select Video (.mp4, .avi, .mov)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3 py-2 text-xs text-brand-navy file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500"
                    />
                  </div>

                  {/* Frame Sampling Setting */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-brand-navy font-bold flex items-center justify-between">
                      <span>Frame Sampling Rate</span>
                      <span className="text-emerald-700 font-extrabold">{sampleRateFps} fps (1 frame/sec)</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sampleRateFps}
                      onChange={(e) => setSampleRateFps(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <LocationPicker
                    selectedLocation={videoLocation}
                    onSelectLocation={(loc) => setVideoLocation(loc)}
                  />

                  <button
                    onClick={handleAnalyzeVideo}
                    disabled={videoAnalyzing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Cpu className={`w-4 h-4 ${videoAnalyzing ? "animate-spin" : ""}`} />
                    <span>{videoAnalyzing ? "Sampling & Running AI..." : "Analyze Video Crowd Statistics"}</span>
                  </button>

                  {videoMessage && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{videoMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Video Analytics Output */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Aggregated Crowd Intelligence Results</span>
                    </h2>
                    {videoResult && (
                      <span className="text-xs text-brand-muted font-mono">
                        {videoResult.total_frames_sampled} frames sampled in {videoResult.processing_time_seconds}s
                      </span>
                    )}
                  </div>

                  {videoResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                          <span className="text-[10px] text-brand-muted uppercase font-bold">Average People</span>
                          <div className="text-2xl font-black text-brand-navy mt-1">{videoResult.average_people}</div>
                        </div>

                        <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                          <span className="text-[10px] text-brand-muted uppercase font-bold">Peak People</span>
                          <div className="text-2xl font-black text-red-600 mt-1">{videoResult.peak_people}</div>
                        </div>

                        <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                          <span className="text-[10px] text-brand-muted uppercase font-bold">Crowd Density</span>
                          <div className="text-2xl font-black text-emerald-700 mt-1">{videoResult.crowd_density}%</div>
                        </div>

                        <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                          <span className="text-[10px] text-brand-muted uppercase font-bold">Activity Level</span>
                          <div className="text-2xl font-black text-brand-purple mt-1">{videoResult.activity_level}</div>
                        </div>
                      </div>

                      {/* Time Series Table */}
                      <div className="space-y-2 pt-2">
                        <h3 className="text-xs font-extrabold text-brand-navy flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-brand-purple" />
                          <span>Timeline Series (People Count vs Time)</span>
                        </h3>

                        <div className="p-4 bg-brand-soft border border-brand-border rounded-2xl space-y-2">
                          <div className="grid grid-cols-4 text-[10px] font-bold text-brand-muted border-b border-brand-border pb-1.5 uppercase">
                            <span>Sample</span>
                            <span>Time</span>
                            <span>People Count</span>
                            <span>Activity</span>
                          </div>

                          <div className="max-h-40 overflow-y-auto space-y-1 divide-y divide-brand-border/60 text-xs">
                            {(videoResult.time_series || []).map((t: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-4 py-1.5 text-brand-navy">
                                <span className="font-mono text-brand-muted">#{t.sample_index + 1}</span>
                                <span>{t.timestamp_seconds}s</span>
                                <span className="font-black text-brand-navy">{t.people_count}</span>
                                <span className="text-emerald-700 font-bold">{t.activity_level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center p-12 space-y-3 bg-brand-soft rounded-2xl border border-brand-border text-brand-muted">
                      <Video className="w-10 h-10 mx-auto text-brand-border" />
                      <p className="text-xs font-medium">Upload a video feed and click analyze to view aggregated crowd metrics</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CCTV LIVE ANALYSIS */}
          {activeTab === "cctv" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Camera Selector */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-purple" />
                    <span>Select CCTV Camera Feed</span>
                  </h2>

                  <div className="space-y-1.5">
                    <label className="text-xs text-brand-navy font-bold">Authorized Surveillance Node</label>
                    <select
                      value={selectedCameraId}
                      onChange={(e) => setSelectedCameraId(e.target.value)}
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-xs text-brand-navy font-semibold focus:outline-none focus:border-brand-purple"
                    >
                      {cameras.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cameraName} ({c.regionName} - {c.areaName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentCamera && (
                    <div className="p-4 bg-brand-soft border border-brand-border rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-brand-navy">{currentCamera.cameraName}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          currentCamera.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {currentCamera.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-brand-muted text-[11px] font-medium">
                        <b>Region:</b> {currentCamera.regionName} • <b>Area:</b> {currentCamera.areaName}
                      </div>
                      <div className="text-brand-muted text-[11px] font-mono">
                        📍 GPS: {currentCamera.latitude}, {currentCamera.longitude}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyzeCCTV}
                    disabled={cctvAnalyzing}
                    className="w-full py-3.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${cctvAnalyzing ? "animate-spin" : ""}`} />
                    <span>{cctvAnalyzing ? "Extracting & Analyzing Frame..." : "Analyze Live CCTV Frame"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: CCTV Live Visualizer & Metrics */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <h2 className="font-extrabold text-brand-navy text-sm flex items-center justify-between">
                    <span>Live CCTV Camera Player & Detection</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Real-time Feed
                    </span>
                  </h2>

                  {/* Video Stream Player */}
                  <div className="relative aspect-video bg-brand-navy rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                    <video
                      src={currentCamera?.streamUrl || "/demo_karur_camera.mp4"}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Camera overlay watermark */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-white border border-white/20">
                      📹 {currentCamera?.cameraName || "CCTV 01"}
                    </div>

                    {currentCamera?.isDemo && (
                      <div className="absolute top-3 right-3 bg-brand-purple text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow border border-white/20">
                        DEMO CAMERA
                      </div>
                    )}
                  </div>

                  {/* Live Extracted Results */}
                  {cctvResult && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">People Count</span>
                        <div className="text-2xl font-black text-brand-navy mt-0.5">{cctvResult.people_count}</div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Crowd Density</span>
                        <div className="text-2xl font-black text-emerald-700 mt-0.5">{cctvResult.crowd_density}%</div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Activity Level</span>
                        <div className="text-2xl font-black text-brand-purple mt-0.5">{cctvResult.activity_level}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
