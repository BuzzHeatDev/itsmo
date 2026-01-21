/**
 * ⚠️ DEPRECATED: Client-side data fetching functions are no longer used
 * 
 * Home page now uses static configuration files:
 * - src/config/markets.ts
 * - src/config/sessions.ts
 * - src/config/holidays.ts
 * 
 * Supabase client initialization removed to prevent any module-level queries.
 * Admin/auth functions may still need client - create per-use if needed.
 */

import type { Database } from '../types/database';
import type { createClient } from '@supabase/supabase-js';

// Supabase client no longer initialized at module level
// Prevents any accidental queries during page load
// For admin/auth features, create client on-demand
const supabase: ReturnType<typeof createClient<Database>> | null = null;

// Helper functions for common client-side operations

/**
 * ⚠️ DEPRECATED: These functions are no longer used for runtime data fetching
 * 
 * Home page now uses static configuration files:
 * - src/config/markets.ts
 * - src/config/sessions.ts
 * - src/config/holidays.ts
 * 
 * Functions return empty data to prevent accidental use and ensure no
 * Supabase queries occur during page render.
 */

/**
 * @deprecated Use static config from src/config/markets.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getActiveMarkets() {
  console.warn('⚠️ getActiveMarkets() is deprecated - use static config from src/config/markets.ts');
  return [];
}

/**
 * @deprecated Use static config from src/config/sessions.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getMarketSessions(marketIds: string[]) {
  console.warn('⚠️ getMarketSessions() is deprecated - use static config from src/config/sessions.ts');
  return [];
}

/**
 * @deprecated Use static config from src/config/holidays.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getMarketHolidays(marketIds: string[], daysAhead: number = 30) {
  console.warn('⚠️ getMarketHolidays() is deprecated - use static config from src/config/holidays.ts');
  return [];
}

/**
 * @deprecated Use static config files instead
 * Returns empty data - no Supabase query executed
 */
export async function getCompleteMarketData() {
  console.warn('⚠️ getCompleteMarketData() is deprecated - use static config from src/config/');
  return { markets: [], sessions: [], holidays: [] };
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
