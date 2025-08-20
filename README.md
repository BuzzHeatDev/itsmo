# IsTheStockMarketOpen.io

A modern, fast, and accurate website that shows the real-time status of global stock markets. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- **Real-time Market Status**: Shows if 30+ global markets are OPEN, CLOSED, or at LUNCH
- **Accurate Countdowns**: Displays time until next market change (opens/closes/lunch)
- **Global Coverage**: Major markets across US, Europe, Asia, and emerging markets
- **Timezone Aware**: Handles DST transitions and local market times correctly
- **Holiday Support**: Accounts for market holidays and half-day trading
- **Lunch Breaks**: Supports Asian markets with lunch break schedules
- **Mobile First**: Responsive design optimized for all devices
- **Admin Dashboard**: CRUD operations for markets, sessions, and holidays
- **Performance Optimized**: ISR caching with minute-level client updates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Email**: Resend
- **Deployment**: Vercel
- **Monetization**: Google AdSense + Buy Me a Coffee

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd itsmo
pnpm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the migrations:

```bash
# Copy the SQL from supabase/migrations/ and run in Supabase SQL editor
# 1. Run 001_initial_schema.sql
# 2. Run 002_seed_data.sql
```

### 3. Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Database Schema

### Tables

- **markets**: Global stock exchanges with timezone and location info
- **sessions**: Weekly trading schedules (Mon-Fri or Sun-Thu)
- **holidays**: Market holidays and half-day trading schedules
- **settings**: Site configuration (AdSense, contact email, etc.)

### Key Features

- **Row Level Security**: Public read access, admin write access
- **Automatic timestamps**: `created_at` and `updated_at` triggers
- **Data validation**: Constraints for lunch times and holiday overrides
- **Optimized indexes**: For performance on common queries

## Market Data

The app includes 30+ global markets:

### Tier 1 (Major Markets)
- NYSE, NASDAQ (US)
- LSE (UK), Euronext (EU), Xetra (Germany)
- TSE (Japan), HKEX (Hong Kong), SSE (China)
- NSE (India), ASX (Australia)

### Tier 2 (Regional Markets)
- TSX (Canada), KRX (Korea), SGX (Singapore)
- SZSE (China), TWSE (Taiwan), B3 (Brazil)
- JSE (South Africa), European markets

### Tier 3 (Emerging Markets)
- Middle Eastern markets (Saudi, UAE, Egypt)
- Additional European and Asian markets

## Status Engine

The core logic (`lib/statusEngine.ts`) handles:

- **Timezone calculations** with proper DST support
- **Holiday detection** and time overrides
- **Lunch break logic** for Asian markets
- **Weekend handling** and next trading day calculation
- **Real-time countdowns** with human-readable formatting

## Admin Dashboard

Access `/admin` with Supabase authentication to:

- **Manage Markets**: Add/edit/delete market information
- **Configure Sessions**: Set trading hours and lunch breaks
- **Manage Holidays**: Add holidays and half-day schedules
- **Site Settings**: Configure AdSense, contact email, etc.
- **Preview Mode**: Test market status calculations

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Environment Variables for Production

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxx
RESEND_API_KEY=re_xxxxx
OPENAI_API_KEY=sk-xxxxx
```

## Performance

- **ISR Caching**: Market data cached and revalidated on changes
- **Client Updates**: Countdowns update every minute via `setInterval`
- **Optimized Queries**: Parallel fetching and indexed database queries
- **Reserved Ad Space**: Prevents Cumulative Layout Shift (CLS)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: GitHub Issues
- **Email**: Contact form on the website
- **Documentation**: This README and inline code comments

---

Built with ❤️ for the global trading community.