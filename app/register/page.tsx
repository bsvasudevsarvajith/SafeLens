"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";

import { getLocalSeedState, saveLocalSeedState, UserRecord } from "@/lib/seedData";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create user record
      const newUserRecord: UserRecord = {
        uid: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "user",
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Save user to system records
      const seed = getLocalSeedState();
      const updatedUsers = [newUserRecord, ...seed.users.filter((u: UserRecord) => u.email !== newUserRecord.email)];
      saveLocalSeedState({ users: updatedUsers });

      localStorage.setItem("wsrs_session", JSON.stringify({
        ...newUserRecord,
        token: "wsrs-auth-token-2026",
      }));

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
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
            <p className="text-xs text-gray-400">Create Account • Karur District</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-emerald-300">Account Created Successfully!</h3>
                <p className="text-xs text-gray-300">Welcome to Women Safety Route System, {name}.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Continue to Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

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
                <label className="text-xs font-semibold text-gray-300">Password</label>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
              </button>

              <div className="text-center text-xs text-gray-400 pt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:underline font-semibold">
                  Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  );
}
