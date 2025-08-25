-- Add comprehensive 2025 holidays for all markets
-- Migration: 008
-- Created: 2025-08-20
-- Description: Add 2025 holiday data for all markets

-- First, clear out any old 2024 holidays that might be causing confusion
DELETE FROM holidays WHERE EXTRACT(year FROM date) = 2024;

-- US Markets (NYSE/NASDAQ) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
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
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug IN ('nyse', 'nasdaq')
ON CONFLICT (market_id, date) DO NOTHING;

-- Half-day holidays for US markets
INSERT INTO holidays (market_id, date, name, is_closed_all_day, close_time_override)
SELECT id, DATE '2025-07-03', 'Day before Independence Day', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-11-28', 'Day after Thanksgiving', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
UNION ALL
SELECT id, DATE '2025-12-24', 'Christmas Eve', false, TIME '13:00' FROM markets WHERE slug IN ('nyse', 'nasdaq')
ON CONFLICT (market_id, date) DO NOTHING;

-- UK Holidays (LSE) - 2025
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-05-05', 'Early May Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-05-26', 'Spring Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-08-25', 'Summer Bank Holiday', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'lse'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'lse'
ON CONFLICT (market_id, date) DO NOTHING;

-- European Markets - 2025 Holidays
-- France (Euronext Paris)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-05-08', 'Victory in Europe Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-07-14', 'Bastille Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-08-15', 'Assumption Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-11-01', 'All Saints Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-11-11', 'Armistice Day', true FROM markets WHERE slug = 'euronext-paris'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'euronext-paris'
ON CONFLICT (market_id, date) DO NOTHING;

-- Germany (DAX)
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2025-10-03', 'German Unity Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'dax'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'dax'
ON CONFLICT (market_id, date) DO NOTHING;

