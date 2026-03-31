import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server"; // ✅ correct
import { NextResponse } from "next/server";

export async function GET() {
  // ✅ latest usage
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("users")
    .select("is_subscribed, plan")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}