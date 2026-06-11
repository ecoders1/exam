import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ notifications: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, userId, markAll } = await req.json();

    if (markAll && userId) {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
      return NextResponse.json({ message: "All marked as read" });
    }

    if (id) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      return NextResponse.json({ message: "Marked as read" });
    }

    return NextResponse.json({ error: "Missing id or userId" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
