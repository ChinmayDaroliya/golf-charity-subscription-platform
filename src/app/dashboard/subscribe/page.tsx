"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Heart, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  const [userStatus, setUserStatus] = useState<{ is_subscribed: boolean } | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Fetch charities and current subscription status
    Promise.all([
      fetch("/api/charities").then((res) => res.json()),
      fetch("/api/user/status").then((res) => res.json()),
    ]).then(([charitiesData, statusData]) => {
      setCharities(charitiesData);
      setUserStatus(statusData);
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!charityId) {
      toast.error("Please select a charity.");
      return;
    }
    if (percentage < 10 || percentage > 100) {
      toast.error("Percentage must be between 10 and 100.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, charity_id: charityId, charity_percentage: percentage }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(data.url);
      } else {
        toast.error(data.error || "Failed to create checkout session.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (userStatus?.is_subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle>Already Subscribed</CardTitle>
            <CardDescription>
              You already have an active subscription. Enjoy the platform!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planDetails = {
    monthly: { price: 10, label: "Monthly", description: "Flexible, cancel anytime" },
    yearly: { price: 100, label: "Yearly", description: "Save $20, best value" },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Join the Community
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Unlock Full Access
          </h1>
          <p className="text-muted-foreground mt-2">
            Subscribe to start adding scores, support charities, and win prizes.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Plan Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {Object.entries(planDetails).map(([key, details]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  plan === key
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "hover:border-slate-300"
                }`}
                onClick={() => setPlan(key as "monthly" | "yearly")}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{details.label}</CardTitle>
                      <CardDescription>{details.description}</CardDescription>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                      ${details.price}
                      {key === "monthly" && <span className="text-sm text-muted-foreground">/mo</span>}
                      {key === "yearly" && <span className="text-sm text-muted-foreground">/yr</span>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {key === "yearly" && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                      Save $20
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Subscription Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Support a Charity</CardTitle>
                <CardDescription>
                  Choose a charity to support and decide what percentage of your subscription goes to them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="charity">Charity</Label>
                    <Select onValueChange={setCharityId} value={charityId}>
                      <SelectTrigger id="charity">
                        <SelectValue placeholder="Select a charity" />
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

                  <div className="space-y-2">
                    <Label htmlFor="percentage">Donation Percentage (min 10%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      min={10}
                      max={100}
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      {percentage}% of your ${planDetails[plan].price} subscription will go to the charity.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          By subscribing, you agree to our Terms of Service. You can cancel anytime.
        </motion.p>
      </div>
    </div>
  );
}