#!/usr/bin/env node

/**
 * Run the 2026 holidays migration
 * This adds all 2026 holidays for all markets to the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('🚀 Running 2026 Holidays Migration\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env.local');
    console.error('💡 Get this from Supabase Dashboard → Settings → API');
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20250820_010_add_2026_holidays.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('📄 Migration: Add 2026 holidays for all markets');
  console.log('═'.repeat(60));
  console.log('This will add holidays including:');
  console.log('  ✅ US Markets: MLK Day (Jan 19), Presidents Day, etc.');
  console.log('  ✅ UK, European, Asian, and other market holidays');
  console.log('═'.repeat(60));
  console.log('\n🔄 Connecting to Supabase...');

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('markets')
      .select('count')
      .limit(1);

    if (testError) {
      throw new Error(`Connection failed: ${testError.message}`);
    }

    console.log('✅ Connected to Supabase successfully');
    console.log('🔄 Executing migration...\n');

    // For Supabase, we need to use the SQL editor approach or RPC
    // Since direct SQL execution via JS client is limited, we'll provide instructions
    console.log('📋 To run this migration:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy the migration SQL from: supabase/migrations/20250820_010_add_2026_holidays.sql');
    console.log('3. Paste and click "Run"');
    console.log('\nOr use Supabase CLI:');
    console.log('  supabase db push');
    console.log('\nMigration SQL preview (first 500 chars):');
    console.log(migrationSQL.substring(0, 500) + '...\n');

    // Try to execute via RPC if available
    try {
      const { error: rpcError } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      if (!rpcError) {
        console.log('✅ Migration executed successfully via RPC!');
        return;
      }
    } catch (rpcErr) {
      // RPC not available, that's okay
    }

    // Alternative: Try to execute statements directly if possible
    // Note: Supabase JS client doesn't support raw SQL execution
    // The migration needs to be run via Supabase Dashboard or CLI
    
    console.log('⚠️  Direct execution not available via JS client');
    console.log('📋 Please run the migration manually as shown above');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n📋 Manual execution required:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy migration from: supabase/migrations/20250820_010_add_2026_holidays.sql');
    console.log('3. Paste and click "Run"');
    process.exit(1);
  }
}

main().catch(console.error);
