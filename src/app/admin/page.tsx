"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, Heart, Dice6, Trophy, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalDonated: string;
  drawsCompleted: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminCards = [
    {
      title: "Users",
      description: "Manage user accounts, subscriptions, and scores",
      icon: Users,
      href: "/admin/users",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Charities",
      description: "Add, edit, or delete charities",
      icon: Heart,
      href: "/admin/charities",
      color: "from-rose-500 to-pink-500",
    },
    {
      title: "Draw",
      description: "Run the monthly draw and view results",
      icon: Dice6,
      href: "/admin/draw",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Winners",
      description: "See all winners and prize distributions",
      icon: Trophy,
      href: "/admin/winners",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  // Optional stats (you can fetch from API)
  const displayStats = [
    { label: "Total Users", value: stats ? stats.totalUsers.toString() : "—", icon: Users },
    { label: "Active Subscriptions", value: stats ? stats.activeSubscriptions.toString() : "—", icon: LayoutDashboard },
    { label: "Total Donated", value: stats ? `$${stats.totalDonated}` : "—", icon: Heart },
    { label: "Draws Completed", value: stats ? stats.drawsCompleted.toString() : "—", icon: Dice6 },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage the platform, users, and charity draws</p>
          </div>
          <SignOutButton>
            <Button variant="outline" className="border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SignOutButton>
        </motion.div>

        {/* Quick Stats (optional) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {displayStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-emerald-600 opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Admin Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
              >
                <Link href={card.href} className="block h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-blue-500 group-hover:text-white transition-all">
                        Manage
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}