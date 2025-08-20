-- Complete setup for IsTheStockMarketOpen.io
-- Migration: 005
-- Created: 2025-08-20
-- Description: All-in-one setup script (alternative to running 001-004 separately)

-- This file creates all tables AND populates them with data
-- Run this single file in Supabase SQL Editor as an alternative to running migrations 001-004

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
CREATE TABLE settings (
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
CREATE INDEX idx_markets_active_tier_position ON markets (is_active, tier, position);
CREATE INDEX idx_sessions_market_weekday ON sessions (market_id, weekday);
CREATE INDEX idx_holidays_market_date ON holidays (market_id, date);

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
VALUES ('IsTheStockMarketOpen.io', 'UTC');

-- Insert all 30 markets with complete data
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
('szse', 'Shenzhen Stock Exchange', 'SZSE', 'China', '🇨🇳', 'Shenzhen', 'Asia/Shanghai', 1, 9, true),
('nse', 'National Stock Exchange of India', 'NSE', 'India', '🇮🇳', 'Mumbai', 'Asia/Kolkata', 1, 10, true),

-- Tier 2 - Regional Markets
('tsx', 'Toronto Stock Exchange', 'TSX', 'Canada', '🇨🇦', 'Toronto', 'America/Toronto', 2, 1, true),
('asx', 'Australian Securities Exchange', 'ASX', 'Australia', '🇦🇺', 'Sydney', 'Australia/Sydney', 2, 2, true),
('krx', 'Korea Exchange', 'KRX', 'South Korea', '🇰🇷', 'Seoul', 'Asia/Seoul', 2, 3, true),
('sgx', 'Singapore Exchange', 'SGX', 'Singapore', '🇸🇬', 'Singapore', 'Asia/Singapore', 2, 4, true),
('twse', 'Taiwan Stock Exchange', 'TWSE', 'Taiwan', '🇹🇼', 'Taipei', 'Asia/Taipei', 2, 5, true),
('omx-stockholm', 'OMX Stockholm', 'OMX', 'Sweden', '🇸🇪', 'Stockholm', 'Europe/Stockholm', 2, 6, true),
('six-swiss', 'SIX Swiss Exchange', 'SIX', 'Switzerland', '🇨🇭', 'Zurich', 'Europe/Zurich', 2, 7, true),
('bit', 'Borsa Italiana', 'BIT', 'Italy', '🇮🇹', 'Milan', 'Europe/Rome', 2, 8, true),
('bme', 'Bolsas y Mercados Españoles', 'BME', 'Spain', '🇪🇸', 'Madrid', 'Europe/Madrid', 2, 9, true),
('vse', 'Vienna Stock Exchange', 'VSE', 'Austria', '🇦🇹', 'Vienna', 'Europe/Vienna', 2, 10, true),

-- Tier 3 - Emerging Markets
('bmv', 'Bolsa Mexicana de Valores', 'BMV', 'Mexico', '🇲🇽', 'Mexico City', 'America/Mexico_City', 3, 1, true),
('b3', 'B3 (Brasil Bolsa Balcão)', 'B3', 'Brazil', '🇧🇷', 'São Paulo', 'America/Sao_Paulo', 3, 2, true),
('bcs', 'Bolsa de Comercio de Santiago', 'BCS', 'Chile', '🇨🇱', 'Santiago', 'America/Santiago', 3, 3, true),
('jse', 'Johannesburg Stock Exchange', 'JSE', 'South Africa', '🇿🇦', 'Johannesburg', 'Africa/Johannesburg', 3, 4, true),
('egx', 'Egyptian Exchange', 'EGX', 'Egypt', '🇪🇬', 'Cairo', 'Africa/Cairo', 3, 5, true),
('tasi', 'Saudi Stock Exchange (Tadawul)', 'TASI', 'Saudi Arabia', '🇸🇦', 'Riyadh', 'Asia/Riyadh', 3, 6, true),
('ase', 'Amman Stock Exchange', 'ASE', 'Jordan', '🇯🇴', 'Amman', 'Asia/Amman', 3, 7, true),
('dfm', 'Dubai Financial Market', 'DFM', 'UAE', '🇦🇪', 'Dubai', 'Asia/Dubai', 3, 8, true),
('qe', 'Qatar Exchange', 'QE', 'Qatar', '🇶🇦', 'Doha', 'Asia/Qatar', 3, 9, true),
('kse', 'Kuwait Stock Exchange', 'KSE', 'Kuwait', '🇰🇼', 'Kuwait City', 'Asia/Kuwait', 3, 10, true);

-- Insert trading sessions for each market
-- US Markets (NYSE, NASDAQ) - Monday-Friday, 9:30 AM - 4:00 PM ET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break) 
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', false 
FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- London Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '08:00', TIME '16:30', false
FROM markets WHERE slug = 'lse';

-- European Markets - Monday-Friday, 9:00 AM - 5:30 PM CET/CEST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:30', false
FROM markets WHERE slug IN ('euronext-paris', 'xetra', 'bit', 'bme', 'vse');

-- OMX Nordic - Monday-Friday, 9:00 AM - 5:25 PM CET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:25', false
FROM markets WHERE slug = 'omx-stockholm';

