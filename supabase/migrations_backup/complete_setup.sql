-- Complete setup for IsTheStockMarketOpen.io
-- This file creates all tables AND populates them with data
-- Run this single file in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS sessions CASCADE; 
DROP TABLE IF EXISTS markets CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Markets table
CREATE TABLE markets (
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
CREATE TABLE sessions (
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
CREATE TABLE holidays (
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
CREATE TABLE settings (
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
CREATE INDEX idx_markets_active_tier_position ON markets(is_active, tier, position) WHERE is_active = true;
CREATE INDEX idx_markets_slug ON markets(slug);
CREATE INDEX idx_sessions_market_weekday ON sessions(market_id, weekday);
CREATE INDEX idx_holidays_market_date ON holidays(market_id, date);
CREATE INDEX idx_holidays_date_range ON holidays(date);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_markets_updated_at BEFORE UPDATE ON markets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON holidays FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) setup
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (homepage needs to read market data)
CREATE POLICY "Public read access" ON markets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON holidays FOR SELECT USING (true);
CREATE POLICY "Public read access" ON settings FOR SELECT USING (true);

-- Admin write access (requires authentication)
CREATE POLICY "Admin write access" ON markets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON holidays FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings row
INSERT INTO settings (id, site_name, default_timezone, contact_forward_email) 
VALUES (1, 'IsTheStockMarketOpen', 'UTC', 'admin@isthestockmarketopen.io');

-- NOW INSERT ALL THE DATA
-- Insert all 30 markets
INSERT INTO markets (slug, name, short_name, country, flag_emoji, city, timezone, tier, position, is_active) VALUES

-- Tier 1 - Major Markets (Top most visible)
('nyse', 'New York Stock Exchange', 'NYSE', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 1, true),
('nasdaq', 'NASDAQ', 'NASDAQ', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 2, true),
('lse', 'London Stock Exchange', 'LSE', 'United Kingdom', '🇬🇧', 'London', 'Europe/London', 1, 3, true),
('euronext-paris', 'Euronext (Paris)', 'ENX', 'France', '🇪🇺', 'Paris', 'Europe/Paris', 1, 4, true),
('xetra', 'Deutsche Börse (Xetra)', 'XETRA', 'Germany', '🇩🇪', 'Frankfurt', 'Europe/Berlin', 1, 5, true),
('tse', 'Tokyo Stock Exchange', 'TSE', 'Japan', '🇯🇵', 'Tokyo', 'Asia/Tokyo', 1, 6, true),
('hkex', 'Hong Kong Stock Exchange', 'HKEX', 'Hong Kong', '🇭🇰', 'Hong Kong', 'Asia/Hong_Kong', 1, 7, true),
('sse', 'Shanghai Stock Exchange', 'SSE', 'China', '🇨🇳', 'Shanghai', 'Asia/Shanghai', 1, 8, true),
('nse', 'National Stock Exchange of India', 'NSE', 'India', '🇮🇳', 'Mumbai', 'Asia/Kolkata', 1, 9, true),
('asx', 'Australian Securities Exchange', 'ASX', 'Australia', '🇦🇺', 'Sydney', 'Australia/Sydney', 1, 10, true),

-- Tier 2 - Regional Markets
('tsx', 'Toronto Stock Exchange', 'TSX', 'Canada', '🇨🇦', 'Toronto', 'America/Toronto', 2, 1, true),
('krx', 'Korea Exchange (KRX)', 'KRX', 'South Korea', '🇰🇷', 'Seoul', 'Asia/Seoul', 2, 2, true),
('sgx', 'Singapore Exchange', 'SGX', 'Singapore', '🇸🇬', 'Singapore', 'Asia/Singapore', 2, 3, true),
('szse', 'Shenzhen Stock Exchange', 'SZSE', 'China', '🇨🇳', 'Shenzhen', 'Asia/Shanghai', 2, 4, true),
('twse', 'Taiwan Stock Exchange', 'TWSE', 'Taiwan', '🇹🇼', 'Taipei', 'Asia/Taipei', 2, 5, true),
('b3', 'B3 (Brasil Bolsa Balcão)', 'B3', 'Brazil', '🇧🇷', 'São Paulo', 'America/Sao_Paulo', 2, 6, true),
('jse', 'Johannesburg Stock Exchange', 'JSE', 'South Africa', '🇿🇦', 'Johannesburg', 'Africa/Johannesburg', 2, 7, true),
('bme', 'Bolsa de Madrid', 'BME', 'Spain', '🇪🇸', 'Madrid', 'Europe/Madrid', 2, 8, true),
('bit', 'Borsa Italiana', 'BIT', 'Italy', '🇮🇹', 'Milan', 'Europe/Rome', 2, 9, true),
('omx', 'OMX Nordic (Stockholm, etc.)', 'OMX', 'Sweden', '🇸🇪', 'Stockholm', 'Europe/Stockholm', 2, 10, true),

-- Tier 3 - Emerging Markets
('bmv', 'Bolsa Mexicana de Valores', 'BMV', 'Mexico', '🇲🇽', 'Mexico City', 'America/Mexico_City', 3, 1, true),
('tasi', 'Tadawul (Saudi Stock Exchange)', 'TASI', 'Saudi Arabia', '🇸🇦', 'Riyadh', 'Asia/Riyadh', 3, 2, true),
('dfm', 'Dubai Financial Market', 'DFM', 'United Arab Emirates', '🇦🇪', 'Dubai', 'Asia/Dubai', 3, 3, true),
('egx', 'Egyptian Exchange', 'EGX', 'Egypt', '🇪🇬', 'Cairo', 'Africa/Cairo', 3, 4, true),
('vse', 'Vienna Stock Exchange', 'VSE', 'Austria', '🇦🇹', 'Vienna', 'Europe/Vienna', 3, 5, true),
('oslo', 'Oslo Børs', 'OSLO', 'Norway', '🇳🇴', 'Oslo', 'Europe/Oslo', 3, 6, true),
('myx', 'Bursa Malaysia', 'MYX', 'Malaysia', '🇲🇾', 'Kuala Lumpur', 'Asia/Kuala_Lumpur', 3, 7, true),
('ise', 'Euronext Dublin', 'ISE', 'Ireland', '🇮🇪', 'Dublin', 'Europe/Dublin', 3, 8, true),
('tase', 'Tel Aviv Stock Exchange', 'TASE', 'Israel', '🇮🇱', 'Tel Aviv', 'Asia/Jerusalem', 3, 9, true),
('adx', 'Abu Dhabi Securities Exchange', 'ADX', 'United Arab Emirates', '🇦🇪', 'Abu Dhabi', 'Asia/Dubai', 3, 10, true);

-- Insert trading sessions for each market
-- US Markets (NYSE, NASDAQ) - Monday-Friday, 9:30 AM - 4:00 PM ET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break) 
SELECT id, generate_series(1,5), '09:30', '16:00', false 
FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- London Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '08:00', '16:30', false
FROM markets WHERE slug = 'lse';

-- European Markets - Monday-Friday, 9:00 AM - 5:30 PM CET/CEST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:30', false
FROM markets WHERE slug IN ('euronext-paris', 'xetra', 'bit', 'bme', 'vse');

-- OMX Nordic - Monday-Friday, 9:00 AM - 5:25 PM
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:25', false
FROM markets WHERE slug = 'omx';

-- Oslo Børs - Monday-Friday, 9:00 AM - 4:25 PM
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '16:25', false
FROM markets WHERE slug = 'oslo';

-- Irish Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '08:00', '16:30', false
FROM markets WHERE slug = 'ise';

-- Tokyo Stock Exchange - Monday-Friday with lunch break (9:00-11:30 AM, 12:30-3:00 PM JST)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:00', '15:00', true, '11:30', '12:30'
FROM markets WHERE slug = 'tse';

-- Hong Kong Stock Exchange - Monday-Friday with lunch break (9:30-12:00, 1:00-4:00 PM HKT)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:30', '16:00', true, '12:00', '13:00'
FROM markets WHERE slug = 'hkex';

-- Shanghai & Shenzhen Stock Exchanges - Monday-Friday with lunch break (9:30-11:30, 1:00-3:00 PM CST)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:30', '15:00', true, '11:30', '13:00'
FROM markets WHERE slug IN ('sse', 'szse');

-- Singapore Exchange - Monday-Friday, 9:00 AM - 5:00 PM SGT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:00', false
FROM markets WHERE slug = 'sgx';

-- Australian Securities Exchange - Monday-Friday, 10:00 AM - 4:00 PM AEST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '10:00', '16:00', false
FROM markets WHERE slug = 'asx';

-- Korea Exchange - Monday-Friday, 9:00 AM - 3:30 PM KST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '15:30', false
FROM markets WHERE slug = 'krx';

-- Indian Markets (NSE) - Monday-Friday, 9:15 AM - 3:30 PM IST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:15', '15:30', false
FROM markets WHERE slug = 'nse';

-- Bursa Malaysia - Monday-Friday with lunch break (9:00-12:30, 2:30-4:50 PM MYT)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:00', '16:50', true, '12:30', '14:30'
FROM markets WHERE slug = 'myx';

-- Taiwan Stock Exchange - Monday-Friday, 9:00 AM - 1:30 PM TWT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '13:30', false
FROM markets WHERE slug = 'twse';

-- Toronto Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM ET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:30', '16:00', false
FROM markets WHERE slug = 'tsx';

-- B3 Brazil - Monday-Friday, 10:00 AM - 5:00 PM BRT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '10:00', '17:00', false
FROM markets WHERE slug = 'b3';

-- Mexican Stock Exchange - Monday-Friday, 8:30 AM - 3:00 PM CT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '08:30', '15:00', false
FROM markets WHERE slug = 'bmv';

-- Johannesburg Stock Exchange - Monday-Friday, 9:00 AM - 5:00 PM SAST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:00', false
FROM markets WHERE slug = 'jse';

-- Middle Eastern Markets (Sunday-Thursday schedule)
-- Saudi Stock Exchange - Sunday-Thursday, 10:00 AM - 3:00 PM AST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '10:00', '15:00', false
FROM markets WHERE slug = 'tasi';

-- Tel Aviv Stock Exchange - Sunday-Thursday, 9:25 AM - 5:30 PM IST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '09:25', '17:30', false
FROM markets WHERE slug = 'tase';

-- UAE Markets (Dubai, Abu Dhabi) - Sunday-Thursday, 10:00 AM - 2:00 PM GST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '10:00', '14:00', false
FROM markets WHERE slug IN ('dfm', 'adx');

-- Egyptian Exchange - Sunday-Thursday, 10:00 AM - 2:30 PM EET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '10:00', '14:30', false
FROM markets WHERE slug = 'egx';

-- Sample holidays for 2024-2025 (US markets only for now)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-01-20', 'Martin Luther King Jr. Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-02-17', 'Presidents Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-05-26', 'Memorial Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-06-19', 'Juneteenth', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-07-04', 'Independence Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-09-01', 'Labor Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-11-27', 'Thanksgiving Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-11-28', 'Day after Thanksgiving', false FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- Add early close for day after Thanksgiving (1:00 PM close)
UPDATE holidays SET close_time_override = TIME '13:00' 
WHERE date = DATE '2025-11-28' AND market_id IN (SELECT id FROM markets WHERE slug IN ('nyse', 'nasdaq'));

-- Create view for easy querying
CREATE OR REPLACE VIEW market_overview AS
SELECT 
    m.id,
    m.slug,
    m.name,
    m.short_name,
    m.country,
    m.flag_emoji,
    m.city,
    m.timezone,
    m.tier,
    m.position,
    m.is_active,
    COUNT(DISTINCT s.id) as session_count,
    COUNT(DISTINCT h.id) as holiday_count
FROM markets m
LEFT JOIN sessions s ON m.id = s.market_id
LEFT JOIN holidays h ON m.id = h.market_id AND h.date >= CURRENT_DATE
GROUP BY m.id, m.slug, m.name, m.short_name, m.country, m.flag_emoji, m.city, m.timezone, m.tier, m.position, m.is_active
ORDER BY m.tier, m.position;

-- Verify the setup
SELECT 
    'Setup Complete!' as status,
    (SELECT COUNT(*) FROM markets) as total_markets,
    (SELECT COUNT(*) FROM sessions) as total_sessions,
    (SELECT COUNT(*) FROM holidays) as total_holidays;
