"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  Camera,
  Cpu,
  MapPin,
  Settings,
  LogOut,
  Shield,
  ArrowLeft
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Camera Management",
      href: "/admin/cameras",
      icon: Camera,
    },
    {
      name: "AI Monitoring",
      href: "/admin/analysis",
      icon: Cpu,
    },
    {
      name: "Video Management",
      href: "/admin/videos",
      icon: Video,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Location Management",
      href: "/admin/locations",
      icon: MapPin,
    },
    {
      name: "AI Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-brand-border flex flex-col min-h-[calc(100vh-4rem)] z-10 flex-shrink-0">
      {/* Admin Title Banner */}
      <div className="p-4 border-b border-brand-border bg-brand-soft">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-light border border-brand-purple/20 rounded-xl text-brand-purple">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-brand-navy text-sm">SafeLens Admin</h3>
            <p className="text-[11px] text-brand-purple font-bold">System Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-light text-brand-purple border border-brand-purple/25 shadow-sm"
                  : "text-brand-muted hover:text-brand-navy hover:bg-brand-soft"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-brand-purple" : "text-brand-muted"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-brand-border space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-brand-muted hover:text-brand-navy hover:bg-brand-soft rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-muted" />
          <span>Return to User App</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
}
