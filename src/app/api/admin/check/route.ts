import { supabaseServer } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (error || !data) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ isAdmin: data.is_admin });
}