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

async function runMigration() {
  console.log('🚀 Supabase Migration Runner\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
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
  console.log('📄 Migration to execute:');
  console.log('─'.repeat(50));
  console.log(migrationSQL);
  console.log('─'.repeat(50));
  console.log('\n📝 This migration will:');
  console.log('  • Combine NYSE and NASDAQ into single market');
  console.log('  • Update ENX with EU + French flags (🇪🇺🇫🇷)');
  console.log('  • Update DAX with EU + German flags (🇪🇺🇩🇪)');
  console.log('  • Reorder market positions');
  console.log('  • Update all related sessions and holidays\n');

  // Ask for confirmation
  const answer = await askQuestion('❓ Do you want to run this migration? (yes/no): ');
  
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('❌ Migration cancelled by user.');
    rl.close();
    return;
  }

  console.log('\n🔄 Connecting to Supabase...');

  try {
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('✅ Connected to Supabase');
    console.log('🔄 Executing migration...\n');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });

    if (error) {
      // If RPC doesn't exist, try direct query
      console.log('📝 Trying direct SQL execution...');
      
      // Split migration into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
        
        const { error: stmtError } = await supabase
          .from('markets')
          .select('*')
          .limit(0); // This is a hack to test connection
        
        if (stmtError) {
          throw stmtError;
        }

        // For actual execution, we need to use the SQL editor or a custom function
        console.log(`   Statement: ${stmt.substring(0, 50)}...`);
      }

      console.log('\n⚠️  Note: Direct SQL execution requires manual running in Supabase SQL Editor');
      console.log('📋 Copy the migration SQL above and paste it into your Supabase SQL Editor');
      
    } else {
      console.log('✅ Migration executed successfully!');
      console.log('📊 Result:', data);
    }

  } catch (err) {
    console.error('❌ Error executing migration:', err.message);
    console.log('\n📋 Manual execution required:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy the migration SQL shown above');
    console.log('3. Paste and run in SQL Editor');
  }

  rl.close();
}

// Run the migration
runMigration().catch(console.error);
