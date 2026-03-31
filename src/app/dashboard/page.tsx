"use client";

import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Flag,
  Heart,
  Trophy,
  CreditCard,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types
interface UserData {
  id: string;
  is_subscribed: boolean;
  plan: string | null;
  charity_id: string | null;
  charity_name: string | null;
  charity_percentage: number | null;
  is_admin: boolean;
}

interface Charity {
  id: string;
  name: string;
}

interface Score {
  id: string;
  score: number;
  date: string;
}

interface WinningsData {
  total: number;
}

interface DrawData {
  id: string;
  numbers: number[];
  date: string;
  winner_count?: number;
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [winnings, setWinnings] = useState<WinningsData>({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [recentDraw, setRecentDraw] = useState<DrawData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Charity update state
  const [charities, setCharities] = useState<Charity[]>([]);
  const [newCharityId, setNewCharityId] = useState("");
  const [newPercentage, setNewPercentage] = useState(10);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
      })
        .then((res) => res.json())
        .then(() => {
          return Promise.all([
            fetch("/api/user/status").then((res) => res.json()),
            fetch("/api/scores").then((res) => res.json()),
            fetch("/api/user/winnings").then((res) => res.json()),
            fetch("/api/draw/latest").then((res) => res.json()).catch(() => null),
            fetch("/api/charities").then((res) => res.json()), // Fetch charities
          ]);
        })
        .then(([userStatus, scoresData, winningsData, drawData, charitiesData]) => {
          setUserData(userStatus);
          setScores(scoresData);
          setWinnings(winningsData);
          if (drawData) setRecentDraw(drawData);
          setCharities(charitiesData);

          if (userStatus.is_admin) {
            router.push("/admin");
          }
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
          toast.error("Failed to load dashboard data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleUpdateCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.is_subscribed) {
      toast.error("You need to be subscribed to set a charity.");
      return;
    }
    if (!newCharityId) {
      toast.error("Please select a charity.");
      return;
    }
    if (newPercentage < 10 || newPercentage > 100) {
      toast.error("Percentage must be between 10 and 100.");
      return;
    }
    setUpdating(true);
    try {
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
        toast.success("Charity updated successfully!");
        setNewCharityId("");
        setNewPercentage(10);
      } else {
        toast.error("Failed to update charity.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Scores", href: "/dashboard/scores", icon: Flag },
    { name: "Winnings", href: "/dashboard/winnings", icon: Trophy },
    { name: "Subscription", href: "/dashboard/subscribe", icon: CreditCard },
  ];

  const scoresCount = scores.length;
  const hasFiveScores = scoresCount === 5;
  const scoresProgress = (scoresCount / 5) * 100;

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl" />
      </div>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (desktop) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 z-30 hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Golf Charity
              </span>
            </Link>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <SignOutButton>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Golf Charity
          </span>
        </Link>
        <div className="w-10" />
      </header>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-white z-50 shadow-xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Golf Charity
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-200">
                <SignOutButton>
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName || "Golfer"}!
                </h1>
                <p className="text-muted-foreground mt-2">Track your progress and make an impact.</p>
              </div>
              {!userData?.is_subscribed && (
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 shadow-md">
                  <Link href="/dashboard/subscribe">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full blur-2xl -mr-16 -mt-16" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                      Subscription
                    </CardTitle>
                    <Badge variant={userData?.is_subscribed ? "default" : "secondary"} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      {userData?.is_subscribed ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {userData?.is_subscribed ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-medium capitalize">{userData.plan}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Charity:</span>
                        <span className="font-medium">{userData.charity_name || "Not set"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Donation:</span>
                        <span className="font-medium">{userData.charity_percentage || 0}%</span>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link href="/dashboard/scores">
                          Manage Scores
                          <TrendingUp className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Subscribe to start participating and supporting charities.
                      </p>
                      <Button asChild size="sm" className="bg-gradient-to-r from-emerald-600 to-blue-600">
                        <Link href="/dashboard/subscribe">Subscribe Now</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Participation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full blur-2xl -mr-16 -mt-16" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Participation
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {userData?.is_subscribed ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Scores stored:</span>
                          <span className="font-bold">{scoresCount}/5</span>
                        </div>
                        <Progress value={scoresProgress} className="h-2" />
                      </div>
                      {hasFiveScores ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Eligible for next draw!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Add {5 - scoresCount} more score{scoresCount !== 4 ? "s" : ""} to be eligible.</span>
                        </div>
                      )}
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href="/dashboard/scores">
                          <Flag className="h-4 w-4 mr-1" />
                          Manage Scores
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Subscribe to start adding scores and enter draws.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Winnings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full blur-2xl -mr-16 -mt-16" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-600" />
                    Winnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      ${winnings?.total?.toFixed(2) || "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Total prizes won</p>
                    <Button asChild variant="link" size="sm" className="mt-3">
                      <Link href="/dashboard/winnings">View details →</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Draw Section (if available) */}
          {recentDraw && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Latest Draw
                  </CardTitle>
                  <CardDescription>
                    Draw conducted on {new Date(recentDraw.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      {recentDraw.numbers.map((num, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-emerald-700"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    {recentDraw.winner_count !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        {recentDraw.winner_count} winner{recentDraw.winner_count !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Charity Update Section (only if subscribed) */}
          {userData?.is_subscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-emerald-600" />
                    Support a Charity
                  </CardTitle>
                  <CardDescription>
                    Change your supported charity or adjust the percentage of your subscription that goes to charity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateCharity} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="charity">Charity</Label>
                        <Select onValueChange={setNewCharityId} value={newCharityId}>
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
                          value={newPercentage}
                          onChange={(e) => setNewPercentage(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={updating} className="bg-emerald-600 hover:bg-emerald-700">
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Charity"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}