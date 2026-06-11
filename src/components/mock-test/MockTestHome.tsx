"use client";

import Link from "next/link";
import { Clock, FileQuestion, Award, AlertCircle, ChevronRight, Play } from "lucide-react";
import { EXAM_TYPES, SUBJECT_CATEGORIES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const examTypeColors = [
  "from-blue-600 to-blue-800",
  "from-purple-600 to-indigo-700",
  "from-rose-600 to-red-700",
];

const examTypeIcons = ["🎓", "🏫", "🌍"];

export default function MockTestHome() {
  return (
    <div className="px-4 pb-4">
      <div className="pt-4 mb-5">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Mock Tests</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Simulate real exam conditions
        </p>
      </div>

      {/* Exam Types */}
      <div className="space-y-3 mb-6">
        {EXAM_TYPES.map((exam, i) => (
          <div
            key={exam.id}
            className={cn(
              "relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br text-white shadow-lg",
              examTypeColors[i]
            )}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-6 -mt-6" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 -ml-4 -mb-4" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{examTypeIcons[i]}</span>
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {exam.questions} Questions
                  </span>
                </div>
                <h3 className="font-black text-lg leading-tight">{exam.name}</h3>
                <div className="flex items-center gap-4 mt-3 text-white/80 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{formatTime(exam.duration * 60)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion size={12} />
                    <span>{exam.questions} marks</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/quiz/general-knowledge?mode=mock&type=${exam.id}`}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 transition-all px-4 py-2.5 rounded-xl text-white text-sm font-bold"
              >
                <Play size={14} fill="white" />
                Start
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mb-5 flex gap-3">
        <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-700 dark:text-amber-300 text-sm font-semibold">Exam Mode Features</p>
          <ul className="text-amber-600 dark:text-amber-400 text-xs mt-1 space-y-0.5 list-disc list-inside">
            <li>Copy/paste disabled</li>
            <li>Right-click disabled</li>
            <li>Auto-save your answers</li>
            <li>Negative marking enabled</li>
          </ul>
        </div>
      </div>

      {/* Subject-based mock tests */}
      <div>
        <h2 className="font-bold text-slate-800 dark:text-white text-base mb-3">Subject Mock Tests</h2>
        <div className="space-y-2">
          {SUBJECT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/quiz/${cat.id}`}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors active:scale-99"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br", cat.gradient)}>
                📝
              </div>
              <div className="flex-1">
                <p className="text-slate-800 dark:text-white text-sm font-semibold">{cat.name}</p>
                <p className="text-slate-400 text-xs">25 Questions · 30 min</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Ready
                </span>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
