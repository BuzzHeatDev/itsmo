-- Complete seed data for all 30 global stock markets
-- Migration: 004
-- Created: 2025-08-20
-- Description: Full seed data with all markets, sessions, and holidays

-- Insert additional markets (extending from basic seed)
INSERT INTO markets (slug, name, short_name, country, flag_emoji, city, timezone, tier, position, is_active) VALUES

-- Additional Tier 1 Markets
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

-- Insert additional trading sessions for new markets
-- Chinese Markets - Monday-Friday, 9:30 AM - 3:00 PM CST (with lunch 11:30 AM - 1:00 PM)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break, lunch_open_time, lunch_close_time)
SELECT id, generate_series(1,5), TIME '09:30', TIME '15:00', true, TIME '11:30', TIME '13:00'
FROM markets WHERE slug = 'szse';

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

-- Other Asian Markets - Monday-Friday
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '15:30', false
FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:00', false
FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, generate_series(1,5), TIME '09:00', TIME '13:30', false
FROM markets WHERE slug = 'twse';

-- European Regional Markets - Monday-Friday, 9:00 AM - 5:30 PM
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:30', false
FROM markets WHERE slug IN ('bit', 'bme', 'vse')
UNION ALL
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:25', false
FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:30', false
FROM markets WHERE slug = 'six-swiss';

-- Latin American Markets
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '08:30', TIME '15:00', false
FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, generate_series(1,5), TIME '10:00', TIME '17:00', false
FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, generate_series(1,5), TIME '09:30', TIME '16:00', false
FROM markets WHERE slug = 'bcs';

-- African Markets
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(1,5), TIME '09:00', TIME '17:00', false
FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, generate_series(0,4), TIME '10:00', TIME '14:30', false
FROM markets WHERE slug = 'egx';

-- Middle East Markets (Sunday-Thursday schedule)
INSERT INTO sessions (market_id, weekday, open_time, close_time, has_lunch_break)
SELECT id, generate_series(0,4), TIME '10:00', TIME '15:00', false
FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, generate_series(0,4), TIME '10:00', TIME '12:00', false
FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, generate_series(0,4), TIME '10:00', TIME '14:00', false
FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, generate_series(0,4), TIME '09:30', TIME '13:00', false
FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, generate_series(0,4), TIME '09:30', TIME '12:30', false
FROM markets WHERE slug = 'kse';

-- Additional holidays for major markets
-- More US holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-15', 'Martin Luther King Jr. Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-02-19', 'Presidents Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-03-29', 'Good Friday', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-05-27', 'Memorial Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-07-04', 'Independence Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-09-02', 'Labor Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2024-11-28', 'Thanksgiving Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- Half-day holidays for US markets
INSERT INTO holidays (market_id, date, name, is_closed_all_day, close_time_override)
SELECT id, DATE '2024-11-29', 'Day after Thanksgiving', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq');

-- UK holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-03-29', 'Good Friday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-04-01', 'Easter Monday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-05-06', 'Early May Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2024-12-26', 'Boxing Day', true FROM markets WHERE slug = 'lse';

-- Japanese holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2024-01-08', 'Coming of Age Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-02-11', 'National Foundation Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-04-29', 'Showa Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-03', 'Constitution Memorial Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-04', 'Greenery Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2024-05-05', 'Children''s Day', true FROM markets WHERE slug = 'tse';
