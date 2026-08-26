"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLocalSeedState, saveLocalSeedState, UserRecord } from "@/lib/seedData";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  AlertCircle,
  UserPlus,
  Phone,
  Mail,
  CheckCircle2,
  LogIn,
  X
} from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Modal State for Registering New User
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"user" | "admin">("user");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const seed = getLocalSeedState();
    setUsers(seed.users);
  };

  const handleToggleStatus = (uid: string) => {
    const updated = users.map((u) => {
      if (u.uid === uid) {
        const nextStatus: "active" | "disabled" = u.status === "active" ? "disabled" : "active";
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    saveLocalSeedState({ users: updated });
    setMessage("User account status updated.");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = (uid: string, email: string) => {
    if (email === "admin@wsrs.in") {
      alert("Initial Administrator account cannot be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    const updated = users.filter((u) => u.uid !== uid);
    setUsers(updated);
    saveLocalSeedState({ users: updated });
    setMessage(`User ${email} deleted.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const cleanPhone = newPhone.replace(/[^0-9]/g, "");
    const userEmail = newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}_${cleanPhone.slice(-4) || "user"}@safelens.in`;

    const newUserRecord: UserRecord = {
      uid: `user-admin-created-${Date.now()}`,
      name: newName.trim(),
      email: userEmail.toLowerCase(),
      phone: cleanPhone ? `+91 ${cleanPhone.slice(-10)}` : undefined,
      role: newRole,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    const updated = [newUserRecord, ...users.filter((u) => u.email !== newUserRecord.email)];
    setUsers(updated);
    saveLocalSeedState({ users: updated });

    // Reset form
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("user");
    setShowAddModal(false);

    setMessage(`New ${newRole} account "${newUserRecord.name}" successfully registered!`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLoginAsUser = (user: UserRecord) => {
    const session = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      token: "wsrs-auth-token-impersonate",
    };
    localStorage.setItem("wsrs_session", JSON.stringify(session));
    if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-brand-border rounded-3xl p-6 shadow-card">
        <div>
          <h1 className="text-2xl font-black text-brand-navy flex items-center gap-2 tracking-tight">
            <Users className="w-6 h-6 text-brand-purple" />
            <span>User & Admin Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            View all registered users, register new accounts via mobile or email, and manage security permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or phone..."
              className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-brand-navy placeholder-brand-muted focus:outline-none focus:border-brand-purple font-medium"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-brand-purple/20 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register User</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-brand-navy">Registered Accounts ({filteredUsers.length})</span>
          <span className="text-[11px] text-brand-muted font-medium">SafeLens Verified Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-soft text-brand-muted border-b border-brand-border uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Contact / Phone</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Registration Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-navy">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-brand-soft/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-extrabold text-brand-navy text-sm">{u.name}</div>
                    <div className="text-brand-muted text-xs font-medium">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    {u.phone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-navy bg-brand-soft px-2.5 py-1 rounded-xl border border-brand-border">
                        <Phone className="w-3 h-3 text-brand-purple" />
                        <span>{u.phone}</span>
                      </span>
                    ) : (
                      <span className="text-brand-muted text-xs font-medium">—</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border uppercase tracking-wider ${
                      u.role === "admin"
                        ? "bg-purple-50 text-brand-purple border-brand-purple/30"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-brand-muted font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.status === "active"
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : "text-red-600 bg-red-50 border-red-200"
                    }`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleLoginAsUser(u)}
                      className="px-2.5 py-1.5 bg-brand-light hover:bg-brand-purple hover:text-white border border-brand-purple/20 rounded-xl text-xs font-bold text-brand-purple transition-all inline-flex items-center gap-1"
                      title="Log In as this User"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(u.uid)}
                      className="px-2.5 py-1.5 bg-brand-soft hover:bg-brand-border border border-brand-border rounded-xl text-xs font-bold text-brand-navy transition-colors"
                      title="Toggle Status"
                    >
                      {u.status === "active" ? "Disable" : "Enable"}
                    </button>
                    {u.email !== "admin@wsrs.in" && (
                      <button
                        onClick={() => handleDeleteUser(u.uid, u.email)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold text-red-600 transition-colors"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register User via Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-brand-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-light rounded-xl text-brand-purple">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-navy text-base">Register New Account</h3>
                  <p className="text-xs text-brand-muted">Add a new user or administrator</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-brand-muted hover:text-brand-navy rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-xs text-brand-navy focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Mobile Number (for OTP Login)</label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-xs font-bold text-brand-purple">🇮🇳 +91</div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="98421 11223"
                    className="w-full bg-brand-soft border border-brand-border rounded-2xl pl-16 pr-3.5 py-2.5 text-xs text-brand-navy focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-xs text-brand-navy focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
                  className="w-full bg-brand-soft border border-brand-border rounded-2xl px-3.5 py-2.5 text-xs text-brand-navy font-bold focus:outline-none focus:border-brand-purple"
                >
                  <option value="user">Traveler / Community User</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-brand-muted hover:text-brand-navy rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-purple hover:bg-brand-violet text-white font-bold rounded-2xl text-xs shadow-md shadow-brand-purple/20 transition-all"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
