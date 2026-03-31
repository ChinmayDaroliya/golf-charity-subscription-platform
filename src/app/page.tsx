"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Flag, 
  Heart, 
  Target, 
  Trophy, 
  ArrowRight, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = () => {
    toast.info("Redirecting to sign up...", {
      icon: <Sparkles className="h-4 w-4" />,
      duration: 2000,
    });
    router.push("/sign-up");
  };

  const handleSignIn = () => {
    toast.info("Taking you to sign in...");
    router.push("/sign-in");
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Subscribed successfully! Stay tuned for updates.", {
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
    setEmail("");
    setIsSubmitting(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Monthly Draws & Charity Impact
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 bg-clip-text text-transparent">
                  Play Golf, Support<br />
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Your Favorite Charity
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Subscribe, enter your scores, and participate in monthly draws while making a difference. 
                  Every subscription gives back to causes you care about.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    className="group bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleSignIn}
                    className="border-2 hover:bg-slate-100"
                  >
                    Sign In
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format"
                  alt="Golf course with players"
                  className="w-full h-auto object-cover aspect-video"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Golfers Love Our Platform</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to enjoy golf, support charity, and win amazing prizes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Flag,
                  title: "Flexible Subscription",
                  description: "Choose monthly or yearly plans. 100% of your charity contribution goes directly to your selected cause.",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: Target,
                  title: "Score Management",
                  description: "Store up to 5 scores (1-45). Automatically keep your best and remove oldest entries.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: Trophy,
                  title: "Monthly Draws",
                  description: "Match your scores with randomly generated numbers. Win up to 40% of the prize pool!",
                  color: "from-amber-500 to-amber-600",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-slate-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Three-Step Process</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes and start making an impact
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  icon: Heart,
                  title: "Subscribe & Choose Charity",
                  description: "Select your plan (monthly/yearly) and pick a charity to support with at least 10% of your subscription.",
                },
                {
                  step: "02",
                  icon: Flag,
                  title: "Enter Your Scores",
                  description: "Add up to 5 golf scores (1-45). Our system keeps your latest scores automatically.",
                },
                {
                  step: "03",
                  icon: Trophy,
                  title: "Participate & Win",
                  description: "With 5 scores, you're entered into monthly draws. Match numbers and win prizes!",
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200">
                    <CardHeader>
                      <div className="text-4xl font-bold text-emerald-600/30 mb-2">{step.step}</div>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <step.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-slate-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats & Impact */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { value: "$50K+", label: "Raised for Charity", icon: Heart },
                { value: "2,500+", label: "Active Golfers", icon: Users },
                { value: "45+", label: "Monthly Draws", icon: Calendar },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200"
                >
                  <stat.icon className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Prize Tiers */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Monthly Prize Distribution</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Match your scores and win a share of the prize pool
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { matches: 5, percentage: "40%", color: "from-amber-400 to-amber-600", description: "Perfect match!" },
                { matches: 4, percentage: "35%", color: "from-blue-400 to-blue-600", description: "Almost there!" },
                { matches: 3, percentage: "25%", color: "from-emerald-400 to-emerald-600", description: "Getting closer!" },
              ].map((tier, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                        <span className="text-2xl font-bold text-white">{tier.matches}</span>
                      </div>
                      <CardTitle className="text-3xl">{tier.percentage}</CardTitle>
                      <CardDescription className="text-base font-medium mt-2">
                        {tier.matches} Matches
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join hundreds of golfers supporting charities and winning prizes every month.
              </p>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-emerald-600 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest news about draws, winners, and new charities
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="h-6 w-6 text-emerald-400" />
                  <span className="font-bold text-lg">Golf Charity</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Supporting charities through the love of golf.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-white transition">Dashboard</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Scores</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Charity</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                  <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <Link href="#" className="text-slate-400 hover:text-white transition">Twitter</Link>
                  <Link href="#" className="text-slate-400 hover:text-white transition">Instagram</Link>
                  <Link href="#" className="text-slate-400 hover:text-white transition">Facebook</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
              © {new Date().getFullYear()} Golf Charity Platform. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
      <Toaster position="top-right" richColors />
    </>
  );
}