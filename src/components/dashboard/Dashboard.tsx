"use client";

import Link from "next/link";
import { BookOpen, TrendingUp, Star, Clock, ArrowRight, Flame, Target } from "lucide-react";
import { useAuthStore, useProgressStore } from "@/lib/store";
import { SUBJECT_CATEGORIES, SAMPLE_ANNOUNCEMENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, string> = {
  BookOpen: "📚", Languages: "🔤", Calculator: "🔢", Monitor: "💻",
  TrendingUp: "📈", Heart: "❤️", Stethoscope: "🩺", Wrench: "🔧",
  Scale: "⚖️", DollarSign: "💰", Users: "👥", Leaf: "🌿",
  Activity: "📊", Cpu: "⚙️", GraduationCap: "🎓", Zap: "⚡",
  FlaskConical: "🧪", Dna: "🧬",
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { progress } = useProgressStore();

  const readinessScore = progress?.overallScore ?? 76;
  const streak = progress?.streak ?? 5;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-4 space-y-6 pb-4">
      {/* Hero / Welcome */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-5 shadow-lg mt-4">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -ml-6 -mb-6" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">{getGreeting()},</p>
          <h1 className="text-white text-2xl font-black mt-0.5 truncate">
            {user?.fullName ?? "Guest"} 👋
          </h1>
          <p className="text-blue-100 text-xs mt-1 truncate">
            {user?.department} • {user?.university}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <Flame size={14} className="text-orange-300" />
              <span className="text-white text-xs font-semibold">{streak} day streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <Star size={14} className="text-yellow-300" />
              <span className="text-white text-xs font-semibold">Rank #{progress?.rank ?? 42}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Readiness</span>
            <Target size={16} className="text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{readinessScore}%</div>
          <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-1">Exam Ready</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Questions</span>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white">
            {progress?.totalQuestionsAnswered ?? 370}
          </div>
          <p className="text-green-500 text-xs font-medium mt-1">+28 this week</p>
          <p className="text-slate-400 text-xs">Answered</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Exams Taken</span>
            <BookOpen size={16} className="text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white">
            {progress?.totalExamsTaken ?? 18}
          </div>
          <p className="text-purple-500 text-xs font-medium mt-1">+3 this month</p>
          <p className="text-slate-400 text-xs">Mock Tests</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Avg Score</span>
            <Star size={16} className="text-yellow-500" />
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-white">
            {progress?.averageScore ?? 76}%
          </div>
          <p className="text-yellow-500 text-xs font-medium mt-1">Above average</p>
          <p className="text-slate-400 text-xs">Performance</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/practice"
          className="flex items-center gap-3 bg-blue-600 text-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Practice</p>
            <p className="text-blue-200 text-xs">By subject</p>
          </div>
          <ArrowRight size={16} className="ml-auto" />
        </Link>

        <Link
          href="/mock-test"
          className="flex items-center gap-3 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Mock Test</p>
            <p className="text-purple-200 text-xs">Simulate exam</p>
          </div>
          <ArrowRight size={16} className="ml-auto" />
        </Link>
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800 dark:text-white text-base">Announcements</h2>
          <button className="text-blue-600 dark:text-blue-400 text-xs font-medium">See all</button>
        </div>
        <div className="space-y-2">
          {SAMPLE_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className={cn(
                "bg-white dark:bg-slate-900 rounded-xl p-3.5 border-l-4 shadow-sm",
                ann.priority === "high"
                  ? "border-red-500"
                  : ann.priority === "medium"
                  ? "border-blue-500"
                  : "border-slate-300 dark:border-slate-700"
              )}
            >
              <p className="text-slate-800 dark:text-white text-sm font-semibold">{ann.title}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-2">{ann.content}</p>
              <p className="text-slate-400 text-xs mt-1">{ann.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800 dark:text-white text-base">Browse Subjects</h2>
          <Link href="/practice" className="text-blue-600 dark:text-blue-400 text-xs font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUBJECT_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/practice/${cat.id}`}
              className="card-hover bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-start gap-2"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br", cat.gradient, "bg-opacity-10")}>
                {iconMap[cat.icon] ?? "📚"}
              </div>
              <div>
                <p className="text-slate-800 dark:text-white text-xs font-semibold leading-tight">{cat.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">Practice now →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Progress by Subject */}
      <div>
        <h2 className="font-bold text-slate-800 dark:text-white text-base mb-3">Subject Progress</h2>
        <div className="space-y-3">
          {Object.values(progress?.subjectProgress ?? {}).map((sp) => (
            <div key={sp.subject} className="bg-white dark:bg-slate-900 rounded-xl p-3.5 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-800 dark:text-white text-sm font-semibold">{sp.subject}</span>
                <span className={cn(
                  "text-xs font-bold",
                  sp.accuracy >= 70 ? "text-green-500" : sp.accuracy >= 50 ? "text-yellow-500" : "text-red-500"
                )}>
                  {sp.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    sp.accuracy >= 70
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : sp.accuracy >= 50
                      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-rose-400"
                  )}
                  style={{ width: `${sp.accuracy}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
                <span>{sp.correctAnswers}/{sp.totalQuestions} correct</span>
                <span>Last: {new Date(sp.lastPracticed).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
