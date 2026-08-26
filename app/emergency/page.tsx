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
  PhoneCall
} from "lucide-react";

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
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
        }
      );
    }
  }, []);

  const handleTriggerSOS = () => {
    setSosActive(true);
    setBroadcasting(true);
    setMessage("🚨 EMERGENCY SOS BROADCAST ACTIVATED. Alert sent to Karur Police Patrol & Emergency Contacts.");
  };

  const handleDeactivateSOS = () => {
    setSosActive(false);
    setBroadcasting(false);
    setMessage(null);
  };

  const emergencyContacts = [
    {
      name: "Women Helpline (National)",
      number: "1091",
      desc: "24/7 Toll-Free Women In Distress Support",
      type: "Helpline",
      badgeClass: "bg-purple-50 text-brand-purple border-brand-purple/20",
    },
    {
      name: "National Emergency Service",
      number: "112",
      desc: "All-in-One Police, Fire & Medical Response",
      type: "Emergency",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
    },
    {
      name: "Karur Police Control Room",
      number: "04324-256100",
      desc: "Karur Town Police Station & Flying Squad",
      type: "Police",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Emergency Medical & Ambulance",
      number: "108",
      desc: "Tamil Nadu State Free Ambulance Dispatch",
      type: "Medical",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Karur Govt District Hospital",
      number: "04324-255555",
      desc: "Gandhigramam, Karur Casualty Ward",
      type: "Hospital",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top SOS Hero Card */}
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-card transition-all ${
            sosActive
              ? "bg-red-500 text-white border-red-600 ring-4 ring-red-500/30 animate-pulse"
              : "bg-white border-brand-border"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                  sosActive ? "bg-white/20 text-white" : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
                  <span>Immediate Assistance Protocol</span>
                </div>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  sosActive ? "text-white" : "text-brand-navy"
                }`}>
                  Emergency SOS & Instant Dispatch
                </h1>
                <p className={`text-xs sm:text-sm max-w-2xl ${
                  sosActive ? "text-white/90" : "text-brand-muted"
                }`}>
                  In case of danger, press the emergency SOS trigger below to broadcast your live GPS location to local patrol units and emergency contacts.
                </p>
              </div>

              {/* Big Red SOS Button */}
              <div className="flex flex-col items-center">
                {!sosActive ? (
                  <button
                    onClick={handleTriggerSOS}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xl shadow-xl shadow-red-500/30 border-4 border-white flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <span>SOS</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">PRESS HERE</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDeactivateSOS}
                    className="px-6 py-3 bg-white text-red-600 hover:bg-gray-100 font-extrabold rounded-2xl text-xs shadow-xl transition-all"
                  >
                    Deactivate SOS Alert
                  </button>
                )}
              </div>
            </div>

            {/* Active Alert Banner */}
            {message && (
              <div className="mt-4 p-4 bg-red-600 text-white border border-red-700 rounded-2xl text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-300 animate-spin shrink-0" />
                  <span>{message}</span>
                </div>
                <span className="text-[10px] text-white/90 font-mono bg-black/20 px-2 py-1 rounded-lg">
                  📍 {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : "GPS Broadcasting"}
                </span>
              </div>
            )}
          </div>

          <NoticeDisclaimer variant="banner" />

          {/* Quick Helpline Contacts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-purple" />
                <span>Karur District 24x7 Emergency Helplines</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.number}
                  className="bg-white border border-brand-border rounded-3xl p-5 shadow-card hover:shadow-hover transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${contact.badgeClass}`}>
                        {contact.type}
                      </span>
                      <Phone className="w-4 h-4 text-brand-muted" />
                    </div>
                    <h3 className="font-extrabold text-brand-navy text-base pt-1">{contact.name}</h3>
                    <p className="text-xs text-brand-muted font-medium">{contact.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                    <span className="text-lg font-black text-brand-navy font-mono">
                      {contact.number}
                    </span>
                    <a
                      href={`tel:${contact.number}`}
                      className="px-4 py-2 bg-brand-light hover:bg-brand-purple hover:text-white text-brand-purple font-bold rounded-xl text-xs border border-brand-purple/20 transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
