import { Market, Session, Holiday, MarketStatusResult } from './types/market';

/**
 * Core status engine that determines if a market is open, closed, or at lunch
 * Handles timezones, DST, holidays, and lunch breaks correctly
 */

/**
 * Get current time in a specific timezone
 */
function getTimeInTimezone(date: Date, timezone: string): Date {
  // Use Intl.DateTimeFormat to get the time in the target timezone
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

  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Create a Date object for a specific time on a given date in a timezone
 */
function createDateTimeInTimezone(date: Date, timeStr: string, timezone: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const localDate = getTimeInTimezone(date, timezone);
  
  // Create a new date with the specified time
  const targetDate = new Date(localDate);
  targetDate.setHours(hours, minutes, 0, 0);
  
  return targetDate;
}

/**
 * Find holiday for a specific date and market
 */
function findHolidayForDate(market: Market, date: Date, holidays: Holiday[]): Holiday | null {
  const localDate = getTimeInTimezone(date, market.timezone);
  const dateStr = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
  return holidays.find(h => h.market_id === market.id && h.date === dateStr) || null;
}

/**
 * Get effective schedule for a market on a specific date
 */
function getEffectiveSchedule(
  market: Market,
  date: Date,
  sessions: Session[],
  holidays: Holiday[]
) {
  const localDate = getTimeInTimezone(date, market.timezone);
  const weekday = localDate.getDay(); // 0=Sunday, 6=Saturday
  const holiday = findHolidayForDate(market, date, holidays);
  
  // Find the regular session for this weekday
  const session = sessions.find(s => s.market_id === market.id && s.weekday === weekday);
  
  if (!session) {
    return null; // No trading session for this weekday
  }
  
  // If it's a holiday that's closed all day
  if (holiday?.is_closed_all_day) {
    return {
      openTime: null,
      closeTime: null,
      hasLunchBreak: false,
      isHoliday: true,
      holidayName: holiday.name,
    };
  }
  
  // If it's a holiday with time overrides
  if (holiday && (holiday.open_time_override || holiday.close_time_override)) {
    return {
      openTime: holiday.open_time_override || session.open_time,
      closeTime: holiday.close_time_override || session.close_time,
      hasLunchBreak: session.has_lunch_break && !holiday.open_time_override, // Disable lunch on partial holidays
      lunchOpenTime: session.lunch_open_time,
      lunchCloseTime: session.lunch_close_time,
      isHoliday: true,
      holidayName: holiday.name,
    };
  }
  
  // Regular trading day
  return {
    openTime: session.open_time,
    closeTime: session.close_time,
    hasLunchBreak: session.has_lunch_break,
    lunchOpenTime: session.lunch_open_time,
    lunchCloseTime: session.lunch_close_time,
    isHoliday: false,
  };
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
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time as minutes since midnight in market timezone
 */
function getCurrentTimeInMarket(now: Date, timezone: string): number {
  const localTime = getTimeInTimezone(now, timezone);
  return localTime.getHours() * 60 + localTime.getMinutes();
}

/**
 * Find next trading day (skipping weekends and holidays)
 */
function findNextTradingDay(
  market: Market,
  currentDate: Date,
  sessions: Session[],
  holidays: Holiday[],
  maxDaysToCheck: number = 14
): Date | null {
  const checkDate = new Date(currentDate);
  checkDate.setDate(checkDate.getDate() + 1);
  
  for (let i = 0; i < maxDaysToCheck; i++) {
    const schedule = getEffectiveSchedule(market, checkDate, sessions, holidays);
    
    // If there's a schedule and it's not closed all day
    if (schedule && schedule.openTime) {
      return checkDate;
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return null; // Couldn't find next trading day within reasonable range
}

/**
 * Calculate minutes until a specific time today or tomorrow
 */
function getMinutesUntilTime(
  now: Date,
  targetTimeStr: string,
  timezone: string,
  allowTomorrow: boolean = false
): number {
  const currentMinutes = getCurrentTimeInMarket(now, timezone);
  const targetMinutes = timeToMinutes(targetTimeStr);
  
  if (targetMinutes > currentMinutes) {
    // Target time is later today
    return targetMinutes - currentMinutes;
  } else if (allowTomorrow) {
    // Target time is tomorrow
    return (24 * 60) - currentMinutes + targetMinutes;
  } else {
    return 0;
  }
}

/**
 * Main function to calculate market status
 */
export function calculateMarketStatus(
  market: Market,
  sessions: Session[],
  holidays: Holiday[],
  now: Date = new Date()
): MarketStatusResult {
  const schedule = getEffectiveSchedule(market, now, sessions, holidays);
  
  if (!schedule || !schedule.openTime || !schedule.closeTime) {
    // No session found or market is closed all day
    const nextTradingDay = findNextTradingDay(market, now, sessions, holidays);
    const nextSession = nextTradingDay 
      ? sessions.find(s => s.market_id === market.id && s.weekday === getTimeInTimezone(nextTradingDay, market.timezone).getDay())
      : null;
    
    if (nextSession && nextTradingDay) {
      // Calculate time until next opening
      const daysUntilNext = Math.floor((nextTradingDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const minutesUntilOpen = daysUntilNext * 24 * 60 + getMinutesUntilTime(now, nextSession.open_time, market.timezone, true);
      
      return {
        status: 'CLOSED',
        label: `opens in ${formatRemainingTime(minutesUntilOpen)}`,
        nextChangeAtLocal: createDateTimeInTimezone(nextTradingDay, nextSession.open_time, market.timezone),
        remainingMinutes: minutesUntilOpen,
        remainingFormatted: formatRemainingTime(minutesUntilOpen),
        isHoliday: schedule?.isHoliday,
        holidayName: schedule?.holidayName,
      };
    }
    
    // Fallback
    return {
      status: 'CLOSED',
      label: 'closed',
      nextChangeAtLocal: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      remainingMinutes: 0,
      remainingFormatted: '0m',
      isHoliday: schedule?.isHoliday,
      holidayName: schedule?.holidayName,
    };
  }
  
  const currentMinutes = getCurrentTimeInMarket(now, market.timezone);
  const openMinutes = timeToMinutes(schedule.openTime);
  const closeMinutes = timeToMinutes(schedule.closeTime);
  
  // Handle lunch break if it exists
  if (schedule.hasLunchBreak && schedule.lunchOpenTime && schedule.lunchCloseTime) {
    const lunchStartMinutes = timeToMinutes(schedule.lunchOpenTime);
    const lunchEndMinutes = timeToMinutes(schedule.lunchCloseTime);
    
    if (currentMinutes >= openMinutes && currentMinutes < lunchStartMinutes) {
      // Morning session - open until lunch
      const minutesUntilLunch = lunchStartMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `lunch in ${formatRemainingTime(minutesUntilLunch)}`,
        nextChangeAtLocal: createDateTimeInTimezone(now, schedule.lunchOpenTime, market.timezone),
        remainingMinutes: minutesUntilLunch,
        remainingFormatted: formatRemainingTime(minutesUntilLunch),
        isHoliday: schedule.isHoliday,
        holidayName: schedule.holidayName,
      };
    } else if (currentMinutes >= lunchStartMinutes && currentMinutes < lunchEndMinutes) {
      // Lunch break
      const minutesUntilReopen = lunchEndMinutes - currentMinutes;
      return {
        status: 'LUNCH',
        label: `reopens in ${formatRemainingTime(minutesUntilReopen)}`,
        nextChangeAtLocal: createDateTimeInTimezone(now, schedule.lunchCloseTime, market.timezone),
        remainingMinutes: minutesUntilReopen,
        remainingFormatted: formatRemainingTime(minutesUntilReopen),
        isHoliday: schedule.isHoliday,
        holidayName: schedule.holidayName,
      };
    } else if (currentMinutes >= lunchEndMinutes && currentMinutes < closeMinutes) {
      // Afternoon session - open until close
      const minutesUntilClose = closeMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `closes in ${formatRemainingTime(minutesUntilClose)}`,
        nextChangeAtLocal: createDateTimeInTimezone(now, schedule.closeTime, market.timezone),
        remainingMinutes: minutesUntilClose,
        remainingFormatted: formatRemainingTime(minutesUntilClose),
        isHoliday: schedule.isHoliday,
        holidayName: schedule.holidayName,
      };
    }
  } else {
    // No lunch break - simple open/close
    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      // Market is open
      const minutesUntilClose = closeMinutes - currentMinutes;
      return {
        status: 'OPEN',
        label: `closes in ${formatRemainingTime(minutesUntilClose)}`,
        nextChangeAtLocal: createDateTimeInTimezone(now, schedule.closeTime, market.timezone),
        remainingMinutes: minutesUntilClose,
        remainingFormatted: formatRemainingTime(minutesUntilClose),
        isHoliday: schedule.isHoliday,
        holidayName: schedule.holidayName,
      };
    }
  }
  
  // Market is closed - find next opening
  if (currentMinutes < openMinutes) {
    // Closed, opens later today
    const minutesUntilOpen = openMinutes - currentMinutes;
    return {
      status: 'CLOSED',
      label: `opens in ${formatRemainingTime(minutesUntilOpen)}`,
      nextChangeAtLocal: createDateTimeInTimezone(now, schedule.openTime, market.timezone),
      remainingMinutes: minutesUntilOpen,
      remainingFormatted: formatRemainingTime(minutesUntilOpen),
      isHoliday: schedule.isHoliday,
      holidayName: schedule.holidayName,
    };
  } else {
    // Closed for the day, find next trading day
    const nextTradingDay = findNextTradingDay(market, now, sessions, holidays);
    const nextSession = nextTradingDay 
      ? sessions.find(s => s.market_id === market.id && s.weekday === getTimeInTimezone(nextTradingDay, market.timezone).getDay())
      : null;
    
    if (nextSession && nextTradingDay) {
      const daysUntilNext = Math.floor((nextTradingDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const minutesUntilOpen = daysUntilNext * 24 * 60 + getMinutesUntilTime(now, nextSession.open_time, market.timezone, true);
      
      return {
        status: 'CLOSED',
        label: `opens in ${formatRemainingTime(minutesUntilOpen)}`,
        nextChangeAtLocal: createDateTimeInTimezone(nextTradingDay, nextSession.open_time, market.timezone),
        remainingMinutes: minutesUntilOpen,
        remainingFormatted: formatRemainingTime(minutesUntilOpen),
        isHoliday: schedule.isHoliday,
        holidayName: schedule.holidayName,
      };
    }
    
    // Fallback
    return {
      status: 'CLOSED',
      label: 'closed',
      nextChangeAtLocal: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      remainingMinutes: 0,
      remainingFormatted: '0m',
      isHoliday: schedule.isHoliday,
      holidayName: schedule.holidayName,
    };
  }
}
