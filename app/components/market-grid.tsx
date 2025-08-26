'use client';

import { useState, useEffect, useCallback } from 'react';
import { Market, Session, Holiday, MarketStatusResult } from '@/lib/types/market';
import { calculateMarketStatus } from '@/lib/status-engine';
import { MarketCard } from './ui/market-card';

// Client-side UTC time component to avoid hydration errors
function UTCTimeDisplay() {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    setUtcTime(new Date().toISOString());
    const interval = setInterval(() => {
      setUtcTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-gray-500">
      Server UTC: {utcTime || 'Loading...'}
    </div>
  );
}

interface MarketGridProps {
  markets: Market[];
  sessions: Session[];
  holidays: Holiday[];
}

export function MarketGrid({ markets, sessions, holidays }: MarketGridProps) {
  const [marketStatuses, setMarketStatuses] = useState<Map<string, MarketStatusResult>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate all market statuses
  const calculateAllStatuses = useCallback(async () => {
    const now = new Date(); // Use server UTC time directly
    console.log('🕐 Calculating market statuses at:', now.toISOString());
    
    const statusMap = new Map<string, MarketStatusResult>();
    
    for (const market of markets) {
      try {
        const marketSessions = sessions.filter(s => s.market_id === market.id);
        const marketHolidays = holidays.filter(h => h.market_id === market.id);
        
        console.log(`🔍 Calculating status for ${market.name}:`, {
          sessions: marketSessions.length,
          holidays: marketHolidays.length,
          timezone: market.timezone
        });
        
        const status = await calculateMarketStatus(market, marketSessions, marketHolidays, now);
        statusMap.set(market.id, status);
        
        console.log(`✅ ${market.name}: ${status.status} - ${status.label}`);
      } catch (error) {
        console.error(`❌ Error calculating status for ${market.name}:`, error);
        // Set a fallback status
        statusMap.set(market.id, {
          status: 'CLOSED',
          label: 'Error calculating status',
          nextChangeAtLocal: now,
          remainingMinutes: 0,
          remainingFormatted: '0m',
        });
      }
    }
    
    setMarketStatuses(statusMap);
    setLastUpdate(now);
    setIsLoading(false);
    console.log('✅ Updated market statuses successfully');
  }, [markets, sessions, holidays]);

  // Initial calculation
  useEffect(() => {
    const initStatuses = async () => {
      await calculateAllStatuses();
    };
    initStatuses();
  }, [calculateAllStatuses]);

  // Update every minute
  useEffect(() => {
    const interval = setInterval(async () => {
      await calculateAllStatuses();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [calculateAllStatuses]);

  // Group markets by tier
  const marketsByTier = markets.reduce((acc, market) => {
    if (!acc[market.tier]) {
      acc[market.tier] = [];
    }
    acc[market.tier].push(market);
    return acc;
  }, {} as Record<number, Market[]>);

  // Sort each tier by position
  Object.keys(marketsByTier).forEach(tier => {
    marketsByTier[parseInt(tier)].sort((a, b) => a.position - b.position);
  });

  const getTierTitle = (tier: number) => {
    switch (tier) {
      case 1:
        return 'Major Markets';
      case 2:
        return 'Regional Markets';
      case 3:
        return 'Emerging Markets';
      default:
        return `Tier ${tier} Markets`;
    }
  };

  const handleToggleExpand = (marketId: string) => {
    setExpandedMarket(expandedMarket === marketId ? null : marketId);
  };

  // Show loading state if no markets
  if (!markets || markets.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Is The Stock Market Open?
          </h1>
          <p className="text-gray-600 text-sm">Loading markets...</p>
        </div>
      </div>
    );
  }

  // Show loading state while calculating statuses
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Is The Stock Market Open?
          </h1>
          <p className="text-gray-600 text-sm">Checking market statuses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with live indicator */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Is The Stock Market Open?
        </h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-medium">Live</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{markets.length} markets</span>
        </div>
        
      </div>

      {/* Markets grouped by tier */}
      {[1, 2, 3].map(tier => {
        const tierMarkets = marketsByTier[tier];
        if (!tierMarkets || tierMarkets.length === 0) return null;

        return (
          <section key={tier} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              {getTierTitle(tier)}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tierMarkets.map(market => {
                const status = marketStatuses.get(market.id);
                // Only show status if it's been calculated
                if (!status) {
                  return (
                    <div key={market.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl" role="img" aria-label={`${market.country} flag`}>
                          {market.flag_emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate">
                            {market.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {market.city}, {market.country}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          Loading...
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <MarketCard
                    key={market.id}
                    market={market}
                    status={status}
                    sessions={sessions.filter(s => s.market_id === market.id)}
                    isExpanded={expandedMarket === market.id}
                    onToggleExpand={() => handleToggleExpand(market.id)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* UTC time display */}
      <div className="text-center mt-4">
        <UTCTimeDisplay />
      </div>

    </div>
  );
}

export default MarketGrid;
