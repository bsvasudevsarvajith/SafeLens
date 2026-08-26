"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
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
    <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <SafeLensLogo size="lg" />
            </div>
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">Create Account</h1>
            <p className="text-xs text-brand-muted">Join the SafeLens Urban Intelligence Network</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center p-6 bg-emerald-50 border border-emerald-200 rounded-3xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-black text-emerald-800">Account Created Successfully!</h3>
                <p className="text-xs text-emerald-700">Welcome to SafeLens, {name}.</p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
              </button>

              <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-purple hover:underline font-bold">
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
