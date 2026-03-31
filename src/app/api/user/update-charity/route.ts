import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { charity_id, charity_percentage } = await req.json();
  if (!charity_id || !charity_percentage) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: user, error: userError } = await supabaseServer
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data, error } = await supabaseServer
    .from("users")
    .update({ charity_id, charity_percentage })
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}