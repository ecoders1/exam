"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, Bookmark, Clock } from "lucide-react";
import { SUBJECT_CATEGORIES, SAMPLE_QUESTIONS, DIFFICULTY_LEVELS } from "@/lib/constants";
import { useProgressStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface SubjectPracticeProps {
  subjectId: string;
}

export default function SubjectPractice({ subjectId }: SubjectPracticeProps) {
  const router = useRouter();
  const { bookmarkedQuestions, toggleBookmark } = useProgressStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [activeTab, setActiveTab] = useState<"topics" | "questions">("questions");

  const subject = SUBJECT_CATEGORIES.find((c) => c.id === subjectId);
  const questions = SAMPLE_QUESTIONS.filter(
    (q) =>
      q.subject === subjectId &&
      (selectedDifficulty === "All" || q.difficulty === selectedDifficulty)
  );

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-6xl mb-4">📚</p>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Subject Not Found</h2>
        <Link href="/practice" className="mt-4 text-blue-600 dark:text-blue-400 font-semibold">
          ← Back to Practice
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Subject header */}
      <div className={cn("bg-gradient-to-br p-5 pb-8", subject.gradient)}>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-white/80 text-sm font-medium">Practice</span>
        </div>
        <h1 className="text-white text-2xl font-black">{subject.name}</h1>
        <p className="text-white/70 text-sm mt-1">
          {SAMPLE_QUESTIONS.filter((q) => q.subject === subjectId).length} questions available
        </p>
      </div>

      <div className="px-4 -mt-4">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => {
            const count = SAMPLE_QUESTIONS.filter((q) => q.subject === subjectId && q.difficulty === d).length;
            return (
              <div key={d} className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-lg font-black text-slate-800 dark:text-white">{count}</p>
                <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded-md", difficultyColors[d])}>
                  {d}
                </span>
              </div>
            );
          })}
        </div>

        {/* Start Practice button */}
        <Link
          href={`/quiz/${subjectId}`}
          className="flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl px-5 py-4 shadow-lg mb-4 active:scale-95 transition-transform"
        >
          <div>
            <p className="font-bold">Start Practice Session</p>
            <p className="text-blue-200 text-xs mt-0.5">Timed • Instant feedback</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
        </Link>

        {/* Difficulty filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["All", ...DIFFICULTY_LEVELS].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d as Difficulty | "All")}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all",
                selectedDifficulty === d
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Questions list */}
        <div className="space-y-3 pb-4">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No questions for this filter</p>
              <p className="text-slate-400 text-sm mt-1">Try selecting a different difficulty</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-white text-sm font-medium line-clamp-2">{q.question}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", difficultyColors[q.difficulty])}>
                        {q.difficulty}
                      </span>
                      <span className="text-slate-400 text-xs">{q.topic}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={cn(
                        "transition-colors",
                        bookmarkedQuestions.includes(q.id)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-300 dark:text-slate-600"
                      )}
                    >
                      <Bookmark size={16} fill={bookmarkedQuestions.includes(q.id) ? "currentColor" : "none"} />
                    </button>
                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Placeholder for more questions */}
          {questions.length > 0 && (
            <div className="text-center py-4">
              <p className="text-slate-400 text-sm">Showing {questions.length} questions</p>
              <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">
                Connect to backend to load all questions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
