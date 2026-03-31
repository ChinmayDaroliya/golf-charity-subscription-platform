// This is a mock Stripe client for simulation purposes
// No real Stripe API calls are made

import { supabaseServer } from '@/lib/supabase/server';

export interface MockStripeSession {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  metadata: {
    plan: string;
    charity_id: string;
    charity_percentage: string;
    user_id: string;
  };
  created_at: Date;
}

// Store sessions in Supabase instead of memory
// const mockSessions = new Map<string, MockStripeSession>();

const mockSessions = new Map<string, MockStripeSession>();

export const mockStripe = {
  checkout: {
    sessions: {
      create: async (params: any): Promise<{ id: string }> => {
        const sessionId = `cs_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session: MockStripeSession = {
          id: sessionId,
          amount: params.line_items[0].price_data.unit_amount,
          currency: params.line_items[0].price_data.currency,
          status: 'pending',
          metadata: params.metadata,
          created_at: new Date(),
        };

        mockSessions.set(sessionId, session);

        // Optional: persist in DB if available
        const { error: dbError } = await supabaseServer
          .from('payment_sessions')
          .upsert({
            session_id: sessionId,
            user_id: params.metadata.user_id,
            plan: params.metadata.plan,
            charity_id: params.metadata.charity_id,
            charity_percentage: parseInt(params.metadata.charity_percentage, 10),
            amount: session.amount,
            status: session.status,
            metadata: params.metadata,
          }, { onConflict: 'session_id' });

        if (dbError) {
          console.warn('MockStripe DB upsert failed, continuing with in-memory session', dbError.message);
        }

        return { id: sessionId };
      },
      retrieve: async (sessionId: string): Promise<MockStripeSession | null> => {
        const inMemory = mockSessions.get(sessionId);
        if (inMemory) {
          return inMemory;
        }

        const { data, error } = await supabaseServer
          .from('payment_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (error || !data) return null;

        const session: MockStripeSession = {
          id: data.session_id,
          amount: data.amount,
          currency: 'usd',
          status: data.status,
          metadata: data.metadata,
          created_at: new Date(data.created_at),
        };

        mockSessions.set(sessionId, session);
        return session;
      },
    },
  },
  webhooks: {
    constructEvent: (payload: any, signature: string, secret: string) => {
      return JSON.parse(payload);
    },
  },
};