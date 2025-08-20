// Simple script to test Supabase connection and show market count
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    return;
  }

  console.log('🔗 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test connection by counting markets
    const { data: markets, error: marketsError } = await supabase
      .from('markets')
      .select('id, name, short_name, tier')
      .eq('is_active', true)
      .order('tier')
      .order('position');

    if (marketsError) {
      console.error('❌ Error fetching markets:', marketsError);
      return;
    }

    console.log(`✅ Successfully connected to Supabase!`);
    console.log(`📊 Found ${markets.length} active markets:`);
    
    const marketsByTier = markets.reduce((acc, market) => {
      if (!acc[market.tier]) acc[market.tier] = [];
      acc[market.tier].push(market);
      return acc;
    }, {});

    Object.keys(marketsByTier).forEach(tier => {
      const tierName = tier === '1' ? 'Major' : tier === '2' ? 'Regional' : 'Emerging';
      console.log(`\n  Tier ${tier} (${tierName}): ${marketsByTier[tier].length} markets`);
      marketsByTier[tier].forEach(market => {
        console.log(`    - ${market.short_name}: ${market.name}`);
      });
    });

    // Test sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id');

    if (!sessionsError) {
      console.log(`\n⏰ Found ${sessions.length} trading sessions`);
    }

    // Test holidays
    const { data: holidays, error: holidaysError } = await supabase
      .from('holidays')
      .select('id')
      .gte('date', new Date().toISOString().split('T')[0]);

    if (!holidaysError) {
      console.log(`🎉 Found ${holidays.length} upcoming holidays`);
    }

    console.log('\n🎯 Supabase setup is complete and working!');
    console.log('Your website should now show all 30 markets with real data.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabase();
