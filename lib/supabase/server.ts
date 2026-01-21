// Supabase client for server-side operations
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

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
 * ⚠️ DEPRECATED: This function is no longer used for runtime data fetching
 * 
 * Home page now uses static configuration files:
 * - src/config/markets.ts
 * - src/config/sessions.ts
 * - src/config/holidays.ts
 * 
 * @deprecated Use static config files instead
 * Returns empty data - no Supabase query executed
 */
export async function getCompleteMarketDataServer() {
  console.warn('⚠️ getCompleteMarketDataServer() is deprecated - use static config from src/config/');
  return { markets: [], sessions: [], holidays: [] };
}

/**
 * @deprecated Not used on home page
 * Returns null - no Supabase query executed
 */
export async function getSiteSettingsServer() {
  console.warn('⚠️ getSiteSettingsServer() is deprecated - not used on home page');
  return null;
}

// Admin functions using service role key

/**
 * Create a new market (admin only)
 */
export async function createMarket(market: Database['public']['Tables']['markets']['Insert']) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('markets')
    .insert(market)
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
  updates: any
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const { data, error } = await (supabaseAdmin as any)
    .from('markets')
    .update(updates)
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

  const { data, error } = await (supabaseAdmin as any)
    .from('sessions')
    .insert(sessions as any)
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

  const { data, error } = await (supabaseAdmin as any)
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

  const { data, error } = await (supabaseAdmin as any)
    .from('holidays')
    .insert(holiday as any)
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

  const { data, error } = await (supabaseAdmin as any)
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

  const { data, error } = await (supabaseAdmin as any)
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
