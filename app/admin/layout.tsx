"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Header from "@/components/layout/Header";
import { ShieldAlert, Lock } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("wsrs_session");
    if (!sessionStr) {
      setAuthorized(false);
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      if (session.role === "admin") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      setAuthorized(false);
    }
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-navy-900 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-navy-800 border border-red-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center justify-center text-red-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
            <p className="text-xs text-gray-300">
              Only authorized administrator accounts can access the WSRS Admin Dashboard.
            </p>
            <div className="p-3 bg-navy-900 rounded-xl text-xs text-emerald-400 font-mono">
              Initial Admin Email: admin@wsrs.in
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Login as Administrator
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
