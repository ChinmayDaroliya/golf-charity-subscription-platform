import { mockStripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, paymentMethod } = await req.json();

  // Simulate payment processing
  // In a real app, you'd call Stripe to confirm payment
  
  // Mark session as completed (simulated)
  const session = await mockStripe.checkout.sessions.retrieve(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Update payment session status (commented out as table may not exist)
  // await supabaseServer
  //   .from('payment_sessions')
  //   .update({ 
  //     status: 'completed',
  //     payment_method: paymentMethod.last4,
  //   })
  //   .eq('session_id', sessionId);

  // Get user from database
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Update user subscription
  const { data, error } = await supabaseServer
    .from('users')
    .update({
      is_subscribed: true,
      plan: session.metadata?.plan,
      charity_id: session.metadata?.charity_id,
      charity_percentage: parseInt(session.metadata?.charity_percentage || '0'),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}