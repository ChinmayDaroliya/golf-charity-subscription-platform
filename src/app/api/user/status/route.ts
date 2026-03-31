import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from("users")
      .select(
        "id, is_subscribed, plan, charity_id, charity_percentage"
      )
      .eq("clerk_id", userId)
      .single();

    if (error) {
      // If user doesn't exist yet, return default values
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          id: null,
          is_subscribed: false,
          plan: null,
          charity_id: null,
          charity_percentage: null,
          charity_name: null,
        });
      }
      console.error("Error fetching user status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let charity_name = null;
    if (data?.charity_id) {
      const { data: charityData } = await supabaseServer
        .from("charities")
        .select("name")
        .eq("id", data.charity_id)
        .single();

      charity_name = charityData?.name || null;
    }

    const userData = {
      id: data.id,
      is_subscribed: data.is_subscribed,
      plan: data.plan,
      charity_id: data.charity_id,
      charity_percentage: data.charity_percentage,
      charity_name,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Unexpected error in user status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}