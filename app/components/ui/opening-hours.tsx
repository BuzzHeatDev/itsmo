'use client';

import { Session } from '@/lib/types/market';

interface OpeningHoursProps {
  sessions: Session[];
  className?: string;
}

const WEEKDAYS = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export function OpeningHours({ sessions, className }: OpeningHoursProps) {
  // Sort sessions by weekday (0-6)
  const sortedSessions = [...sessions].sort((a, b) => a.weekday - b.weekday);

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    // Extract just the HH:MM part from the time string
    return time.substring(0, 5);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📅</span>
          <h4 className="font-medium text-gray-800">Opening Hours</h4>
        </div>
        
        <div className="space-y-2 text-sm">
          {sortedSessions.map((session) => (
            <div key={session.weekday} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-700 min-w-[80px]">
                {WEEKDAYS[session.weekday]}
              </span>
              <div className="text-right text-gray-600">
                <div className="font-medium">
                  {formatTime(session.open_time)} - {formatTime(session.close_time)}
                </div>
                {session.has_lunch_break && session.lunch_open_time && session.lunch_close_time && (
                  <div className="text-xs text-gray-500">
                    Lunch: {formatTime(session.lunch_open_time)} - {formatTime(session.lunch_close_time)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
