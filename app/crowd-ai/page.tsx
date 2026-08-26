"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import LocationPicker, { GeoLocationSelection } from "@/components/map/LocationPicker";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { getLocalSeedState, CameraRecord } from "@/lib/seedData";
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
  Info,
  FileWarning,
  X
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
  const [imageError, setImageError] = useState<string | null>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---------------- VIDEO ANALYSIS STATE ----------------
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
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
  const [videoError, setVideoError] = useState<string | null>(null);

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
    setImageError(null);
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setImageResult(null);

      // Draw initial image preview on canvas
      setTimeout(() => {
        drawImageOnly(url);
      }, 100);
    }
  };

  const handleUseDemoImage = () => {
    setImageError(null);
    // Create a demo canvas graphic representing a pedestrian walkway
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw background walkway
      const grad = ctx.createLinearGradient(0, 0, 0, 500);
      grad.addColorStop(0, "#cbd5e1");
      grad.addColorStop(1, "#94a3b8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Draw walkway path
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(250, 500);
      ctx.lineTo(550, 500);
      ctx.lineTo(440, 150);
      ctx.lineTo(360, 150);
      ctx.closePath();
      ctx.fill();

      // Draw silhouettes of people
      const peoplePositions = [
        { x: 300, y: 320, s: 0.9 },
        { x: 420, y: 300, s: 0.95 },
        { x: 370, y: 220, s: 0.6 },
        { x: 460, y: 250, s: 0.7 },
        { x: 340, y: 400, s: 1.2 },
        { x: 480, y: 380, s: 1.15 },
      ];

      peoplePositions.forEach((p) => {
        const headR = 14 * p.s;
        const bodyW = 26 * p.s;
        const bodyH = 55 * p.s;

        ctx.fillStyle = "#334155";
        // Head
        ctx.beginPath();
        ctx.arc(p.x, p.y - bodyH / 2, headR, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillRect(p.x - bodyW / 2, p.y - bodyH / 2 + headR, bodyW, bodyH);
      });

      // Overlay text
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("Karur Bus Stand Concourse - Demo Sample Feed", 20, 40);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "demo_bus_stand_concourse.jpg", { type: "image/jpeg" });
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
        setImageResult(null);
        setTimeout(() => {
          drawImageOnly(url);
        }, 100);
      }
    }, "image/jpeg");
  };

  const drawImageOnly = (url: string) => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = url;
    img.onload = () => {
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleAnalyzeImage = async () => {
    // Strictly prevent analysis without an uploaded file
    if (!imageFile) {
      setImageError("Please choose or drop an image file first (or click 'Load Sample Photo') before running AI analysis.");
      return;
    }

    setImageError(null);
    setImageAnalyzing(true);
    setImageResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
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
      } else {
        setImageError(data.error || "Failed to analyze image.");
      }
    } catch (err: any) {
      setImageError(err.message || "Network error while connecting to AI detection service.");
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
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 500;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      predictions.forEach((pred: any) => {
        const w = pred.width || 50;
        const h = pred.height || 100;
        const x = pred.x ? (pred.x - w / 2) : 50;
        const y = pred.y ? (pred.y - h / 2) : 50;

        // Bounding Box
        ctx.strokeStyle = "#6D35E8";
        ctx.lineWidth = Math.max(2, Math.round(canvas.width / 320));
        ctx.strokeRect(x, y, w, h);

        // Semi-transparent overlay inside box
        ctx.fillStyle = "rgba(109, 53, 232, 0.15)";
        ctx.fillRect(x, y, w, h);

        // Label Tag
        const label = `Person (${Math.round((pred.confidence || 0.9) * 100)}%)`;
        const fontSize = Math.max(11, Math.round(canvas.width / 50));
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const textWidth = ctx.measureText(label).width;
        const tagHeight = fontSize + 6;

        ctx.fillStyle = "#6D35E8";
        ctx.fillRect(x, Math.max(0, y - tagHeight), textWidth + 8, tagHeight);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, x + 4, Math.max(fontSize, y - 4));
      });
    };
  };

  // ---------------- VIDEO ANALYSIS HANDLER ----------------
  const handleVideoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoError(null);
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setVideoResult(null);
      setVideoMessage(null);
    }
  };

  const handleUseDemoVideo = async () => {
    setVideoError(null);
    try {
      const res = await fetch("/demo_karur_camera.mp4");
      const blob = await res.blob();
      const file = new File([blob], "demo_karur_camera.mp4", { type: "video/mp4" });
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setVideoResult(null);
      setVideoMessage(null);
    } catch {
      setVideoError("Could not load sample video file.");
    }
  };

  const handleAnalyzeVideo = async () => {
    // Strictly prevent analysis without an uploaded video
    if (!videoFile) {
      setVideoError("Please choose or drop a video file first (or click 'Load Sample Video') before analyzing.");
      return;
    }

    setVideoError(null);
    setVideoAnalyzing(true);
    setVideoResult(null);
    setVideoMessage(null);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("region", videoLocation.region || "Karur");
      formData.append("area", videoLocation.area || "Bus Stand");
      formData.append("landmark", videoLocation.landmark || "Main Concourse");
      formData.append("latitude", videoLocation.lat.toString());
      formData.append("longitude", videoLocation.lng.toString());
      formData.append("sample_rate_fps", sampleRateFps.toString());

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setVideoResult(data);
        setVideoMessage("Corridor crowd analysis completed & logged to surveillance records.");
      } else {
        setVideoError(data.error || "Failed to analyze video file.");
      }
    } catch (err: any) {
      setVideoError(err.message || "Network error while running video crowd AI.");
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
    <div className="min-h-screen bg-brand-soft text-brand-navy flex pb-20 md:pb-0">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header & Source Mode Selector */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deep Learning AI Vision Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Crowd AI Analytics Studio
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Upload images or video files, or analyze live municipal CCTV streams to extract real-time crowd density.
              </p>
            </div>

            {/* Media Source Tabs */}
            <div className="flex items-center p-1.5 bg-brand-soft border border-brand-border rounded-2xl gap-1">
              <button
                onClick={() => {
                  setActiveTab("image");
                  setImageError(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "image"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>UPLOAD IMAGE</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("video");
                  setVideoError(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "video"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <Video className="w-4 h-4" />
                <span>UPLOAD VIDEO</span>
              </button>

              <button
                onClick={() => setActiveTab("cctv")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "cctv"
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "text-brand-muted hover:text-brand-navy hover:bg-white"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>LIVE CCTV</span>
              </button>
            </div>
          </div>

          <NoticeDisclaimer variant="banner" />

          {/* ========================================================= */}
          {/* TAB 1: IMAGE SOURCE UPLOAD */}
          {/* ========================================================= */}
          {activeTab === "image" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Upload Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4 text-brand-purple" />
                      <span>Select or Drop Image Source</span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleUseDemoImage}
                      className="text-[11px] text-brand-purple hover:underline font-bold"
                    >
                      ✨ Load Sample Photo
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-brand-navy font-bold block">
                      Image File (.jpg, .png, .webp, .jpeg)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUploadChange}
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3 py-2 text-xs text-brand-navy file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-purple file:text-white hover:file:bg-brand-violet cursor-pointer"
                    />
                    {imageFile && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</span>
                      </p>
                    )}
                  </div>

                  {/* Location Picker */}
                  <LocationPicker
                    selectedLocation={imageLocation}
                    onSelectLocation={(loc) => setImageLocation(loc)}
                  />

                  {imageError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                      <FileWarning className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{imageError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyzeImage}
                    disabled={imageAnalyzing}
                    className={`w-full py-3.5 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                      imageFile
                        ? "bg-brand-purple hover:bg-brand-violet text-white shadow-brand-purple/20 cursor-pointer"
                        : "bg-brand-soft text-brand-muted border border-brand-border cursor-pointer hover:bg-brand-border/40"
                    }`}
                  >
                    <Cpu className={`w-4 h-4 ${imageAnalyzing ? "animate-spin" : ""}`} />
                    <span>
                      {imageAnalyzing
                        ? "Running AI Vision Detection..."
                        : imageFile
                        ? "Analyze People in Image"
                        : "Choose Image to Run AI"}
                    </span>
                  </button>

                  <div className="p-3.5 bg-brand-light border border-brand-purple/20 rounded-2xl text-[11px] text-brand-muted space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-navy font-bold">
                      <Info className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Privacy Guaranteed:</span>
                    </div>
                    <p>No biometric or facial identity tracking is stored. Only aggregated crowd counts and spatial density bounding boxes are computed.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visualizer & Results */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-purple" />
                      <span>AI Bounding Box Visualizer</span>
                    </h2>
                    {imageResult && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Inference Completed
                      </span>
                    )}
                  </div>

                  {/* Canvas Container */}
                  <div className="relative w-full min-h-[340px] bg-brand-soft border border-brand-border rounded-2xl flex items-center justify-center overflow-hidden p-2">
                    <canvas
                      ref={imageCanvasRef}
                      className={`max-w-full max-h-[460px] object-contain rounded-xl ${
                        imagePreviewUrl ? "block" : "hidden"
                      }`}
                    />

                    {!imagePreviewUrl && (
                      <div className="text-center p-8 space-y-3 text-brand-muted">
                        <ImageIcon className="w-12 h-12 mx-auto text-brand-border" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-brand-navy">No image chosen yet</p>
                          <p className="text-[11px]">Upload an image file on the left or click &quot;Load Sample Photo&quot; to test AI detection.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Results Metrics Row */}
                  {imageResult ? (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">People Detected</span>
                        <div className="text-2xl font-black text-brand-navy">{imageResult.people_count}</div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Confidence</span>
                        <div className="text-2xl font-black text-emerald-700">
                          {imageResult.people_count > 0 ? Math.round((imageResult.average_confidence || 0.91) * 100) : 0}%
                        </div>
                      </div>

                      <div className="p-3.5 bg-brand-soft border border-brand-border rounded-2xl text-center space-y-1">
                        <span className="text-[10px] text-brand-muted font-bold uppercase">Crowd Level</span>
                        <div className="text-2xl font-black text-brand-purple">{imageResult.activity_level}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-brand-muted">
                      Detection results and bounding boxes will display here once an image is uploaded and analyzed.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: VIDEO SOURCE UPLOAD */}
          {/* ========================================================= */}
          {activeTab === "video" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Video Upload & Configuration */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-brand-navy text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-600" />
                      <span>Select or Drop Video Source</span>
                    </h2>
                    <button
                      type="button"
                      onClick={handleUseDemoVideo}
                      className="text-[11px] text-emerald-700 hover:underline font-bold"
                    >
                      ✨ Load Sample Video
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-brand-navy font-bold block">
                      Video File (.mp4, .mov, .avi, .webm)
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUploadChange}
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3 py-2 text-xs text-brand-navy file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                    />
                    {videoFile && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                      </p>
                    )}
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

                  {videoError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                      <FileWarning className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{videoError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyzeVideo}
                    disabled={videoAnalyzing}
                    className={`w-full py-3.5 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                      videoFile
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer"
                        : "bg-brand-soft text-brand-muted border border-brand-border cursor-pointer hover:bg-brand-border/40"
                    }`}
                  >
                    <Cpu className={`w-4 h-4 ${videoAnalyzing ? "animate-spin" : ""}`} />
                    <span>
                      {videoAnalyzing
                        ? "Sampling Frames & Running Vision AI..."
                        : videoFile
                        ? "Analyze Video Crowd Statistics"
                        : "Choose Video to Run AI"}
                    </span>
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
                      <span>Aggregated Corridor Crowd Intelligence</span>
                    </h2>
                    {videoResult && (
                      <span className="text-xs text-brand-muted font-mono">
                        {videoResult.total_frames_sampled} frames in {videoResult.processing_time_seconds}s
                      </span>
                    )}
                  </div>

                  {/* Video Player Preview if available */}
                  {videoPreviewUrl && (
                    <div className="relative aspect-video bg-brand-navy rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                      <video
                        src={videoPreviewUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

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
                          <span>Timeline Series (People Count vs Video Seconds)</span>
                        </h3>

                        <div className="p-4 bg-brand-soft border border-brand-border rounded-2xl space-y-2">
                          <div className="grid grid-cols-4 text-[10px] font-bold text-brand-muted border-b border-brand-border pb-1.5 uppercase">
                            <span>Sample</span>
                            <span>Timestamp</span>
                            <span>Count</span>
                            <span>Density Level</span>
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
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-brand-navy">No video analyzed yet</p>
                        <p className="text-[11px]">Upload a video corridor feed on the left and click analyze to view aggregated crowd stats.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CCTV LIVE STREAM ANALYSIS */}
          {/* ========================================================= */}
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

                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow border border-white/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>LIVE SURVEILLANCE FEED</span>
                    </div>
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
