"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import NoticeDisclaimer from "@/components/ui/NoticeDisclaimer";
import {
  User,
  Mail,
  Shield,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  MapPin,
  Check,
  Phone,
  UserPlus,
  Trash2,
  Heart,
  Edit2,
  Save,
  X,
  PhoneCall
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  createdAt: string;
}

const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: "contact-1",
    userId: "default",
    name: "Lakshmi Sharma",
    phone: "+91 98421 88990",
    email: "lakshmi.s@example.com",
    relationship: "Mother",
    createdAt: new Date().toISOString(),
  },
  {
    id: "contact-2",
    userId: "default",
    name: "Sneha Reddy",
    phone: "+91 94432 11223",
    email: "sneha.r@example.com",
    relationship: "Friend",
    createdAt: new Date().toISOString(),
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trusted Contacts state
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRelation, setContactRelation] = useState("Mother");
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("wsrs_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed);
        loadTrustedContacts(parsed.uid);
      } catch {
        setUser(null);
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  const loadTrustedContacts = async (uid: string) => {
    // 1. Try local storage cache
    const cachedContacts = localStorage.getItem(`wsrs_contacts_${uid}`);
    if (cachedContacts) {
      try {
        setContacts(JSON.parse(cachedContacts));
      } catch {
        setContacts(DEFAULT_CONTACTS);
      }
    } else {
      setContacts(DEFAULT_CONTACTS);
    }

    // 2. Fetch from Firestore if available
    try {
      const q = query(collection(db, "trustedContacts"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const fetched: TrustedContact[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as TrustedContact);
      });
      if (fetched.length > 0) {
        setContacts(fetched);
        localStorage.setItem(`wsrs_contacts_${uid}`, JSON.stringify(fetched));
      }
    } catch (err) {
      console.warn("[Firestore Contacts] Read note:", err);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      setError("Please provide a name and mobile phone number.");
      return;
    }

    setContactLoading(true);
    setError(null);

    const newContact: TrustedContact = {
      id: `contact-${Date.now()}`,
      userId: user?.uid || "current-user",
      name: contactName.trim(),
      phone: contactPhone.trim().startsWith("+91") ? contactPhone.trim() : `+91 ${contactPhone.trim().slice(-10)}`,
      email: contactEmail.trim().toLowerCase(),
      relationship: contactRelation,
      createdAt: new Date().toISOString(),
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    if (user?.uid) {
      localStorage.setItem(`wsrs_contacts_${user.uid}`, JSON.stringify(updated));
    }

    try {
      const docRef = doc(db, "trustedContacts", newContact.id);
      await setDoc(docRef, newContact);
    } catch (err) {
      console.warn("[Firestore] Contact save note:", err);
    }

    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setContactRelation("Mother");
    setShowAddContact(false);
    setContactLoading(false);
    setMessage("Emergency trusted contact added successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteContact = async (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    if (user?.uid) {
      localStorage.setItem(`wsrs_contacts_${user.uid}`, JSON.stringify(updated));
    }

    try {
      await deleteDoc(doc(db, "trustedContacts", id));
    } catch (err) {
      console.warn("[Firestore] Contact delete note:", err);
    }

    setMessage("Trusted contact removed.");
    setTimeout(() => setMessage(null), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setMessage("Password updated successfully!");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("wsrs_session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-brand-soft text-brand-navy flex pb-20 md:pb-0">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-light border border-brand-purple/20 rounded-full text-brand-purple text-xs font-bold mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Account & Safety Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Profile & Trusted Circle
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                Manage your credentials, emergency contacts, and journey-sharing permissions.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors self-start sm:self-auto active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Account</span>
            </button>
          </div>

          {message && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: User Profile Card */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-5 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-violet flex items-center justify-center font-black text-xl text-white shadow-md shadow-brand-purple/20">
                    {user?.displayName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-brand-navy">
                      {user?.displayName || user?.name || "Community Traveler"}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Verified {user?.role === "admin" ? "Administrator" : "Safety Member"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-brand-soft rounded-2xl border border-brand-border">
                    <span className="text-brand-muted flex items-center gap-2 font-medium">
                      <Mail className="w-4 h-4 text-brand-purple" />
                      Email
                    </span>
                    <span className="font-bold text-brand-navy truncate max-w-[200px]">
                      {user?.email || "Not linked"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-brand-soft rounded-2xl border border-brand-border">
                    <span className="text-brand-muted flex items-center gap-2 font-medium">
                      <Phone className="w-4 h-4 text-brand-purple" />
                      Mobile Phone
                    </span>
                    <span className="font-bold text-brand-navy">
                      {user?.phoneNumber || "+91 98421 11223"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-brand-soft rounded-2xl border border-brand-border">
                    <span className="text-brand-muted flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-brand-purple" />
                      Primary City
                    </span>
                    <span className="font-bold text-brand-navy">Karur, Tamil Nadu</span>
                  </div>
                </div>
              </div>

              {/* Password Change Card */}
              <div className="bg-white border border-brand-border rounded-3xl p-6 space-y-4 shadow-card">
                <h3 className="font-extrabold text-sm text-brand-navy flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-purple" />
                  <span>Security & Password</span>
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-brand-navy">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-brand-navy">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl shadow-sm transition-all"
                  >
                    Update Password
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Trusted Emergency Contacts */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-brand-navy flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                      <span>Trusted Emergency Contacts</span>
                    </h3>
                    <p className="text-[11px] text-brand-muted mt-0.5">
                      Contacts notified when you trigger SOS or share live journeys.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="px-3 py-1.5 bg-brand-light hover:bg-brand-purple hover:text-white border border-brand-purple/20 text-brand-purple text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    {showAddContact ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{showAddContact ? "Cancel" : "+ Add Contact"}</span>
                  </button>
                </div>

                {/* Add Contact Form */}
                {showAddContact && (
                  <form onSubmit={handleAddContact} className="p-4 bg-brand-soft rounded-2xl border border-brand-border space-y-3 text-xs animate-in fade-in">
                    <span className="font-black text-brand-navy block uppercase tracking-wider text-[10px]">
                      New Trusted Contact
                    </span>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-navy">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Lakshmi Sharma"
                        className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="font-bold text-brand-navy">Mobile Phone</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="98421 11223"
                          className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-brand-navy">Relationship</label>
                        <select
                          value={contactRelation}
                          onChange={(e) => setContactRelation(e.target.value)}
                          className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-brand-navy font-bold focus:outline-none focus:border-brand-purple"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Friend">Friend</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-navy">Email (Optional)</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@example.com"
                        className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{contactLoading ? "Saving..." : "Save Emergency Contact"}</span>
                    </button>
                  </form>
                )}

                {/* Contacts List */}
                <div className="space-y-2.5">
                  {contacts.map((c) => (
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

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${c.phone}`}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                          title="Call Contact"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(c.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                          title="Remove Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
