import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs/server"

export async function GET() {
  const { data, error } = await supabaseServer.from("charities").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admin check
  const { data: adminCheck } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (!adminCheck?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, description } = await req.json();
  const { data, error } = await supabaseServer
    .from("charities")
    .insert({ name, description })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminCheck } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (!adminCheck?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseServer.from("charities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}