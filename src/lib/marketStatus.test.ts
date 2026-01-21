import { describe, it, expect } from 'vitest';
import { getMarketStatus } from './marketStatus';

/**
 * Unit tests for getMarketStatus()
 * 
 * Run tests with: pnpm test
 */

describe('getMarketStatus', () => {
  // Note: The getMarketStatus function converts UTC dates to market local time
  // So we provide UTC dates that correspond to the desired local times
  // For example: 2 PM ET = 6 PM UTC (during EST) or 7 PM UTC (during EDT)

  // Test 1: NYSE normal weekday open (Tuesday, 2:00 PM ET)
  it('NYSE normal weekday open', () => {
    // Tuesday, March 18, 2025, 2:00 PM ET (14:00)
    const tuesday = new Date('2025-03-18T18:00:00Z'); // 2 PM ET = 6 PM UTC
    const status = getMarketStatus('nyse-market-id', tuesday);
    
    expect(status.isOpen).toBe(true);
    expect(status.reasonClosed).toBeUndefined();
    expect(status.closesAt).toBeDefined();
    expect(status.opensAt).toBeDefined();
  });

  // Test 2: NYSE before opening hours (Monday, 8:00 AM ET)
  it('NYSE before opening hours', () => {
    // Monday, March 17, 2025, 8:00 AM ET (08:00)
    const monday = new Date('2025-03-17T12:00:00Z'); // 8 AM ET = 12 PM UTC
    const status = getMarketStatus('nyse-market-id', monday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Before trading hours');
    expect(status.opensAt).toBeDefined();
    expect(status.closesAt).toBeDefined();
  });

  // Test 3: NYSE after closing hours (Monday, 5:00 PM ET)
  it('NYSE after closing hours', () => {
    // Monday, March 17, 2025, 5:00 PM ET (17:00)
    const monday = new Date('2025-03-17T21:00:00Z'); // 5 PM ET = 9 PM UTC
    const status = getMarketStatus('nyse-market-id', monday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('After trading hours');
    expect(status.nextChange.getTime()).toBeGreaterThan(monday.getTime());
  });

  // Test 4: LSE weekend closed (Saturday)
  it('LSE weekend closed on Saturday', () => {
    // Saturday, March 22, 2025, 12:00 PM GMT
    const saturday = new Date('2025-03-22T12:00:00Z');
    const status = getMarketStatus('lse-market-id', saturday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Weekend');
    expect(status.nextChange.getTime()).toBeGreaterThan(saturday.getTime());
  });

  // Test 5: LSE weekend closed on Sunday
  it('LSE weekend closed on Sunday', () => {
    // Sunday, March 23, 2025, 12:00 PM GMT
    const sunday = new Date('2025-03-23T12:00:00Z');
    const status = getMarketStatus('lse-market-id', sunday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Weekend');
  });

  // Test 6: Sun-Thu market (TASI) closed on Friday
  it('Sun-Thu market closed on Friday', () => {
    // Friday, March 21, 2025, 12:00 PM AST
    const friday = new Date('2025-03-21T09:00:00Z'); // 12 PM AST = 9 AM UTC (approx)
    const status = getMarketStatus('tasi-market-id', friday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Weekend');
  });

  // Test 7: Sun-Thu market (TASI) open on Sunday
  it('Sun-Thu market open on Sunday', () => {
    // Sunday, March 16, 2025, 12:00 PM AST
    const sunday = new Date('2025-03-16T09:00:00Z'); // 12 PM AST = 9 AM UTC (approx)
    const status = getMarketStatus('tasi-market-id', sunday);
    
    expect(status.isOpen).toBe(true);
    expect(status.reasonClosed).toBeUndefined();
  });

  // Test 8: Market with lunch break - closed during lunch
  it('Market with lunch break closed during lunch', () => {
    // Tokyo Stock Exchange - Tuesday, March 18, 2025, 12:00 PM JST (during lunch)
    const tuesday = new Date('2025-03-18T03:00:00Z'); // 12 PM JST = 3 AM UTC
    const status = getMarketStatus('tse-market-id', tuesday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Lunch break');
    expect(status.opensAt).toBeDefined();
    expect(status.closesAt).toBeDefined();
    expect(status.nextChange.getTime()).toBeGreaterThan(tuesday.getTime());
  });

  // Test 9: Market with lunch break - open before lunch
  it('Market with lunch break open before lunch', () => {
    // Tokyo Stock Exchange - Tuesday, March 18, 2025, 10:00 AM JST (before lunch)
    const tuesday = new Date('2025-03-18T01:00:00Z'); // 10 AM JST = 1 AM UTC
    const status = getMarketStatus('tse-market-id', tuesday);
    
    expect(status.isOpen).toBe(true);
    expect(status.reasonClosed).toBeUndefined();
    expect(status.closesAt).toBeDefined();
  });

  // Test 10: Fixed holiday closure - New Year's Day
  it('Fixed holiday closure - New Year\'s Day', () => {
    // NYSE - January 1, 2025, 12:00 PM ET (New Year's Day)
    const newYear = new Date('2025-01-01T17:00:00Z'); // 12 PM ET = 5 PM UTC
    const status = getMarketStatus('nyse-market-id', newYear);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toContain('New Year');
    expect(status.nextChange.getTime()).toBeGreaterThan(newYear.getTime());
  });

  // Test 11: Rule-based holiday - Good Friday (Easter-derived)
  it('Good Friday closure (Easter-derived)', () => {
    // Good Friday 2025: April 18, 2025
    // NYSE - April 18, 2025, 12:00 PM ET
    const goodFriday = new Date('2025-04-18T16:00:00Z'); // 12 PM ET = 4 PM UTC (EDT)
    const status = getMarketStatus('nyse-market-id', goodFriday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Good Friday');
  });

  // Test 12: Rule-based holiday - Easter Monday (LSE)
  it('Easter Monday closure (LSE)', () => {
    // Easter Monday 2025: April 21, 2025
    // LSE - April 21, 2025, 12:00 PM GMT
    const easterMonday = new Date('2025-04-21T12:00:00Z');
    const status = getMarketStatus('lse-market-id', easterMonday);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Easter Monday');
  });

  // Test 13: Rule-based holiday - MLK Day (3rd Monday of January)
  it('MLK Day closure (3rd Monday of January)', () => {
    // MLK Day 2025: January 20, 2025 (3rd Monday)
    // NYSE - January 20, 2025, 12:00 PM ET
    const mlkDay = new Date('2025-01-20T17:00:00Z'); // 12 PM ET = 5 PM UTC
    const status = getMarketStatus('nyse-market-id', mlkDay);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Martin Luther King Jr. Day');
  });

  // Test 14: Rule-based holiday - Memorial Day (Last Monday of May)
  it('Memorial Day closure (Last Monday of May)', () => {
    // Memorial Day 2025: May 26, 2025 (Last Monday)
    // NYSE - May 26, 2025, 12:00 PM ET
    const memorialDay = new Date('2025-05-26T16:00:00Z'); // 12 PM ET = 4 PM UTC (EDT)
    const status = getMarketStatus('nyse-market-id', memorialDay);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Memorial Day');
  });

  // Test 15: Rule-based holiday - Labor Day (1st Monday of September)
  it('Labor Day closure (1st Monday of September)', () => {
    // Labor Day 2025: September 1, 2025 (1st Monday)
    // NYSE - September 1, 2025, 12:00 PM ET
    const laborDay = new Date('2025-09-01T16:00:00Z'); // 12 PM ET = 4 PM UTC (EDT)
    const status = getMarketStatus('nyse-market-id', laborDay);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Labor Day');
  });

  // Test 16: Rule-based holiday - Thanksgiving (4th Thursday of November)
  it('Thanksgiving closure (4th Thursday of November)', () => {
    // Thanksgiving 2025: November 27, 2025 (4th Thursday)
    // NYSE - November 27, 2025, 12:00 PM ET
    const thanksgiving = new Date('2025-11-27T17:00:00Z'); // 12 PM ET = 5 PM UTC (EST)
    const status = getMarketStatus('nyse-market-id', thanksgiving);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Thanksgiving Day');
  });

  // Test 17: Half-day holiday - Day after Thanksgiving
  it('Half-day holiday - Day after Thanksgiving', () => {
    // Day after Thanksgiving 2025: November 28, 2025
    // NYSE - November 28, 2025, 12:00 PM ET (should be open, closes at 1 PM)
    const dayAfterThanksgiving = new Date('2025-11-28T17:00:00Z'); // 12 PM ET = 5 PM UTC
    const status = getMarketStatus('nyse-market-id', dayAfterThanksgiving);
    
    // Market should be open but will close early
    expect(status.isOpen).toBe(true);
    expect(status.closesAt).toBeDefined();
    // Verify it closes at 1 PM (13:00)
    if (status.closesAt) {
      const closeHour = status.closesAt.getHours();
      expect(closeHour).toBe(13); // 1 PM in local time
    }
  });

  // Test 18: Invalid market ID
  it('Invalid market ID returns error', () => {
    const now = new Date('2025-03-18T12:00:00Z');
    const status = getMarketStatus('invalid-market-id', now);
    
    expect(status.isOpen).toBe(false);
    expect(status.reasonClosed).toBe('Market not found');
    expect(status.nextChange).toEqual(now);
  });
});
