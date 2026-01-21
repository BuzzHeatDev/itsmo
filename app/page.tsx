import MarketGrid from './components/market-grid';
import { markets } from '@/src/config/markets';
import { sessions } from '@/src/config/sessions';
import { holidays } from '@/src/config/holidays';
import SharedHeader from './components/shared-header';
import SharedFooter from './components/shared-footer';

export default function Home() {
  // Use static configuration instead of Supabase queries
  const marketData = {
    markets,
    sessions,
    holidays,
  };
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
