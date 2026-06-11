"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Bookmark, Flag, Clock, CheckCircle2, X
} from "lucide-react";
import { SAMPLE_QUESTIONS, SUBJECT_CATEGORIES } from "@/lib/constants";
import { useProgressStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/types";

interface QuizInterfaceProps {
  subjectId: string;
  timeLimit?: number; // seconds, default 30min
}

type QuizState = "ready" | "active" | "review" | "finished";

export default function QuizInterface({ subjectId, timeLimit = 1800 }: QuizInterfaceProps) {
  const router = useRouter();
  const { bookmarkedQuestions, toggleBookmark } = useProgressStore();
  const [state, setState] = useState<QuizState>("ready");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions: Question[] = SAMPLE_QUESTIONS.filter((q) => q.subject === subjectId).length > 0
    ? SAMPLE_QUESTIONS.filter((q) => q.subject === subjectId)
    : SAMPLE_QUESTIONS; // Fallback to all questions for demo

  const currentQ = questions[currentIndex];
  const subject = SUBJECT_CATEGORIES.find((c) => c.id === subjectId);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Anti-cheating: disable context menu
  useEffect(() => {
    if (state !== "active") return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
    };
  }, [state]);

  // Timer
  useEffect(() => {
    if (state !== "active") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const selectAnswer = (optionIndex: number) => {
    if (!currentQ) return;
    setSelectedOption(optionIndex);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
    setTimeout(() => setShowExplanation(true), 300);
  };

  const nextQuestion = useCallback(() => {
    setShowExplanation(false);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextAns = answers[questions[currentIndex + 1].id];
      setSelectedOption(nextAns !== undefined ? nextAns : null);
    } else {
      setState("finished");
    }
  }, [currentIndex, questions, answers]);

  const prevQuestion = () => {
    setShowExplanation(false);
    if (currentIndex > 0) {
      const newIdx = currentIndex - 1;
      setCurrentIndex(newIdx);
      const prevAns = answers[questions[newIdx].id];
      setSelectedOption(prevAns !== undefined ? prevAns : null);
    }
  };

  const toggleMarkForReview = () => {
    if (!currentQ) return;
    setMarkedForReview((prev) =>
      prev.includes(currentQ.id) ? prev.filter((id) => id !== currentQ.id) : [...prev, currentQ.id]
    );
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0, incorrect = 0, skipped = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === null || ans === undefined) skipped++;
      else if (ans === q.correctAnswer) correct++;
      else incorrect++;
    });
    const percentage = Math.round((correct / questions.length) * 100);
    return { correct, incorrect, skipped, percentage, total: questions.length };
  };

  // READY STATE
  if (state === "ready") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className={cn("bg-gradient-to-br p-5 pb-10", subject?.gradient ?? "from-blue-600 to-blue-800")}>
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white text-2xl font-black">{subject?.name ?? "Quiz"}</h1>
          <p className="text-white/70 text-sm mt-1">Practice Session</p>
        </div>

        <div className="px-4 -mt-4 flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">{questions.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Questions</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                <p className="text-xl font-black text-purple-600 dark:text-purple-400">{formatTime(timeLimit)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Time Limit</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                <p className="text-xl font-black text-green-600 dark:text-green-400">50%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pass Mark</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Each correct answer earns 1 mark</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> You can mark questions for review</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Instant feedback after each answer</p>
              <p className="flex items-center gap-2"><Flag size={14} className="text-yellow-500" /> Copy/paste disabled in exam mode</p>
            </div>

            <button
              onClick={() => { setState("active"); setCurrentIndex(0); setSelectedOption(null); }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-base shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FINISHED STATE
  if (state === "finished") {
    const { correct, incorrect, skipped, percentage, total } = calculateResults();
    const passed = percentage >= 50;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm space-y-4 animate-scale-in">
          {/* Score circle */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl",
              passed ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"
            )}>
              <span className="text-white text-3xl font-black">{percentage}%</span>
              <span className="text-white/80 text-xs font-medium mt-0.5">{passed ? "PASSED ✓" : "FAILED ✗"}</span>
            </div>
          </div>

          {/* Result stats */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{correct}</p>
              <p className="text-xs text-slate-500 mt-0.5">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-500">{incorrect}</p>
              <p className="text-xs text-slate-500 mt-0.5">Incorrect</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-400">{skipped}</p>
              <p className="text-xs text-slate-500 mt-0.5">Skipped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600">{total}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total</p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => setState("review")}
            className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold active:scale-95 transition-transform"
          >
            Review Answers
          </button>
          <button
            onClick={() => {
              setAnswers({});
              setMarkedForReview([]);
              setCurrentIndex(0);
              setSelectedOption(null);
              setShowExplanation(false);
              setTimeLeft(timeLimit);
              setState("active");
            }}
            className="w-full h-12 rounded-xl border border-blue-600 text-blue-600 dark:text-blue-400 font-semibold active:scale-95 transition-transform"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold active:scale-95 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // REVIEW STATE
  if (state === "review") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setState("finished")} className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold text-slate-800 dark:text-white text-lg">Review Answers</h1>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const wasAnswered = userAns !== null && userAns !== undefined;
            return (
              <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    !wasAnswered ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    : isCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600"
                  )}>
                    {!wasAnswered ? "-" : isCorrect ? "✓" : "✗"}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{i + 1}. {q.question}</p>
                    {wasAnswered && !isCorrect && (
                      <p className="text-xs text-red-500 mt-1">
                        Your answer: {q.options[userAns as number]} | Correct: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    {isCorrect && (
                      <p className="text-xs text-green-600 mt-1">Correct: {q.options[q.correctAnswer]}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 italic">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ STATE
  if (!currentQ) return null;

  const isMarked = markedForReview.includes(currentQ.id);
  const isBookmarked = bookmarkedQuestions.includes(currentQ.id);
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="exam-mode min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Quiz header */}
      <div className="bg-white dark:bg-slate-900 px-4 pt-4 pb-3 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (confirm("Exit quiz? Your progress will be lost.")) router.back();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
            <Clock size={14} className={cn("text-blue-600 dark:text-blue-400", timeLeft <= 60 && "text-red-500 animate-pulse")} />
            <span className={cn("text-sm font-bold text-blue-600 dark:text-blue-400", timeLeft <= 60 && "text-red-500")}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMarkForReview} className={cn("transition-colors", isMarked ? "text-yellow-500" : "text-slate-300 dark:text-slate-600")}>
              <Flag size={18} fill={isMarked ? "currentColor" : "none"} />
            </button>
            <button onClick={() => toggleBookmark(currentQ.id)} className={cn("transition-colors", isBookmarked ? "text-blue-600" : "text-slate-300 dark:text-slate-600")}>
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs text-slate-400">
            {Object.keys(answers).filter((k) => answers[k] !== null && answers[k] !== undefined).length} answered
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-4 pt-5 pb-4 overflow-y-auto">
        {/* Difficulty badge */}
        <span className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block",
          currentQ.difficulty === "Easy" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : currentQ.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        )}>
          {currentQ.difficulty} · {currentQ.topic}
        </span>

        {/* Question text */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4">
          <p className="text-slate-800 dark:text-white font-semibold text-base leading-relaxed">
            {currentIndex + 1}. {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx || currentAnswer === idx;
            const isCorrect = idx === currentQ.correctAnswer;
            const showResult = showExplanation && (isSelected || isCorrect);

            let optionStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
            if (showExplanation) {
              if (isCorrect) optionStyle = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
              else if (isSelected && !isCorrect) optionStyle = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
            } else if (isSelected) {
              optionStyle = "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400";
            }

            const letter = ["A", "B", "C", "D"][idx];

            return (
              <button
                key={idx}
                onClick={() => !showExplanation && selectAnswer(idx)}
                disabled={showExplanation}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all active:scale-99",
                  optionStyle
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors",
                  showExplanation && isCorrect ? "bg-green-500 text-white"
                  : showExplanation && isSelected && !isCorrect ? "bg-red-500 text-white"
                  : isSelected ? "bg-blue-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                )}>
                  {letter}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 mb-4 animate-fade-in">
            <p className="text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">💡 Explanation</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-sm disabled:opacity-40 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={16} /> Prev
        </button>

        {/* Question dots */}
        <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto">
          {questions.slice(Math.max(0, currentIndex - 3), currentIndex + 4).map((q, i) => {
            const realIdx = Math.max(0, currentIndex - 3) + i;
            const ans = answers[q.id];
            const isAnswered = ans !== null && ans !== undefined;
            const isCurrent = realIdx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => { setCurrentIndex(realIdx); setSelectedOption(answers[q.id] ?? null); setShowExplanation(false); }}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-all",
                  isCurrent ? "bg-blue-600 text-white scale-110"
                  : isAnswered ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                  : markedForReview.includes(q.id) ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}
              >
                {realIdx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={nextQuestion}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm transition-colors hover:bg-blue-700 active:scale-95"
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
