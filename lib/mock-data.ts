// Mock data for development - will be replaced with Supabase data
import { Market, Session, Holiday } from './types/market';

export const mockMarkets: Market[] = [
  // Tier 1 - Major Markets
  {
    id: 'nyse-001',
    slug: 'nyse',
    name: 'NYSE & NASDAQ',
    short_name: 'NYSE/NASDAQ',
    country: 'United States',
    flag_emoji: '🇺🇸',
    city: 'New York',
    timezone: 'America/New_York',
    tier: 1,
    position: 1,
    is_active: true,
  },
  {
    id: 'lse-001',
    slug: 'lse',
    name: 'London Stock Exchange',
    short_name: 'LSE',
    country: 'United Kingdom',
    flag_emoji: '🇬🇧',
    city: 'London',
    timezone: 'Europe/London',
    tier: 1,
    position: 2,
    is_active: true,
  },
  {
    id: 'enx-001',
    slug: 'euronext-paris',
    name: 'Euronext Paris',
    short_name: 'ENX',
    country: 'France/EU',
    flag_emoji: '🇪🇺🇫🇷',
    city: 'Paris',
    timezone: 'Europe/Paris',
    tier: 1,
    position: 3,
    is_active: true,
  },
  {
    id: 'dax-001',
    slug: 'dax',
    name: 'Deutsche Börse (DAX)',
    short_name: 'DAX',
    country: 'Germany/EU',
    flag_emoji: '🇪🇺🇩🇪',
    city: 'Frankfurt',
    timezone: 'Europe/Berlin',
    tier: 1,
    position: 4,
    is_active: true,
  },
  {
    id: 'tse-001',
    slug: 'tse',
    name: 'Tokyo Stock Exchange',
    short_name: 'TSE',
    country: 'Japan',
    flag_emoji: '🇯🇵',
    city: 'Tokyo',
    timezone: 'Asia/Tokyo',
    tier: 1,
    position: 5,
    is_active: true,
  },
  {
    id: 'hkex-001',
    slug: 'hkex',
    name: 'Hong Kong Stock Exchange',
    short_name: 'HKEX',
    country: 'Hong Kong',
    flag_emoji: '🇭🇰',
    city: 'Hong Kong',
    timezone: 'Asia/Hong_Kong',
    tier: 1,
    position: 6,
    is_active: true,
  },
  {
    id: 'sse-001',
    slug: 'sse',
    name: 'Shanghai Stock Exchange',
    short_name: 'SSE',
    country: 'China',
    flag_emoji: '🇨🇳',
    city: 'Shanghai',
    timezone: 'Asia/Shanghai',
    tier: 1,
    position: 8,
    is_active: true,
  },
  {
    id: 'nse-001',
    slug: 'nse',
    name: 'National Stock Exchange of India',
    short_name: 'NSE',
    country: 'India',
    flag_emoji: '🇮🇳',
    city: 'Mumbai',
    timezone: 'Asia/Kolkata',
    tier: 1,
    position: 9,
    is_active: true,
  },
  {
    id: 'asx-001',
    slug: 'asx',
    name: 'Australian Securities Exchange',
    short_name: 'ASX',
    country: 'Australia',
    flag_emoji: '🇦🇺',
    city: 'Sydney',
    timezone: 'Australia/Sydney',
    tier: 1,
    position: 10,
    is_active: true,
  },

  // Tier 2 - Regional Markets (sample)
  {
    id: 'tsx-001',
    slug: 'tsx',
    name: 'Toronto Stock Exchange',
    short_name: 'TSX',
    country: 'Canada',
    flag_emoji: '🇨🇦',
    city: 'Toronto',
    timezone: 'America/Toronto',
    tier: 2,
    position: 1,
    is_active: true,
  },
  {
    id: 'krx-001',
    slug: 'krx',
    name: 'Korea Exchange',
    short_name: 'KRX',
    country: 'South Korea',
    flag_emoji: '🇰🇷',
    city: 'Seoul',
    timezone: 'Asia/Seoul',
    tier: 2,
    position: 2,
    is_active: true,
  },
  {
    id: 'sgx-001',
    slug: 'sgx',
    name: 'Singapore Exchange',
    short_name: 'SGX',
    country: 'Singapore',
    flag_emoji: '🇸🇬',
    city: 'Singapore',
    timezone: 'Asia/Singapore',
    tier: 2,
    position: 3,
    is_active: true,
  },

  // Tier 3 - Emerging Markets (sample)
  {
    id: 'bmv-001',
    slug: 'bmv',
    name: 'Bolsa Mexicana de Valores',
    short_name: 'BMV',
    country: 'Mexico',
    flag_emoji: '🇲🇽',
    city: 'Mexico City',
    timezone: 'America/Mexico_City',
    tier: 3,
    position: 1,
    is_active: true,
  },
  {
    id: 'tasi-001',
    slug: 'tasi',
    name: 'Saudi Stock Exchange (Tadawul)',
    short_name: 'TASI',
    country: 'Saudi Arabia',
    flag_emoji: '🇸🇦',
    city: 'Riyadh',
    timezone: 'Asia/Riyadh',
    tier: 3,
    position: 2,
    is_active: true,
  },
];

