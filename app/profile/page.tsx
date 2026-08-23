"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { User, Mail, Shield, Key, LogOut, CheckCircle, AlertCircle } from "lucide-react";
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
      } catch (e) {
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
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">User Profile & Account Settings</h1>
          <p className="text-xs text-gray-400">Manage your profile information and account security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* User Info Card */}
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-lg text-white">
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{user?.name || "Registered User"}</h3>
                <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-700/60 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-navy-700/40">
                <span className="text-gray-400">Account Role</span>
                <span className={`font-semibold capitalize px-2 py-0.5 rounded-md border text-[11px] ${
                  user?.role === "admin" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}>
                  {user?.role || "user"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-navy-700/40">
                <span className="text-gray-400">Supported District</span>
                <span className="font-semibold text-white">Karur, Tamil Nadu</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Status</span>
                <span className="font-semibold text-emerald-400">Active</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>

          {/* Change Password Card */}
          <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              <span>Security & Password</span>
            </h3>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
