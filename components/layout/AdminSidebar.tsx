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
    <aside className="w-64 bg-navy-900 border-r border-navy-700 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Admin Title Banner */}
      <div className="p-4 border-b border-navy-700/60 bg-navy-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">SafeRoute Admin</h3>
            <p className="text-[11px] text-emerald-400 font-medium">System Administrator</p>
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md font-bold"
                  : "text-gray-400 hover:text-white hover:bg-navy-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-gray-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-navy-700 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-400" />
          <span>Return to User App</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
}
