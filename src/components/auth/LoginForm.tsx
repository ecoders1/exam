"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import type { User } from "@/lib/types";

export default function LoginForm() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Simulate authentication
    await new Promise((r) => setTimeout(r, 1500));
    if (form.identifier && form.password.length >= 6) {
      const mockUser: User = {
        id: "user-1",
        fullName: "Abebe Kebede",
        email: form.identifier.includes("@") ? form.identifier : "abebe@example.com",
        phone: form.identifier.includes("@") ? "+251912345678" : form.identifier,
        university: "Addis Ababa University",
        department: "Computer Science",
        role: "student",
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      router.replace("/dashboard");
    } else {
      setError("Invalid credentials. Please check your email/phone and password.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 safe-top">
        <Link
          href="/splash"
          className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="text-white font-semibold">Back</span>
      </div>

      {/* Top brand section */}
      <div className="flex flex-col items-center px-8 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4 border border-white/20">
          <GraduationCap size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white">Welcome Back!</h1>
        <p className="text-blue-200 mt-1">Sign in to continue learning</p>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-8 pb-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Login</h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email or Phone Number
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                placeholder="email@example.com or +251..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-slate-400 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Sign up link */}
        <p className="text-center text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Demo hint */}
        <p className="text-center text-slate-400 text-xs mt-4">
          Demo: Use any email + password (min 6 chars)
        </p>
      </div>
    </div>
  );
}
