-- Add comprehensive 2026 holidays for all markets
-- Migration: 010
-- Created: 2026-01-19
-- Description: Add 2026 holiday data for all markets

-- US Markets (NYSE/NASDAQ) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-01-19', 'Martin Luther King Jr. Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-02-16', 'Presidents Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-04-03', 'Good Friday', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-05-25', 'Memorial Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-06-19', 'Juneteenth', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-07-03', 'Independence Day (Observed)', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-09-07', 'Labor Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-11-26', 'Thanksgiving Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
ON CONFLICT (market_id, date) DO NOTHING;

-- Half-day holidays for US markets
INSERT INTO holidays (market_id, date, name, is_closed_all_day, close_time_override)
SELECT id, DATE '2026-07-02', 'Day before Independence Day', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-11-27', 'Day after Thanksgiving', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2026-12-24', 'Christmas Eve', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
ON CONFLICT (market_id, date) DO NOTHING;

-- UK Holidays (LSE) - 2026
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-04-03', 'Good Friday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-04-06', 'Easter Monday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-05-04', 'Early May Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-05-25', 'Spring Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-08-31', 'Summer Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2026-12-28', 'Boxing Day (Observed)', true FROM markets WHERE slug = 'lse'
ON CONFLICT (market_id, date) DO NOTHING;

-- European Markets - 2026 Holidays
-- France (Euronext Paris)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-05-08', 'Victory in Europe Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-07-14', 'Bastille Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-08-15', 'Assumption Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-11-01', 'All Saints Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-11-11', 'Armistice Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'euronext-paris'
ON CONFLICT (market_id, date) DO NOTHING;

-- Germany (DAX)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2026-10-03', 'German Unity Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2026-12-26', 'Boxing Day', true FROM markets WHERE slug = 'dax'
ON CONFLICT (market_id, date) DO NOTHING;

-- Japan (TSE) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-01-12', 'Coming of Age Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-02-11', 'National Foundation Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-02-23', 'Emperor''s Birthday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-03-20', 'Vernal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-04-29', 'Showa Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-05-03', 'Constitution Memorial Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-05-04', 'Greenery Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-05-05', 'Children''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-07-20', 'Marine Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-08-11', 'Mountain Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-09-21', 'Respect for the Aged Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-09-22', 'Autumnal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-10-12', 'Sports Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-11-03', 'Culture Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-11-23', 'Labor Thanksgiving Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2026-12-31', 'New Year''s Eve', true FROM markets WHERE slug = 'tse'
ON CONFLICT (market_id, date) DO NOTHING;

-- Hong Kong (HKEX) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-01-29', 'Chinese New Year', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-01-30', 'Chinese New Year Holiday', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-04-04', 'Ching Ming Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-06-10', 'Dragon Boat Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-10-01', 'National Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-10-05', 'Chung Yeung Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2026-12-28', 'Boxing Day (Observed)', true FROM markets WHERE slug = 'hkex'
ON CONFLICT (market_id, date) DO NOTHING;

-- China (SSE, SZSE) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-01-29', 'Chinese New Year', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-01-30', 'Chinese New Year Holiday', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-04-04', 'Ching Ming Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-06-10', 'Dragon Boat Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-10-01', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2026-10-05', 'Chung Yeung Festival', true FROM markets WHERE slug IN ('sse', 'szse')
ON CONFLICT (market_id, date) DO NOTHING;

-- India (NSE) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-26', 'Republic Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2026-03-14', 'Holi', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2026-05-01', 'Maharashtra Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2026-08-15', 'Independence Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2026-10-02', 'Mahatma Gandhi Jayanti', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2026-11-01', 'Diwali', true FROM markets WHERE slug = 'nse'
ON CONFLICT (market_id, date) DO NOTHING;

-- Canada (TSX) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-02-16', 'Family Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-04-03', 'Good Friday', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-05-18', 'Victoria Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-07-01', 'Canada Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-09-07', 'Labour Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-10-12', 'Thanksgiving Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2026-12-28', 'Boxing Day (Observed)', true FROM markets WHERE slug = 'tsx'
ON CONFLICT (market_id, date) DO NOTHING;

-- Australia (ASX) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-01-26', 'Australia Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-04-03', 'Good Friday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-04-06', 'Easter Monday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-04-25', 'ANZAC Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-06-08', 'King''s Birthday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2026-12-28', 'Boxing Day (Observed)', true FROM markets WHERE slug = 'asx'
ON CONFLICT (market_id, date) DO NOTHING;

-- Singapore (SGX) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-01-29', 'Chinese New Year', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-01-30', 'Chinese New Year Holiday', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-04-03', 'Good Friday', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-08-09', 'National Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'sgx'
ON CONFLICT (market_id, date) DO NOTHING;

-- South Korea (KRX) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-01-29', 'Korean New Year', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-01-30', 'Korean New Year Holiday', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-05-05', 'Children''s Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-08-15', 'Liberation Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-10-03', 'National Foundation Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-10-09', 'Hangeul Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'krx'
ON CONFLICT (market_id, date) DO NOTHING;

-- Mexico (BMV) - 2026 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2026-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-02-02', 'Constitution Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-03-16', 'Benito Juárez Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-05-01', 'Labour Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-09-16', 'Independence Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-11-16', 'Revolution Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2026-12-25', 'Christmas Day', true FROM markets WHERE slug = 'bmv'
ON CONFLICT (market_id, date) DO NOTHING;

-- Verify the holidays were added
SELECT COUNT(*) as total_holidays FROM holidays;
SELECT COUNT(*) as holidays_by_year, EXTRACT(year FROM date) as year FROM holidays GROUP BY EXTRACT(year FROM date) ORDER BY year;
