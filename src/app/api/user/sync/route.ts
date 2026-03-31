import { supabaseServer } from "@/lib/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;

  const { data, error } = await supabaseServer
    .from("users")
    .upsert(
      {
        clerk_id: user.id,
        email,
      },
      { onConflict: "clerk_id" }
    )
    .select()
    .single();

  if (error) {
      console.error("Supabase error:", error); 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}