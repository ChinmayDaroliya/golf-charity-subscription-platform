import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check admin (optional – you might allow users to see their own winners, but for admin we show all)
  const { data: adminCheck } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (!adminCheck?.is_admin) {
    // For non-admin, maybe show their own winners; but for MVP we just return empty or error.
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseServer
    .from("winners")
    .select(`
      id,
      matches,
      prize_amount,
      created_at,
      users (email),
      draws (numbers)
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const winners = data.map((w: any) => ({
    id: w.id,
    user_email: w.users.email,
    draw_numbers: w.draws.numbers,
    matches: w.matches,
    prize_amount: w.prize_amount,
    created_at: w.created_at,
  }));

  return NextResponse.json(winners);
}