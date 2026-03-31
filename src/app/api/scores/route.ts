import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/scores – returns user's scores sorted newest first
export async function GET() {
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
    // Return empty array if user not found
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseServer
    .from("scores")
    .select("id, score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json([]);
  }
  
  return NextResponse.json(data || []);
}

// POST /api/scores – add a new score, enforce max 5
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { score } = await req.json();
  if (!score || score < 1 || score > 45) {
    return NextResponse.json({ error: "Score must be between 1 and 45" }, { status: 400 });
  }

  // Get user's Supabase id and subscription status
  const { data: user, error: userError } = await supabaseServer
    .from("users")
    .select("id, is_subscribed")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.is_subscribed) {
    return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  // Get existing scores count
  const { count, error: countError } = await supabaseServer
    .from("scores")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

  // If already 5 scores, delete oldest before inserting
  if (count === 5) {
    const { data: oldest } = await supabaseServer
      .from("scores")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (oldest) {
      await supabaseServer.from("scores").delete().eq("id", oldest.id);
    }
  }

  // Insert new score
  const { data, error } = await supabaseServer
    .from("scores")
    .insert({ user_id: user.id, score })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}