export const mockSessions: Session[] = [
  // US Markets (NYSE/NASDAQ combined) - Monday-Friday, 9:30 AM - 4:00 PM ET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-nyse-001-${weekday}`,
    market_id: 'nyse-001',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  })),

  // London Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-lse-001-${weekday}`,
    market_id: 'lse-001',
    weekday,
    open_time: '08:00',
    close_time: '16:30',
    has_lunch_break: false,
  })),

  // European Markets - Monday-Friday, 9:00 AM - 5:30 PM CET/CEST
  ...['enx-001', 'dax-001'].flatMap(marketId =>
    [1, 2, 3, 4, 5].map(weekday => ({
      id: `session-${marketId}-${weekday}`,
      market_id: marketId,
      weekday,
      open_time: '09:00',
      close_time: '17:30',
      has_lunch_break: false,
    }))
  ),

  // Tokyo Stock Exchange - Monday-Friday with lunch break
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-tse-001-${weekday}`,
    market_id: 'tse-001',
    weekday,
    open_time: '09:00',
    close_time: '15:00',
    has_lunch_break: true,
    lunch_open_time: '11:30',
    lunch_close_time: '12:30',
  })),

  // Hong Kong Stock Exchange - Monday-Friday with lunch break
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-hkex-001-${weekday}`,
    market_id: 'hkex-001',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: true,
    lunch_open_time: '12:00',
    lunch_close_time: '13:00',
  })),

  // Shanghai Stock Exchange - Monday-Friday with lunch break
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-sse-001-${weekday}`,
    market_id: 'sse-001',
    weekday,
    open_time: '09:30',
    close_time: '15:00',
    has_lunch_break: true,
    lunch_open_time: '11:30',
    lunch_close_time: '13:00',
  })),

  // Indian Markets - Monday-Friday, 9:15 AM - 3:30 PM IST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-nse-001-${weekday}`,
    market_id: 'nse-001',
    weekday,
    open_time: '09:15',
    close_time: '15:30',
    has_lunch_break: false,
  })),

  // Australian Securities Exchange - Monday-Friday, 10:00 AM - 4:00 PM AEST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-asx-001-${weekday}`,
    market_id: 'asx-001',
    weekday,
    open_time: '10:00',
    close_time: '16:00',
    has_lunch_break: false,
  })),

  // Toronto Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM ET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-tsx-001-${weekday}`,
    market_id: 'tsx-001',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  })),

  // Korea Exchange - Monday-Friday, 9:00 AM - 3:30 PM KST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-krx-001-${weekday}`,
    market_id: 'krx-001',
    weekday,
    open_time: '09:00',
    close_time: '15:30',
    has_lunch_break: false,
  })),

  // Singapore Exchange - Monday-Friday, 9:00 AM - 5:00 PM SGT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-sgx-001-${weekday}`,
    market_id: 'sgx-001',
    weekday,
    open_time: '09:00',
    close_time: '17:00',
    has_lunch_break: false,
  })),

  // Mexican Stock Exchange - Monday-Friday, 8:30 AM - 3:00 PM CT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-bmv-001-${weekday}`,
    market_id: 'bmv-001',
    weekday,
    open_time: '08:30',
    close_time: '15:00',
    has_lunch_break: false,
  })),

  // Saudi Stock Exchange - Sunday-Thursday, 10:00 AM - 3:00 PM AST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-tasi-001-${weekday}`,
    market_id: 'tasi-001',
    weekday,
    open_time: '10:00',
    close_time: '15:00',
    has_lunch_break: false,
  })),
];

export const mockHolidays: Holiday[] = [
  // Sample US holidays for 2024 (combined NYSE/NASDAQ)
  {
    id: 'holiday-1',
    market_id: 'nyse-001',
    date: '2024-01-01',
    name: 'New Year\'s Day',
    is_closed_all_day: true,
  },
  {
    id: 'holiday-3',
    market_id: 'nyse-001',
    date: '2024-12-25',
    name: 'Christmas Day',
    is_closed_all_day: true,
  },
  
  // Sample UK holidays
  {
    id: 'holiday-5',
    market_id: 'lse-001',
    date: '2024-01-01',
    name: 'New Year\'s Day',
    is_closed_all_day: true,
  },
  {
    id: 'holiday-6',
    market_id: 'lse-001',
    date: '2024-12-25',
    name: 'Christmas Day',
    is_closed_all_day: true,
  },
  
  // Sample half-day holiday
  {
    id: 'holiday-7',
    market_id: 'nyse-001',
    date: '2024-11-29',
    name: 'Day after Thanksgiving',
    is_closed_all_day: false,
    close_time_override: '13:00',
  },
];
