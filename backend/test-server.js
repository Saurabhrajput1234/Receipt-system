// Quick server test
const { connectDB, getSupabase } = require('./config/database');

async function testServer() {
  console.log('🔍 Testing server components...\n');
  
  try {
    // Test 1: Environment variables
    console.log('1. Environment Variables:');
    console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('   PORT:', process.env.PORT || 5000);
    
    // Test 2: Database connection
    console.log('\n2. Database Connection:');
    await connectDB();
    
    // Test 3: Test a simple query
    console.log('\n3. Database Query Test:');
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('receipts')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('   Query Error:', error.message);
      if (error.code === 'PGRST116') {
        console.log('   ❌ Table "receipts" does not exist!');
        console.log('   📋 Please run the SQL commands from FIX_DATABASE.sql');
      }
    } else {
      console.log('   ✅ Database query successful');
    }
    
    // Test 4: Receipt model
    console.log('\n4. Receipt Model Test:');
    const Receipt = require('./models/Receipt');
    await Receipt.createTable(); // This will show the SQL to create table
    
    console.log('\n🎉 Server test completed!');
    
  } catch (error) {
    console.error('\n❌ Server test failed:');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
  }
  
  process.exit(0);
}

testServer();