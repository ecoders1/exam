"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User, Building2, BookOpen, ArrowLeft, GraduationCap } from "lucide-react";
import { ETHIOPIAN_UNIVERSITIES, DEPARTMENTS } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";
import type { User as UserType } from "@/lib/types";

type Step = "form" | "otp";

export default function SignUpForm() {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const [step, setStep] = useState<Step>("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "+251",
    university: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email required";
    if (!form.phone.match(/^\+251\d{9}$/)) newErrors.phone = "Valid Ethiopian phone required (+251XXXXXXXXX)";
    if (!form.university) newErrors.university = "Please select your university";
    if (!form.department) newErrors.department = "Please select your department";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const mockUser: UserType = {
      id: "user-new",
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      university: form.university,
      department: form.department,
      role: "student",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    router.replace("/dashboard");
    setIsLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
        <div className="flex items-center gap-3 p-6 safe-top">
          <button
            onClick={() => setStep("form")}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-white font-semibold">Verify OTP</span>
        </div>

        <div className="flex flex-col items-center px-8 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4 border border-white/20">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Check Your Email</h1>
          <p className="text-blue-200 mt-1 text-center">
            We sent a 6-digit code to <br />
            <span className="text-white font-semibold">{form.email}</span>
          </p>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-8 pb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Enter OTP</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Enter the 6-digit verification code
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex gap-2 justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length < 6}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </button>

            <p className="text-center text-slate-500 text-sm">
              Didn&apos;t receive code?{" "}
              <button type="button" className="text-blue-600 font-semibold">
                Resend
              </button>
            </p>

            <p className="text-center text-slate-400 text-xs">
              Demo: Enter any 6 digits to proceed
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      <div className="flex items-center gap-3 p-6 safe-top">
        <Link
          href="/splash"
          className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="text-white font-semibold">Create Account</span>
      </div>

      <div className="flex flex-col items-center px-8 pb-6">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-3 border border-white/20">
          <GraduationCap size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-white">Join Exit Exam App</h1>
        <p className="text-blue-200 mt-1">Start your exam preparation journey</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-t-3xl px-6 pt-6 pb-8 shadow-2xl overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5">Personal Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Abebe Kebede"
                className={`${inputClass} pl-9`}
                required
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="abebe@example.com"
                className={`${inputClass} pl-9`}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+251912345678"
                className={`${inputClass} pl-9`}
                required
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">University</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className={`${inputClass} pl-9 appearance-none`}
                required
              >
                <option value="">Select University</option>
                {ETHIOPIAN_UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department</label>
            <div className="relative">
              <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={`${inputClass} pl-9 appearance-none`}
                required
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className={`${inputClass} pl-9 pr-10`}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                className={`${inputClass} pl-9 pr-10`}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
