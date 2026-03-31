"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dice6, Loader2, Trophy, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DrawResult {
  drawNumbers: number[];
  eligibleUsers: number;
  winners: Array<{
    user_id: string;
    email: string;
    matches: number;
    prize: number;
  }>;
  totalPrizePool: number;
  prizeDistribution: {
    [key: number]: number;
  };
}

export default function DrawPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);

  const runDraw = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/draw/run", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        toast.success(`Draw completed! ${data.winners?.length || 0} winner(s) selected.`);
      } else {
        toast.error(data.error || "Failed to run draw");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            <Dice6 className="h-8 w-8 text-emerald-600" />
            Monthly Draw
          </h1>
          <p className="text-muted-foreground mt-2">
            Run the monthly draw to select winners based on user scores.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-600" />
                Run Draw
              </CardTitle>
              <CardDescription>
                This will generate 5 random numbers (1–45) and match them against all subscribed users with exactly 5 scores.
                Winners will be recorded and prizes distributed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={runDraw}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Draw...
                  </>
                ) : (
                  <>
                    <Dice6 className="mr-2 h-4 w-4" />
                    Run Draw
                  </>
                )}
              </Button>

              {result && (
                <div className="space-y-6 mt-6 pt-6 border-t border-slate-200">
                  {/* Draw Numbers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Draw Numbers</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.drawNumbers.map((num, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-slate-50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Eligible Users</p>
                            <p className="text-2xl font-bold">{result.eligibleUsers}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Prize Pool</p>
                            <p className="text-2xl font-bold">${result.totalPrizePool.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Winners Table */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Winners</h3>
                    {result.winners.length === 0 ? (
                      <p className="text-muted-foreground">No winners this draw.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="px-4 py-2 text-left">User</th>
                              <th className="px-4 py-2 text-left">Matches</th>
                              <th className="px-4 py-2 text-left">Prize</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.winners.map((winner, idx) => (
                              <tr key={idx} className="border-b border-slate-200">
                                <td className="px-4 py-2">{winner.email}</td>
                                <td className="px-4 py-2">
                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                    {winner.matches} match{winner.matches !== 1 ? "es" : ""}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2 font-medium">${winner.prize.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Prize Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Prize Distribution</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>5 matches (40%):</span>
                        <span>${result.prizeDistribution[5]?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>4 matches (35%):</span>
                        <span>${result.prizeDistribution[4]?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>3 matches (25%):</span>
                        <span>${result.prizeDistribution[3]?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}