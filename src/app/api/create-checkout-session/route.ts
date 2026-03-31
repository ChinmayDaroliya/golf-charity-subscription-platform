import { mockStripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan, charity_id, charity_percentage } = await req.json();

  // Get user from database
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('id, email')
    .eq('clerk_id', userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Calculate price based on plan
  const prices = {
    monthly: 1000, // $10.00
    yearly: 10000, // $100.00
  };

  const amount = prices[plan as keyof typeof prices];
  if (!amount) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  // Create mock checkout session
  const session = await mockStripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/checkout/cancel`,
    metadata: {
      plan,
      charity_id,
      charity_percentage: charity_percentage.toString(),
      user_id: user.id, // Use database UUID, not Clerk userId
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Golf Charity ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
            description: `Support your chosen charity with ${charity_percentage}% of your subscription`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
  });

  console.log('Created checkout session', session);

  return NextResponse.json({ sessionId: session.id, url: `/dashboard/checkout/${session.id}` });
}