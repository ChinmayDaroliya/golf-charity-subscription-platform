import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin
    const { data: adminCheck, error: adminError } = await supabaseServer
      .from("users")
      .select("is_admin")
      .eq("clerk_id", userId)
      .single();

    if (adminError || !adminCheck?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("users")
      .select("id, email, is_subscribed, plan, charity_id, charity_percentage")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unique charity IDs
    const charityIds = [...new Set((data || []).map(u => u.charity_id).filter(Boolean))];

    // Fetch charities
    const { data: charities } = await supabaseServer
      .from("charities")
      .select("id, name")
      .in("id", charityIds);

    const charityMap = new Map(charities?.map(c => [c.id, c.name]) || []);

    // Transform to include charity name
    const users = (data || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      is_subscribed: user.is_subscribed,
      plan: user.plan,
      charity_percentage: user.charity_percentage,
      charity_name: user.charity_id ? charityMap.get(user.charity_id) || null : null,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Unexpected error in admin users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}