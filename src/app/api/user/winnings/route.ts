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
      // Return empty winnings instead of error
      return NextResponse.json({ total: 0 });
    }

    const { data, error } = await supabaseServer
      .from("winners")
      .select("prize_amount")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching winnings:", error);
      return NextResponse.json({ total: 0 });
    }

    const total = data?.reduce((sum, w) => sum + (w.prize_amount || 0), 0) || 0;
    return NextResponse.json({ total });
  } catch (error) {
    console.error("Unexpected error in winnings:", error);
    return NextResponse.json({ total: 0 });
  }
}