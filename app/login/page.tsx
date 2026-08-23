"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulate/Authenticate user session
      let role = "user";
      if (email.trim().toLowerCase() === "admin@wsrs.in") {
        if (password !== "admin@1234") {
          throw new Error("Invalid password for Administrator account.");
        }
        role = "admin";
      }

      const userSession = {
        email: email.trim().toLowerCase(),
        role: role,
        name: role === "admin" ? "System Administrator" : email.split("@")[0],
        token: "wsrs-auth-token-2026",
      };

      localStorage.setItem("wsrs_session", JSON.stringify(userSession));
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-navy-800 border border-navy-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 border border-blue-500/30 rounded-2xl text-emerald-400 mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Women Safety Route System</h1>
            <p className="text-xs text-gray-400">Karur District Prototype • Secure Access</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300">Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact system administrator to reset password."); }} className="text-[11px] text-blue-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? "Logging in..." : "Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 pt-2">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline font-semibold">
              Create Account
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
