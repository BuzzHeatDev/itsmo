-- Initial schema for IsTheStockMarketOpen.io
-- Migration: 001
-- Created: 2025-08-20
-- Description: Create markets, sessions, holidays, and settings tables

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
    date DATE NOT NULL,
    name TEXT NOT NULL,
    is_closed_all_day BOOLEAN NOT NULL DEFAULT true,
    close_time_override TIME, -- for half-day holidays
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_half_day_holiday CHECK (
        (is_closed_all_day = true) OR 
        (is_closed_all_day = false AND close_time_override IS NOT NULL)
    ),
    UNIQUE(market_id, date)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    site_name TEXT NOT NULL DEFAULT 'IsTheStockMarketOpen.io',
    default_timezone TEXT NOT NULL DEFAULT 'UTC',
    adsense_client_id TEXT,
    buymeacoffee_url TEXT,
    contact_forward_email TEXT,
    show_openai_quips BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_markets_active_tier_position ON markets (is_active, tier, position);
CREATE INDEX IF NOT EXISTS idx_sessions_market_weekday ON sessions (market_id, weekday);
CREATE INDEX IF NOT EXISTS idx_holidays_market_date ON holidays (market_id, date);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, authenticated write)
CREATE POLICY "Public can read markets" ON markets FOR SELECT USING (true);
CREATE POLICY "Authenticated can write markets" ON markets FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Authenticated can write sessions" ON sessions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read holidays" ON holidays FOR SELECT USING (true);
CREATE POLICY "Authenticated can write holidays" ON holidays FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can write settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (site_name, default_timezone) 
VALUES ('IsTheStockMarketOpen.io', 'UTC')
ON CONFLICT (id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE markets IS 'Global stock market exchanges';
COMMENT ON TABLE sessions IS 'Regular trading hours for each market by weekday';
COMMENT ON TABLE holidays IS 'Market holidays and closures';
COMMENT ON TABLE settings IS 'Site-wide configuration settings';

COMMENT ON COLUMN markets.tier IS '1=Major markets, 2=Regional, 3=Emerging';
COMMENT ON COLUMN markets.position IS 'Sort order within tier (lower = higher priority)';
COMMENT ON COLUMN sessions.weekday IS '0=Sunday, 1=Monday, ..., 6=Saturday';
