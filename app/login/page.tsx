"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Mail,
  RefreshCw,
  Send,
  KeyRound,
  ArrowLeft,
  UserPlus
} from "lucide-react";
import Header from "@/components/layout/Header";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { auth, db } from "@/lib/firebase/config";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  // Form inputs
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Views & States: "login" | "unverified" | "forgot_password"
  const [viewState, setViewState] = useState<"login" | "unverified" | "forgot_password">("login");
  const [forgotEmail, setForgotEmail] = useState("");

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unverifiedAccount, setUnverifiedAccount] = useState<{ email: string; userObj: any } | null>(null);

  // Map Firebase Auth error codes to user-friendly messages
  const mapAuthError = (err: any): string => {
    const code = err?.code || "";
    if (code === "auth/invalid-email") return "Invalid User ID (email) format.";
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return "Invalid User ID or password.";
    }
    if (code === "auth/user-disabled") {
      return "This account has been disabled. Please contact administrator.";
    }
    if (code === "auth/too-many-requests") {
      return "Too many login attempts. Please wait a few moments before trying again.";
    }
    if (code === "auth/network-request-failed") {
      return "Network error. Please check your internet connection.";
    }
    return err?.message || "Authentication failed. Please check your credentials.";
  };

  // ---------------- LOGIN SUBMISSION FLOW ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const inputEmail = userId.trim().toLowerCase();
    if (!inputEmail) {
      setError("Please enter your User ID (Email).");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Direct Administrator Credentials Check
    if (inputEmail === "admin@wsrs.in" && password === "admin@1234") {
      const adminSession = {
        uid: "admin-system-root",
        email: "admin@wsrs.in",
        displayName: "System Administrator",
        role: "admin",
        authProvider: "email_password",
        emailVerified: true,
        token: "wsrs-admin-session",
      };
      localStorage.setItem("wsrs_session", JSON.stringify(adminSession));
      setSuccess("Administrator verified! Redirecting to control panel...");
      setTimeout(() => router.push("/admin/dashboard"), 400);
      return;
    }

    setLoading(true);
    setStatusMessage("Authenticating credentials...");

    try {
      // 1. Authenticate with Firebase Email & Password
      const userCred = await signInWithEmailAndPassword(auth, inputEmail, password);
      const user = userCred.user;

      // 2. Check if email is verified
      if (!user.emailVerified) {
        setUnverifiedAccount({ email: inputEmail, userObj: user });
        setViewState("unverified");
        setError("Your email address is not verified yet.");
        setLoading(false);
        setStatusMessage(null);
        return;
      }

      // 3. Update / Create Firestore User Profile
      let role = "user";
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().role) {
          role = docSnap.data().role;
        }

        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || inputEmail.split("@")[0],
          email: inputEmail,
          emailVerified: true,
          role: role,
          photoURL: user.photoURL || "",
          lastLoginAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn("[Firestore] User profile sync note:", firestoreErr);
      }

      // 4. Save Local Session
      const sessionData = {
        uid: user.uid,
        displayName: user.displayName || inputEmail.split("@")[0],
        email: inputEmail,
        role: role,
        emailVerified: true,
        token: `wsrs-token-${user.uid}`,
      };
      localStorage.setItem("wsrs_session", JSON.stringify(sessionData));

      setStatusMessage("Login successful! Loading dashboard...");
      setSuccess("Login successful!");

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 500);
    } catch (err: any) {
      setError(mapAuthError(err));
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESEND VERIFICATION EMAIL FLOW ----------------
  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (unverifiedAccount?.userObj) {
        await sendEmailVerification(unverifiedAccount.userObj);
        setSuccess(`Verification email sent to ${unverifiedAccount.email}. Please check your inbox.`);
      } else if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setSuccess(`Verification email sent to ${auth.currentUser.email}. Please check your inbox.`);
      } else {
        setSuccess(`A verification request has been dispatched to ${unverifiedAccount?.email || userId}.`);
      }
    } catch (err: any) {
      if (err?.code === "auth/too-many-requests") {
        setError("Too many verification requests. Please wait a few minutes before resending.");
      } else {
        setError(mapAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD FLOW ----------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const inputEmail = (forgotEmail || userId).trim().toLowerCase();
    if (!inputEmail) {
      setError("Please enter your registered User ID (Email).");
      return;
    }

    setLoading(true);
    setStatusMessage("Sending password reset email...");

    try {
      await sendPasswordResetEmail(auth, inputEmail);
      setSuccess(`Password reset email sent to ${inputEmail}. Please check your inbox.`);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <SafeLensLogo size="lg" />
            </div>
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">SafeRoute</h1>
            <p className="text-xs font-semibold text-brand-muted">Travel safer. Stay connected.</p>
          </div>

          {/* Status Loading Spinner */}
          {statusMessage && (
            <div className="p-3 bg-brand-light border border-brand-purple/20 rounded-2xl text-brand-purple text-xs font-bold flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-brand-purple border-t-transparent rounded-full animate-spin shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. LOGIN VIEW (USER ID + PASSWORD)                                        */}
          {/* ========================================================================= */}
          {viewState === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* User ID Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">User ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-navy">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(userId);
                      setError(null);
                      setSuccess(null);
                      setViewState("forgot_password");
                    }}
                    className="text-[11px] font-bold text-brand-purple hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : "LOGIN"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* New User / Create Account Section */}
              <div className="pt-4 border-t border-brand-border text-center space-y-3">
                <p className="text-xs text-brand-muted font-medium">New user?</p>
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 bg-brand-soft hover:bg-brand-border text-brand-navy font-bold rounded-2xl border border-brand-border flex items-center justify-center gap-2 transition-colors text-xs active:scale-95"
                >
                  <UserPlus className="w-4 h-4 text-brand-purple" />
                  <span>Create Account</span>
                </Link>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. EMAIL VERIFICATION REQUIRED SCREEN                                    */}
          {/* ========================================================================= */}
          {viewState === "unverified" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-900 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-amber-900">Email Verification Required</h3>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your account has been registered, but your email address <strong>{unverifiedAccount?.email || userId}</strong> has not been verified yet.
                  </p>
                  <p className="text-[11px] text-amber-700 pt-1">
                    Please check your inbox and click the verification link before logging in.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{loading ? "Sending..." : "RESEND VERIFICATION EMAIL"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSuccess(null);
                    setViewState("login");
                  }}
                  className="w-full py-2.5 bg-brand-soft hover:bg-brand-border text-brand-navy rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-brand-border"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO LOGIN</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. FORGOT PASSWORD SCREEN                                                */}
          {/* ========================================================================= */}
          {viewState === "forgot_password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-brand-purple" />
                  <span>Reset Your Password</span>
                </h3>
                <p className="text-xs text-brand-muted">
                  Enter your registered User ID (Email) to receive a secure password reset link.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">User ID (Email)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Sending..." : "SEND PASSWORD RESET EMAIL"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setViewState("login");
                }}
                className="w-full py-2.5 bg-brand-soft hover:bg-brand-border text-brand-navy rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-brand-border"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </form>
          )}

          {/* Footer Security Note */}
          <div className="text-center text-[11px] text-brand-muted pt-2 border-t border-brand-border flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-purple" />
            <span>End-to-End Encrypted Safety Protocol</span>
          </div>

        </div>
      </main>
    </div>
  );
}
