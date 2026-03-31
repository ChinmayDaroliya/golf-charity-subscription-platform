"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WinnerRecord {
  id: string;
  draw_numbers: number[];
  matches: number;
  prize_amount: number;
  created_at: string;
}

export default function WinningsPage() {
  const [wins, setWins] = useState<WinnerRecord[]>([]);

  useEffect(() => {
    fetch("/api/user/wins")
      .then((res) => res.json())
      .then(setWins);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Winnings</h1>
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
          {wins.map((w) => (
            <TableRow key={w.id}>
              <TableCell>{w.draw_numbers.join(", ")}</TableCell>
              <TableCell>{w.matches}</TableCell>
              <TableCell>${w.prize_amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(w.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}