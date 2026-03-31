"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Charity {
  id: string;
  name: string;
}

export default function SubscribePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [charityId, setCharityId] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Fetch charities
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data));
  }, []);

  
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      plan, 
      charity_id: charityId, 
      charity_percentage: percentage 
    }),
  });

  if (res.ok) {
    const { sessionId, url } = await res.json();
    router.push(url);
  } else {
    alert("Failed to create checkout session");
  }

  setLoading(false);
};

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to Participate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Plan</Label>
              <Select onValueChange={(val) => setPlan(val as any)} defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly – $10/mo</SelectItem>
                  <SelectItem value="yearly">Yearly – $100/yr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Charity</Label>
              <Select onValueChange={setCharityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a charity" />
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
              <Label>Donation Percentage (min 10%)</Label>
              <Input
                type="number"
                min={10}
                max={100}
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {percentage}% of your subscription will go to the charity.
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}