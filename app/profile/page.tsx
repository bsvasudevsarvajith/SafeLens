"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import { User, Mail, Shield, Key, LogOut, CheckCircle2, AlertCircle, Lock, Sparkles, MapPin, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser(null);
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setMessage("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Account Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                User Profile & Settings
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Manage your credentials, safety profile, and active regional monitoring permissions.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>

          <NoticeDisclaimer variant="banner" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: User Profile Card */}
            <div className="md:col-span-6 bg-white border border-brand-border rounded-3xl p-6 space-y-5 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-violet flex items-center justify-center font-black text-xl text-white shadow-md shadow-brand-purple/20">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-brand-navy">{user?.name || "Traveler User"}</h3>
                  <p className="text-xs text-brand-muted">{user?.email || "user@wsrs.in"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-brand-border/60">
                  <span className="text-brand-muted font-medium">Account Role</span>
                  <span className={`font-bold capitalize px-2.5 py-0.5 rounded-full border text-[11px] ${
                    user?.role === "admin" 
                      ? "bg-purple-50 text-brand-purple border-brand-purple/30" 
                      : "bg-brand-light text-brand-purple border-brand-purple/20"
                  }`}>
                    {user?.role || "User"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-brand-border/60">
                  <span className="text-brand-muted font-medium">Supported Region</span>
                  <span className="font-bold text-brand-navy flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                    Karur, Tamil Nadu
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-brand-border/60">
                  <span className="text-brand-muted font-medium">Surveillance Feeds</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    ● Online (Active)
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-brand-muted font-medium">AI Intelligence</span>
                  <span className="font-bold text-brand-purple flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-brand-purple" />
                    Karur Real-time Model v2.4
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Change Password Card */}
            <div className="md:col-span-6 bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-card">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <div className="p-2 bg-brand-light text-brand-purple rounded-xl">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-brand-navy">Security & Credentials</h3>
                  <p className="text-[11px] text-brand-muted">Update your account password</p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-navy font-bold">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl px-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-brand-navy font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl px-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold text-xs rounded-2xl shadow-md shadow-brand-purple/20 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
