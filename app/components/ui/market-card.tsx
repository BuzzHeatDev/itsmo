'use client';

import { Market, MarketStatusResult } from '@/lib/types/market';

interface MarketCardProps {
  market: Market;
  status: MarketStatusResult;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function MarketCard({ market, status, isExpanded = false, onToggleExpand }: MarketCardProps) {
  // Determine status color and style
  const getStatusStyle = (marketStatus: string) => {
    switch (marketStatus) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LUNCH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        ${isExpanded ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
      onClick={onToggleExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleExpand?.();
        }
      }}
      aria-expanded={isExpanded}
      aria-label={`${market.name} market status: ${status.status}, ${status.label}`}
    >
      {/* Main card content */}
      <div className="flex items-center justify-between">
        {/* Left side: Flag and market info */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {/* Flag */}
          <div className="text-2xl flex-shrink-0" role="img" aria-label={`${market.country} flag`}>
            {market.flag_emoji}
          </div>
          
          {/* Market name and location */}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">
              {market.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {market.city}, {market.country}
            </div>
          </div>
        </div>

        {/* Right side: Status and countdown */}
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          {/* Status pill */}
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium border
            ${getStatusStyle(status.status)}
          `}>
            {status.status}
          </div>
          
          {/* Countdown */}
          <div className="text-sm text-gray-600 text-right">
            {status.label}
          </div>
        </div>
      </div>

      {/* Holiday indicator */}
      {status.isHoliday && (
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
          🎉 {status.holidayName}
        </div>
      )}

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Full Name:</span>
              <span className="ml-2 text-gray-600">{market.name}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Location:</span>
              <span className="ml-2 text-gray-600">{market.city}, {market.country}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Timezone:</span>
              <span className="ml-2 text-gray-600">{market.timezone}</span>
            </div>
            {status.isHoliday && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Holiday:</span>
                <span className="ml-2 text-gray-600">{status.holidayName}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketCard;
