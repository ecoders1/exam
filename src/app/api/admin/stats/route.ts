import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const [
      { count: totalUsers },
      { count: totalQuestions },
      { count: totalExams },
      { data: resultsData },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("questions").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("exams").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("results").select("percentage, passed").limit(1000),
    ]);

    const avgScore = resultsData?.length
      ? resultsData.reduce((a, r) => a + (r.percentage ?? 0), 0) / resultsData.length
      : 0;

    const passRate = resultsData?.length
      ? (resultsData.filter((r) => r.passed).length / resultsData.length) * 100
      : 0;

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalQuestions: totalQuestions ?? 0,
      totalExams: totalExams ?? 0,
      averageScore: Math.round(avgScore * 10) / 10,
      passRate: Math.round(passRate * 10) / 10,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
