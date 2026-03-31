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
    .select(`
      id,
      matches,
      prize_amount,
      created_at,
      draws (numbers)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const wins = data.map((w: any) => ({
    id: w.id,
    draw_numbers: w.draws.numbers,
    matches: w.matches,
    prize_amount: w.prize_amount,
    created_at: w.created_at,
  }));

  return NextResponse.json(wins);
}