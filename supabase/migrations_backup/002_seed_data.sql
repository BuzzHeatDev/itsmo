-- Seed data for global stock markets
-- Based on reference data from docs/market-reference-data.md

-- Insert markets (30+ global exchanges)
INSERT INTO markets (slug, name, short_name, country, flag_emoji, city, timezone, tier, position, is_active) VALUES

-- Tier 1 - Major Markets (Top visibility)
('nyse', 'New York Stock Exchange', 'NYSE', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 1, true),
('nasdaq', 'NASDAQ', 'NASDAQ', 'United States', '🇺🇸', 'New York', 'America/New_York', 1, 2, true),
('lse', 'London Stock Exchange', 'LSE', 'United Kingdom', '🇬🇧', 'London', 'Europe/London', 1, 3, true),
('euronext-paris', 'Euronext Paris', 'ENX', 'France', '🇪🇺', 'Paris', 'Europe/Paris', 1, 4, true),
('xetra', 'Deutsche Börse (Xetra)', 'XETRA', 'Germany', '🇩🇪', 'Frankfurt', 'Europe/Berlin', 1, 5, true),
('tse', 'Tokyo Stock Exchange', 'TSE', 'Japan', '🇯🇵', 'Tokyo', 'Asia/Tokyo', 1, 6, true),
('hkex', 'Hong Kong Stock Exchange', 'HKEX', 'Hong Kong', '🇭🇰', 'Hong Kong', 'Asia/Hong_Kong', 1, 7, true),
('sse', 'Shanghai Stock Exchange', 'SSE', 'China', '🇨🇳', 'Shanghai', 'Asia/Shanghai', 1, 8, true),
('nse', 'National Stock Exchange of India', 'NSE', 'India', '🇮🇳', 'Mumbai', 'Asia/Kolkata', 1, 9, true),
('asx', 'Australian Securities Exchange', 'ASX', 'Australia', '🇦🇺', 'Sydney', 'Australia/Sydney', 1, 10, true),

-- Tier 2 - Regional Markets
('tsx', 'Toronto Stock Exchange', 'TSX', 'Canada', '🇨🇦', 'Toronto', 'America/Toronto', 2, 1, true),
('krx', 'Korea Exchange', 'KRX', 'South Korea', '🇰🇷', 'Seoul', 'Asia/Seoul', 2, 2, true),
('sgx', 'Singapore Exchange', 'SGX', 'Singapore', '🇸🇬', 'Singapore', 'Asia/Singapore', 2, 3, true),
('szse', 'Shenzhen Stock Exchange', 'SZSE', 'China', '🇨🇳', 'Shenzhen', 'Asia/Shanghai', 2, 4, true),
('twse', 'Taiwan Stock Exchange', 'TWSE', 'Taiwan', '🇹🇼', 'Taipei', 'Asia/Taipei', 2, 5, true),
('b3', 'B3 - Brasil Bolsa Balcão', 'B3', 'Brazil', '🇧🇷', 'São Paulo', 'America/Sao_Paulo', 2, 6, true),
('jse', 'Johannesburg Stock Exchange', 'JSE', 'South Africa', '🇿🇦', 'Johannesburg', 'Africa/Johannesburg', 2, 7, true),
('bme', 'Bolsa de Madrid', 'BME', 'Spain', '🇪🇸', 'Madrid', 'Europe/Madrid', 2, 8, true),
('bit', 'Borsa Italiana', 'BIT', 'Italy', '🇮🇹', 'Milan', 'Europe/Rome', 2, 9, true),
('omx', 'OMX Nordic Stockholm', 'OMX', 'Sweden', '🇸🇪', 'Stockholm', 'Europe/Stockholm', 2, 10, true),
('bse', 'Bombay Stock Exchange', 'BSE', 'India', '🇮🇳', 'Mumbai', 'Asia/Kolkata', 2, 11, true),

