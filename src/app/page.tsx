import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Golf Charity Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Play golf, support your favorite charity, and win prizes every month.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">1. Subscribe</h3>
            <p className="text-muted-foreground">Choose monthly or yearly plan and select your charity.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">2. Enter Scores</h3>
            <p className="text-muted-foreground">Add up to 5 golf scores (1-45) – keep your best!</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">3. Win Prizes</h3>
            <p className="text-muted-foreground">Monthly draws reward you when your scores match the draw numbers.</p>
          </div>
        </div>
      </div>
    </main>
  );
}