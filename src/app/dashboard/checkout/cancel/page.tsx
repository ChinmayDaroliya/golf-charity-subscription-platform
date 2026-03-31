'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardContent className="pt-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="mb-2">Payment Cancelled</CardTitle>
          <p className="text-muted-foreground mb-6">
            Your subscription was not completed. You can try again anytime.
          </p>
          <Button onClick={() => router.push('/dashboard/subscribe')}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}