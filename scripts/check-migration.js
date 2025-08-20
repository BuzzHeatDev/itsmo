#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkMigration() {
  console.log('🔍 Checking if migration was applied...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if NYSE & NASDAQ are combined
    const { data: nyseData, error: nyseError } = await supabase
      .from('markets')
      .select('name, short_name')
      .eq('slug', 'nyse')
      .single();

    if (nyseError) {
      console.error('❌ Error checking NYSE:', nyseError.message);
      return;
    }

    // Check if NASDAQ still exists separately
    const { data: nasdaqData, error: nasdaqError } = await supabase
      .from('markets')
      .select('name')
      .eq('slug', 'nasdaq')
      .single();

    // Check ENX flags
    const { data: enxData, error: enxError } = await supabase
      .from('markets')
      .select('flag_emoji, country')
      .eq('slug', 'euronext-paris')
      .single();

    // Check DAX
    const { data: daxData, error: daxError } = await supabase
      .from('markets')
      .select('name, short_name, flag_emoji, country')
      .eq('slug', 'dax')
      .single();

    console.log('📊 Current Market Status:');
    console.log('─'.repeat(50));
    
    if (nyseData) {
      console.log(`NYSE: ${nyseData.name} (${nyseData.short_name})`);
      if (nyseData.name.includes('NASDAQ')) {
        console.log('✅ NYSE & NASDAQ combined successfully');
      } else {
        console.log('❌ NYSE & NASDAQ not combined yet');
      }
    }

    if (nasdaqError && nasdaqError.code === 'PGRST116') {
      console.log('✅ NASDAQ entry deleted successfully');
    } else if (nasdaqData) {
      console.log('❌ NASDAQ still exists as separate entry');
    }

    if (enxData) {
      console.log(`ENX: ${enxData.flag_emoji} (${enxData.country})`);
      if (enxData.flag_emoji.includes('🇪🇺') && enxData.flag_emoji.includes('🇫🇷')) {
        console.log('✅ ENX has dual flags');
      } else {
        console.log('❌ ENX flags not updated yet');
      }
    }

    if (daxData) {
      console.log(`DAX: ${daxData.name} - ${daxData.flag_emoji} (${daxData.country})`);
      if (daxData.flag_emoji.includes('🇪🇺') && daxData.flag_emoji.includes('🇩🇪')) {
        console.log('✅ DAX has dual flags');
      } else {
        console.log('❌ DAX flags not updated yet');
      }
    } else if (daxError) {
      console.log('❌ DAX entry not found (still using xetra slug?)');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMigration();
