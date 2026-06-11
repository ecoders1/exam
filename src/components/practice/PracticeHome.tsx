"use client";

import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { SUBJECT_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, string> = {
  BookOpen: "📚", Languages: "🔤", Calculator: "🔢", Monitor: "💻",
  TrendingUp: "📈", Heart: "❤️", Stethoscope: "🩺", Wrench: "🔧",
  Scale: "⚖️", DollarSign: "💰", Users: "👥", Leaf: "🌿",
  Activity: "📊", Cpu: "⚙️", GraduationCap: "🎓", Zap: "⚡",
  FlaskConical: "🧪", Dna: "🧬",
};

export default function PracticeHome() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");

  const filtered = SUBJECT_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pb-4">
      {/* Header */}
      <div className="pt-4 mb-4">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Practice</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Choose a subject to start practicing</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects..."
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">
          <Filter size={14} />
          <span className="text-xs font-medium">Filter:</span>
        </div>
        {["All", ...DIFFICULTY_LEVELS].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
              difficulty === d
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((cat) => (
          <Link
            key={cat.id}
            href={`/practice/${cat.id}`}
            className="card-hover bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-3"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-sm",
              cat.gradient
            )}>
              {iconMap[cat.icon] ?? "📚"}
            </div>
            <div>
              <p className="text-slate-800 dark:text-white text-sm font-bold leading-tight">{cat.name}</p>
              <p className="text-slate-400 text-xs mt-1">Tap to practice →</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No subjects found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