-- Japan (TSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-01-13', 'Coming of Age Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-02-11', 'National Foundation Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-02-23', 'Emperor''s Birthday', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-03-21', 'Vernal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-04-29', 'Showa Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-05-03', 'Constitution Memorial Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-05-04', 'Greenery Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-05-05', 'Children''s Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-07-21', 'Marine Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-08-11', 'Mountain Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-09-15', 'Respect for the Aged Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-09-23', 'Autumnal Equinox Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-10-13', 'Sports Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-11-03', 'Culture Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-11-23', 'Labor Thanksgiving Day', true FROM markets WHERE slug = 'tse'
UNION ALL
SELECT id, DATE '2025-12-31', 'New Year''s Eve', true FROM markets WHERE slug = 'tse'
ON CONFLICT (market_id, date) DO NOTHING;

-- Hong Kong (HKEX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-02-09', 'Chinese New Year', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-02-10', 'Chinese New Year Holiday', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-04-04', 'Ching Ming Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-06-22', 'Dragon Boat Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-10-01', 'National Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-10-06', 'Chung Yeung Festival', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'hkex'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'hkex';

-- China (SSE, SZSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-02-09', 'Chinese New Year', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-02-10', 'Chinese New Year Holiday', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-04-04', 'Ching Ming Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-06-22', 'Dragon Boat Festival', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-10-01', 'National Day', true FROM markets WHERE slug IN ('sse', 'szse')
UNION ALL
SELECT id, DATE '2025-10-06', 'Chung Yeung Festival', true FROM markets WHERE slug IN ('sse', 'szse');

-- India (NSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-26', 'Republic Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2025-03-25', 'Holi', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2025-05-01', 'Maharashtra Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2025-08-15', 'Independence Day', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2025-10-02', 'Mahatma Gandhi Jayanti', true FROM markets WHERE slug = 'nse'
UNION ALL
SELECT id, DATE '2025-11-14', 'Diwali', true FROM markets WHERE slug = 'nse';

-- Canada (TSX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-02-17', 'Family Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-05-19', 'Victoria Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-07-01', 'Canada Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-09-01', 'Labour Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-10-13', 'Thanksgiving Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'tsx'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'tsx';

-- Australia (ASX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-01-27', 'Australia Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-04-25', 'ANZAC Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-06-09', 'King''s Birthday', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'asx'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'asx';

-- Singapore (SGX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-02-09', 'Chinese New Year', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-02-10', 'Chinese New Year Holiday', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-08-09', 'National Day', true FROM markets WHERE slug = 'sgx'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'sgx';

-- South Korea (KRX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-02-09', 'Korean New Year', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-02-10', 'Korean New Year Holiday', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-05-05', 'Children''s Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-08-15', 'Liberation Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-10-03', 'National Foundation Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-10-09', 'Hangeul Day', true FROM markets WHERE slug = 'krx'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'krx';

-- Mexico (BMV) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-02-03', 'Constitution Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-03-17', 'Benito Juárez Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-09-16', 'Independence Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-11-17', 'Revolution Day', true FROM markets WHERE slug = 'bmv'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'bmv';

-- Brazil (B3) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-04-21', 'Tiradentes Day', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-09-07', 'Independence Day', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-10-12', 'Our Lady of Aparecida', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-11-02', 'All Souls Day', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-11-15', 'Proclamation of the Republic', true FROM markets WHERE slug = 'b3'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'b3';

-- South Africa (JSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-03-21', 'Human Rights Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-04-21', 'Family Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-05-01', 'Workers Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-06-16', 'Youth Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-08-09', 'National Women''s Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-09-24', 'Heritage Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-12-16', 'Day of Reconciliation', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'jse'
UNION ALL
SELECT id, DATE '2025-12-26', 'Day of Goodwill', true FROM markets WHERE slug = 'jse';

-- Saudi Arabia (TASI) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-06-27', 'Eid al-Fitr', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-06-28', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-07-01', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-09-23', 'Saudi National Day', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-10-02', 'Eid al-Adha', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-10-03', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'tasi'
UNION ALL
SELECT id, DATE '2025-10-06', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'tasi';

-- UAE (DFM) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-06-27', 'Eid al-Fitr', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-06-28', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-07-01', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-10-02', 'Eid al-Adha', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-10-03', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-10-06', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-12-02', 'UAE National Day', true FROM markets WHERE slug = 'dfm'
UNION ALL
SELECT id, DATE '2025-12-03', 'UAE National Day Holiday', true FROM markets WHERE slug = 'dfm';

-- Qatar (QE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-06-27', 'Eid al-Fitr', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-06-28', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-07-01', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-10-02', 'Eid al-Adha', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-10-03', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-10-06', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'qe'
UNION ALL
SELECT id, DATE '2025-12-18', 'Qatar National Day', true FROM markets WHERE slug = 'qe';

-- Kuwait (KSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-02-25', 'Liberation Day', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-06-27', 'Eid al-Fitr', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-06-28', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-07-01', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-10-02', 'Eid al-Adha', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-10-03', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'kse'
UNION ALL
SELECT id, DATE '2025-10-06', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'kse';

-- Jordan (ASE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-01-27', 'Prophet Muhammad''s Birthday', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-05-25', 'Independence Day', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-06-27', 'Eid al-Fitr', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-06-28', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-07-01', 'Eid al-Fitr Holiday', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-10-02', 'Eid al-Adha', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-10-03', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-10-06', 'Eid al-Adha Holiday', true FROM markets WHERE slug = 'ase'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'ase';

-- Egypt (EGX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-01-07', 'Coptic Christmas', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-04-25', 'Sinai Liberation Day', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-07-23', 'Revolution Day', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-10-06', 'Armed Forces Day', true FROM markets WHERE slug = 'egx'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'egx';

-- Chile (BCS) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-05-21', 'Navy Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-06-29', 'Saint Peter and Saint Paul', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-07-16', 'Our Lady of Mount Carmel', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-09-18', 'Independence Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-09-19', 'Army Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-10-12', 'Discovery of America', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-11-01', 'All Saints Day', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-12-08', 'Immaculate Conception', true FROM markets WHERE slug = 'bcs'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'bcs';

-- Taiwan (TWSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-02-09', 'Chinese New Year', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-02-10', 'Chinese New Year Holiday', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-02-28', 'Peace Memorial Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-04-04', 'Children''s Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-04-05', 'Tomb Sweeping Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-06-22', 'Dragon Boat Festival', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-10-10', 'National Day', true FROM markets WHERE slug = 'twse'
UNION ALL
SELECT id, DATE '2025-10-06', 'Chung Yeung Festival', true FROM markets WHERE slug = 'twse';

-- Sweden (OMX Stockholm) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-01-06', 'Epiphany', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-05-29', 'Ascension Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-06-06', 'National Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-06-20', 'Midsummer Eve', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-12-24', 'Christmas Eve', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'omx-stockholm'
UNION ALL
SELECT id, DATE '2025-12-31', 'New Year''s Eve', true FROM markets WHERE slug = 'omx-stockholm';

-- Switzerland (SIX) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-01-02', 'Berchtold''s Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-05-29', 'Ascension Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-06-09', 'Whit Monday', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-08-01', 'Swiss National Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'six-swiss'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'six-swiss';

-- Italy (BIT) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-01-06', 'Epiphany', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-04-25', 'Liberation Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-06-02', 'Republic Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-08-15', 'Assumption Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-11-01', 'All Saints Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-12-08', 'Immaculate Conception', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'bit'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'bit';

-- Spain (BME) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-01-06', 'Epiphany', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-08-15', 'Assumption Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-10-12', 'National Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-11-01', 'All Saints Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-12-06', 'Constitution Day', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-12-08', 'Immaculate Conception', true FROM markets WHERE slug = 'bme'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'bme';

-- Austria (VSE) - 2025 Holidays
INSERT INTO holidays (market_id, date, name, is_closed_all_day)
SELECT id, DATE '2025-01-01', 'New Year''s Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-01-06', 'Epiphany', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-04-18', 'Good Friday', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-04-20', 'Easter Sunday', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-04-21', 'Easter Monday', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-05-01', 'Labour Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-05-29', 'Ascension Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-06-09', 'Whit Monday', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-08-15', 'Assumption Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-10-26', 'National Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-11-01', 'All Saints Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-12-08', 'Immaculate Conception', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-12-25', 'Christmas Day', true FROM markets WHERE slug = 'vse'
UNION ALL
SELECT id, DATE '2025-12-26', 'Boxing Day', true FROM markets WHERE slug = 'vse';

-- Verify the holidays were added
SELECT COUNT(*) as total_holidays FROM holidays;
SELECT COUNT(*) as holidays_by_year, EXTRACT(year FROM date) as year FROM holidays GROUP BY EXTRACT(year FROM date) ORDER BY year;
