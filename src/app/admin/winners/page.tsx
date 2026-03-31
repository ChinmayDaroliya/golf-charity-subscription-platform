"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Winner {
  id: string;
  user_email: string;
  draw_numbers: number[];
  matches: number;
  prize_amount: number;
  created_at: string;
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/winners")
      .then((res) => res.json())
      .then((data) => {
        setWinners(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching winners:", error);
        toast.error("Failed to load winners");
        setLoading(false);
      });
  }, []);

  // Calculate total prize amount
  const totalPrize = winners.reduce((sum, w) => sum + w.prize_amount, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
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
            Winner History
          </h1>
          <p className="text-muted-foreground mt-2">
            View all past winners and prize distributions.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Winners</p>
                    <p className="text-2xl font-bold">{winners.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Prizes Awarded</p>
                    <p className="text-2xl font-bold">${totalPrize.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Winners Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Winners</CardTitle>
              <CardDescription>
                {winners.length} winner{winners.length !== 1 ? "s" : ""} recorded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : winners.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No winners yet. Run the draw to see results.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Draw Numbers</TableHead>
                        <TableHead>Matches</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {winners.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-medium">{w.user_email}</TableCell>
                          <TableCell className="font-mono text-sm">
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
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {new Date(w.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
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