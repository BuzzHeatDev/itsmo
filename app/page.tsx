import MarketGrid from './components/market-grid';
import { getCompleteMarketData } from '@/lib/supabase-data';
import { mockMarkets, mockSessions, mockHolidays } from '@/lib/mock-data';
import SharedHeader from './components/shared-header';
import SharedFooter from './components/shared-footer';

export default async function Home() {
  // Try to fetch real data from Supabase, fallback to mock data
  let marketData;
  try {
    marketData = await getCompleteMarketData();
    
    // If no data from Supabase, use mock data
    if (marketData.markets.length === 0) {
      console.log('No Supabase data found, using mock data');
      marketData = {
        markets: mockMarkets,
        sessions: mockSessions,
        holidays: mockHolidays,
      };
    } else {
      console.log(`Loaded ${marketData.markets.length} markets from Supabase`);
    }
  } catch (error) {
    console.error('Error loading market data, using mock data:', error);
    marketData = {
      markets: mockMarkets,
      sessions: mockSessions,
      holidays: mockHolidays,
    };
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      {/* Main content with top padding to account for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <MarketGrid 
          markets={marketData.markets}
          sessions={marketData.sessions}
          holidays={marketData.holidays}
        />
      </main>

      <SharedFooter />
    </div>
  );
}
