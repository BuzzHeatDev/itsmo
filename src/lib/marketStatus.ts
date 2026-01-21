import { markets } from '@/src/config/markets';
import { sessions } from '@/src/config/sessions';
import { holidays } from '@/src/config/holidays';
import type { Market, Session, Holiday } from '@/lib/types/market';

/**
 * Market status computation engine
 * 
 * Computes whether a market is open or closed based on:
 * - Custom weekends per market (via sessions)
 * - Lunch breaks
 * - Fixed holidays
 * - Rule-based holidays (nth weekday, Easter-derived)
 */

export interface MarketStatus {
  isOpen: boolean;
  reasonClosed?: string;
  nextChange: Date;
  closesAt?: Date;
  opensAt?: Date;
}

/**
 * Calculate Easter date for a given year using Anonymous Gregorian algorithm
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month, day);
}

/**
 * Calculate nth weekday of a month (e.g., 3rd Monday of May)
 * @param year - Year
 * @param month - Month (0-11)
 * @param weekday - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @param n - Nth occurrence (1=first, 2=second, etc., -1=last)
 */
function getNthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  
  let dayOffset = (weekday - firstWeekday + 7) % 7;
  
  if (n > 0) {
    // Nth occurrence (e.g., 3rd Monday)
    dayOffset += (n - 1) * 7;
  } else if (n === -1) {
    // Last occurrence
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDay();
    const daysFromLast = (lastWeekday - weekday + 7) % 7;
    dayOffset = lastDay.getDate() - daysFromLast - 1;
  }
  
  return new Date(year, month, 1 + dayOffset);
}

/**
 * Generate rule-based holidays for a market on a specific date
 * Currently supports common rule-based holidays
 */
