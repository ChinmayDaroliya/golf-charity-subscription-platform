import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabaseServer
      .from("users")
      .select("is_admin")
      .eq("clerk_id", userId)
      .single();

    if (adminError || !adminCheck?.is_admin) {
      // For non-admin, return their own winners only
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
        console.error("Error fetching user winners:", error);
        return NextResponse.json([]);
      }

      const winners = (data || []).map((w: any) => ({
        id: w.id,
        user_email: "You", // Hide email for privacy
        draw_numbers: w.draws?.numbers || [],
        matches: w.matches,
        prize_amount: w.prize_amount,
        created_at: w.created_at,
      }));

      return NextResponse.json(winners);
    }

    // Admin view - get all winners with user emails
    const { data, error } = await supabaseServer
      .from("winners")
      .select(`
        id,
        matches,
        prize_amount,
        created_at,
        users:users (
          email
        ),
        draws:draws (
          numbers
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all winners:", error);
      return NextResponse.json([]);
    }

    const winners = (data || []).map((w: any) => ({
      id: w.id,
      user_email: w.users?.email || "Unknown",
      draw_numbers: w.draws?.numbers || [],
      matches: w.matches,
      prize_amount: w.prize_amount,
      created_at: w.created_at,
    }));

    return NextResponse.json(winners);
  } catch (error) {
    console.error("Unexpected error in winners:", error);
    return NextResponse.json([]);
  }
}