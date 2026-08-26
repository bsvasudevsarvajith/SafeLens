"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Mail,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  PhoneCall
} from "lucide-react";
import Header from "@/components/layout/Header";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { getLocalSeedState, saveLocalSeedState, UserRecord } from "@/lib/seedData";

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"phone" | "email">("phone");

  // Common details
  const [name, setName] = useState("");
  
  // Phone OTP Flow State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>("123456");

  // Email Flow State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ---------------- PHONE OTP REGISTRATION ----------------
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    // Mock OTP dispatch
    const demoCode = "123456";
    setGeneratedOtp(demoCode);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setError(null);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== "123456") {
      setError(`Invalid OTP code. Please enter the 6-digit code (${generatedOtp}).`);
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
      const formattedPhone = cleanPhone.startsWith("91") && cleanPhone.length > 10
        ? `+${cleanPhone}`
        : `+91 ${cleanPhone.slice(-10)}`;

      const newUserRecord: UserRecord = {
        uid: `user-phone-${Date.now()}`,
        name: name.trim(),
        email: `${name.toLowerCase().replace(/\s+/g, ".") || "user"}_${cleanPhone.slice(-4)}@safelens.in`,
        role: "user",
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Persist to seed state
      const seed = getLocalSeedState();
      const updatedUsers = [newUserRecord, ...seed.users.filter((u: UserRecord) => u.email !== newUserRecord.email)];
      saveLocalSeedState({ users: updatedUsers });

      // Save user session
      localStorage.setItem("wsrs_session", JSON.stringify({
        ...newUserRecord,
        phoneNumber: formattedPhone,
        authType: "phone_otp",
        token: "wsrs-auth-token-phone-verified",
      }));

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to complete mobile registration.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EMAIL REGISTRATION ----------------
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

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
      const newUserRecord: UserRecord = {
        uid: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "user",
        createdAt: new Date().toISOString(),
        status: "active",
      };

      const seed = getLocalSeedState();
      const updatedUsers = [newUserRecord, ...seed.users.filter((u: UserRecord) => u.email !== newUserRecord.email)];
      saveLocalSeedState({ users: updatedUsers });

      localStorage.setItem("wsrs_session", JSON.stringify({
        ...newUserRecord,
        token: "wsrs-auth-token-email",
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
            <p className="text-xs text-brand-muted">SafeLens Women Safety & Crowd Intelligence Network</p>
          </div>

          {/* Registration Mode Selector */}
          <div className="grid grid-cols-2 gap-1.5 bg-brand-soft p-1.5 rounded-2xl border border-brand-border">
            <button
              onClick={() => { setMethod("phone"); setError(null); setOtpSent(false); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                method === "phone"
                  ? "bg-white text-brand-purple shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile OTP</span>
            </button>

            <button
              onClick={() => { setMethod("email"); setError(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                method === "email"
                  ? "bg-white text-brand-purple shadow-sm border border-brand-border"
                  : "text-brand-muted hover:text-brand-navy"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email & Password</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center p-6 bg-emerald-50 border border-emerald-200 rounded-3xl animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-black text-emerald-800">Account Verified & Registered!</h3>
                <p className="text-xs text-emerald-700">Welcome to SafeLens, {name}. Your safety profile is active.</p>
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
            <>
              {/* ---------------- METHOD 1: MOBILE OTP REGISTRATION ---------------- */}
              {method === "phone" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                        <label className="text-xs font-bold text-brand-navy">Mobile Number</label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-2.5 flex items-center gap-1 text-xs font-bold text-brand-purple border-r border-brand-border pr-2">
                            <span>🇮🇳 +91</span>
                          </div>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="98421 11223"
                            className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-20 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium tracking-wide"
                          />
                        </div>
                        <p className="text-[11px] text-brand-muted">A 6-digit one-time verification code will be sent to your mobile phone.</p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{loading ? "Sending OTP..." : "Send Verification OTP"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      {/* OTP Banner Info */}
                      <div className="p-3.5 bg-brand-light border border-brand-purple/25 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-brand-muted">Code sent to:</span>
                          <span className="font-bold text-brand-navy">+91 {phoneNumber}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-brand-purple font-bold">Demo OTP Code: {generatedOtp}</span>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-brand-purple font-bold hover:underline"
                          >
                            Edit Number
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-navy text-center block">
                          Enter 6-Digit OTP Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          autoFocus
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="123456"
                          className="w-full bg-brand-soft border-2 border-brand-purple rounded-2xl px-4 py-3 text-center text-xl font-mono font-black tracking-widest text-brand-navy focus:outline-none shadow-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 6}
                        className="w-full py-3.5 px-4 bg-brand-purple hover:bg-brand-violet disabled:opacity-50 text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{loading ? "Verifying..." : "Verify OTP & Complete Registration"}</span>
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpCode("");
                            setLoading(true);
                            setTimeout(() => setLoading(false), 500);
                          }}
                          className="text-xs text-brand-muted hover:text-brand-purple font-bold inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP Code</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ---------------- METHOD 2: EMAIL REGISTRATION ---------------- */}
              {method === "email" && (
                <form onSubmit={handleEmailRegister} className="space-y-4">
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
                </form>
              )}

              <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-purple hover:underline font-bold">
                  Sign In
                </Link>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
