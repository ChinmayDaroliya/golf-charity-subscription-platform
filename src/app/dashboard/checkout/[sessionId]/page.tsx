'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@clerk/nextjs';

interface SessionData {
  id: string;
  amount: number;
  plan: string;
  charity_name: string;
  charity_percentage: number;
}

export default function CheckoutPage({ params }: { params: any }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const resolvedParams = use(params) as { sessionId: string };
  const { sessionId } = resolvedParams;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Fetch session details
    fetch(`/api/checkout-session/${sessionId}`)
      .then((res) => res.json())
      .then(setSession);
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call our mock payment confirmation endpoint
    const res = await fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        paymentMethod: {
          last4: cardNumber.slice(-4),
        },
      }),
    });

    if (res.ok) {
      router.push(`/dashboard/checkout/success?session_id=${sessionId}`);
    } else {
      alert('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  if (!session) return <div className="container mx-auto p-8">Loading checkout...</div>;

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p>Plan: {session.plan === 'monthly' ? 'Monthly' : 'Yearly'}</p>
            <p>Amount: ${(session.amount / 100).toFixed(2)}</p>
            <p>Charity: {session.charity_name}</p>
            <p>Donation: {session.charity_percentage}% of subscription</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiry Date</Label>
                <Input
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : `Pay $${(session.amount / 100).toFixed(2)}`}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              This is a simulated payment. No real charges will be made.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}