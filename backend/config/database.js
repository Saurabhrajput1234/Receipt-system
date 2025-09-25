const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  try {
    // Test the connection by making a simple query
    const { data, error } = await supabase
      .from('receipts')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      throw error;
    }
    
    console.log('✅ Connected to Supabase successfully');
    return supabase;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
    console.log('\nPlease check:');
    console.log('1. Your SUPABASE_URL is correct');
    console.log('2. Your SUPABASE_ANON_KEY is correct');
    console.log('3. Your Supabase project is active');
    process.exit(1);
  }
};

const getSupabase = () => {
  return supabase;
};

module.exports = { connectDB, getSupabase };