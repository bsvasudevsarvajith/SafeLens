"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { Shield, User, LogOut, Bell, Compass, Sparkles, Navigation } from "lucide-react";

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

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between z-20">
      
      {/* Left: Mobile Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <SafeLensLogo variant="icon" size="sm" href="/dashboard" />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-brand-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Intelligence Engine: <strong>Active</strong></span>
          <span>•</span>
          <span className="text-brand-purple font-bold">Region: Karur District</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        <Link
          href="/safe-route"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-light text-brand-purple hover:bg-brand-purple hover:text-white border border-brand-purple/20 text-xs font-bold rounded-xl transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Safer Route</span>
        </Link>

        {/* Demo Indicator */}
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-brand-soft border border-brand-border text-brand-muted rounded-md">
          DEMO MODE
        </span>

        {/* User Account / Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 p-1.5 hover:bg-brand-soft rounded-xl transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-violet text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-xs font-bold text-brand-navy hidden sm:inline">
            {user?.name || "Account"}
          </span>
        </Link>

      </div>

    </header>
  );
}
