import { Market, Session, Holiday, MarketStatusResult } from './types/market';

/**
 * Simple and reliable market status engine
 * Uses server UTC time and converts to market local time for calculations
 * 
 * USAGE EXAMPLE:
 * ```typescript
 * // Get current market status
 * const status = await calculateMarketStatus(market, sessions, holidays);
 * 
 * // Or with specific time
 * const status = await calculateMarketStatus(market, sessions, holidays, new Date());
 * 
 * // Status will include:
 * // - status: 'OPEN' | 'CLOSED' | 'LUNCH'
 * // - label: human-readable description
 * // - nextChangeAtLocal: when status will change
 * // - remainingMinutes: time until next change
 * // - remainingFormatted: formatted time string
 * ```
 */

/**
 * Convert UTC time to market local time
 * Returns the local time in the market's timezone
 */
function getMarketLocalTime(utcTime: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(utcTime);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Get market local date as YYYY-MM-DD string
 */
function getMarketLocalDate(utcTime: Date, timezone: string): string {
  const localTime = getMarketLocalTime(utcTime, timezone);
  return localTime.toISOString().split('T')[0];
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format remaining time as "Xh Ym" (no seconds)
 */
function formatRemainingTime(remainingMinutes: number): string {
  if (remainingMinutes <= 0) return '0m';
  
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Check if a market is closed due to holidays
 */
function isMarketClosedForHoliday(market: Market, localDate: string, holidays: Holiday[]): Holiday | null {
  return holidays.find(h => h.market_id === market.id && h.date === localDate) || null;
}

/**
 * Find the next trading day for a market
 */
function findNextTradingDay(market: Market, utcTime: Date, sessions: Session[], holidays: Holiday[]): Date | null {
  let checkDate = new Date(utcTime);
  let attempts = 0;
  const maxAttempts = 30; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Move to next day
    checkDate.setDate(checkDate.getDate() + 1);
    const checkLocalDate = getMarketLocalDate(checkDate, market.timezone);
    
    // Check if it's a holiday
    const holiday = holidays.find(h => h.market_id === market.id && h.date === checkLocalDate);
    if (holiday) continue;
    
    // Check if it's a weekend
    const localTime = getMarketLocalTime(checkDate, market.timezone);
    const weekday = localTime.getDay();
    const hasSession = sessions.some(s => s.market_id === market.id && s.weekday === weekday);
    
    if (hasSession) return checkDate;
  }
  
  return null;
}

/**
 * Get the effective trading session for a market on a specific date
 */
function getEffectiveSession(market: Market, utcTime: Date, sessions: Session[], holidays: Holiday[]): Session | null {
  const localDate = getMarketLocalDate(utcTime, market.timezone);
  const localTime = getMarketLocalTime(utcTime, market.timezone);
  const weekday = localTime.getDay();
  
  // Check if it's a holiday
  const holiday = isMarketClosedForHoliday(market, localDate, holidays);
  if (holiday && holiday.is_closed_all_day) {
    return null; // Market is closed all day
  }
  
  // Find the session for this weekday
  return sessions.find(s => s.market_id === market.id && s.weekday === weekday) || null;
}

/**
 * Calculate market status based on current time and schedule
 */
export async function calculateMarketStatus(
  market: Market,
  sessions: Session[],
  holidays: Holiday[],
  utcTime: Date = new Date()
): Promise<MarketStatusResult> {
  console.log(`🔍 Starting status calculation for ${market.name}`);
  
  // Get current time in market's local timezone
  const marketLocalTime = getMarketLocalTime(utcTime, market.timezone);
  const currentMinutes = marketLocalTime.getHours() * 60 + marketLocalTime.getMinutes();
  
  console.log(`🕐 ${market.name} local time: ${marketLocalTime.toLocaleString()}, current minutes: ${currentMinutes}`);
  
  // Get effective trading session for today
  const session = getEffectiveSession(market, utcTime, sessions, holidays);
  
  console.log(`📅 ${market.name} session:`, session ? {
    weekday: session.weekday,
    open_time: session.open_time,
    close_time: session.close_time,
    has_lunch_break: session.has_lunch_break
  } : 'No session today');
  
  if (!session) {
    // Market is closed today (holiday or no session)
    console.log(`🚫 ${market.name} is closed today, finding next trading day`);
    const nextTradingDay = findNextTradingDay(market, utcTime, sessions, holidays);
    
    if (nextTradingDay) {
      const nextLocalTime = getMarketLocalTime(nextTradingDay, market.timezone);
      const nextWeekday = nextLocalTime.getDay();
      const nextSession = sessions.find(s => s.market_id === market.id && s.weekday === nextWeekday);
      
      if (nextSession) {
        const [nextOpenHour, nextOpenMinute] = nextSession.open_time.split(':').map(Number);
        const nextOpenTime = new Date(nextLocalTime);
        nextOpenTime.setHours(nextOpenHour, nextOpenMinute, 0, 0);
        
        const minutesUntilNextOpen = Math.floor((nextOpenTime.getTime() - utcTime.getTime()) / (1000 * 60));
        
        console.log(`⏰ ${market.name} next open: ${nextOpenTime.toLocaleString()} (in ${formatRemainingTime(minutesUntilNextOpen)})`);
        
        return {
          status: 'CLOSED',
          label: `opens in ${formatRemainingTime(minutesUntilNextOpen)}`,
          nextChangeAtLocal: nextOpenTime,
          remainingMinutes: minutesUntilNextOpen,
          remainingFormatted: formatRemainingTime(minutesUntilNextOpen),
        };
      }
      
      return {
        status: 'CLOSED',
        label: `opens ${nextLocalTime.toLocaleDateString()}`,
        nextChangeAtLocal: nextLocalTime,
        remainingMinutes: 0,
        remainingFormatted: '0m',
      };
    }
    
    return {
      status: 'CLOSED',
      label: 'closed indefinitely',
      nextChangeAtLocal: utcTime,
      remainingMinutes: 0,
      remainingFormatted: '0m',
    };
  }
  
  const openMinutes = timeToMinutes(session.open_time);
  const closeMinutes = timeToMinutes(session.close_time);
  
  console.log(`⏰ ${market.name} trading hours: ${session.open_time} - ${session.close_time} (${openMinutes} - ${closeMinutes})`);
  
  // Handle lunch break if it exists
  if (session.has_lunch_break && session.lunch_open_time && session.lunch_close_time) {
    const lunchStartMinutes = timeToMinutes(session.lunch_open_time);
    const lunchEndMinutes = timeToMinutes(session.lunch_close_time);
    
    console.log(`🍽️ ${market.name} lunch break: ${session.lunch_open_time} - ${session.lunch_close_time}`);
    
    if (currentMinutes >= openMinutes && currentMinutes < lunchStartMinutes) {
      // Before lunch - market is open
      const minutesUntilLunch = lunchStartMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `lunch in ${formatRemainingTime(minutesUntilLunch)}`,
        nextChangeAtLocal: new Date(marketLocalTime.getTime() + minutesUntilLunch * 60000),
        remainingMinutes: minutesUntilLunch,
        remainingFormatted: formatRemainingTime(minutesUntilLunch),
      };
    } else if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
      // During lunch
      const minutesUntilReopen = lunchEndMinutes - currentMinutes;
      return {
        status: 'LUNCH',
        label: `reopens in ${formatRemainingTime(minutesUntilReopen)}`,
        nextChangeAtLocal: new Date(marketLocalTime.getTime() + minutesUntilReopen * 60000),
        remainingMinutes: minutesUntilReopen,
        remainingFormatted: formatRemainingTime(minutesUntilReopen),
      };
    } else if (currentMinutes >= lunchEndMinutes && currentMinutes < closeMinutes) {
      // After lunch - market is open
      const minutesUntilClose = closeMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `closes in ${formatRemainingTime(minutesUntilClose)}`,
        nextChangeAtLocal: new Date(marketLocalTime.getTime() + minutesUntilClose * 60000),
        remainingMinutes: minutesUntilClose,
        remainingFormatted: formatRemainingTime(minutesUntilClose),
      };
    }
  } else {
    // No lunch break
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      // Market is open
      const minutesUntilClose = closeMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `closes in ${formatRemainingTime(minutesUntilClose)}`,
        nextChangeAtLocal: new Date(marketLocalTime.getTime() + minutesUntilClose * 60000),
        remainingMinutes: minutesUntilClose,
        remainingFormatted: formatRemainingTime(minutesUntilClose),
      };
    }
  }
  
  // Market is closed
  if (currentMinutes < openMinutes) {
    // Market opens later today
    const minutesUntilOpen = openMinutes - currentMinutes;
    return {
      status: 'CLOSED',
      label: `opens in ${formatRemainingTime(minutesUntilOpen)}`,
      nextChangeAtLocal: new Date(marketLocalTime.getTime() + minutesUntilOpen * 60000),
      remainingMinutes: minutesUntilOpen,
      remainingFormatted: formatRemainingTime(minutesUntilOpen),
    };
  } else {
    // Closed for the day, find next trading day
    const nextTradingDay = findNextTradingDay(market, utcTime, sessions, holidays);
    
    if (nextTradingDay) {
      const nextLocalTime = getMarketLocalTime(nextTradingDay, market.timezone);
      const nextWeekday = nextLocalTime.getDay();
      const nextSession = sessions.find(s => s.market_id === market.id && s.weekday === nextWeekday);
      
      if (nextSession) {
        const [nextOpenHour, nextOpenMinute] = nextSession.open_time.split(':').map(Number);
        const nextOpenTime = new Date(nextLocalTime);
        nextOpenTime.setHours(nextOpenHour, nextOpenMinute, 0, 0);
        
        const minutesUntilNextOpen = Math.floor((nextOpenTime.getTime() - utcTime.getTime()) / (1000 * 60));
        
        return {
          status: 'CLOSED',
          label: `opens in ${formatRemainingTime(minutesUntilNextOpen)}`,
          nextChangeAtLocal: nextOpenTime,
          remainingMinutes: minutesUntilNextOpen,
          remainingFormatted: formatRemainingTime(minutesUntilNextOpen),
        };
      }
    }
    
    return {
      status: 'CLOSED',
      label: 'closed indefinitely',
      nextChangeAtLocal: utcTime,
      remainingMinutes: 0,
      remainingFormatted: '0m',
    };
  }
}

// Legacy function names for backward compatibility
export const findHolidayForDate = (market: Market, date: Date, holidays: Holiday[]): Holiday | null => {
  const localDate = getMarketLocalDate(date, market.timezone);
  return holidays.find(h => h.market_id === market.id && h.date === localDate) || null;
};

export const getEffectiveSchedule = getEffectiveSession;