-- Tier 3 - Emerging/Regional Markets
('bmv', 'Bolsa Mexicana de Valores', 'BMV', 'Mexico', '🇲🇽', 'Mexico City', 'America/Mexico_City', 3, 1, true),
('tasi', 'Saudi Stock Exchange (Tadawul)', 'TASI', 'Saudi Arabia', '🇸🇦', 'Riyadh', 'Asia/Riyadh', 3, 2, true),
('dfm', 'Dubai Financial Market', 'DFM', 'United Arab Emirates', '🇦🇪', 'Dubai', 'Asia/Dubai', 3, 3, true),
('egx', 'Egyptian Exchange', 'EGX', 'Egypt', '🇪🇬', 'Cairo', 'Africa/Cairo', 3, 4, true),
('vse', 'Vienna Stock Exchange', 'VSE', 'Austria', '🇦🇹', 'Vienna', 'Europe/Vienna', 3, 5, true),
('oslo', 'Oslo Børs', 'OSLO', 'Norway', '🇳🇴', 'Oslo', 'Europe/Oslo', 3, 6, true),
('myx', 'Bursa Malaysia', 'MYX', 'Malaysia', '🇲🇾', 'Kuala Lumpur', 'Asia/Kuala_Lumpur', 3, 7, true),
('ise', 'Euronext Dublin', 'ISE', 'Ireland', '🇮🇪', 'Dublin', 'Europe/Dublin', 3, 8, true),
('tase', 'Tel Aviv Stock Exchange', 'TASE', 'Israel', '🇮🇱', 'Tel Aviv', 'Asia/Jerusalem', 3, 9, true),
('adx', 'Abu Dhabi Securities Exchange', 'ADX', 'United Arab Emirates', '🇦🇪', 'Abu Dhabi', 'Asia/Dubai', 3, 10, true);

-- Insert trading sessions for each market
-- Note: weekday 0=Sunday, 1=Monday, ..., 6=Saturday

-- US Markets (NYSE, NASDAQ) - Monday-Friday, 9:30 AM - 4:00 PM ET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break) 
SELECT id, generate_series(1,5), '09:30', '16:00', false 
FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- London Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '08:00', '16:30', false
FROM markets WHERE slug = 'lse';

-- European Markets (Euronext, Xetra, etc.) - Monday-Friday, 9:00 AM - 5:30 PM CET/CEST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:30', false
FROM markets WHERE slug IN ('euronext-paris', 'xetra', 'bit', 'bme', 'vse');

-- OMX Nordic - Monday-Friday, 9:00 AM - 5:25 PM
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '17:25', false
FROM markets WHERE slug = 'omx';

-- Oslo Børs - Monday-Friday, 9:00 AM - 4:25 PM (assuming similar to OMX)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:00', '16:25', false
FROM markets WHERE slug = 'oslo';

-- Irish Stock Exchange - Monday-Friday, 8:00 AM - 4:30 PM GMT/BST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '08:00', '16:30', false
FROM markets WHERE slug = 'ise';

-- Tokyo Stock Exchange - Monday-Friday with lunch break
-- 9:00-11:30 AM, 12:30-3:00 PM JST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:00', '15:00', true, '11:30', '12:30'
FROM markets WHERE slug = 'tse';

-- Hong Kong Stock Exchange - Monday-Friday with lunch break
-- 9:30-12:00, 1:00-4:00 PM HKT
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), '09:30', '16:00', true, '12:00', '13:00'
FROM markets WHERE slug = 'hkex';

-- Shanghai & Shenzhen Stock Exchanges - Monday-Friday with lunch break
-- 9:30-11:30, 1:00-3:00 PM CST
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

-- Indian Markets (NSE, BSE) - Monday-Friday, 9:15 AM - 3:30 PM IST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), '09:15', '15:30', false
FROM markets WHERE slug IN ('nse', 'bse');

-- Bursa Malaysia - Monday-Friday with lunch break
-- 9:00-12:30, 2:30-4:50 PM MYT
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

-- UAE Markets (Dubai, Abu Dhabi) - Sunday-Thursday
-- Dubai Financial Market - Sunday-Thursday, 10:00 AM - 2:00 PM GST
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '10:00', '14:00', false
FROM markets WHERE slug IN ('dfm', 'adx');

