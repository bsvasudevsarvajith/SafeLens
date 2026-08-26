"use client";

import React from "react";
import Link from "next/link";
import { Shield, Home, Navigation, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white border border-brand-border rounded-3xl p-8 max-w-md w-full shadow-card space-y-5">
        <div className="w-16 h-16 bg-brand-light text-brand-purple rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-brand-purple">404</span>
          <h1 className="text-xl font-extrabold text-brand-navy">Page Not Found</h1>
          <p className="text-xs text-brand-muted leading-relaxed">
            The page you are looking for does not exist or has been relocated within SafeLens.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <Link
            href="/safe-route"
            className="w-full py-3 bg-brand-soft hover:bg-brand-light border border-brand-border text-brand-navy font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-4 h-4 text-brand-purple" />
            <span>Find Safe Route</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
