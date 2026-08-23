"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Navigation, User, LogOut, LayoutDashboard, MapPin } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null);

  useEffect(() => {
    // Check local user session
    const storedUser = localStorage.getItem("wsrs_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-navy-900/95 border-b border-navy-700 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & System Name */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white">WSRS</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Karur Prototype
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">Women Safety Route System</p>
            </div>
          </Link>

          {/* Navigation Links - Available after login only */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/route"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/route"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Route</span>
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith("/admin")
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                        : "text-emerald-400 hover:bg-emerald-950/40"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    pathname === "/login"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-gray-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
