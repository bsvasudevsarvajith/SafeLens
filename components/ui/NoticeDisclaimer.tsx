import React from "react";
import { Shield, AlertCircle, Info, PhoneCall } from "lucide-react";

interface NoticeDisclaimerProps {
  variant?: "banner" | "card" | "compact";
  className?: string;
}

export default function NoticeDisclaimer({
  variant = "banner",
  className = "",
}: NoticeDisclaimerProps) {
  if (variant === "compact") {
    return (
      <div className={`p-3 bg-brand-light border border-brand-purple/20 rounded-2xl flex items-center justify-between text-xs text-brand-navy ${className}`}>
        <div className="flex items-center gap-2 font-semibold">
          <Shield className="w-4 h-4 text-brand-purple shrink-0" />
          <span>Real-time safety scores are computed via AI vision crowd telemetry, street illumination, and police patrol coverage.</span>
        </div>
        <a href="/emergency" className="text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1 shrink-0 ml-3">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Emergency SOS</span>
        </a>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`p-5 bg-white border border-brand-border rounded-3xl shadow-card space-y-3 ${className}`}>
        <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
          <Shield className="w-4 h-4 text-brand-purple" />
          <span>SafeLens Urban Safety Advisory</span>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          SafeLens synthesizes multi-factor telemetry including crowd density, commercial foot-traffic, road lighting, and authorized CCTV surveillance to calculate the safest navigation paths. Always remain vigilant and trigger Emergency SOS for immediate law enforcement dispatch when needed.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-brand-light/70 border border-brand-purple/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-navy shadow-sm ${className}`}>
      <div className="flex items-start sm:items-center gap-2.5">
        <Shield className="w-4 h-4 text-brand-purple shrink-0 mt-0.5 sm:mt-0" />
        <span className="font-medium">
          <strong>SafeLens Safety Advisory:</strong> Route recommendations are powered by real-time crowd activity, municipal surveillance, and verified illumination corridors.
        </span>
      </div>
      <a
        href="/emergency"
        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 shadow-sm shrink-0 transition-all self-start sm:self-auto"
      >
        <PhoneCall className="w-3 h-3" />
        <span>Emergency 112 / SOS</span>
      </a>
    </div>
  );
}
