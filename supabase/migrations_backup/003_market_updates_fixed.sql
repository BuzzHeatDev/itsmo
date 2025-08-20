-- Market updates based on user feedback (FIXED VERSION)
-- 1. Combine NYSE and NASDAQ
-- 2. ENX requires EU Flag and French flag  
-- 3. DAX requires EU and German flag

-- First, delete NASDAQ sessions (since NYSE already has the same schedule)
DELETE FROM sessions WHERE market_id = (SELECT id FROM markets WHERE slug = 'nasdaq');

-- Delete NASDAQ holidays (since NYSE already has the same holidays)
DELETE FROM holidays WHERE market_id = (SELECT id FROM markets WHERE slug = 'nasdaq');

-- Delete the separate NASDAQ market
DELETE FROM markets WHERE slug = 'nasdaq';

-- Update the NYSE entry to represent both NYSE and NASDAQ
UPDATE markets 
SET 
  name = 'NYSE & NASDAQ',
  short_name = 'NYSE/NASDAQ',
  position = 1
WHERE slug = 'nyse';

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

-- Reorder positions after NYSE/NASDAQ combination
UPDATE markets SET position = 2 WHERE slug = 'lse';
UPDATE markets SET position = 3 WHERE slug = 'euronext-paris';  
UPDATE markets SET position = 4 WHERE slug = 'dax';
UPDATE markets SET position = 5 WHERE slug = 'tse';
UPDATE markets SET position = 6 WHERE slug = 'hkex';
