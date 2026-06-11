import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ results: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id, session_id, exam_id, subject_id, exam_type,
      total_questions, correct_answers, incorrect_answers,
      skipped_questions, score, percentage, grade, passed,
      time_taken, question_results,
    } = body;

    if (!user_id || !total_questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("results")
      .insert({
        user_id, session_id, exam_id, subject_id, exam_type,
        total_questions, correct_answers, incorrect_answers,
        skipped_questions, score, percentage, grade, passed,
        time_taken, question_results,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update user_progress
    await updateUserProgress(user_id, { percentage, subject_id });

    return NextResponse.json({ result: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateUserProgress(userId: string, { percentage, subject_id }: { percentage: number; subject_id?: string }) {
  const { data: existing } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const newTotal = existing.total_exams_taken + 1;
    const newAvg = ((existing.average_score * existing.total_exams_taken) + percentage) / newTotal;

    await supabase.from("user_progress").update({
      total_exams_taken: newTotal,
      average_score: Math.round(newAvg * 100) / 100,
      overall_score: Math.round(newAvg * 100) / 100,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);
  } else {
    await supabase.from("user_progress").insert({
      user_id: userId,
      total_exams_taken: 1,
      average_score: percentage,
      overall_score: percentage,
    });
  }
}
