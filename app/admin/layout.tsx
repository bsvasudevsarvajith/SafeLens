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
      <div className="min-h-screen bg-brand-soft flex items-center justify-center text-brand-navy">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-brand-border rounded-3xl p-8 text-center space-y-4 shadow-card">
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-brand-navy">Administrator Access Required</h2>
            <p className="text-xs text-brand-muted">
              Only authorized administrator accounts can access the SafeLens Admin Dashboard.
            </p>
            <div className="p-3 bg-brand-soft border border-brand-border rounded-xl text-xs text-brand-purple font-mono font-bold">
              Initial Admin Email: admin@wsrs.in
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs transition-colors shadow-md shadow-brand-purple/20"
            >
              Login as Administrator
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col">
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
