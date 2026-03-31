"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Charity {
  id: string;
  name: string;
  description: string | null;
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const fetchCharities = async () => {
    const res = await fetch("/api/charities");
    const data = await res.json();
    setCharities(data);
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const addCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    await fetch("/api/charities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    setNewName("");
    setNewDesc("");
    fetchCharities();
  };

  const deleteCharity = async (id: string) => {
    await fetch(`/api/charities?id=${id}`, { method: "DELETE" });
    fetchCharities();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Charity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addCharity} className="space-y-4">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <Button type="submit">Add Charity</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Charities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charities.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.description || "-"}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => deleteCharity(c.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}