-- Initial seed data for stock markets
-- Migration: 003
-- Created: 2025-08-20
-- Description: Insert basic market data for major exchanges

-- Insert major markets
INSERT INTO markets (slug, name, short_name, country, flag_emoji, city, timezone, tier, position, is_active) VALUES

-- Tier 1 - Major Markets (Top visibility)
('nyse', 'New York Stock Exchange', 'NYSE', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 1, true),
('nasdaq', 'NASDAQ', 'NASDAQ', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 2, true),
('lse', 'London Stock Exchange', 'LSE', 'United Kingdom', '🇬🇧', 'London', 'Europe/London', 1, 3, true),
('euronext-paris', 'Euronext Paris', 'ENX', 'France', '🇪🇺', 'Paris', 'Europe/Paris', 1, 4, true),
('xetra', 'Deutsche Börse (Xetra)', 'XETRA', 'Germany', '🇩🇪', 'Frankfurt', 'Europe/Berlin', 1, 5, true),
('tse', 'Tokyo Stock Exchange', 'TSE', 'Japan', '🇯🇵', 'Tokyo', 'Asia/Tokyo', 1, 6, true),
('hkex', 'Hong Kong Stock Exchange', 'HKEX', 'Hong Kong', '🇭🇰', 'Hong Kong', 'Asia/Hong_Kong', 1, 7, true),
('sse', 'Shanghai Stock Exchange', 'SSE', 'China', '🇨🇳', 'Shanghai', 'Asia/Shanghai', 1, 8, true);

-- Insert basic trading sessions
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
FROM markets WHERE slug IN ('euronext-paris', 'xetra');

-- Tokyo Stock Exchange - Monday-Friday, 9:00 AM - 3:00 PM JST (with lunch 11:30-12:30)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:00', TIME '15:00', true, TIME '11:30', TIME '12:30'
FROM markets WHERE slug = 'tse';

-- Hong Kong Stock Exchange - Monday-Friday, 9:30 AM - 4:00 PM HKT (with lunch 12:00-1:00 PM)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', true, TIME '12:00', TIME '13:00'
FROM markets WHERE slug = 'hkex';

-- Shanghai Stock Exchange - Monday-Friday, 9:30 AM - 3:00 PM CST (with lunch 11:30 AM - 1:00 PM)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:30', TIME '15:00', true, TIME '11:30', TIME '13:00'
FROM markets WHERE slug = 'sse';

-- Sample holidays for 2024 (major markets)
-- US Markets (NYSE, NASDAQ) - Common US holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- UK Holidays (LSE)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-12-25', 'Christmas Day', true FROM markets WHERE slug = 'lse';
