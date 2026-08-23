import React from "react";
import { ShieldAlert, Info } from "lucide-react";

interface NoticeDisclaimerProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export default function NoticeDisclaimer({ variant = "banner", className = "" }: NoticeDisclaimerProps) {
  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5 ${className}`}>
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Safety Notice:</strong> Recommendation based on activity indicators. Does not guarantee safety. Stay alert.
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-navy-800/90 border border-amber-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-semibold text-amber-300 flex items-center gap-2">
            Safety Indicator Notice
          </h4>
          <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
            This recommendation is based on available human activity and route data. It does <strong>not guarantee personal safety</strong>. Stay alert and contact local emergency services when necessary.
          </p>
        </div>
      </div>
    </div>
  );
}
