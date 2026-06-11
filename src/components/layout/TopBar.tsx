"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Sun, Moon, X, GraduationCap } from "lucide-react";
import { useAuthStore, useNotificationStore, useThemeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { user } = useAuthStore();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { theme, setTheme } = useThemeStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 safe-top">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-black text-blue-700 dark:text-blue-400 text-sm hidden sm:block">EXIT EXAM</span>
          </Link>

          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <Link href="/profile">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </Link>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-4 pb-3 animate-slide-down">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, topics..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notifications Panel */}
      {showNotifs && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setShowNotifs(false)}>
          <div className="flex-1 bg-black/30" />
          <div
            className="bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-blue-600 text-sm font-medium">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "flex gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      !n.isRead && "bg-blue-50 dark:bg-blue-900/10"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg",
                      n.type === "exam" ? "bg-blue-100 dark:bg-blue-900/30" :
                      n.type === "result" ? "bg-green-100 dark:bg-green-900/30" :
                      "bg-slate-100 dark:bg-slate-800"
                    )}>
                      {n.type === "exam" ? "📝" : n.type === "result" ? "✅" : "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold text-slate-800 dark:text-white", !n.isRead && "text-blue-700 dark:text-blue-300")}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
