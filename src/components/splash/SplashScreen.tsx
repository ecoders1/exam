"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

interface SplashScreenProps {
  autoRedirect?: boolean;
}

export default function SplashScreen({ autoRedirect = true }: SplashScreenProps) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 300);
    const t2 = setTimeout(() => setShowButtons(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 animate-pulse" />
        <div
          className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-white/5"
          style={{ animation: "pulse 3s ease-in-out 0.5s infinite" }}
        />
        <div
          className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/5"
          style={{ animation: "pulse 4s ease-in-out 1s infinite" }}
        />
        {/* Stars/dots pattern */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Top spacer */}
      <div className="flex-1" />

      {/* Main content */}
      <div
        className={`flex flex-col items-center px-8 transition-all duration-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="w-36 h-36 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20">
            <div className="relative">
              {/* Graduation cap SVG */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Board/cap base */}
                <path d="M40 8L72 24L40 40L8 24L40 8Z" fill="white" opacity="0.95" />
                {/* Cap strings */}
                <path d="M40 40V60" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                {/* Left side of hat */}
                <path d="M20 30V50C20 50 28 58 40 58C52 58 60 50 60 50V30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.2" opacity="0.9" />
                {/* Tassel */}
                <circle cx="70" cy="24" r="3" fill="#fbbf24" />
                <path d="M70 27V40" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <path d="M67 40L70 44L73 40" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#fbbf24" />
                {/* Books below */}
                <rect x="16" y="60" width="48" height="8" rx="2" fill="white" opacity="0.7" />
                <rect x="20" y="62" width="40" height="4" rx="1" fill="#3b82f6" opacity="0.5" />
                <rect x="18" y="57" width="20" height="6" rx="1.5" fill="white" opacity="0.6" />
                <rect x="42" y="57" width="18" height="6" rx="1.5" fill="#fbbf24" opacity="0.7" />
              </svg>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-125" />
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-black text-white tracking-wide text-center drop-shadow-lg mb-2">
          {APP_NAME}
        </h1>

        {/* Tagline */}
        <p className="text-blue-100 text-lg font-medium tracking-widest text-center mb-2">
          {APP_TAGLINE}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="w-12 h-px bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/60" />
          <div className="w-12 h-px bg-white/30" />
        </div>

        <p className="text-blue-200 text-sm text-center max-w-xs">
          Ethiopia&apos;s most comprehensive university exit exam preparation platform
        </p>
      </div>

      <div className="flex-1" />

      {/* Action Buttons */}
      <div
        className={`w-full max-w-sm px-8 pb-12 space-y-3 transition-all duration-700 ${
          showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Link
          href="/auth/login"
          className="flex items-center justify-center w-full h-14 rounded-2xl bg-white text-blue-700 font-bold text-base shadow-lg hover:bg-blue-50 active:scale-95 transition-all duration-200"
        >
          Login
        </Link>

        <Link
          href="/auth/signup"
          className="flex items-center justify-center w-full h-14 rounded-2xl bg-white/15 backdrop-blur-sm text-white font-bold text-base border border-white/30 hover:bg-white/25 active:scale-95 transition-all duration-200"
        >
          Sign Up
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center justify-center w-full h-12 rounded-2xl text-blue-100 font-medium text-sm hover:text-white transition-colors duration-200"
        >
          Continue as Guest →
        </Link>
      </div>

      {/* Bottom indicator */}
      <div className="pb-6 flex gap-1.5">
        <div className="w-6 h-1.5 rounded-full bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
