-- Market updates based on user feedback
-- 1. Combine NYSE and NASDAQ
-- 2. ENX requires EU Flag and French flag  
-- 3. DAX requires EU and German flag

-- First, update the combined NYSE/NASDAQ entry
UPDATE markets 
SET 
  name = 'NYSE & NASDAQ',
  short_name = 'NYSE/NASDAQ',
  position = 1
WHERE slug = 'nyse';

-- Remove the separate NASDAQ entry and update sessions to point to NYSE
UPDATE sessions 
SET market_id = (SELECT id FROM markets WHERE slug = 'nyse')
WHERE market_id = (SELECT id FROM markets WHERE slug = 'nasdaq');

-- Update holidays to point to the combined market
UPDATE holidays 
SET market_id = (SELECT id FROM markets WHERE slug = 'nyse')
WHERE market_id = (SELECT id FROM markets WHERE slug = 'nasdaq');

-- Delete the separate NASDAQ market
DELETE FROM markets WHERE slug = 'nasdaq';

-- Update ENX to show EU flag and French flag (🇪🇺🇫🇷)
UPDATE markets 
SET 
  flag_emoji = '🇪🇺🇫🇷',
  name = 'Euronext Paris',
  country = 'France/EU'
WHERE slug = 'euronext-paris';

-- Update DAX (currently xetra) to show EU and German flag (🇪🇺🇩🇪)
UPDATE markets 
SET 
  name = 'Deutsche Börse (DAX)',
  short_name = 'DAX',
  flag_emoji = '🇪🇺🇩🇪',
  country = 'Germany/EU',
  slug = 'dax'
WHERE slug = 'xetra';

-- Update sessions that reference xetra to use dax
UPDATE sessions 
SET market_id = (SELECT id FROM markets WHERE slug = 'dax')
WHERE market_id IN (
  SELECT id FROM markets WHERE slug = 'xetra'
);

-- Update holidays that reference xetra to use dax  
UPDATE holidays 
SET market_id = (SELECT id FROM markets WHERE slug = 'dax')
WHERE market_id IN (
  SELECT id FROM markets WHERE slug = 'xetra'
);

-- Reorder positions after NYSE/NASDAQ combination
UPDATE markets SET position = 2 WHERE slug = 'lse';
UPDATE markets SET position = 3 WHERE slug = 'euronext-paris';  
UPDATE markets SET position = 4 WHERE slug = 'dax';
UPDATE markets SET position = 5 WHERE slug = 'tse';
UPDATE markets SET position = 6 WHERE slug = 'hkex';
