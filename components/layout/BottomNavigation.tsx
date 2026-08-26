"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Navigation,
  Shield,
  PhoneCall,
  User,
  MapPin,
  FileText
} from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Map",
      href: "/safe-route",
      icon: Navigation,
    },
    {
      name: "Safety",
      href: "/safety",
      icon: Shield,
    },
    {
      name: "SOS",
      href: "/emergency",
      icon: PhoneCall,
      isSOS: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-border px-2 py-1.5 shadow-lg safe-area-bottom">
      <nav className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/safe-route" && pathname === "/route") || (item.href === "/safety" && pathname === "/reports");

          if (item.isSOS) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive
                    ? "bg-red-600 text-white ring-4 ring-red-200"
                    : "bg-red-600 text-white shadow-red-500/30 hover:bg-red-700"
                }`}>
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-red-600 mt-1 uppercase tracking-tight">
                  SOS
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 min-w-[56px] ${
                isActive
                  ? "text-brand-purple font-extrabold"
                  : "text-brand-muted hover:text-brand-navy font-semibold"
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? "bg-brand-light" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-purple stroke-[2.5]" : "text-brand-muted"}`} />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? "font-black text-brand-purple" : "font-medium text-brand-muted"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