-- SIX Swiss Exchange - Monday-Friday, 9:00 AM - 5:30 PM CET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:30', false
FROM markets WHERE slug = 'six-swiss';

-- Asian Markets with lunch breaks
-- Tokyo Stock Exchange - Monday-Friday, 9:00 AM - 3:00 PM JST (with lunch 11:30-12:30)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:00', TIME '15:00', true, TIME '11:30', TIME '12:30'
FROM markets WHERE slug = 'tse';

-- Hong Kong Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM HKT (with lunch 12:00-1:00 PM)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', true, TIME '12:00', TIME '13:00'
FROM markets WHERE slug = 'hkex';

-- Chinese Markets - Monday-Friday, 9:30 AM - 3:00 PM CST (with lunch 11:30 AM - 1:00 PM)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:30', TIME '15:00', true, TIME '11:30', TIME '13:00'
FROM markets WHERE slug IN ('sse', 'szse');

-- Indian Markets - Monday-Friday, 9:15 AM - 3:30 PM IST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:15', TIME '15:30', false
FROM markets WHERE slug = 'nse';

-- Canadian Markets - Monday-Friday, 9:30 AM - 4:00 PM ET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', false
FROM markets WHERE slug = 'tsx';

-- Australian Securities Exchange - Monday-Friday, 10:00 AM - 4:00 PM AEST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '10:00', TIME '16:00', false
FROM markets WHERE slug = 'asx';

-- Korea Exchange - Monday-Friday, 9:00 AM - 3:30 PM KST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '15:30', false
FROM markets WHERE slug = 'krx';

-- Singapore Exchange - Monday-Friday, 9:00 AM - 5:00 PM SGT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:00', false
FROM markets WHERE slug = 'sgx';

-- Taiwan Stock Exchange - Monday-Friday, 9:00 AM - 1:30 PM CST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '13:30', false
FROM markets WHERE slug = 'twse';

-- Latin American Markets
-- Mexican Stock Exchange - Monday-Friday, 8:30 AM - 3:00 PM CT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '08:30', TIME '15:00', false
FROM markets WHERE slug = 'bmv';

-- B3 Brazil - Monday-Friday, 10:00 AM - 5:00 PM BRT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '10:00', TIME '17:00', false
FROM markets WHERE slug = 'b3';

-- Santiago Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM CLT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', false
FROM markets WHERE slug = 'bcs';

-- African Markets
-- Johannesburg Stock Exchange - Monday-Friday, 9:00 AM - 5:00 PM SAST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:00', false
FROM markets WHERE slug = 'jse';

-- Egyptian Exchange - Sunday-Thursday, 10:00 AM - 2:30 PM EET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '10:00', TIME '14:30', false
FROM markets WHERE slug = 'egx';

-- Middle East Markets (Sunday-Thursday schedule)
-- Saudi Stock Exchange - Sunday-Thursday, 10:00 AM - 3:00 PM AST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '10:00', TIME '15:00', false
FROM markets WHERE slug = 'tasi';

-- Amman Stock Exchange - Sunday-Thursday, 10:00 AM - 12:00 PM AST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '10:00', TIME '12:00', false
FROM markets WHERE slug = 'ase';

-- Dubai Financial Market - Sunday-Thursday, 10:00 AM - 2:00 PM GST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '10:00', TIME '14:00', false
FROM markets WHERE slug = 'dfm';

-- Qatar Exchange - Sunday-Thursday, 9:30 AM - 1:00 PM AST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '09:30', TIME '13:00', false
FROM markets WHERE slug = 'qe';

-- Kuwait Stock Exchange - Sunday-Thursday, 9:30 AM - 12:30 PM AST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '09:30', TIME '12:30', false
FROM markets WHERE slug = 'kse';

-- Sample holidays for 2024-2025 (major markets)
-- US Markets (NYSE, NASDAQ) - Common US holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-01-15', 'Martin Luther King Jr. Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-02-19', 'Presidents Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-03-29', 'Good Friday', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-05-27', 'Memorial Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-06-19', 'Juneteenth', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-07-04', 'Independence Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-09-02', 'Labor Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-11-28', 'Thanksgiving Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- Half-day holidays for US markets
INSERT INTO holidays (market_id, date, name, is_closed_all_day, close_time_override)
SELECT id, DATE '2024-07-03', 'Day before Independence Day', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-11-29', 'Day after Thanksgiving', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-12-24', 'Christmas Eve', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- UK Holidays (LSE)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-03-29', 'Good Friday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-04-01', 'Easter Monday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-05-06', 'Early May Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-05-27', 'Spring Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-08-26', 'Summer Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-12-25', 'Christmas Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-12-26', 'Boxing Day', true FROM markets WHERE slug = 'lse';

-- Japanese Holidays (TSE)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-01-08', 'Coming of Age Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-02-11', 'National Foundation Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-02-23', 'Emperor''s Birthday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-03-20', 'Vernal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-04-29', 'Showa Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-03', 'Constitution Memorial Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-04', 'Greenery Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-05', 'Children''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-07-15', 'Marine Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-08-11', 'Mountain Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-09-16', 'Respect for the Aged Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-09-22', 'Autumnal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-10-14', 'Sports Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-11-03', 'Culture Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-11-23', 'Labor Thanksgiving Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-12-31', 'New Year''s Eve', true FROM markets WHERE slug = 'tse';
