"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles
} from "lucide-react";
import Header from "@/components/layout/Header";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import SafeLensLogo from "@/components/brand/SafeLensLogo";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "google">("email");

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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
      setSuccess("Login successful! Redirecting to SafeLens...");

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/cameras");
        } else {
          router.push("/dashboard");
        }
      }, 700);
    } catch (err: any) {
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setSuccess(`Mock SMS OTP sent to ${phoneNumber}. (Use code: 123456)`);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "123456") {
      setError("Invalid OTP code. For demo, use 123456.");
      return;
    }

    setLoading(true);
    const userSession = {
      email: `user_${phoneNumber.slice(-4)}@wsrs.in`,
      role: "user",
      name: `Traveler (${phoneNumber.slice(-4)})`,
      token: "wsrs-auth-token-phone",
    };

    localStorage.setItem("wsrs_session", JSON.stringify(userSession));
    setSuccess("Phone authentication verified! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    const userSession = {
      email: "google.user@gmail.com",
      role: "user",
      name: "Google Traveler",
      token: "wsrs-auth-token-google",
    };

    localStorage.setItem("wsrs_session", JSON.stringify(userSession));
    setSuccess("Google Authentication verified! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
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
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">Welcome to SafeLens</h1>
            <p className="text-xs text-brand-muted">Crowd AI & Urban Safety Intelligence</p>
          </div>

          {/* Auth Method Selector */}
          <div className="grid grid-cols-3 gap-1 bg-brand-soft p-1.5 rounded-2xl border border-brand-border">
            <button
              onClick={() => { setAuthMethod("email"); setError(null); setSuccess(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                authMethod === "email"
                  ? "bg-white text-brand-purple shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              Email / Admin
            </button>

            <button
              onClick={() => { setAuthMethod("phone"); setError(null); setSuccess(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                authMethod === "phone"
                  ? "bg-white text-brand-purple shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              Phone OTP
            </button>

            <button
              onClick={() => { setAuthMethod("google"); setError(null); setSuccess(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                authMethod === "google"
                  ? "bg-white text-brand-purple shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              Google
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* METHOD 1: EMAIL / PASSWORD */}
          {authMethod === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@wsrs.in or name@example.com"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-navy">Password</label>
                  <span className="text-[10px] text-brand-purple font-bold">Admin: admin@1234</span>
                </div>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
              >
                <span>{loading ? "Authenticating..." : "Sign In with Email"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* METHOD 2: PHONE OTP LOGIN */}
          {authMethod === "phone" && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy">Mobile Phone Number</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98421 11223"
                        className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
                  >
                    <span>{loading ? "Sending SMS OTP..." : "Send Verification OTP"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-brand-navy">Enter 6-Digit OTP</label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[10px] text-brand-purple font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-brand-navy focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
                  >
                    <span>{loading ? "Verifying..." : "Verify OTP & Continue"}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD 3: GOOGLE ONE-TOUCH LOGIN */}
          {authMethod === "google" && (
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-brand-muted">
                Sign in securely with your verified Google account credentials.
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-soft hover:bg-brand-border border border-brand-border text-brand-navy font-bold rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all text-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-purple hover:underline font-bold">
              Create Account
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
