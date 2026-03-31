"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flag, Plus, AlertCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      Promise.all([fetchScores(), fetchSubscriptionStatus()]).finally(() => setFetching(false));
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
      toast.error("You need to subscribe to add scores.");
      return;
    }
    const scoreNum = parseInt(newScore);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      toast.error("Score must be between 1 and 45");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scoreNum }),
      });
      if (res.ok) {
        setNewScore("");
        await fetchScores();
        toast.success("Score added successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add score.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const scoresCount = scores.length;
  const scoresProgress = (scoresCount / 5) * 100;

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Flag className="h-8 w-8 text-emerald-600" />
            My Scores
          </h1>
          <p className="text-muted-foreground mt-2">
            Store up to 5 scores (1–45). Your oldest scores are automatically replaced when you add a 6th.
          </p>
        </motion.div>

        {/* Add Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                Add New Score
              </CardTitle>
              <CardDescription>Enter a score between 1 and 45.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addScore} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="number"
                  placeholder="Enter score (1-45)"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  min={1}
                  max={45}
                  disabled={!subscribed}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !subscribed}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Score"
                  )}
                </Button>
              </form>
              {!subscribed && (
                <div className="flex items-center gap-2 mt-3 text-amber-600 bg-amber-50 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">You must be subscribed to add scores.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Progress & List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Scores</CardTitle>
              <CardDescription>
                {scoresCount}/5 scores stored. {scoresCount === 5 ? "You are eligible for the next draw!" : `Add ${5 - scoresCount} more to become eligible.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to 5 scores</span>
                  <span className="font-medium">{scoresCount}/5</span>
                </div>
                <Progress value={scoresProgress} className="h-2" />
              </div>

              {/* Scores Table */}
              {scores.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No scores yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your first score using the form above.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Score</TableHead>
                        <TableHead>Date Added</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scores.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-lg font-bold text-emerald-600">
                            {s.score}
                          </TableCell>
                          <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {scoresCount === 5 && (
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">You have 5 scores! You are entered in the next monthly draw.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}