'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}