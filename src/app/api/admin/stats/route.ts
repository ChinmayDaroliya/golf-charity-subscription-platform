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

    // Total users count
    const { count: totalUsers, error: usersError } = await supabaseServer
      .from("users")
      .select("*", { count: "exact", head: true });

    // Active subscriptions count
    const { count: activeSubscriptions, error: subError } = await supabaseServer
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_subscribed", true);

    // Get all subscriptions to calculate total amount donated
    const { data: subscriptions, error: subDataError } = await supabaseServer
      .from("users")
      .select("plan")
      .eq("is_subscribed", true);

    // Plan prices mapping
    const planPrices: { [key: string]: number } = {
      monthly: 29.99,
      quarterly: 74.99,
      annual: 249.99,
    };

    let totalDonated = 0;
    if (subscriptions) {
      totalDonated = subscriptions.reduce((sum, sub) => {
        const price = planPrices[sub.plan as string] || 0;
        return sum + price;
      }, 0);
    }

    // Draws completed (placeholder for now - can be updated when draw system is fully implemented)
    const drawsCompleted = 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalDonated: totalDonated.toFixed(2),
      drawsCompleted: drawsCompleted,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
