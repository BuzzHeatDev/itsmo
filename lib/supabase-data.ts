// Real Supabase data fetching functions
import { createClient } from '@supabase/supabase-js';
import { Market, Session, Holiday } from './types/market';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are available
let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not found, using mock data');
}

/**
 * Get all active markets with their basic info
 */
export async function getActiveMarkets(): Promise<Market[]> {
  if (!supabase) {
    console.log('Supabase not available, returning empty array');
    return [];
  }

  try {
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

    return (data as unknown as Market[]) || [];
  } catch (error) {
    console.error('Error in getActiveMarkets:', error);
    return [];
  }
}

/**
 * Get market sessions for specific markets
 */
export async function getMarketSessions(marketIds: string[]): Promise<Session[]> {
  if (!supabase || marketIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .in('market_id', marketIds);

    if (error) {
      console.error('Error fetching market sessions:', error);
      return [];
    }

    return (data as unknown as Session[]) || [];
  } catch (error) {
    console.error('Error in getMarketSessions:', error);
    return [];
  }
}

/**
 * Get current and upcoming holidays for specific markets
 */
export async function getMarketHolidays(marketIds: string[], daysAhead: number = 30): Promise<Holiday[]> {
  if (!supabase || marketIds.length === 0) return [];

  try {
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

    return (data as unknown as Holiday[]) || [];
  } catch (error) {
    console.error('Error in getMarketHolidays:', error);
    return [];
  }
}

/**
 * Get complete market data (markets + sessions + holidays) for status calculation
 */
export async function getCompleteMarketData(): Promise<{
  markets: Market[];
  sessions: Session[];
  holidays: Holiday[];
}> {
  if (!supabase) {
    console.log('Supabase not available, returning empty data');
    return { markets: [], sessions: [], holidays: [] };
  }

  try {
    // Get all active markets first
    const markets = await getActiveMarkets();
    
    if (markets.length === 0) {
      return { markets: [], sessions: [], holidays: [] };
    }

    const marketIds = markets.map(m => m.id);

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
 * Test connection to Supabase
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) {
    console.log('Supabase not available for connection test');
    return false;
  }

  try {
    const { error } = await supabase
      .from('markets')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}
