import { mockStripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  try {
    // Construct the event (simulated)
    const event = mockStripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'mock_secret'
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await supabaseServer
          .from('payment_sessions')
          .update({ status: 'completed' })
          .eq('session_id', session.id);
        
        // Update user subscription
        await supabaseServer
          .from('users')
          .update({
            is_subscribed: true,
            plan: session.metadata.plan,
            charity_id: session.metadata.charity_id,
            charity_percentage: parseInt(session.metadata.charity_percentage),
            subscription_started_at: new Date().toISOString(),
          })
          .eq('id', session.metadata.user_id);
        break;
      
      case 'invoice.payment_failed':
        // Handle failed payment (would update user subscription status)
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}