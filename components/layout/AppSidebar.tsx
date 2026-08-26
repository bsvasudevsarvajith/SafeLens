"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import BottomNavigation from "@/components/layout/BottomNavigation";
import {
  LayoutDashboard,
  Navigation,
  MapPin,
  Users,
  AlertTriangle,
  FileText,
  Shield,
  Settings,
  Camera,
  Cpu,
  LogOut,
  ChevronRight,
  Sparkles,
  PhoneCall
} from "lucide-react";

export default function AppSidebar() {
  const pathname = usePathname();
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

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "LIVE",
    },
    {
      name: "Safe Route",
      href: "/safe-route",
      icon: Navigation,
    },
    {
      name: "Nearby Analysis",
      href: "/location-analysis",
      icon: MapPin,
    },
    {
      name: "Crowd AI",
      href: "/crowd-ai",
      icon: Users,
    },
    {
      name: "Emergency SOS",
      href: "/emergency",
      icon: PhoneCall,
      alert: true,
    },
    {
      name: "Safety Reports",
      href: "/safety",
      icon: FileText,
    },
    {
      name: "Profile & Settings",
      href: "/profile",
      icon: Settings,
    },
  ];

  const adminItems = [
    {
      name: "CCTV Cameras",
      href: "/admin/cameras",
      icon: Camera,
    },
    {
      name: "AI Monitoring",
      href: "/admin/analysis",
      icon: Cpu,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (< md) */}
      <BottomNavigation />

      {/* Desktop & Tablet Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-brand-border flex-col min-h-screen z-30 flex-shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-border">
          <SafeLensLogo size="md" href="/dashboard" />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto">
          
          {/* Main Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-brand-muted">
              INTELLIGENCE
            </span>
            <nav className="space-y-1 pt-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === "/safe-route" && pathname === "/route") || (item.href === "/safety" && pathname === "/reports");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-brand-light text-brand-purple border border-brand-purple/25 shadow-sm"
                        : item.alert
                        ? "text-red-600 hover:bg-red-50"
                        : "text-brand-muted hover:text-brand-navy hover:bg-brand-soft"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-purple" : item.alert ? "text-red-500" : "text-brand-muted"}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Administration Section */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-brand-muted">
              ADMINISTRATION
            </span>
            <nav className="space-y-1 pt-1.5">
              {adminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-brand-light text-brand-purple border border-brand-purple/25 shadow-sm"
                        : "text-brand-muted hover:text-brand-navy hover:bg-brand-soft"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-purple" : "text-brand-muted"}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-3.5 border-t border-brand-border bg-brand-soft/60 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-violet text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                {user?.displayName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-brand-navy truncate">
                  {user?.displayName || user?.name || "Traveler User"}
                </span>
                <span className="text-[10px] text-brand-muted truncate">
                  {user?.email || user?.phoneNumber || "SafeRoute Member"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-brand-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
