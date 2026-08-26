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
  Sparkles,
  UserCheck
} from "lucide-react";
import Header from "@/components/layout/Header";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { getLocalSeedState, UserRecord } from "@/lib/seedData";

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
  const [demoOtp, setDemoOtp] = useState("123456");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ---------------- EMAIL / ADMIN LOGIN ----------------
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const seed = getLocalSeedState();
      const inputEmail = email.trim().toLowerCase();

      // Check for primary admin
      if (inputEmail === "admin@wsrs.in") {
        if (password !== "admin@1234") {
          throw new Error("Invalid password for Administrator account.");
        }
        const adminSession = {
          email: "admin@wsrs.in",
          role: "admin",
          name: "System Administrator",
          token: "wsrs-auth-token-admin",
        };
        localStorage.setItem("wsrs_session", JSON.stringify(adminSession));
        setSuccess("Administrator login verified! Redirecting to Admin Dashboard...");
        setTimeout(() => router.push("/admin/dashboard"), 600);
        return;
      }

      // Check in registered users
      const existingUser = seed.users.find((u: UserRecord) => u.email.toLowerCase() === inputEmail);
      if (existingUser && existingUser.status === "disabled") {
        throw new Error("This account is currently disabled. Please contact an administrator.");
      }

      const role = existingUser?.role || "user";
      const userName = existingUser?.name || inputEmail.split("@")[0];

      const userSession = {
        uid: existingUser?.uid || `user-${Date.now()}`,
        email: inputEmail,
        role: role,
        name: userName,
        token: "wsrs-auth-token-session",
      };

      localStorage.setItem("wsrs_session", JSON.stringify(userSession));
      setSuccess(`Welcome back, ${userName}! Redirecting...`);

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 600);
    } catch (err: any) {
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PHONE OTP LOGIN ----------------
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setDemoOtp("123456");
      setSuccess(`Mock SMS OTP dispatched to +91 ${cleanPhone.slice(-10)}`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== demoOtp && otpCode.trim() !== "123456") {
      setError("Invalid OTP code. Please enter 123456.");
      return;
    }

    setLoading(true);
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

    // Look for matching registered user
    const seed = getLocalSeedState();
    const existingUser = seed.users.find(
      (u: UserRecord) => u.phone && u.phone.replace(/[^0-9]/g, "").includes(cleanPhone.slice(-10))
    );

    const role = existingUser?.role || "user";
    const userName = existingUser?.name || `Traveler (${cleanPhone.slice(-4)})`;
    const userEmail = existingUser?.email || `user_${cleanPhone.slice(-4)}@safelens.in`;

    const userSession = {
      uid: existingUser?.uid || `user-phone-${Date.now()}`,
      email: userEmail,
      phoneNumber: `+91 ${cleanPhone.slice(-10)}`,
      role: role,
      name: userName,
      token: "wsrs-auth-token-phone",
    };

    localStorage.setItem("wsrs_session", JSON.stringify(userSession));
    setSuccess(`Phone verified! Logging in as ${userName}...`);

    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = () => {
    setLoading(true);
    const userSession = {
      uid: "user-google-demo",
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

  // ---------------- 1-CLICK DEMO LOGIN ----------------
  const handleQuickDemoLogin = (type: "admin" | "user") => {
    if (type === "admin") {
      const adminSession = {
        email: "admin@wsrs.in",
        role: "admin",
        name: "System Administrator",
        token: "wsrs-auth-token-admin",
      };
      localStorage.setItem("wsrs_session", JSON.stringify(adminSession));
      setSuccess("Logged in as System Administrator!");
      setTimeout(() => router.push("/admin/dashboard"), 400);
    } else {
      const userSession = {
        email: "traveler@safelens.in",
        role: "user",
        name: "Priya Sharma",
        token: "wsrs-auth-token-demo",
      };
      localStorage.setItem("wsrs_session", JSON.stringify(userSession));
      setSuccess("Logged in as Community Traveler!");
      setTimeout(() => router.push("/dashboard"), 400);
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
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">Welcome to SafeLens</h1>
            <p className="text-xs text-brand-muted">Crowd AI & Urban Safety Intelligence</p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-3 bg-brand-light border border-brand-purple/20 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-purple block text-center">
              Quick 1-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                className="py-1.5 px-2.5 bg-brand-purple hover:bg-brand-violet text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("user")}
                className="py-1.5 px-2.5 bg-white hover:bg-brand-soft border border-brand-border text-brand-navy text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-purple" />
                <span>User Login</span>
              </button>
            </div>
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
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
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
                    placeholder="admin@wsrs.in or registered email"
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
                    <label className="text-xs font-bold text-brand-navy">Registered Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-xs font-bold text-brand-purple">🇮🇳 +91</div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="98421 11223"
                        className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-16 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
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
                  <div className="p-3 bg-brand-light border border-brand-purple/20 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-brand-purple font-bold">Demo OTP: {demoOtp}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-brand-purple font-bold hover:underline text-[11px]"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-navy text-center block">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="123456"
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-brand-navy focus:outline-none focus:border-brand-purple"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
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
                Sign in securely with your Google account.
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
              Register with Mobile OTP
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
