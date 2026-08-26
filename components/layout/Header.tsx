"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { Shield, User, LogOut, Bell, Compass, Sparkles, Navigation, PhoneCall } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      
      {/* Left: Mobile Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <SafeLensLogo variant="full" size="sm" href="/dashboard" />
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-brand-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Safety Telemetry: <strong className="text-emerald-700">Online</strong></span>
          <span>•</span>
          <span className="text-brand-purple font-bold">Region: Karur District</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        <Link
          href="/safe-route"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-light text-brand-purple hover:bg-brand-purple hover:text-white border border-brand-purple/20 text-xs font-bold rounded-xl transition-all"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Safe Route</span>
        </Link>

        <Link
          href="/emergency"
          className="flex sm:hidden items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-black rounded-xl"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>SOS</span>
        </Link>

        {/* Live Safety Status Indicator */}
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>MONITORED</span>
        </span>

        {/* User Account / Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 hover:bg-brand-soft rounded-xl transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-violet text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.displayName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-xs font-bold text-brand-navy hidden sm:inline max-w-[120px] truncate">
            {user?.displayName || user?.name || "Account"}
          </span>
        </Link>

      </div>

    </header>
  );
}
