"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, Building2, BookOpen, Bell, Globe, Lock,
  ChevronRight, LogOut, Edit2, Moon, Sun, Laptop, Shield, Camera
} from "lucide-react";
import { useAuthStore, useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function UserProfile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
  });

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      router.replace("/splash");
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // In a real app, this would update the user in the database
  };

  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: Edit2, label: "Edit Profile", action: () => setIsEditing(true), color: "text-blue-600" },
        { icon: Lock, label: "Change Password", action: () => {}, color: "text-purple-600" },
        { icon: Shield, label: "Security Settings", action: () => {}, color: "text-green-600" },
      ],
    },
    {
      section: "Preferences",
      items: [
        { icon: Bell, label: "Notification Settings", action: () => {}, color: "text-orange-600" },
        { icon: Globe, label: "Language Settings", action: () => {}, color: "text-cyan-600" },
      ],
    },
  ];

  return (
    <div className="pb-4">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-4 pt-6 pb-10">
        <h1 className="text-white font-black text-xl mb-5">Profile</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white/30">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600">
              <Camera size={13} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-xl font-black truncate">{user?.fullName ?? "Guest User"}</h2>
            <p className="text-blue-200 text-sm truncate mt-0.5">{user?.email}</p>
            {user?.isVerified && (
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-5 space-y-4">
        {/* Info card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {isEditing ? (
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 h-10 rounded-xl bg-blue-600 text-white font-semibold text-sm active:scale-95 transition-transform"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { icon: User, label: "Full Name", value: user?.fullName ?? "—" },
                { icon: Mail, label: "Email", value: user?.email ?? "—" },
                { icon: Phone, label: "Phone", value: user?.phone ?? "—" },
                { icon: Building2, label: "University", value: user?.university ?? "—" },
                { icon: BookOpen, label: "Department", value: user?.department ?? "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Icon size={15} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme selector */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Laptop },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value as "light" | "dark" | "system")}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all",
                  theme === value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                <Icon size={18} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu sections */}
        {menuItems.map((section) => (
          <div key={section.section} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <p className="px-4 pt-3 pb-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {section.section}
            </p>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.items.map(({ icon: Icon, label, action, color }) => (
                <button
                  key={label}
                  onClick={action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:bg-slate-100 dark:active:bg-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Icon size={15} className={color} />
                  </div>
                  <span className="flex-1 text-left text-slate-700 dark:text-slate-300 text-sm font-medium">{label}</span>
                  <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>

        <p className="text-center text-slate-300 dark:text-slate-600 text-xs pb-2">
          Exit Exam App v1.0.0 · Developed for Ethiopian Students
        </p>
      </div>
    </div>
  );
}
