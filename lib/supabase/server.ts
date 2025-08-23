// Supabase client for server-side operations
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase clients if environment variables are available
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;
let supabaseServer: ReturnType<typeof createClient<Database>> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  // Server client with service role key for admin operations
  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn('Missing Supabase environment variables for admin operations');
}

if (supabaseUrl && supabaseAnonKey) {
  // Regular server client for public operations
  supabaseServer = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn('Missing Supabase environment variables for server operations');
}

/**
 * Server-side function to get complete market data
 * Used for ISR/SSG generation
 */
export async function getCompleteMarketDataServer() {
  if (!supabaseServer) {
    console.log('Supabase server client not available');
    return { markets: [], sessions: [], holidays: [] };
  }

  try {
    // Use Promise.all for parallel fetching
    const [marketsResult, sessionsResult, holidaysResult] = await Promise.all([
      supabaseServer
        .from('markets')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('position', { ascending: true }),
      
      supabaseServer
        .from('sessions')
        .select('*'),
      
      supabaseServer
        .from('holidays')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
    ]);

    if (marketsResult.error) {
      console.error('Error fetching markets:', marketsResult.error);
      return { markets: [], sessions: [], holidays: [] };
    }

    if (sessionsResult.error) {
      console.error('Error fetching sessions:', sessionsResult.error);
      return { markets: marketsResult.data || [], sessions: [], holidays: [] };
    }

    if (holidaysResult.error) {
      console.error('Error fetching holidays:', holidaysResult.error);
      return { 
        markets: marketsResult.data || [], 
        sessions: sessionsResult.data || [], 
        holidays: [] 
      };
    }

    return {
      markets: marketsResult.data || [],
      sessions: sessionsResult.data || [],
      holidays: holidaysResult.data || [],
    };
  } catch (error) {
    console.error('Error in getCompleteMarketDataServer:', error);
    return { markets: [], sessions: [], holidays: [] };
  }
}

/**
 * Get site settings server-side
 */
export async function getSiteSettingsServer() {
  if (!supabaseServer) {
    console.log('Supabase server client not available');
    return null;
  }

  const { data, error } = await supabaseServer
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

// Admin functions using service role key

/**
 * Create a new market (admin only)
 */
export async function createMarket(market: Database['public']['Tables']['markets']['Insert']) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('markets')
    .insert(market as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating market:', error);
    throw error;
  }

  return data;
}

/**
 * Update a market (admin only)
 */
export async function updateMarket(
  id: string, 
  updates: Database['public']['Tables']['markets']['Update']
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('markets')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating market:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a market (admin only)
 */
export async function deleteMarket(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { error } = await supabaseAdmin
    .from('markets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting market:', error);
    throw error;
  }
}

/**
 * Create market sessions (admin only)
 */
export async function createSessions(sessions: Database['public']['Tables']['sessions']['Insert'][]) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('sessions')
    .insert(sessions)
    .select();

  if (error) {
    console.error('Error creating sessions:', error);
    throw error;
  }

  return data;
}

/**
 * Update market session (admin only)
 */
export async function updateSession(
  id: string,
  updates: Database['public']['Tables']['sessions']['Update']
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('sessions')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating session:', error);
    throw error;
  }

  return data;
}

/**
 * Create holiday (admin only)
 */
export async function createHoliday(holiday: Database['public']['Tables']['holidays']['Insert']) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('holidays')
    .insert(holiday)
    .select()
    .single();

  if (error) {
    console.error('Error creating holiday:', error);
    throw error;
  }

  return data;
}

/**
 * Update holiday (admin only)
 */
export async function updateHoliday(
  id: string,
  updates: Database['public']['Tables']['holidays']['Update']
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('holidays')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating holiday:', error);
    throw error;
  }

  return data;
}

/**
 * Delete holiday (admin only)
 */
export async function deleteHoliday(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { error } = await supabaseAdmin
    .from('holidays')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting holiday:', error);
    throw error;
  }
}

/**
 * Update site settings (admin only)
 */
export async function updateSiteSettings(
  updates: Database['public']['Tables']['settings']['Update']
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await supabaseAdmin
    .from('settings')
    .update(updates as any)
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }

  return data;
}

/**
 * Revalidate market data cache
 * This should be called after any admin changes to market data
 */
export async function revalidateMarketData() {
  try {
    // In a real implementation, you'd trigger Next.js revalidation here
    // For now, we'll just log it
    console.log('Market data cache should be revalidated');
    
    // Example: await revalidatePath('/');
    // Example: await revalidateTag('market-data');
  } catch (error) {
    console.error('Error revalidating market data:', error);
  }
}
