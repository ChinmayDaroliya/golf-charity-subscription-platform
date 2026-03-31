import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userError } = await supabaseServer
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data, error } = await supabaseServer
    .from("winners")
    .select("prize_amount")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = data.reduce((sum, w) => sum + w.prize_amount, 0);
  return NextResponse.json({ total });
}