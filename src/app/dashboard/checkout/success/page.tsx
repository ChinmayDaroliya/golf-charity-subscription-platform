'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (sessionId) {
      // Confirm the session was completed
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
    }
  }, [sessionId]);

  if (status === 'loading') {
    return <div className="container mx-auto p-8 text-center">Confirming your subscription...</div>;
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto p-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Something went wrong. Please contact support.</p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="mb-2">Subscription Successful!</CardTitle>
          <p className="text-muted-foreground mb-6">
            Thank you for subscribing. You can now add scores and participate in draws.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}