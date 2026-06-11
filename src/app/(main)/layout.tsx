"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showAIHint, setShowAIHint] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/splash");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Show AI hint after 5 seconds on dashboard
    if (pathname === "/dashboard") {
      const t = setTimeout(() => setShowAIHint(true), 5000);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  if (!isAuthenticated) return null;

  const isAIPage = pathname === "/ai";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 max-w-screen-lg mx-auto">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-24 pt-2">
        {children}
      </main>
      <BottomNav />

      {/* Floating AI Button */}
      {!isAIPage && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
          {/* Hint bubble */}
          {showAIHint && (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-2xl px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
              <p className="text-slate-700 dark:text-slate-300 text-xs font-medium">Ask AI anything!</p>
              <button onClick={() => setShowAIHint(false)} className="text-slate-400 hover:text-slate-600">
                <X size={12} />
              </button>
            </div>
          )}
          <Link
            href="/ai"
            onClick={() => setShowAIHint(false)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={22} className="text-white" />
          </Link>
        </div>
      )}
    </div>
  );
}
