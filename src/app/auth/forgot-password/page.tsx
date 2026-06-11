"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, GraduationCap } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      <div className="flex items-center gap-3 p-6 safe-top">
        <Link href="/auth/login" className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-white font-semibold">Forgot Password</span>
      </div>

      <div className="flex flex-col items-center px-8 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4 border border-white/20">
          <GraduationCap size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white">Reset Password</h1>
        <p className="text-blue-200 mt-1 text-center text-sm">Enter your email to receive a reset link</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-8 pb-8 shadow-2xl">
        {sent ? (
          <div className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Email Sent!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center mt-2 max-w-xs">
              We sent a password reset link to <strong>{email}</strong>. Check your inbox.
            </p>
            <Link href="/auth/login" className="mt-6 h-12 px-8 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-colors">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                ) : "Send Reset Link"}
              </button>
            </form>
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-5">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
