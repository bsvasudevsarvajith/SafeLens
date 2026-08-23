"use client";

import React, { useState, useEffect } from "react";
import { getLocalSeedState, saveLocalSeedState, UserRecord } from "@/lib/seedData";
import { Users, Search, UserCheck, UserX, Trash2, Shield, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const seed = getLocalSeedState();
    setUsers(seed.users);
  }, []);

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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            View registered users, monitor accounts, and control user permissions. Passwords are securely encrypted and hidden.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-navy-900 border border-navy-600 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300">Registered Accounts ({filteredUsers.length})</span>
          <span className="text-[11px] text-gray-400">Passwords Protected (Never Exposed)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900/80 text-gray-400 border-b border-navy-700 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">User Info</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Creation Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/60 text-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-navy-700/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-gray-400 text-xs">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                      u.role === "admin" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-400 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      u.status === "active" ? "text-emerald-400 bg-emerald-950/40" : "text-red-400 bg-red-950/40"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(u.uid)}
                      className="px-2.5 py-1 bg-navy-900 hover:bg-navy-700 border border-navy-600 rounded-lg text-xs font-medium text-gray-300 transition-colors"
                      title="Toggle Account Status"
                    >
                      {u.status === "active" ? "Disable" : "Enable"}
                    </button>
                    {u.email !== "admin@wsrs.in" && (
                      <button
                        onClick={() => handleDeleteUser(u.uid, u.email)}
                        className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 transition-colors"
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

    </div>
  );
}
