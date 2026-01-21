/**
 * ⚠️ DEPRECATED: This file is no longer used for runtime data fetching
 * 
 * Home page now uses static configuration files:
 * - src/config/markets.ts
 * - src/config/sessions.ts  
 * - src/config/holidays.ts
 * 
 * This file is kept for reference only. All functions return empty data
 * to prevent accidental use and ensure no Supabase queries occur during
 * page render.
 * 
 * NO SUPABASE CLIENT INITIALIZATION - prevents any module-level queries.
 */

import { Market, Session, Holiday } from './types/market';

/**
 * @deprecated Use static config from src/config/markets.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getActiveMarkets(): Promise<Market[]> {
  console.warn('⚠️ getActiveMarkets() is deprecated - use static config from src/config/markets.ts');
  return [];
}

/**
 * @deprecated Use static config from src/config/sessions.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getMarketSessions(marketIds: string[]): Promise<Session[]> {
  console.warn('⚠️ getMarketSessions() is deprecated - use static config from src/config/sessions.ts');
  return [];
}

/**
 * @deprecated Use static config from src/config/holidays.ts instead
 * Returns empty array - no Supabase query executed
 */
export async function getMarketHolidays(marketIds: string[], daysAhead: number = 30): Promise<Holiday[]> {
  console.warn('⚠️ getMarketHolidays() is deprecated - use static config from src/config/holidays.ts');
  return [];
}

/**
 * @deprecated Use static config files instead
 * Returns empty data - no Supabase query executed
 */
export async function getCompleteMarketData(): Promise<{
  markets: Market[];
  sessions: Session[];
  holidays: Holiday[];
}> {
  console.warn('⚠️ getCompleteMarketData() is deprecated - use static config from src/config/');
  return { markets: [], sessions: [], holidays: [] };
}

/**
 * @deprecated No longer needed for runtime
 * Returns false - no Supabase query executed
 */
export async function testSupabaseConnection(): Promise<boolean> {
  console.warn('⚠️ testSupabaseConnection() is deprecated - not used for runtime');
  return false;
}
