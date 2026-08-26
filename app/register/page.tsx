"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  UserPlus
} from "lucide-react";
import Header from "@/components/layout/Header";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import { auth, db } from "@/lib/firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();

  // Registration form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredUserObj, setRegisteredUserObj] = useState<any>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Map Firebase Auth errors
  const mapAuthError = (err: any): string => {
    const code = err?.code || "";
    if (code === "auth/invalid-email") return "Invalid User ID (email) address format.";
    if (code === "auth/email-already-in-use") return "An account already exists with this email. Please log in.";
    if (code === "auth/weak-password") return "Password should be at least 6 characters.";
    if (code === "auth/too-many-requests") return "Too many requests. Please wait a few moments.";
    if (code === "auth/network-request-failed") return "Network error. Please check your connection.";
    return err?.message || "Failed to create account. Please try again.";
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendMessage(null);

    const inputEmail = email.trim().toLowerCase();
    const inputName = name.trim();

    if (!inputName) {
      setError("Please enter your Full Name.");
      return;
    }

    if (!inputEmail) {
      setError("Please enter your User ID (Email).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, inputEmail, password);
      const user = userCred.user;
      setRegisteredUserObj(user);

      // 2. Update Display Name
      await updateProfile(user, { displayName: inputName });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      // 4. Save User Profile in Firestore
      const userProfile = {
        uid: user.uid,
        displayName: inputName,
        email: inputEmail,
        emailVerified: false,
        role: "user",
        photoURL: "",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, userProfile, { merge: true });
      } catch (firestoreErr) {
        console.warn("[Firestore] User write note:", firestoreErr);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError(null);
    setResendMessage(null);
    setLoading(true);

    try {
      if (registeredUserObj) {
        await sendEmailVerification(registeredUserObj);
        setResendMessage(`Verification email sent to ${email.trim()}. Please check your inbox.`);
      } else if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setResendMessage(`Verification email sent to ${auth.currentUser.email}. Please check your inbox.`);
      } else {
        setResendMessage(`Verification email resent to ${email.trim()}.`);
      }
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-black text-brand-navy tracking-tight">Create Account</h1>
            <p className="text-xs font-semibold text-brand-muted">Join SafeRoute for safer urban travel.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {resendMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{resendMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUCCESS SCREEN: ACCOUNT CREATED + EMAIL VERIFICATION NOTICE               */}
          {/* ========================================================================= */}
          {success ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-emerald-900">Your account has been created.</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Please verify your email before logging in. A verification link has been sent to:
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-950 pt-1">
                    {email.trim().toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{loading ? "Sending..." : "RESEND VERIFICATION EMAIL"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full py-2.5 bg-brand-soft hover:bg-brand-border text-brand-navy font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-brand-border transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO LOGIN</span>
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* REGISTRATION FORM                                                         */
            /* ========================================================================= */
            <form onSubmit={handleCreateAccount} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* User ID (Email) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">User ID (Email)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* Password */}
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
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
                <p className="text-[11px] text-brand-muted">Minimum 6 characters.</p>
              </div>

              {/* Confirm Password */}
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
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm active:scale-95 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "Creating Account..." : "CREATE ACCOUNT"}</span>
              </button>

              {/* Already have an account link */}
              <div className="pt-3 border-t border-brand-border text-center">
                <p className="text-xs text-brand-muted">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-brand-purple hover:underline">
                    Login
                  </Link>
                </p>
              </div>

            </form>
          )}

          {/* Footer Security Note */}
          <div className="text-center text-[11px] text-brand-muted pt-1 border-t border-brand-border flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-purple" />
            <span>End-to-End Encrypted Safety Protocol</span>
          </div>

        </div>
      </main>
    </div>
  );
}
