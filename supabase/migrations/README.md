# Database Migrations

This directory contains SQL migration files for the IsTheStockMarketOpen.io database.

## Migration Order

Migrations should be run in chronological order based on the date prefix:

1. **20250820_001_initial_schema.sql** - Creates tables, indexes, RLS policies
2. **20250820_002_initial_schema_fixed.sql** - Fixes IMMUTABLE function error 
3. **20250820_003_seed_data.sql** - Inserts basic market data (8 major exchanges)
4. **20250820_004_complete_seed_data.sql** - Extends to full 30 global markets
5. **20250820_005_complete_setup.sql** - All-in-one setup (alternative to 001-004)
6. **20250820_006_market_updates.sql** - NYSE/NASDAQ combination, flag updates
7. **20250820_007_market_updates_fixed.sql** - Fixed version (handles constraints)


## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Open Supabase Dashboard → Your project
2. Go to SQL Editor
3. Copy and paste each migration file in order
4. Click "Run" for each one

### Option 2: Use Complete Setup (Fastest)
- Run **005_complete_setup.sql** for everything at once
- Then run **007_market_updates_fixed.sql** for the latest updates

### Option 3: Automated Script
```bash
pnpm migrate
```

## Migration Status

- ✅ **001_initial_schema** - Creates all tables and policies
- ✅ **002_initial_schema_fixed** - Fixes index issues
- ✅ **003_seed_data** - Basic market data (8 markets)
- ✅ **004_complete_seed_data** - Full market data (30 markets)
- ✅ **005_complete_setup** - All-in-one alternative
- ✅ **006_market_updates** - Original market updates
- ✅ **007_market_updates_fixed** - Market updates with constraint fixes


## What Each Migration Does

### 001_initial_schema.sql
- Creates `markets`, `sessions`, `holidays`, `settings` tables
- Sets up indexes for performance
- Configures Row Level Security (RLS)
- Creates update triggers
- Inserts default settings

### 002_initial_schema_fixed.sql
- Fixes IMMUTABLE function error from 001
- Removes problematic date range index

### 003_seed_data.sql
- Inserts 8 major stock markets (NYSE, LSE, TSE, etc.)
- Configures basic trading sessions
- Adds sample holidays

### 004_complete_seed_data.sql  
- Extends to full 30 global markets
- Includes all tiers (Major, Regional, Emerging)
- Handles different schedules (Mon-Fri vs Sun-Thu)
- Includes lunch breaks for Asian markets
- Comprehensive holiday data

### 005_complete_setup.sql
- **Alternative to running 001-004 separately**
- Creates tables AND populates with full data
- Use this for clean setup from scratch

### 006_market_updates.sql
- Combines NYSE and NASDAQ into single entry
- Updates ENX to show EU + French flags (🇪🇺🇫🇷)
- Updates DAX to show EU + German flags (🇪🇺🇩🇪)
- Reorders market positions

### 007_market_updates_fixed.sql ⭐
- Fixed version of 006 that handles constraint violations
- Deletes NASDAQ data before updating to avoid duplicates
- Same functionality as 006 but without errors



## Current State

The database should be at migration **007** with:
- ✅ Combined "NYSE & NASDAQ" market
- ✅ ENX with dual flags 🇪🇺🇫🇷
- ✅ DAX with dual flags 🇪🇺🇩🇪
- ✅ Proper position ordering



## Backup

Original migration files are backed up in `supabase/migrations_backup/` directory.