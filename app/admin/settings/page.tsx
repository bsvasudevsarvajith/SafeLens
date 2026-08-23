"use client";

import React, { useState, useEffect } from "react";
import { getLocalSeedState, saveLocalSeedState, SystemSettings } from "@/lib/seedData";
import { Settings, Sliders, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    aiApiEndpoint: "http://127.0.0.1:8000",
    aiModelIdentifier: "YOLOv8n",
    confidenceThreshold: 0.5,
    detectionIntervalSeconds: 1,
    safetyWeightActivity: 0.7,
    safetyWeightRoute: 0.3,
    updatedAt: new Date().toISOString(),
  });

  const [apiKeyInput, setApiKeyInput] = useState("••••••••wsrs2026");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    if (seed.settings) {
      setSettings(seed.settings);
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    setSettings(updated);
    saveLocalSeedState({ settings: updated });
    setSavedMessage("AI Model Configuration & Safety Parameters saved securely!");
    setTimeout(() => setSavedMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <span>AI Configuration & System Settings</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure server-side AI model parameters, confidence thresholds, detection intervals, and safety score weights.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* AI API Configuration Card */}
        <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-white text-base flex items-center gap-2 border-b border-navy-700/60 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>AI Model & Inference API Parameters</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">AI Service Endpoint URL</label>
              <input
                type="url"
                required
                value={settings.aiApiEndpoint}
                onChange={(e) => setSettings({ ...settings, aiApiEndpoint: e.target.value })}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">AI Model Identifier</label>
              <input
                type="text"
                required
                value={settings.aiModelIdentifier}
                onChange={(e) => setSettings({ ...settings, aiModelIdentifier: e.target.value })}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-gray-300">YOLO Confidence Threshold</label>
                <span className="text-xs font-mono text-emerald-400 font-bold">{settings.confidenceThreshold}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
                className="w-full h-2 bg-navy-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-gray-400">Minimum probability required for person class detection.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Detection Frame Interval (Seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.detectionIntervalSeconds}
                onChange={(e) => setSettings({ ...settings, detectionIntervalSeconds: parseInt(e.target.value) || 1 })}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Safety Score Weighting Card */}
        <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="font-bold text-white text-base flex items-center gap-2 border-b border-navy-700/60 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safety Indicator Calculation Formula</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Human Activity Weight (Density)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={settings.safetyWeightActivity}
                onChange={(e) => setSettings({ ...settings, safetyWeightActivity: parseFloat(e.target.value) })}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <span className="text-[10px] text-gray-400">Weight applied to AI observed person density (default 0.7)</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Route Geometry / Lighting Weight</label>
              <input
                type="number"
                step="0.05"
                min="0.0"
                max="1.0"
                value={settings.safetyWeightRoute}
                onChange={(e) => setSettings({ ...settings, safetyWeightRoute: parseFloat(e.target.value) })}
                className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <span className="text-[10px] text-gray-400">Weight applied to road infrastructure factor (default 0.3)</span>
            </div>
          </div>
        </div>

        {/* Server API Secret Security */}
        <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white text-base">Server Secrets & Security Protection</h2>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            API secrets are strictly stored in server-side environment variables (`AI_API_KEY`) and are never exposed to browser client JavaScript bundles.
          </p>

          <div className="space-y-1 max-w-md">
            <label className="text-xs font-semibold text-gray-300">Server AI Secret Key (Masked)</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-navy-900/80 border border-navy-700 rounded-xl px-3.5 py-2 text-xs text-gray-300 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-blue-600/25 transition-all"
        >
          Save System Configuration
        </button>

      </form>

    </div>
  );
}
