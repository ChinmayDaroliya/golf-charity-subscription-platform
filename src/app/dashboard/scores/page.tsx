"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Score {
  id: string;
  score: number;
  created_at: string;
}

export default function ScoresPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchScores();
      fetchSubscriptionStatus();
    }
  }, [isLoaded, isSignedIn]);

  const fetchScores = async () => {
    const res = await fetch("/api/scores");
    if (res.ok) {
      const data = await res.json();
      setScores(data);
    }
  };

  const fetchSubscriptionStatus = async () => {
    const res = await fetch("/api/user/status");
    if (res.ok) {
      const data = await res.json();
      setSubscribed(data.is_subscribed);
    }
  };

  const addScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribed) {
      alert("You need to subscribe to add scores.");
      return;
    }
    const scoreNum = parseInt(newScore);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      alert("Score must be between 1 and 45");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: scoreNum }),
    });
    if (res.ok) {
      setNewScore("");
      fetchScores();
    } else {
      const err = await res.json();
      alert(err.error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Score</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addScore} className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter score (1-45)"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              min={1}
              max={45}
              disabled={!subscribed}
            />
            <Button type="submit" disabled={loading || !subscribed}>
              Add Score
            </Button>
          </form>
          {!subscribed && (
            <p className="text-sm text-red-500 mt-2">
              You must be subscribed to add scores.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Scores (Last 5)</CardTitle>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <p>No scores yet. Add your first score!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.score}</TableCell>
                    <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}