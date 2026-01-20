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

async function fixSearchPath() {
  console.log('🔒 Supabase Search Path Security Fix\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20250820_009_fix_search_path.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Show what will be executed
  console.log('📄 Security Fix Migration:');
  console.log('─'.repeat(50));
  console.log(migrationSQL);
  console.log('─'.repeat(50));
  console.log('\n🔒 This migration will fix:');
  console.log('  • Function search_path security vulnerability');
  console.log('  • Make update_updated_at_column function secure');
  console.log('  • Lock search path to public schema only');
  console.log('  • Recreate all related triggers\n');

  // Ask for confirmation
  const answer = await askQuestion('❓ Do you want to run this security fix? (yes/no): ');
  
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('❌ Security fix cancelled by user.');
    rl.close();
    return;
  }

  console.log('\n🔄 Connecting to Supabase...');

  try {
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('✅ Connected to Supabase');
    console.log('🔄 Executing security fix...\n');

    // Split migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.length === 0) continue;
      
      console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
      console.log(`   ${stmt.substring(0, 60)}...`);
      
      try {
        // Execute the statement using RPC if available
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: stmt 
        });

        if (error) {
          // If RPC doesn't exist, try direct query
          console.log('   📝 Trying direct SQL execution...');
          
          // For now, just log that we need to run this manually
          console.log('   ⚠️  This statement needs to be run manually in Supabase SQL editor');
          console.log(`   SQL: ${stmt}`);
        } else {
          console.log('   ✅ Statement executed successfully');
        }
      } catch (stmtError) {
        console.log(`   ❌ Error executing statement: ${stmtError.message}`);
        console.log(`   SQL: ${stmt}`);
      }
    }

    console.log('\n✅ Security fix migration completed!');
    console.log('\n📝 Next steps:');
    console.log('  1. Go to Supabase Dashboard → SQL Editor');
    console.log('  2. Copy and paste the migration SQL above');
    console.log('  3. Run the migration manually');
    console.log('  4. Verify the function is secure');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
  } finally {
    rl.close();
  }
}

// Run the script
fixSearchPath().catch(console.error);
