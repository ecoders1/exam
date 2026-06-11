"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ClipboardList, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/practice", icon: BookOpen, label: "Practice" },
  { href: "/mock-test", icon: ClipboardList, label: "Mock Test" },
  { href: "/results", icon: BarChart2, label: "Results" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-screen-lg mx-auto">
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/40"
                    : "bg-transparent"
                )}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all",
                  isActive ? "font-bold" : ""
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
