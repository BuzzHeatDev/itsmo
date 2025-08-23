'use client';

import { useState, useEffect, useCallback } from 'react';
import { Market, Session, Holiday, MarketStatusResult } from '@/lib/types/market';
import { calculateMarketStatus } from '@/lib/status-engine';
import MarketCard from './ui/market-card';

interface MarketGridProps {
  markets: Market[];
  sessions: Session[];
  holidays: Holiday[];
}

export function MarketGrid({ markets, sessions, holidays }: MarketGridProps) {
  const [marketStatuses, setMarketStatuses] = useState<Map<string, MarketStatusResult>>(new Map());
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate market statuses
  const calculateAllStatuses = useCallback(() => {
    const now = new Date();
    const statusMap = new Map<string, MarketStatusResult>();
    
    markets.forEach(market => {
      const marketSessions = sessions.filter(s => s.market_id === market.id);
      const marketHolidays = holidays.filter(h => h.market_id === market.id);
      const status = calculateMarketStatus(market, marketSessions, marketHolidays, now);
      statusMap.set(market.id, status);
    });
    
    setMarketStatuses(statusMap);
    setLastUpdate(now);
  }, [markets, sessions, holidays]);

  // Initial calculation
  useEffect(() => {
    calculateAllStatuses();
  }, [calculateAllStatuses]);

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      calculateAllStatuses();
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

  return (
    <div className="space-y-8">
      {/* Header with live indicator */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Is The Stock Market Open?
        </h1>
        <div className="flex items-center justify-center space-x-2">
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
          <section key={tier} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
              {getTierTitle(tier)}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tierMarkets.map(market => {
                const status = marketStatuses.get(market.id);
                // Temporary fix: provide a default status if calculation fails
                const defaultStatus: MarketStatusResult = {
                  status: 'CLOSED' as const,
                  label: 'Status calculating...',
                  isHoliday: false,
                  holidayName: undefined,
                  nextChangeAtLocal: new Date(),
                  remainingMinutes: 0,
                  remainingFormatted: '0m'
                };
                const displayStatus = status || defaultStatus;

                return (
                  <MarketCard
                    key={market.id}
                    market={market}
                    status={displayStatus}
                    isExpanded={expandedMarket === market.id}
                    onToggleExpand={() => handleToggleExpand(market.id)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}


    </div>
  );
}

export default MarketGrid;
