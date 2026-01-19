# Deployment Checklist - Holiday Fix

## ✅ Code Fixes (Already Deployed)

All code fixes have been committed and pushed to `main`:
- ✅ Fixed date detection bug in `getMarketLocalDate`
- ✅ Fixed timezone bug in holiday queries (fetch from yesterday)
- ✅ Added debug logging for holiday detection
- ✅ Fixed all Supabase client implementations

**Status**: Code is live on production via Vercel auto-deploy

## 🔴 Required: Run 2026 Holidays Migration

The 2026 holidays (including MLK Day on Jan 19) need to be added to your production database.

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Open the file: `supabase/migrations/20250820_010_add_2026_holidays.sql`
5. Copy the entire SQL content
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or link to your project and push
supabase link --project-ref your-project-ref
supabase db push
```

### Option 3: Migration Helper Script

```bash
# Run the helper script (provides instructions)
node scripts/run-2026-holidays-migration.js
```

## ✅ Verification Steps

After running the migration:

1. **Check the database**:
   ```sql
   SELECT COUNT(*) FROM holidays WHERE EXTRACT(year FROM date) = 2026;
   ```
   Should return a count > 0

2. **Check MLK Day specifically**:
   ```sql
   SELECT * FROM holidays 
   WHERE date = '2026-01-19' 
   AND market_id IN (SELECT id FROM markets WHERE slug IN ('nyse', 'nasdaq'));
   ```
   Should return at least one row

3. **Test the website**:
   - Visit https://www.isthestockmarketopen.io
   - Check browser console for debug logs
   - US markets should show as CLOSED on Jan 19, 2026 (MLK Day)
   - Look for log: `📅 NYSE & NASDAQ local date: 2026-01-19, holidays available: X`

## 🐛 Troubleshooting

### If holidays still not showing:

1. **Check browser console** for debug logs:
   - Look for `📅 [Market] local date: YYYY-MM-DD`
   - Look for `📅 [Market] holiday dates: [...]`
   - Verify the local date matches the holiday date

2. **Check database**:
   - Verify holidays exist: `SELECT * FROM holidays WHERE date >= '2026-01-01' LIMIT 10;`
   - Check market IDs match: `SELECT id, slug FROM markets WHERE slug IN ('nyse', 'nasdaq');`

3. **Clear cache**:
   - Hard refresh the page (Cmd/Ctrl + Shift + R)
   - Vercel may cache the page - wait a few minutes or trigger a redeploy

## 📝 What Was Fixed

1. **Date Detection Bug**: `getMarketLocalDate` now uses timezone formatter directly instead of `toISOString()` which was causing date shifts

2. **Holiday Query Bug**: Holiday queries now fetch from yesterday onwards to account for timezone differences between server UTC and market local dates

3. **Consistency**: All Supabase client implementations (`data.ts`, `server.ts`, `client.ts`) now use the same fixed logic

4. **Debug Logging**: Added logging to help diagnose holiday detection issues

## 🚀 Next Steps

1. Run the migration (choose one of the options above)
2. Verify holidays are in the database
3. Test the website
4. Monitor logs for any issues

---

**Migration File**: `supabase/migrations/20250820_010_add_2026_holidays.sql`
