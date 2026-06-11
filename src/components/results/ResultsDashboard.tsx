"use client";

import { useState } from "react";
import { TrendingUp, Award, BarChart2, Calendar, Target, Download } from "lucide-react";
import { useProgressStore } from "@/lib/store";
import { cn, getGrade, getGradeColor } from "@/lib/utils";

type Tab = "overview" | "weekly" | "monthly" | "subjects";

export default function ResultsDashboard() {
  const { progress } = useProgressStore();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 size={14} /> },
    { id: "weekly", label: "Weekly", icon: <Calendar size={14} /> },
    { id: "monthly", label: "Monthly", icon: <TrendingUp size={14} /> },
    { id: "subjects", label: "Subjects", icon: <Target size={14} /> },
  ];

  const overall = progress?.overallScore ?? 76;
  const grade = getGrade(overall);
  const gradeColor = getGradeColor(overall);

  return (
    <div className="px-4 pb-4">
      <div className="pt-4 mb-5">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Results & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track your performance</p>
      </div>

      {/* Main score card */}
      <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-5 mb-5 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-8 -mt-8" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">Overall Score</p>
            <p className="text-white text-5xl font-black mt-1">{overall}%</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn("text-2xl font-black", gradeColor.replace("text-", "text-"))} style={{ color: "white" }}>
                Grade: {grade}
              </span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
            <Award size={36} className="text-yellow-300" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/15 rounded-xl p-2">
            <p className="text-white font-black text-lg">{progress?.totalExamsTaken ?? 18}</p>
            <p className="text-blue-200 text-xs">Exams</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2">
            <p className="text-white font-black text-lg">{progress?.totalQuestionsAnswered ?? 370}</p>
            <p className="text-blue-200 text-xs">Questions</p>
          </div>
          <div className="bg-white/15 rounded-xl p-2">
            <p className="text-white font-black text-lg">#{progress?.rank ?? 42}</p>
            <p className="text-blue-200 text-xs">Rank</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all",
              activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4 animate-fade-in">
          {/* Pass/Fail status */}
          <div className={cn(
            "rounded-xl p-4 flex items-center gap-3",
            overall >= 50 ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
              overall >= 50 ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40"
            )}>
              {overall >= 50 ? "✅" : "❌"}
            </div>
            <div>
              <p className={cn("font-bold text-base", overall >= 50 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
                {overall >= 50 ? "Passing Score" : "Below Pass Mark"}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                {overall >= 50 ? "You're on track! Keep practicing." : "Need 50% to pass. Keep studying!"}
              </p>
            </div>
          </div>

          {/* Recent exam history */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Recent Exams</h3>
            <div className="space-y-2">
              {[
                { name: "Computer Science Mock", score: 78, date: "Jan 15", passed: true },
                { name: "Mathematics Practice", score: 65, date: "Jan 13", passed: true },
                { name: "English Grammar Test", score: 90, date: "Jan 10", passed: true },
                { name: "Economics Mock", score: 45, date: "Jan 8", passed: false },
              ].map((exam, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-3.5 flex items-center gap-3 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                    exam.passed ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                  )}>
                    {exam.score}%
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 dark:text-white text-sm font-semibold">{exam.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{exam.date}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    exam.passed ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  )}>
                    {exam.passed ? "Pass" : "Fail"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "weekly" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">This Week&apos;s Performance</h3>
          {/* Simple bar chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-end gap-2 h-32">
              {(progress?.weeklyData ?? []).map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative flex items-end justify-center" style={{ height: "100px" }}>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700"
                      style={{ height: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{d.week}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{d.score}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(progress?.weeklyData ?? []).map((d, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{d.week}</p>
                <p className="text-slate-800 dark:text-white font-black text-lg">{d.score}%</p>
                <p className="text-slate-400 text-xs">{d.questionsAnswered} questions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "monthly" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Monthly Progress</h3>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-end gap-4 h-40">
              {(progress?.monthlyData ?? []).map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{d.score}%</span>
                  <div className="w-full relative flex items-end justify-center" style={{ height: "100px" }}>
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-purple-400 transition-all duration-700"
                      style={{ height: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{d.month}</span>
                  <span className="text-xs text-slate-400">{d.examsCompleted} exams</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="space-y-3 animate-fade-in">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Subject Performance</h3>
          {Object.values(progress?.subjectProgress ?? {}).map((sp) => (
            <div key={sp.subject} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-800 dark:text-white text-sm font-semibold">{sp.subject}</p>
                <span className={cn("text-sm font-black", getGradeColor(sp.accuracy))}>
                  {sp.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className={cn(
                    "h-full rounded-full",
                    sp.accuracy >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-400"
                    : sp.accuracy >= 50 ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                    : "bg-gradient-to-r from-red-500 to-rose-400"
                  )}
                  style={{ width: `${sp.accuracy}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{sp.correctAnswers}/{sp.totalQuestions} correct</span>
                <span>Grade: {getGrade(sp.accuracy)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download button */}
      <button className="w-full mt-4 h-12 rounded-xl border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors active:scale-95">
        <Download size={16} />
        Download Report
      </button>
    </div>
  );
}
