import { mockStripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await params;
  const session = await mockStripe.checkout.sessions.retrieve(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Update user subscription
  const { error: updateError } = await supabaseServer
    .from('users')
    .update({
      is_subscribed: true,
      plan: session.metadata.plan,
      charity_id: session.metadata.charity_id,
      charity_percentage: session.metadata.charity_percentage,
      subscription_started_at: new Date().toISOString(),
    })
    .eq('clerk_id', userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Update payment session status
  await supabaseServer
    .from('payment_sessions')
    .update({ status: 'completed' })
    .eq('session_id', sessionId);

  return NextResponse.json({ success: true });
}