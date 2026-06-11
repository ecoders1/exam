"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/splash");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 max-w-screen-lg mx-auto">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-24 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
