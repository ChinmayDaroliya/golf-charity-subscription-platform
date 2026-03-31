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

  console.log('Checkout session GET request:', sessionId);

  const { data: sessionRow, error: sessionError } = await supabaseServer
    .from('payment_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  console.log('payment_sessions row:', sessionRow, 'error:', sessionError);

  let session = sessionRow
    ? {
        id: sessionRow.session_id,
        amount: sessionRow.amount,
        currency: 'usd',
        status: sessionRow.status,
        metadata: sessionRow.metadata,
        created_at: new Date(sessionRow.created_at),
      }
    : await mockStripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    console.warn('Session not found in DB or mock', sessionId);
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const { data: charity } = await supabaseServer
    .from('charities')
    .select('name')
    .eq('id', session.metadata?.charity_id)
    .single();

  return NextResponse.json({
    id: session.id,
    amount: session.amount,
    plan: session.metadata?.plan,
    charity_name: charity?.name || 'None',
    charity_percentage: parseInt(session.metadata?.charity_percentage || '0'),
  });
}