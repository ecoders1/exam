import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("questions")
      .select(`
        id, topic, chapter, difficulty, question, options, correct_answer, explanation,
        subjects!inner(id, slug, name)
      `)
      .eq("is_active", true)
      .range(offset, offset + limit - 1);

    if (subject) query = query.eq("subjects.slug", subject);
    if (difficulty) query = query.eq("difficulty", difficulty);
    if (topic) query = query.ilike("topic", `%${topic}%`);

    const { data, error, count } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ questions: data, total: count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject_id, topic, chapter, difficulty, question, options, correct_answer, explanation } = body;

    if (!subject_id || !question || !options || correct_answer === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({ subject_id, topic, chapter, difficulty, question, options, correct_answer, explanation })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ question: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
