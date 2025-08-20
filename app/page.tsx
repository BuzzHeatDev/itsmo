import MarketGrid from './components/market-grid';
import { getCompleteMarketData } from '@/lib/supabase-data';
import { mockMarkets, mockSessions, mockHolidays } from '@/lib/mock-data';
import Image from 'next/image';

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image 
                src="/branding/itsmo logo3.jpeg" 
                alt="IsTheStockMarketOpen Logo" 
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-gray-900">IsTheStockMarket</span>
                <span className="text-green-600">Open</span>
                <span className="text-orange-500">?</span>
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Live updates every minute
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Real-time global market status
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with top padding to account for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <MarketGrid 
          markets={marketData.markets}
          sessions={marketData.sessions}
          holidays={marketData.holidays}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              © 2024 IsTheStockMarketOpen.io - Real-time global market status
            </p>
            <div className="flex justify-center space-x-6">
              <a href="/about" className="hover:text-gray-700">About</a>
              <a href="/privacy" className="hover:text-gray-700">Privacy</a>
              <a href="/contact" className="hover:text-gray-700">Contact</a>
              <a href="/terms" className="hover:text-gray-700">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
