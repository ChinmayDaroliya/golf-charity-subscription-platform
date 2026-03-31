import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error: userError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabaseServer
      .from("winners")
      .select(`
        id,
        matches,
        prize_amount,
        created_at,
        draws:draws (
          numbers
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user wins:", error);
      return NextResponse.json([]);
    }

    const wins = (data || []).map((w: any) => ({
      id: w.id,
      draw_numbers: w.draws?.numbers || [],
      matches: w.matches,
      prize_amount: w.prize_amount,
      created_at: w.created_at,
    }));

    return NextResponse.json(wins);
  } catch (error) {
    console.error("Unexpected error in user wins:", error);
    return NextResponse.json([]);
  }
}