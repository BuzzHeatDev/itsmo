#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Supabase Migration Tool\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.error('💡 Get this from Supabase Dashboard → Settings → API → service_role key');
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/003_market_updates.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Show what will be executed
  console.log('📄 Migration Preview:');
  console.log('═'.repeat(60));
  console.log(migrationSQL);
  console.log('═'.repeat(60));
  
  console.log('\n📝 This migration will:');
  console.log('  ✅ Combine NYSE and NASDAQ → "NYSE & NASDAQ"');
  console.log('  ✅ ENX gets dual flags → 🇪🇺🇫🇷');
  console.log('  ✅ DAX gets dual flags → 🇪🇺🇩🇪');
  console.log('  ✅ Reorder all market positions');
  console.log('  ✅ Update sessions and holidays accordingly\n');

  // Ask for confirmation
  const answer = await askQuestion('❓ Execute this migration? (type "yes" to confirm): ');
  
  if (answer.toLowerCase() !== 'yes') {
    console.log('❌ Migration cancelled.');
    rl.close();
    return;
  }

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

    // Split into individual statements and execute one by one
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`🔄 [${i + 1}/${statements.length}] Executing: ${statement.substring(0, 50)}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`⚠️  RPC not available, statement queued for manual execution`);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} needs manual execution: ${err.message}`);
      }
    }

    if (successCount === statements.length) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('🔄 Refresh your app to see the changes');
    } else {
      console.log('\n⚠️  Some statements need manual execution:');
      console.log('📋 Copy the migration SQL and run it in Supabase SQL Editor');
      console.log('🌐 Dashboard → SQL Editor → Paste → Run');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📋 Manual execution required:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the migration SQL shown above');
    console.log('4. Paste and click "Run"');
  }

  rl.close();
}

main().catch(console.error);
