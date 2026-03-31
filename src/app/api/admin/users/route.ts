import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check admin
  const { data: adminCheck } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (!adminCheck?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabaseServer
    .from("users")
    .select(`
      id,
      email,
      is_subscribed,
      plan,
      charity_percentage,
      charity:charities (name)
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Transform to flatten charity name
  const users = data.map((u: any) => ({
    ...u,
    charity_name: u.charity?.name || null,
  }));

  return NextResponse.json(users);
}