"use client";

import {
  Users, BookOpen, FileText, TrendingUp, Upload, Bell,
  Plus, Download, BarChart2, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Users", value: "12,458", change: "+8.2%", icon: Users, color: "from-blue-500 to-blue-700", positive: true },
  { label: "Active Users", value: "3,842", change: "+12.5%", icon: Activity, color: "from-green-500 to-green-700", positive: true },
  { label: "Total Questions", value: "48,320", change: "+245", icon: BookOpen, color: "from-purple-500 to-purple-700", positive: true },
  { label: "Pass Rate", value: "68.4%", change: "+3.1%", icon: TrendingUp, color: "from-orange-500 to-orange-700", positive: true },
];

const recentUsers = [
  { name: "Abebe Kebede", dept: "Computer Science", university: "AAU", status: "active", date: "Jan 15" },
  { name: "Tigist Alemu", dept: "Medicine", university: "Jimma", status: "active", date: "Jan 14" },
  { name: "Yonas Bekele", dept: "Engineering", university: "Adama", status: "pending", date: "Jan 13" },
  { name: "Hana Girma", dept: "Accounting", university: "AAU", status: "active", date: "Jan 12" },
  { name: "Dawit Tesfaye", dept: "Law", university: "Bahir Dar", status: "inactive", date: "Jan 11" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Welcome back, Admin! 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here&apos;s what&apos;s happening with Exit Exam App.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</p>
                <p className={cn("text-sm font-semibold mt-1", stat.positive ? "text-green-600" : "text-red-500")}>
                  {stat.change}
                </p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Upload Questions", icon: Upload, color: "bg-blue-600" },
          { label: "Add Exam", icon: Plus, color: "bg-purple-600" },
          { label: "Send Notification", icon: Bell, color: "bg-orange-600" },
          { label: "Generate Report", icon: Download, color: "bg-green-600" },
        ].map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-white font-semibold text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all",
              color
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Upload section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-blue-600" />
          Upload Content
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {["PDF", "DOCX", "PPTX", "XLSX", "Images"].map((format) => (
            <button
              key={format}
              className="h-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <span className="text-xl">
                {format === "PDF" ? "📄" : format === "DOCX" ? "📝" : format === "PPTX" ? "📊" : format === "XLSX" ? "📈" : "🖼️"}
              </span>
              <span className="text-xs font-semibold">{format}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent users table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            Recent Users
          </h3>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">University</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-slate-800 dark:text-white text-sm font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-sm">{u.dept}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-sm">{u.university}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full",
                      u.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : u.status === "pending" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    )}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm">{u.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
