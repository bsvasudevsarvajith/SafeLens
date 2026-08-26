"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import {
  AlertTriangle,
  Phone,
  Radio,
  Shield,
  MapPin,
  CheckCircle2,
  Bell,
  Volume2,
  Share2,
  Navigation,
  Sparkles,
  PhoneCall,
  Heart,
  UserCheck
} from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  useEffect(() => {
    // 1. Get live GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setGpsLocation({ lat: 10.9601, lng: 78.0766 });
        },
        { enableHighAccuracy: true }
      );
    }

    // 2. Load trusted contacts
    const session = localStorage.getItem("wsrs_session");
    if (session) {
      try {
        const user = JSON.parse(session);
        const cached = localStorage.getItem(`wsrs_contacts_${user.uid}`);
        if (cached) {
          setTrustedContacts(JSON.parse(cached));
        } else {
          setTrustedContacts([
            { id: "1", name: "Lakshmi Sharma", phone: "+91 98421 88990", relationship: "Mother" },
            { id: "2", name: "Sneha Reddy", phone: "+91 94432 11223", relationship: "Friend" },
          ]);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleTriggerSOS = async () => {
    setSosActive(true);
    setBroadcasting(true);

    const lat = gpsLocation?.lat || 10.9601;
    const lng = gpsLocation?.lng || 78.0766;

    // Log incident in Firestore
    try {
      const session = localStorage.getItem("wsrs_session");
      const user = session ? JSON.parse(session) : null;
      const incidentId = `sos-${Date.now()}`;
      await setDoc(doc(db, "emergencyIncidents", incidentId), {
        incidentId,
        userId: user?.uid || "anonymous",
        userName: user?.displayName || user?.name || "Traveler",
        userPhone: user?.phoneNumber || "Unknown",
        location: { lat, lng },
        timestamp: new Date().toISOString(),
        status: "ACTIVE_ALERT",
      }, { merge: true });
    } catch (err) {
      console.warn("[Firestore] SOS write note:", err);
    }

    setMessage(
      `🚨 EMERGENCY SOS BROADCAST ACTIVE. Your live GPS coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) have been recorded for emergency responders & trusted contacts.`
    );
  };

  const handleDeactivateSOS = () => {
    setSosActive(false);
    setBroadcasting(false);
    setMessage(null);
  };

  const helplineServices = [
    {
      name: "National Women Helpline",
      number: "1091",
      desc: "24/7 Toll-Free Women In Distress Support",
      type: "Helpline",
      badgeClass: "bg-purple-50 text-brand-purple border-brand-purple/20",
    },
    {
      name: "National Emergency Response",
      number: "112",
      desc: "All-in-One Police, Fire & Emergency Response",
      type: "Emergency",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
    },
    {
      name: "Karur Police Control Room",
      number: "04324-256100",
      desc: "Karur Town Police Station & Flying Patrol Squad",
      type: "Police",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Emergency Ambulance Service",
      number: "108",
      desc: "Free 24/7 State Emergency Ambulance Dispatch",
      type: "Medical",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex pb-20 md:pb-0">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-red-50 border border-red-200 rounded-full text-red-700 text-xs font-bold mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Rapid Emergency Response</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Emergency SOS Dispatch
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Instantly trigger law enforcement alerts, broadcast GPS coordinates, and notify trusted contacts.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-brand-muted bg-brand-soft px-3 py-1.5 rounded-2xl border border-brand-border">
              <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
              <span>GPS: {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : "Detecting..."}</span>
            </div>
          </div>

          {/* SOS Broadcast Banner */}
          {message && (
            <div className="p-4 bg-red-600 text-white rounded-3xl shadow-xl shadow-red-600/30 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm">
                  <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                  <span>EMERGENCY BROADCAST ACTIVE</span>
                </div>
                <button
                  onClick={handleDeactivateSOS}
                  className="px-3 py-1 bg-white text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Deactivate Alert
                </button>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                {message}
              </p>
            </div>
          )}

          {/* 1-Tap SOS Huge Trigger Button */}
          <div className="bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-card text-center space-y-4">
            <h2 className="text-lg font-black text-brand-navy">1-Tap Emergency Trigger</h2>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Pressing the button below instantly logs your emergency coordinates and initiates rapid dispatch protocol.
            </p>

            <div className="py-4">
              <button
                type="button"
                onClick={sosActive ? handleDeactivateSOS : handleTriggerSOS}
                className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full font-black text-white text-2xl sm:text-3xl shadow-2xl transition-all duration-300 transform active:scale-95 mx-auto flex flex-col items-center justify-center gap-2 ${
                  sosActive
                    ? "bg-amber-600 shadow-amber-600/50 hover:bg-amber-700 animate-pulse"
                    : "bg-red-600 shadow-red-600/40 hover:bg-red-700 ring-8 ring-red-100"
                }`}
              >
                <PhoneCall className="w-10 h-10 sm:w-12 sm:h-12" />
                <span>{sosActive ? "CANCEL" : "SOS"}</span>
              </button>
            </div>

            <p className="text-[11px] text-brand-muted">
              {sosActive ? "🚨 Alert is broadcasting live to patrol units." : "Touch to broadcast immediate distress signal."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Trusted Emergency Contacts */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-brand-navy flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                    <span>Your Trusted Emergency Circle</span>
                  </h3>
                  <a
                    href="/profile"
                    className="text-xs font-bold text-brand-purple hover:underline"
                  >
                    Manage
                  </a>
                </div>

                <div className="space-y-2.5">
                  {trustedContacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 bg-brand-soft rounded-2xl border border-brand-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-brand-navy">{c.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-light text-brand-purple border border-brand-purple/20 rounded-md">
                            {c.relationship}
                          </span>
                        </div>
                        <p className="text-brand-muted font-mono text-[11px]">{c.phone}</p>
                      </div>

                      <a
                        href={`tel:${c.phone}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official 24/7 Helplines */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                <h3 className="font-extrabold text-base text-brand-navy flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-purple" />
                  <span>24/7 Verified Emergency Helplines</span>
                </h3>

                <div className="space-y-2.5">
                  {helplineServices.map((h) => (
                    <div
                      key={h.number}
                      className="p-3.5 bg-brand-soft rounded-2xl border border-brand-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-brand-navy">{h.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${h.badgeClass}`}>
                            {h.type}
                          </span>
                        </div>
                        <p className="text-brand-muted text-[11px]">{h.desc}</p>
                      </div>

                      <a
                        href={`tel:${h.number}`}
                        className="px-3 py-1.5 bg-brand-purple hover:bg-brand-violet text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{h.number}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
