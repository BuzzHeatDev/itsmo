-- Fixed initial schema for IsTheStockMarketOpen.io
-- Based on PRD requirements with support for ~30 global markets

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    country TEXT NOT NULL,
    flag_emoji TEXT NOT NULL,
    city TEXT NOT NULL,
    timezone TEXT NOT NULL, -- IANA timezone (e.g., "America/New_York")
    tier INTEGER NOT NULL DEFAULT 2, -- 1 = major markets, 2 = regional, 3 = emerging
    position INTEGER NOT NULL DEFAULT 0, -- for ordering within tier
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (regular weekly schedule)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6), -- 0=Sunday, 6=Saturday
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    has_lunch_break BOOLEAN NOT NULL DEFAULT false,
    lunch_open_time TIME, -- when lunch break starts (market closes for lunch)
    lunch_close_time TIME, -- when lunch break ends (market reopens)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_lunch_times CHECK (
        (has_lunch_break = false) OR 
        (has_lunch_break = true AND lunch_open_time IS NOT NULL AND lunch_close_time IS NOT NULL)
    ),
    CONSTRAINT lunch_within_trading_hours CHECK (
        (has_lunch_break = false) OR
        (lunch_open_time > open_time AND lunch_close_time < close_time)
    ),
    UNIQUE(market_id, weekday)
);

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    date DATE NOT NULL, -- local market date (YYYY-MM-DD)
    name TEXT NOT NULL,
    is_closed_all_day BOOLEAN NOT NULL DEFAULT true,
    open_time_override TIME, -- for half-day holidays
    close_time_override TIME, -- for half-day holidays
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate holidays for same market/date
    UNIQUE(market_id, date)
);

-- Settings table (singleton for site configuration)
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    adsense_client_id TEXT,
    buymeacoffee_url TEXT,
    contact_forward_email TEXT,
    show_openai_quips BOOLEAN NOT NULL DEFAULT false,
    site_name TEXT NOT NULL DEFAULT 'IsTheStockMarketOpen',
    default_timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure only one settings row
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_markets_active_tier_position ON markets(is_active, tier, position) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_markets_slug ON markets(slug);
CREATE INDEX IF NOT EXISTS idx_sessions_market_weekday ON sessions(market_id, weekday);
CREATE INDEX IF NOT EXISTS idx_holidays_market_date ON holidays(market_id, date);
CREATE INDEX IF NOT EXISTS idx_holidays_date_range ON holidays(date);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (drop first if they exist)
DROP TRIGGER IF EXISTS update_markets_updated_at ON markets;
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS update_holidays_updated_at ON holidays;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;

CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) setup
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON markets;
DROP POLICY IF EXISTS "Public read access" ON sessions;
DROP POLICY IF EXISTS "Public read access" ON holidays;
DROP POLICY IF EXISTS "Public read access" ON settings;
DROP POLICY IF EXISTS "Admin write access" ON markets;
DROP POLICY IF EXISTS "Admin write access" ON sessions;
DROP POLICY IF EXISTS "Admin write access" ON holidays;
DROP POLICY IF EXISTS "Admin write access" ON settings;

-- Public read access for all tables (homepage needs to read market data)
CREATE POLICY "Public read access" ON markets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON holidays FOR SELECT USING (true);
CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);

-- Admin write access (requires authentication)
-- Note: In production, you'd want to check for specific admin roles
CREATE POLICY "Admin write access" ON markets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON holidays FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings row
INSERT INTO settings (id, site_name, default_timezone, contact_forward_email) 
VALUES (1, 'IsTheStockMarketOpen', 'UTC', 'admin@isthestockmarketopen.io')
ON CONFLICT (id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE markets IS 'Global stock markets and exchanges';
COMMENT ON TABLE sessions IS 'Regular weekly trading sessions for each market';
COMMENT ON TABLE holidays IS 'Market holidays and special trading days';
COMMENT ON TABLE settings IS 'Site-wide configuration settings';

COMMENT ON COLUMN markets.tier IS '1=Major markets (NYSE, NASDAQ), 2=Regional, 3=Emerging';
COMMENT ON COLUMN markets.position IS 'Sort order within tier (lower = higher priority)';
COMMENT ON COLUMN sessions.weekday IS '0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN sessions.lunch_open_time IS 'Time when market closes for lunch break';
COMMENT ON COLUMN sessions.lunch_close_time IS 'Time when market reopens after lunch';
COMMENT ON COLUMN holidays.is_closed_all_day IS 'If false, use time overrides for partial trading';