-- Egyptian Exchange - Sunday-Thursday, 10:00 AM - 2:30 PM EET
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), '10:00', '14:30', false
FROM markets WHERE slug = 'egx';

-- Sample holidays for 2024 (major markets)
-- US Markets (NYSE, NASDAQ) - Common US holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-01-15', 'Martin Luther King Jr. Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-02-19', 'Presidents Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-03-29', 'Good Friday', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-05-27', 'Memorial Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-06-19', 'Juneteenth', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-07-04', 'Independence Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-09-02', 'Labor Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-11-28', 'Thanksgiving Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-11-29', 'Day after Thanksgiving', false FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, '2024-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- Add early close for day after Thanksgiving (1:00 PM close)
UPDATE holidays SET close_time_override = '13:00' 
WHERE date = '2024-11-29' AND market_id IN (SELECT id FROM markets WHERE slug IN ('nyse', 'nasdaq'));

-- UK Market (LSE) - Common UK holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-03-29', 'Good Friday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-04-01', 'Easter Monday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-05-06', 'Early May Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-05-27', 'Spring Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-08-26', 'Summer Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-12-25', 'Christmas Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, '2024-12-26', 'Boxing Day', true FROM markets WHERE slug = 'lse';

-- Japan (TSE) - Common Japanese holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-01-02', 'Bank Holiday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-01-03', 'Bank Holiday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-01-08', 'Coming of Age Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-02-11', 'National Foundation Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-02-12', 'National Foundation Day (Observed)', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-02-23', 'Emperor''s Birthday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-03-20', 'Vernal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-04-29', 'Showa Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-05-03', 'Constitution Memorial Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-05-06', 'Children''s Day (Observed)', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-07-15', 'Marine Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-08-11', 'Mountain Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-08-12', 'Mountain Day (Observed)', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-09-16', 'Respect for the Aged Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-09-23', 'Autumnal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-10-14', 'Sports Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-11-03', 'Culture Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-11-04', 'Culture Day (Observed)', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-11-23', 'Labor Thanksgiving Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, '2024-12-31', 'New Year''s Eve', true FROM markets WHERE slug = 'tse';

-- Hong Kong (HKEX) - Common Hong Kong holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-02-10', 'Lunar New Year''s Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-02-12', 'The second day of Lunar New Year', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-02-13', 'The third day of Lunar New Year', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-03-29', 'Good Friday', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-04-01', 'Easter Monday', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-04-04', 'Ching Ming Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-05-01', 'Labour Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-05-15', 'The Birthday of the Buddha', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-06-10', 'Tuen Ng Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-07-01', 'Hong Kong Special Administrative Region Establishment Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-09-18', 'The day following the Chinese Mid-Autumn Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-10-01', 'National Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-10-11', 'Chung Yeung Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-12-25', 'Christmas Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, '2024-12-26', 'Boxing Day', true FROM markets WHERE slug = 'hkex';

-- Add a few sample holidays for other major markets
-- China (SSE, SZSE)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, '2024-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-10', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-11', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-12', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-13', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-14', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-15', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-16', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-02-17', 'Spring Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-04-04', 'Tomb Sweeping Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-04-05', 'Tomb Sweeping Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-04-06', 'Tomb Sweeping Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-05-01', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-05-02', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-05-03', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-05-04', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-05-05', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-06-10', 'Dragon Boat Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-09-15', 'Mid-Autumn Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-09-16', 'Mid-Autumn Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-09-17', 'Mid-Autumn Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-01', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-02', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-03', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-04', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-05', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-06', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, '2024-10-07', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse');

-- Create view for easy querying of market data with sessions
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
    COUNT(s.id) as session_count,
    COUNT(h.id) as holiday_count
FROM markets m
LEFT JOIN sessions s ON m.id = s.market_id
LEFT JOIN holidays h ON m.id = h.market_id AND h.date >= CURRENT_DATE
GROUP BY m.id, m.slug, m.name, m.short_name, m.country, m.flag_emoji, m.city, m.timezone, m.tier, m.position, m.is_active
ORDER BY m.tier, m.position;
