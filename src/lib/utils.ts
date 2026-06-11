import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 45) return "D";
  return "F";
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 70) return "text-green-500";
  if (percentage >= 50) return "text-yellow-500";
  return "text-red-500";
}