function getRuleBasedHolidays(marketSlug: string, date: Date): Holiday[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const weekday = date.getDay();
  const holidays: Holiday[] = [];
  
  // Easter calculation
  const easter = calculateEaster(year);
  const easterMonth = easter.getMonth();
  const easterDay = easter.getDate();
  
  // US Market holidays (NYSE/NASDAQ)
  if (marketSlug === 'nyse' || marketSlug === 'nasdaq') {
    // MLK Day: 3rd Monday of January
    const mlkDay = getNthWeekday(year, 0, 1, 3);
    if (mlkDay.getMonth() === month && mlkDay.getDate() === day) {
      holidays.push({
        id: `rule-mlk-${year}`,
        market_id: '', // Will be filled later
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Martin Luther King Jr. Day',
        is_closed_all_day: true,
      });
    }
    
    // Presidents Day: 3rd Monday of February
    const presidentsDay = getNthWeekday(year, 1, 1, 3);
    if (presidentsDay.getMonth() === month && presidentsDay.getDate() === day) {
      holidays.push({
        id: `rule-presidents-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Presidents Day',
        is_closed_all_day: true,
      });
    }
    
    // Memorial Day: Last Monday of May
    const memorialDay = getNthWeekday(year, 4, 1, -1);
    if (memorialDay.getMonth() === month && memorialDay.getDate() === day) {
      holidays.push({
        id: `rule-memorial-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Memorial Day',
        is_closed_all_day: true,
      });
    }
    
    // Labor Day: 1st Monday of September
    const laborDay = getNthWeekday(year, 8, 1, 1);
    if (laborDay.getMonth() === month && laborDay.getDate() === day) {
      holidays.push({
        id: `rule-labor-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Labor Day',
        is_closed_all_day: true,
      });
    }
    
    // Thanksgiving: 4th Thursday of November
    const thanksgiving = getNthWeekday(year, 10, 4, 4);
    if (thanksgiving.getMonth() === month && thanksgiving.getDate() === day) {
      holidays.push({
        id: `rule-thanksgiving-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Thanksgiving Day',
        is_closed_all_day: true,
      });
    }
    
    // Good Friday: Friday before Easter
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    if (goodFriday.getMonth() === month && goodFriday.getDate() === day) {
      holidays.push({
        id: `rule-goodfriday-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Good Friday',
        is_closed_all_day: true,
      });
    }
  }
  
  // UK Market holidays (LSE)
  if (marketSlug === 'lse') {
    // Easter Monday: Monday after Easter
    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);
    if (easterMonday.getMonth() === month && easterMonday.getDate() === day) {
      holidays.push({
        id: `rule-eastermonday-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Easter Monday',
        is_closed_all_day: true,
      });
    }
    
    // Early May Bank Holiday: 1st Monday of May
    const earlyMay = getNthWeekday(year, 4, 1, 1);
    if (earlyMay.getMonth() === month && earlyMay.getDate() === day) {
      holidays.push({
        id: `rule-earlymay-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Early May Bank Holiday',
        is_closed_all_day: true,
      });
    }
    
    // Spring Bank Holiday: Last Monday of May
    const springBank = getNthWeekday(year, 4, 1, -1);
    if (springBank.getMonth() === month && springBank.getDate() === day) {
      holidays.push({
        id: `rule-springbank-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Spring Bank Holiday',
        is_closed_all_day: true,
      });
    }
    
    // Summer Bank Holiday: Last Monday of August
    const summerBank = getNthWeekday(year, 7, 1, -1);
    if (summerBank.getMonth() === month && summerBank.getDate() === day) {
      holidays.push({
        id: `rule-summerbank-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Summer Bank Holiday',
        is_closed_all_day: true,
      });
    }
    
    // Good Friday: Friday before Easter
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    if (goodFriday.getMonth() === month && goodFriday.getDate() === day) {
      holidays.push({
        id: `rule-goodfriday-${year}`,
        market_id: '',
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        name: 'Good Friday',
        is_closed_all_day: true,
      });
    }
  }
  
  return holidays;
}

/**
 * Convert UTC time to market local time
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
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(utcTime);
  const year = parts.find(p => p.type === 'year')?.value || '0';
  const month = parts.find(p => p.type === 'month')?.value || '0';
  const day = parts.find(p => p.type === 'day')?.value || '0';

  return `${year}-${month}-${day}`;
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get all holidays (fixed + rule-based) for a market on a specific date
 */
function getAllHolidaysForDate(market: Market, date: Date): Holiday[] {
  const localDate = getMarketLocalDate(date, market.timezone);
  
  // Get fixed holidays from config
  const fixedHolidays = holidays.filter(
    h => h.market_id === market.id && h.date === localDate
  );
  
  // Get rule-based holidays
  const ruleBased = getRuleBasedHolidays(market.slug, date);
  ruleBased.forEach(h => {
    h.market_id = market.id;
  });
  
  return [...fixedHolidays, ...ruleBased];
}

/**
 * Find the next trading day for a market
 */
function findNextTradingDay(market: Market, utcTime: Date, marketSessions: Session[]): Date {
  let checkDate = new Date(utcTime);
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    attempts++;
    checkDate.setDate(checkDate.getDate() + 1);
    
    const localDate = getMarketLocalDate(checkDate, market.timezone);
    const localTime = getMarketLocalTime(checkDate, market.timezone);
    const weekday = localTime.getDay();
    
    // Check if it's a holiday (fixed or rule-based)
    const holidaysForDate = getAllHolidaysForDate(market, checkDate);
    const isHoliday = holidaysForDate.some(h => h.is_closed_all_day);
    if (isHoliday) continue;
    
    // Check if it's a trading day (has a session)
    const hasSession = marketSessions.some(s => s.weekday === weekday);
    if (hasSession) return checkDate;
  }
  
  return checkDate; // Fallback
}

/**
 * Get market status at a given time
 * @param marketId - Market ID
 * @param now - Current UTC time
 * @returns Market status with open/closed state and next change time
 */
export function getMarketStatus(marketId: string, now: Date = new Date()): MarketStatus {
  // Find market
  const market = markets.find(m => m.id === marketId);
  if (!market) {
    return {
      isOpen: false,
      reasonClosed: 'Market not found',
      nextChange: now,
    };
  }
  
  // Get sessions for this market
  const marketSessions = sessions.filter(s => s.market_id === marketId);
  if (marketSessions.length === 0) {
    return {
      isOpen: false,
      reasonClosed: 'No trading sessions configured',
      nextChange: now,
    };
  }
  
  // Get local time and date
  const localTime = getMarketLocalTime(now, market.timezone);
  const localDate = getMarketLocalDate(now, market.timezone);
  const weekday = localTime.getDay();
  const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();
  
  // Check for holidays (fixed + rule-based)
  const holidaysForDate = getAllHolidaysForDate(market, now);
  const holiday = holidaysForDate.find(h => h.date === localDate && h.is_closed_all_day);
  
  if (holiday) {
    // Market is closed for holiday - find next trading day
    const nextTradingDay = findNextTradingDay(market, now, marketSessions);
    const nextLocalTime = getMarketLocalTime(nextTradingDay, market.timezone);
    const nextWeekday = nextLocalTime.getDay();
    const nextSession = marketSessions.find(s => s.weekday === nextWeekday);
    
    if (nextSession) {
      const [openHour, openMinute] = nextSession.open_time.split(':').map(Number);
      const opensAt = new Date(nextLocalTime);
      opensAt.setHours(openHour, openMinute, 0, 0);
      
      return {
        isOpen: false,
        reasonClosed: holiday.name,
        nextChange: opensAt,
        opensAt,
      };
    }
    
    return {
      isOpen: false,
      reasonClosed: holiday.name,
      nextChange: nextTradingDay,
    };
  }
  
  // Check if it's a weekend (no session for this weekday)
  const session = marketSessions.find(s => s.weekday === weekday);
  if (!session) {
    // Weekend - find next trading day
    const nextTradingDay = findNextTradingDay(market, now, marketSessions);
    const nextLocalTime = getMarketLocalTime(nextTradingDay, market.timezone);
    const nextWeekday = nextLocalTime.getDay();
    const nextSession = marketSessions.find(s => s.weekday === nextWeekday);
    
    if (nextSession) {
      const [openHour, openMinute] = nextSession.open_time.split(':').map(Number);
      const opensAt = new Date(nextLocalTime);
      opensAt.setHours(openHour, openMinute, 0, 0);
      
      return {
        isOpen: false,
        reasonClosed: 'Weekend',
        nextChange: opensAt,
        opensAt,
      };
    }
    
    return {
      isOpen: false,
      reasonClosed: 'Weekend',
      nextChange: nextTradingDay,
    };
  }
  
  // Check for half-day holiday
  const halfDayHoliday = holidaysForDate.find(
    h => h.date === localDate && !h.is_closed_all_day && h.close_time_override
  );
  
  const openMinutes = timeToMinutes(halfDayHoliday ? session.open_time : session.open_time);
  const closeMinutes = timeToMinutes(halfDayHoliday?.close_time_override || session.close_time);
  
  // Calculate open/close times for today
  const [openHour, openMinute] = session.open_time.split(':').map(Number);
  const opensAt = new Date(localTime);
  opensAt.setHours(openHour, openMinute, 0, 0);
  
  const [closeHour, closeMinute] = (halfDayHoliday?.close_time_override || session.close_time).split(':').map(Number);
  const closesAt = new Date(localTime);
  closesAt.setHours(closeHour, closeMinute, 0, 0);
  
  // Check lunch break
  if (session.has_lunch_break && session.lunch_open_time && session.lunch_close_time) {
    const lunchStartMinutes = timeToMinutes(session.lunch_open_time);
    const lunchEndMinutes = timeToMinutes(session.lunch_close_time);
    
    if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
      // During lunch break
      const lunchEnd = new Date(localTime);
      const [lunchEndHour, lunchEndMinute] = session.lunch_close_time.split(':').map(Number);
      lunchEnd.setHours(lunchEndHour, lunchEndMinute, 0, 0);
      
      return {
        isOpen: false,
        reasonClosed: 'Lunch break',
        nextChange: lunchEnd,
        opensAt: lunchEnd,
        closesAt,
      };
    }
  }
  
  // Check if market is open
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      nextChange: closesAt,
      closesAt,
      opensAt,
    };
  }
  
  // Market is closed (before open or after close)
  if (currentMinutes < openMinutes) {
    // Before opening time
    return {
      isOpen: false,
      reasonClosed: 'Before trading hours',
      nextChange: opensAt,
      opensAt,
      closesAt,
    };
  } else {
    // After closing time - find next trading day
    const nextTradingDay = findNextTradingDay(market, now, marketSessions);
    const nextLocalTime = getMarketLocalTime(nextTradingDay, market.timezone);
    const nextWeekday = nextLocalTime.getDay();
    const nextSession = marketSessions.find(s => s.weekday === nextWeekday);
    
    if (nextSession) {
      const [nextOpenHour, nextOpenMinute] = nextSession.open_time.split(':').map(Number);
      const opensAt = new Date(nextLocalTime);
      opensAt.setHours(nextOpenHour, nextOpenMinute, 0, 0);
      
      return {
        isOpen: false,
        reasonClosed: 'After trading hours',
        nextChange: opensAt,
        opensAt,
      };
    }
    
    return {
      isOpen: false,
      reasonClosed: 'After trading hours',
      nextChange: nextTradingDay,
    };
  }
}
