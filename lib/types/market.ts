// Market status types for the status engine
export type MarketStatus = 'OPEN' | 'CLOSED' | 'LUNCH';

// Database types based on our Supabase schema
export interface Market {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  country: string;
  flag_emoji: string;
  city: string;
  timezone: string; // IANA timezone
  tier: number;
  position: number;
  is_active: boolean;
  notes?: string;
}

export interface Session {
  id: string;
  market_id: string;
  weekday: number; // 0-6, 0=Sunday
  open_time: string; // HH:MM format
  close_time: string; // HH:MM format
  has_lunch_break: boolean;
  lunch_open_time?: string; // HH:MM format
  lunch_close_time?: string; // HH:MM format
}

export interface Holiday {
  id: string;
  market_id: string;
  date: string; // YYYY-MM-DD format (local market date)
  name: string;
  is_closed_all_day: boolean;
  open_time_override?: string; // HH:MM format
  close_time_override?: string; // HH:MM format
}

// Status engine result types
export interface MarketStatusResult {
  status: MarketStatus;
  label: string; // "closes in 2h 13m", "opens in 5h 30m", etc.
  nextChangeAtLocal: Date;
  remainingMinutes: number;
  remainingFormatted: string; // "2h 13m" format
  isHoliday?: boolean;
  holidayName?: string;
}

// Combined data for status calculation
export interface MarketData {
  market: Market;
  sessions: Session[];
  holidays: Holiday[];
}
