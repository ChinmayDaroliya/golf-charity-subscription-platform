"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  useEffect(() => {
    fetch("/api/winners")
      .then((res) => res.json())
      .then(setWinners);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Winners</h1>
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
              <TableCell>{w.user_email}</TableCell>
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