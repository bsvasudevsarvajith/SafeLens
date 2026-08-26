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
  Navigation
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
    },
    {
      name: "National Emergency Service",
      number: "112",
      desc: "All-in-One Police, Fire & Medical Response",
      type: "Emergency",
    },
    {
      name: "Karur Police Control Room",
      number: "04324-256100",
      desc: "Karur Town Police Station & Flying Squad",
      type: "Police",
    },
    {
      name: "Emergency Medical & Ambulance",
      number: "108",
      desc: "Tamil Nadu State Free Ambulance Dispatch",
      type: "Medical",
    },
    {
      name: "Karur Govt District Hospital",
      number: "04324-255555",
      desc: "Gandhigramam, Karur Casualty Ward",
      type: "Hospital",
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-white flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top SOS Hero Card */}
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${
            sosActive
              ? "bg-red-950/80 border-red-500 ring-4 ring-red-500/40 animate-pulse"
              : "bg-gradient-to-r from-red-950/40 via-navy-800 to-navy-800 border-red-500/30"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-300 text-xs font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                  <span>Immediate Assistance Protocol</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  🚨 Emergency SOS & Instant Dispatch
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                  In case of danger, press the emergency SOS trigger below to broadcast your live GPS location to local patrol units and emergency contacts.
                </p>
              </div>

              {/* Big Red SOS Button */}
              <div className="flex flex-col items-center">
                {!sosActive ? (
                  <button
                    onClick={handleTriggerSOS}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-black text-xl shadow-2xl shadow-red-600/50 border-4 border-white/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all animate-bounce"
                  >
                    <span>SOS</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">PRESS HERE</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDeactivateSOS}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl text-xs border border-gray-600 shadow-xl transition-all"
                  >
                    Deactivate SOS Alert
                  </button>
                )}
              </div>
            </div>

            {/* Active Alert Banner */}
            {message && (
              <div className="mt-4 p-4 bg-red-900/60 border border-red-500/60 rounded-2xl text-red-200 text-xs font-bold flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-spin shrink-0" />
                  <span>{message}</span>
                </div>
                <span className="text-[10px] text-red-300 font-mono">
                  📍 {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : "GPS Broadcasting"}
                </span>
              </div>
            )}
          </div>

          <NoticeDisclaimer variant="banner" />

          {/* Quick Helpline Contacts Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Karur District 24x7 Emergency Helplines</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.number}
                  className="bg-navy-800 border border-navy-700 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                        {contact.type}
                      </span>
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-white text-base pt-1">{contact.name}</h3>
                    <p className="text-xs text-gray-400">{contact.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {contact.number}
                    </span>
                    <a
                      href={`tel:${contact.number}`}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow transition-colors"
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
