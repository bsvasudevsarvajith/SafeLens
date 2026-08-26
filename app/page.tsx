"use client";

import React, { useState } from "react";
import Link from "next/link";
import SafeLensLogo from "@/components/brand/SafeLensLogo";
import HeroMapPreview from "@/components/landing/HeroMapPreview";
import InteractiveDemoSection from "@/components/landing/InteractiveDemoSection";
import {
  Shield,
  MapPin,
  Users,
  Route as RouteIcon,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  Eye,
  Lock,
  Compass,
  ChevronRight,
  PhoneCall,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureCards = [
    {
      icon: MapPin,
      color: "bg-purple-100 text-brand-purple border-purple-200",
      title: "AI Location Analysis",
      description:
        "Select any point on the map and receive an AI-generated assessment of crowd activity, ambient infrastructure, and safety indicators.",
    },
    {
      icon: Users,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      title: "Crowd Activity Analysis",
      description:
        "Estimate human activity and crowd density levels using available location signals and AI-powered video analysis.",
    },
    {
      icon: Shield,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      title: "Safety Score",
      description:
        "Convert multiple area indicators into an easy-to-understand multi-factor safety assessment score and risk level.",
    },
    {
      icon: RouteIcon,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      title: "Safer Route Analysis",
      description:
        "Compare alternative travel paths using estimated safety indicators, lighting presence, distance, and transit time.",
    },
    {
      icon: AlertTriangle,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      title: "Risk Indicators",
      description:
        "Identify locations that may require additional caution based on community reports, isolated segments, and time of day.",
    },
    {
      icon: BarChart3,
      color: "bg-violet-100 text-brand-violet border-violet-200",
      title: "AI Safety Insights",
      description:
        "Understand why an area received its assessment through transparent breakdown indicators and AI-generated explanations.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "SELECT",
      description: "Search for a destination or click directly on the interactive map.",
    },
    {
      number: "02",
      title: "ANALYZE",
      description: "SafeLens collects available location, transit, and activity signals.",
    },
    {
      number: "03",
      title: "AI ASSESS",
      description: "AI processes multi-factor indicators and estimates crowd presence.",
    },
    {
      number: "04",
      title: "DECIDE",
      description: "Review the assessment, compare routes, and make an informed decision.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col selection:bg-brand-purple selection:text-white">
      
      {/* 5. Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <SafeLensLogo size="md" href="/" />

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-muted">
            <a href="#features" className="hover:text-brand-purple transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-purple transition-colors">
              How It Works
            </a>
            <a href="#safety-analysis" className="hover:text-brand-purple transition-colors">
              Safety Analysis
            </a>
            <a href="#safety-disclaimer" className="hover:text-brand-purple transition-colors">
              Advisory
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-brand-navy hover:text-brand-purple transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-violet hover:opacity-95 text-white text-sm font-bold rounded-2xl shadow-md shadow-brand-purple/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Shield className="w-4 h-4" />
              <span>Launch App</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-brand-navy hover:bg-brand-soft border border-brand-border"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-brand-border px-4 py-6 space-y-4 shadow-lg">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-brand-navy">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-brand-soft"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-brand-soft"
              >
                How It Works
              </a>
              <a
                href="#safety-analysis"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-brand-soft"
              >
                Safety Analysis
              </a>
              <a
                href="#safety-disclaimer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-brand-soft"
              >
                Safety Principles
              </a>
            </nav>
            <div className="pt-4 border-t border-brand-border flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full py-2.5 text-center text-sm font-bold text-brand-navy border border-brand-border rounded-xl"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-2.5 text-center bg-brand-purple text-white text-sm font-bold rounded-xl shadow-md"
              >
                Launch App
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 6. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        
        {/* Subtle Background Pattern & Soft Purple Glows */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(#6D35E8 0.75px, transparent 0.75px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & CTA */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-light border border-brand-purple/25 text-brand-purple text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                <span>AI-POWERED SAFETY INTELLIGENCE</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy tracking-tight leading-[1.1]">
                See the Area.
                <br />
                Understand the Risk.
                <br />
                <span className="bg-gradient-to-r from-brand-purple via-[#7C3AED] to-brand-violet bg-clip-text text-transparent">
                  Choose Your Path.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                SafeLens AI analyzes crowd activity, location signals, and environmental safety indicators to help you make more informed travel decisions before stepping out.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-violet hover:opacity-95 text-white text-base font-extrabold rounded-2xl shadow-hover flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
                >
                  <Shield className="w-5 h-5 fill-white/20" />
                  <span>🛡 ANALYZE A LOCATION</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-7 py-4 bg-brand-soft hover:bg-brand-light border border-brand-border text-brand-navy text-base font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>▶ HOW IT WORKS</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Privacy First (No Face ID)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Estimation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Decision Support</span>
                </div>
              </div>

            </div>

            {/* 7. Right Column: Hero Map Preview */}
            <div className="lg:col-span-6">
              <HeroMapPreview />
            </div>

          </div>
        </div>
      </section>

      {/* 8. Primary CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-brand-purple via-[#7C3AED] to-brand-violet text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Analyze any area before you travel.
            </h3>
            <p className="text-sm sm:text-base text-purple-100">
              Select a location on the map and let SafeLens AI analyze available crowd and safety indicators.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-white text-brand-purple hover:bg-brand-light font-extrabold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <Shield className="w-4 h-4" />
            <span>🛡 ANALYZE A LOCATION</span>
          </Link>
        </div>
      </section>

      {/* 9. Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider">
              <span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              SafeLens Intelligence
            </h2>
            <p className="text-base text-brand-muted">
              AI-powered tools designed to help you understand your surroundings and choose safer routes.
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-3xl p-7 border border-brand-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 space-y-4"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-purple transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-brand-soft border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider">
              <span>Simple 4-Step Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              How SafeLens AI Works
            </h2>
            <p className="text-base text-brand-muted">
              From coordinates to actionable intelligence in under two seconds.
            </p>
          </div>

          {/* 4 Steps Grid (Horizontal Desktop / Vertical Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative bg-white p-6 rounded-3xl border border-brand-border shadow-card space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-brand-purple font-mono">
                    {s.number}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-brand-light text-brand-purple border border-brand-purple/20">
                    Step {idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-brand-navy">
                  {s.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. Interactive Location Analysis Live Showcase */}
      <InteractiveDemoSection />

      {/* Crowd Video AI & Safer Route Showcase */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Crowd AI Module Card */}
            <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-card space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple border border-purple-200 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                  AI Crowd Video Studio
                </span>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  Real-Time Video People Detection
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Upload corridor footage or connect municipal video feeds to estimate person density without facial recognition or identity tracking.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-brand-soft rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-brand-muted uppercase block">People Count</span>
                  <span className="text-xl font-extrabold text-brand-purple">32</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted uppercase block">Crowd Density</span>
                  <span className="text-xl font-extrabold text-emerald-600">81%</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted uppercase block">Confidence</span>
                  <span className="text-xl font-extrabold text-brand-navy">91%</span>
                </div>
              </div>

              <Link
                href="/crowd-ai"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple hover:underline"
              >
                <span>Explore Crowd AI Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Safer Routes Module Card */}
            <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-card space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <RouteIcon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Smart Route Comparison
                </span>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  Comparative Route Intelligence
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Compare alternative transit paths based on ambient lighting, commercial density, estimated activity, and travel duration.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-800">Route A (Main Road)</span>
                    <span className="text-[11px] text-emerald-600 block">4.2 km • 18 min</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">
                    Score 87 (Recommended)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-brand-soft border border-brand-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-brand-navy">Route B (Direct Alley)</span>
                    <span className="text-[11px] text-brand-muted block">3.7 km • 15 min</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-lg text-[10px]">
                    Score 68 (Moderate)
                  </span>
                </div>
              </div>

              <Link
                href="/safe-route"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-purple hover:underline"
              >
                <span>Find Safer Routes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 28. Safety Disclaimer Banner (Data Honesty) */}
      <section id="safety-disclaimer" className="py-12 bg-brand-soft border-t border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border rounded-full text-xs font-bold text-brand-muted">
            <Lock className="w-3.5 h-3.5 text-brand-purple" />
            <span>Ethical AI & Decision-Support Notice</span>
          </div>
          <h4 className="text-lg font-bold text-brand-navy">
            Important Safety & Decision-Support Disclaimer
          </h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            SafeLens AI provides advisory decision-support information based on available crowd estimates, municipal signals, and user reports. It does <strong>not</strong> guarantee personal safety or classify areas as definitively dangerous. Users must exercise independent judgment and contact local emergency authorities (<strong>112</strong> / <strong>1091</strong>) in urgent situations.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <SafeLensLogo size="md" href="/" />
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-brand-muted">
            <Link href="/dashboard" className="hover:text-brand-purple">Dashboard</Link>
            <Link href="/safe-route" className="hover:text-brand-purple">Safe Route</Link>
            <Link href="/crowd-ai" className="hover:text-brand-purple">Crowd AI</Link>
            <Link href="/safety" className="hover:text-brand-purple">Safety Reports</Link>
            <Link href="/emergency" className="hover:text-brand-purple">Emergency SOS</Link>
            <Link href="/login" className="hover:text-brand-purple">Account Login</Link>
          </div>

          <span className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} SafeLens AI Inc. All rights reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
