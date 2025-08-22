// Supabase client for client-side operations
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are available
let supabase: ReturnType<typeof createClient<Database>> | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  console.warn('Supabase environment variables not found for client');
}

// Helper functions for common client-side operations

/**
 * Get all active markets with their basic info
 * This is used for the public homepage
 */
export async function getActiveMarkets() {
  if (!supabase) {
    console.log('Supabase client not available');
    return [];
  }

  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: true })
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching active markets:', error);
    return [];
  }

  return data;
}

/**
 * Get market sessions for specific markets
 */
export async function getMarketSessions(marketIds: string[]) {
  if (!supabase) {
    console.log('Supabase client not available');
    return [];
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .in('market_id', marketIds);

  if (error) {
    console.error('Error fetching market sessions:', error);
    return [];
  }

  return data;
}

/**
 * Get current and upcoming holidays for specific markets
 */
export async function getMarketHolidays(marketIds: string[], daysAhead: number = 30) {
  if (!supabase) {
    console.log('Supabase client not available');
    return [];
  }

  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  const futureDateStr = futureDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .in('market_id', marketIds)
    .gte('date', today)
    .lte('date', futureDateStr);

  if (error) {
    console.error('Error fetching market holidays:', error);
    return [];
  }

  return data;
}

/**
 * Get complete market data (markets + sessions + holidays) for status calculation
 * This is the main function used by the homepage
 */
export async function getCompleteMarketData() {
  if (!supabase) {
    console.log('Supabase client not available');
    return { markets: [], sessions: [], holidays: [] };
  }

  try {
    // Get all active markets
    const markets = await getActiveMarkets();
    
    if (markets.length === 0) {
      return { markets: [], sessions: [], holidays: [] };
    }

    const marketIds = markets.map((m: Database['public']['Tables']['markets']['Row']) => m.id);

    // Get sessions and holidays in parallel
    const [sessions, holidays] = await Promise.all([
      getMarketSessions(marketIds),
      getMarketHolidays(marketIds),
    ]);

    return {
      markets,
      sessions,
      holidays,
    };
  } catch (error) {
    console.error('Error fetching complete market data:', error);
    return { markets: [], sessions: [], holidays: [] };
  }
}

/**
 * Get site settings
 */
export async function getSiteSettings() {
  if (!supabase) {
    console.log('Supabase client not available');
    return null;
  }

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }

  return data;
}

/**
 * Subscribe to real-time changes in market data
 * Useful for admin dashboard
 */
export function subscribeToMarketChanges(callback: () => void) {
  if (!supabase) {
    console.log('Supabase client not available for subscriptions');
    return () => {}; // Return no-op unsubscribe function
  }

  const subscription = supabase
    .channel('market-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'markets' }, 
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'sessions' }, 
      callback
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'holidays' }, 
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
