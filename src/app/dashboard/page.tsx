"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [subscription, setSubscription] = useState<{
    is_subscribed: boolean;
    plan: string | null;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/user/status")
        .then((res) => res.json())
        .then(setSubscription);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {subscription?.is_subscribed ? (
        <p>You are subscribed ({subscription.plan}). Thank you for supporting charity!</p>
      ) : (
        <div>
          <p>You are not subscribed. Subscribe to participate in draws and support charities.</p>
          <Link href="/dashboard/subscribe">
            <Button className="mt-4">Subscribe Now</Button>
          </Link>
        </div>
      )}

    <div className="flex gap-4 mb-6">
      <Link href="/dashboard/scores">
        <Button variant="outline">My Scores</Button>
      </Link>
    </div>
    </div>
    
  );
}