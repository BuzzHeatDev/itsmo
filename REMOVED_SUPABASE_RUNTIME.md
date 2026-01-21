# Removed Supabase Runtime Code

This document tracks the removal of unused Supabase runtime code after implementing static configuration.

## Files Modified

### 1. `lib/supabase-data.ts` - DISABLED (Unused Runtime Code)

**Status**: All functions disabled - replaced by static config
**Reason**: Home page now uses static config files (`src/config/markets.ts`, `sessions.ts`, `holidays.ts`)

Functions disabled:
- `getActiveMarkets()` - replaced by static config
- `getMarketSessions()` - replaced by static config  
- `getMarketHolidays()` - replaced by static config
- `getCompleteMarketData()` - replaced by static config
- `testSupabaseConnection()` - no longer needed for runtime

**Note**: File kept for reference but all functions return empty/mock data

### 2. `lib/supabase/client.ts` - DISABLED (Unused Runtime Code)

**Status**: All public data fetching functions disabled
**Reason**: Home page no longer queries Supabase

Functions disabled:
- `getActiveMarkets()` - replaced by static config
- `getMarketSessions()` - replaced by static config
- `getMarketHolidays()` - replaced by static config
- `getCompleteMarketData()` - replaced by static config
- `getSiteSettings()` - not used on home page
- `subscribeToMarketChanges()` - not used

**Note**: Client initialization kept for potential future admin use

### 3. `lib/supabase/server.ts` - PARTIALLY DISABLED

**Status**: Public data fetching functions disabled, admin functions kept
**Reason**: Admin functions may be used for future admin dashboard

Functions disabled:
- `getCompleteMarketDataServer()` - replaced by static config
- `getSiteSettingsServer()` - not used on home page

Functions kept (for future admin use):
- `createMarket()` - admin CRUD
- `updateMarket()` - admin CRUD
- `deleteMarket()` - admin CRUD
- `createSessions()` - admin CRUD
- `updateSession()` - admin CRUD
- `createHoliday()` - admin CRUD
- `updateHoliday()` - admin CRUD
- `deleteHoliday()` - admin CRUD
- `updateSiteSettings()` - admin CRUD
- `revalidateMarketData()` - admin cache invalidation

## Files Kept

### Migration Scripts
All scripts in `scripts/` directory are kept:
- `scripts/migrate.js`
- `scripts/run-migration.js`
- `scripts/check-migration.js`
- `scripts/test-supabase.js`
- `scripts/run-2026-holidays-migration.js`
- `scripts/fix-search-path.js`

**Reason**: These are used for database migrations and setup, not runtime queries

### Auth Functions
`lib/supabase/auth.ts` - KEPT
**Reason**: May be used for future authentication/admin features

## Verification

✅ **Home page (`app/page.tsx`)**: No Supabase imports - uses static config only
✅ **No Supabase queries during page render**: Verified - uses `src/config/*` files only
✅ **Build passes**: No errors

## Next Steps (Optional)

If you want to completely remove these files:
1. Delete `lib/supabase-data.ts` (completely unused)
2. Consider if admin functions in `lib/supabase/server.ts` are needed
3. Consider if client functions in `lib/supabase/client.ts` are needed

For now, they are disabled to prevent accidental use while keeping them available for future admin features.
