const { connectDB, getPool, sql } = require("./config/database");

async function testConnection() {
  console.log("Testing database connection...\n");

  try {
    // Test connection
    console.log("1. Connecting to SQL Server...");
    await connectDB();
    console.log("✅ Connected successfully!\n");

    // Test database exists
    console.log("2. Checking if ReceiptDB exists...");
    const pool = getPool();
    const dbCheck = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = 'ReceiptDB'
    `);

    if (dbCheck.recordset.length > 0) {
      console.log("✅ ReceiptDB database exists!\n");
    } else {
      console.log("❌ ReceiptDB database does not exist!");
      console.log("Please run the setup-windows-auth.sql script first.\n");
      return;
    }

    // Test table exists
    console.log("3. Checking if receipts table exists...");
    const tableCheck = await pool.request().query(`
      SELECT * FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'receipts' AND TABLE_SCHEMA = 'dbo'
    `);

    if (tableCheck.recordset.length > 0) {
      console.log("✅ receipts table exists!\n");
    } else {
      console.log("❌ receipts table does not exist!");
      console.log("Please run the setup-windows-auth.sql script first.\n");
      return;
    }

    // Test insert/select
    console.log("4. Testing insert and select operations...");
    const testData = {
      receiptNo: "TEST" + Date.now(),
      fromName: "Test User",
      mobile: "1234567890",
      amount: 1000.0,
    };

    const insertResult = await pool
      .request()
      .input("receiptNo", sql.NVarChar, testData.receiptNo)
      .input("fromName", sql.NVarChar, testData.fromName)
      .input("mobile", sql.NVarChar, testData.mobile)
      .input("amount", sql.Decimal(18, 2), testData.amount).query(`
        INSERT INTO receipts (receiptNo, fromName, mobile, amount)
        VALUES (@receiptNo, @fromName, @mobile, @amount);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const insertedId = insertResult.recordset[0].id;
    console.log(`✅ Test record inserted with ID: ${insertedId}`);

    // Clean up test data
    await pool
      .request()
      .input("id", sql.Int, insertedId)
      .query("DELETE FROM receipts WHERE id = @id");

    console.log("✅ Test record cleaned up\n");

    console.log("🎉 All database tests passed!");
    console.log("Your database is ready to use with the application.\n");
  } catch (error) {
    console.error("❌ Database test failed:");
    console.error("Error:", error.message);
    console.log("\nTroubleshooting tips:");
    console.log("1. Make sure SQL Server is running");
    console.log("2. Check if SQL Server allows Windows Authentication");
    console.log("3. Run SQL Server Management Studio as the same user");
    console.log("4. Make sure ReceiptDB database exists");
    console.log("5. Run the setup-windows-auth.sql script\n");
  } finally {
    process.exit();
  }
}

testConnection();
