"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  LayoutDashboard, Users, Building2, BookOpen, FileText,
  BarChart2, Bell, Settings, LogOut, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/universities", icon: Building2, label: "Universities" },
  { href: "/admin/questions", icon: BookOpen, label: "Questions" },
  { href: "/admin/exams", icon: FileText, label: "Exams" },
  { href: "/admin/reports", icon: BarChart2, label: "Reports" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-blue-700 dark:text-blue-400 text-sm">EXIT EXAM</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNav.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={() => { logout(); router.replace("/splash"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">{user?.fullName}</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
