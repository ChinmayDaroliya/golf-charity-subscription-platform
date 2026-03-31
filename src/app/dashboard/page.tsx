"use client";

import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserData {
  id: string;
  is_subscribed: boolean;
  plan: string | null;
  charity_id: string | null;
  charity_name: string | null;
  charity_percentage: number | null;
}

interface Charity {
  id: string;
  name: string;
}

interface WinningsData {
  total: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [newCharityId, setNewCharityId] = useState("");
  const [newPercentage, setNewPercentage] = useState(10);
  const [updating, setUpdating] = useState(false);
  const [scoresCount, setScoresCount] = useState(0);
  const [winnings, setWinnings] = useState<WinningsData>({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      console.log("Calling sync API");
      fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      }).then(res => {
        console.log("Sync API response:", res.status);
        return res.json();
      }).then(data => {
        console.log("Sync data:", data);
        // Then fetch status and other data
        return Promise.all([
          fetch("/api/user/status").then(res => res.json()),
          fetch("/api/charities").then(res => res.json()),
          fetch("/api/scores").then(res => res.json()),
          fetch("/api/user/winnings").then(res => res.json()),
        ]);
      }).then(([userStatus, charitiesData, scoresData, winningsData]) => {
        setUserData(userStatus);
        setCharities(charitiesData);
        setScoresCount(scoresData.length);
        setWinnings(winningsData);
      }).catch(error => {
        console.error("Error fetching dashboard data:", error);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [isLoaded, isSignedIn, user]);

  const handleUpdateCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.is_subscribed) {
      alert("You need to be subscribed to set a charity.");
      return;
    }
    setUpdating(true);
    const res = await fetch("/api/user/update-charity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        charity_id: newCharityId,
        charity_percentage: newPercentage,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUserData((prev) => ({ ...prev!, ...updated }));
      alert("Charity updated!");
    } else {
      alert("Failed to update charity.");
    }
    setUpdating(false);
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SignOutButton>
          <Button variant="outline">Sign Out</Button>
        </SignOutButton>
      </div>

      {/* Subscription status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {userData?.is_subscribed ? (
            <div>
              <p>Active plan: {userData.plan === 'monthly' ? 'Monthly' : 'Yearly'}</p>
              <p>Charity: {userData.charity_name || "None"} ({userData.charity_percentage || 0}%)</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/dashboard/scores">Manage Scores</Link>
              </Button>
            </div>
          ) : (
            <div>
              <p>Not subscribed. <Link href="/dashboard/subscribe" className="text-blue-600 underline">Subscribe now</Link> to participate.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Score participation status */}
      <Card>
        <CardHeader>
          <CardTitle>Participation</CardTitle>
        </CardHeader>
        <CardContent>
          {userData?.is_subscribed ? (
            scoresCount === 5 ? (
              <p className="text-green-600">✅ You have 5 scores – eligible for the next draw!</p>
            ) : (
              <p className="text-yellow-600">⚠️ You have {scoresCount}/5 scores. Add more to be eligible.</p>
            )
          ) : (
            <p>Subscribe to start adding scores.</p>
          )}
        </CardContent>
      </Card>

      {/* Change charity (if subscribed) */}
      {userData?.is_subscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Change Charity / Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateCharity} className="space-y-4">
              <div>
                <Label>Charity</Label>
                <Select onValueChange={setNewCharityId} value={newCharityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select charity" />
                  </SelectTrigger>
                  <SelectContent>
                    {charities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Percentage (min 10)</Label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={newPercentage}
                  onChange={(e) => setNewPercentage(Number(e.target.value))}
                />
              </div>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Charity"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Winnings */}
      <Card>
        <CardHeader>
          <CardTitle>Winnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${winnings?.total?.toFixed(2) || "0.00"}
          </p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/dashboard/winnings">View details</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}