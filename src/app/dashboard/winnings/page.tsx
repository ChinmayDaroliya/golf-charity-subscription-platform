"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Calendar, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface WinnerRecord {
  id: string;
  draw_numbers: number[];
  matches: number;
  prize_amount: number;
  created_at: string;
}

export default function WinningsPage() {
  const [wins, setWins] = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/wins")
      .then((res) => res.json())
      .then((data) => {
        setWins(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalWinnings = wins.reduce((sum, w) => sum + w.prize_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Trophy className="h-8 w-8 text-emerald-600" />
            My Winnings
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your prize history and celebrate your successes.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Total Winnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  ${totalWinnings.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Number of Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {wins.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Latest Win
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {wins.length > 0
                    ? new Date(wins[0].created_at).toLocaleDateString()
                    : "No wins yet"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Winnings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Prize History</CardTitle>
              <CardDescription>
                All your winning draws and prize amounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wins.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No winnings yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep participating in monthly draws to win prizes!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Draw Numbers</TableHead>
                        <TableHead>Matches</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wins.map((w, idx) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-mono">
                            {w.draw_numbers.join(", ")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                              {w.matches} match{w.matches !== 1 ? "es" : ""}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-emerald-600">
                            ${w.prize_amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{new Date(w.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}