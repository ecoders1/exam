import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: "Email/phone and password required" }, { status: 400 });
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    let email = identifier;

    // If phone, look up email from profiles
    if (!isEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("phone", identifier)
        .single();

      if (!profile?.email) {
        return NextResponse.json({ error: "No account found with this phone number" }, { status: 404 });
      }
      email = profile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Fetch full profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    // Update last_login
    await supabase.from("profiles").update({ last_login: new Date().toISOString() }).eq("id", data.user.id);

    return NextResponse.json({
      user: profile,
      session: data.session,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
