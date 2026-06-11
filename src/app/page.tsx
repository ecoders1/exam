"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import SplashScreen from "@/components/splash/SplashScreen";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Short delay to show splash, then redirect
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/splash");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return <SplashScreen autoRedirect={false} />;
}
