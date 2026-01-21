import type { Session } from '@/lib/types/market';

/**
 * Static session configuration
 * This replaces Supabase queries for the home page
 * Generated from supabase/migrations/20250820_005_complete_setup.sql
 */

export const sessions: Session[] = [
  // US Markets (NYSE, NASDAQ) - Monday-Friday, 9:30 AM - 4:00 PM ET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-nyse-${weekday}`,
    market_id: 'nyse-market-id',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  } as Session)),
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-nasdaq-${weekday}`,
    market_id: 'nasdaq-market-id',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  } as Session)),

  // London Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-lse-${weekday}`,
    market_id: 'lse-market-id',
    weekday,
    open_time: '08:00',
    close_time: '16:30',
    has_lunch_break: false,
  } as Session)),

  // European Markets - Monday-Friday, 9:00 AM - 5:30 PM CET/CEST
  ...['euronext-paris-market-id', 'xetra-market-id', 'bit-market-id', 'bme-market-id', 'vse-market-id'].flatMap(marketId =>
    [1, 2, 3, 4, 5].map(weekday => ({
      id: `session-${marketId}-${weekday}`,
      market_id: marketId,
      weekday,
      open_time: '09:00',
      close_time: '17:30',
      has_lunch_break: false,
    } as Session))
  ),

  // OMX Nordic - Monday-Friday, 9:00 AM - 5:25 PM CET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-omx-stockholm-${weekday}`,
    market_id: 'omx-stockholm-market-id',
    weekday,
    open_time: '09:00',
    close_time: '17:25',
    has_lunch_break: false,
  } as Session)),

  // SIX Swiss Exchange - Monday-Friday, 9:00 AM - 5:30 PM CET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-six-swiss-${weekday}`,
    market_id: 'six-swiss-market-id',
    weekday,
    open_time: '09:00',
    close_time: '17:30',
    has_lunch_break: false,
  } as Session)),

  // Tokyo Stock Exchange - Monday-Friday, 9:00 AM - 3:00 PM JST (with lunch 11:30-12:30)
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-tse-${weekday}`,
    market_id: 'tse-market-id',
    weekday,
    open_time: '09:00',
    close_time: '15:00',
    has_lunch_break: true,
    lunch_open_time: '11:30',
    lunch_close_time: '12:30',
  } as Session)),

  // Hong Kong Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM HKT (with lunch 12:00-1:00 PM)
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-hkex-${weekday}`,
    market_id: 'hkex-market-id',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: true,
    lunch_open_time: '12:00',
    lunch_close_time: '13:00',
  } as Session)),

  // Chinese Markets - Monday-Friday, 9:30 AM - 3:00 PM CST (with lunch 11:30 AM - 1:00 PM)
  ...['sse-market-id', 'szse-market-id'].flatMap(marketId =>
    [1, 2, 3, 4, 5].map(weekday => ({
      id: `session-${marketId}-${weekday}`,
      market_id: marketId,
      weekday,
      open_time: '09:30',
      close_time: '15:00',
      has_lunch_break: true,
      lunch_open_time: '11:30',
      lunch_close_time: '13:00',
    } as Session))
  ),

  // Indian Markets - Monday-Friday, 9:15 AM - 3:30 PM IST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-nse-${weekday}`,
    market_id: 'nse-market-id',
    weekday,
    open_time: '09:15',
    close_time: '15:30',
    has_lunch_break: false,
  } as Session)),

  // Canadian Markets - Monday-Friday, 9:30 AM - 4:00 PM ET
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-tsx-${weekday}`,
    market_id: 'tsx-market-id',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  } as Session)),

  // Australian Securities Exchange - Monday-Friday, 10:00 AM - 4:00 PM AEST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-asx-${weekday}`,
    market_id: 'asx-market-id',
    weekday,
    open_time: '10:00',
    close_time: '16:00',
    has_lunch_break: false,
  } as Session)),

  // Korea Exchange - Monday-Friday, 9:00 AM - 3:30 PM KST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-krx-${weekday}`,
    market_id: 'krx-market-id',
    weekday,
    open_time: '09:00',
    close_time: '15:30',
    has_lunch_break: false,
  } as Session)),

  // Singapore Exchange - Monday-Friday, 9:00 AM - 5:00 PM SGT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-sgx-${weekday}`,
    market_id: 'sgx-market-id',
    weekday,
    open_time: '09:00',
    close_time: '17:00',
    has_lunch_break: false,
  } as Session)),

  // Taiwan Stock Exchange - Monday-Friday, 9:00 AM - 1:30 PM CST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-twse-${weekday}`,
    market_id: 'twse-market-id',
    weekday,
    open_time: '09:00',
    close_time: '13:30',
    has_lunch_break: false,
  } as Session)),

  // Mexican Stock Exchange - Monday-Friday, 8:30 AM - 3:00 PM CT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-bmv-${weekday}`,
    market_id: 'bmv-market-id',
    weekday,
    open_time: '08:30',
    close_time: '15:00',
    has_lunch_break: false,
  } as Session)),

  // B3 Brazil - Monday-Friday, 10:00 AM - 5:00 PM BRT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-b3-${weekday}`,
    market_id: 'b3-market-id',
    weekday,
    open_time: '10:00',
    close_time: '17:00',
    has_lunch_break: false,
  } as Session)),

  // Santiago Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM CLT
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-bcs-${weekday}`,
    market_id: 'bcs-market-id',
    weekday,
    open_time: '09:30',
    close_time: '16:00',
    has_lunch_break: false,
  } as Session)),

  // Johannesburg Stock Exchange - Monday-Friday, 9:00 AM - 5:00 PM SAST
  ...[1, 2, 3, 4, 5].map(weekday => ({
    id: `session-jse-${weekday}`,
    market_id: 'jse-market-id',
    weekday,
    open_time: '09:00',
    close_time: '17:00',
    has_lunch_break: false,
  } as Session)),

  // Egyptian Exchange - Sunday-Thursday, 10:00 AM - 2:30 PM EET
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-egx-${weekday}`,
    market_id: 'egx-market-id',
    weekday,
    open_time: '10:00',
    close_time: '14:30',
    has_lunch_break: false,
  } as Session)),

  // Saudi Stock Exchange - Sunday-Thursday, 10:00 AM - 3:00 PM AST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-tasi-${weekday}`,
    market_id: 'tasi-market-id',
    weekday,
    open_time: '10:00',
    close_time: '15:00',
    has_lunch_break: false,
  } as Session)),

  // Amman Stock Exchange - Sunday-Thursday, 10:00 AM - 12:00 PM AST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-ase-${weekday}`,
    market_id: 'ase-market-id',
    weekday,
    open_time: '10:00',
    close_time: '12:00',
    has_lunch_break: false,
  } as Session)),

  // Dubai Financial Market - Sunday-Thursday, 10:00 AM - 2:00 PM GST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-dfm-${weekday}`,
    market_id: 'dfm-market-id',
    weekday,
    open_time: '10:00',
    close_time: '14:00',
    has_lunch_break: false,
  } as Session)),

  // Qatar Exchange - Sunday-Thursday, 9:30 AM - 1:00 PM AST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-qe-${weekday}`,
    market_id: 'qe-market-id',
    weekday,
    open_time: '09:30',
    close_time: '13:00',
    has_lunch_break: false,
  } as Session)),

  // Kuwait Stock Exchange - Sunday-Thursday, 9:30 AM - 12:30 PM AST
  ...[0, 1, 2, 3, 4].map(weekday => ({
    id: `session-kse-${weekday}`,
    market_id: 'kse-market-id',
    weekday,
    open_time: '09:30',
    close_time: '12:30',
    has_lunch_break: false,
  } as Session)),
];
