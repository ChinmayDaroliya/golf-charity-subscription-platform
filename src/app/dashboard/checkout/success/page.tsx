'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-session/${sessionId}/confirm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden p-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl" />
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-rose-600">Something went wrong</CardTitle>
                <CardDescription>We couldn't confirm your subscription. Please contact support.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
              </CardContent>
            </Card>
          </motion.div>
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
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Subscription Successful!
              </CardTitle>
              <CardDescription>
                Thank you for subscribing. You can now add scores and participate in draws.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/scores')}
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Adding Scores
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}