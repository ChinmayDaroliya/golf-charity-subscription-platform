import { supabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Helper to generate 5 random numbers 1-45
function generateDrawNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers);
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user is admin
  const { data: adminCheck, error: adminError } = await supabaseServer
    .from("users")
    .select("is_admin")
    .eq("clerk_id", userId)
    .single();

  if (adminError || !adminCheck?.is_admin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  // 1. Generate draw numbers
  const drawNumbers = generateDrawNumbers();

  // 2. Insert into draws table
  const { data: draw, error: drawError } = await supabaseServer
    .from("draws")
    .insert({ numbers: drawNumbers })
    .select()
    .single();

  if (drawError) {
    return NextResponse.json({ error: drawError.message }, { status: 500 });
  }

  // 3. Get all subscribed users with exactly 5 scores
  const { data: users, error: usersError } = await supabaseServer
    .from("users")
    .select(`
      id,
      scores: scores(score)
    `)
    .eq("is_subscribed", true)
    .not("scores", "is", null);

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  // Filter users who have exactly 5 scores
  const eligibleUsers = users.filter(user => user.scores && user.scores.length === 5);

  // 4. For each user, count matches
  interface WinnerMatch {
    userId: string;
    matches: number;
  }
  const matchesList: WinnerMatch[] = [];

  for (const user of eligibleUsers) {
    const userScores = user.scores.map((s: any) => s.score);
    const matchCount = userScores.filter(score => drawNumbers.includes(score)).length;
    if (matchCount >= 3) {
      matchesList.push({ userId: user.id, matches: matchCount });
    }
  }

  // 5. Group by matches and distribute prize (simulated total prize = 1000)
  const totalPrize = 1000; // fixed for simulation
  const prizes = {
    5: totalPrize * 0.4,
    4: totalPrize * 0.35,
    3: totalPrize * 0.25,
  };

  const winnersByMatch: Record<number, { userId: string; matches: number }[]> = {
    5: [],
    4: [],
    3: [],
  };

  for (const m of matchesList) {
    winnersByMatch[m.matches].push(m);
  }

  // For each match tier, split prize equally
  const insertedWinners: any[] = [];

  for (const [matches, winners] of Object.entries(winnersByMatch)) {
    const matchCount = parseInt(matches);
    if (winners.length === 0) continue;
    const prizeAmount = prizes[matchCount as keyof typeof prizes];
    const amountPerWinner = prizeAmount / winners.length;

    for (const winner of winners) {
      const { data: winnerRecord, error: winnerError } = await supabaseServer
        .from("winners")
        .insert({
          user_id: winner.userId,
          draw_id: draw.id,
          matches: matchCount,
          prize_amount: amountPerWinner,
        })
        .select()
        .single();

      if (!winnerError) insertedWinners.push(winnerRecord);
    }
  }

  return NextResponse.json({
    drawNumbers,
    drawId: draw.id,
    winners: insertedWinners,
  });
}