const { getSupabase } = require("../config/database");

class Receipt {
  static async createTable() {
    // Supabase tables are created via SQL or Dashboard
    // This method is kept for compatibility but doesn't need to do anything
    console.log("📋 Receipt table should be created in Supabase Dashboard");
    console.log("📋 Run the following SQL in your Supabase SQL Editor:");
    console.log(`
CREATE TABLE IF NOT EXISTS receipts (
  id BIGSERIAL PRIMARY KEY,
  receipt_no VARCHAR(50),
  receipt_type VARCHAR(20) DEFAULT 'token',
  date DATE,
  from_name VARCHAR(255),
  relation_type VARCHAR(10) DEFAULT 'S/O',
  relation_name VARCHAR(255),
  address TEXT,
  mobile VARCHAR(20),
  token_expiry_date DATE,
  received_amount TEXT,
  reference_name VARCHAR(255),
  site_name VARCHAR(255),
  plot_villa_no VARCHAR(100),
  plot_size VARCHAR(100),
  basic_rate DECIMAL(18,2) DEFAULT 0,
  other DECIMAL(18,2) DEFAULT 0,
  cash DECIMAL(18,2) DEFAULT 0,
  cheque DECIMAL(18,2) DEFAULT 0,
  rtgs_neft DECIMAL(18,2) DEFAULT 0,
  amount DECIMAL(18,2) DEFAULT 0,
  rest_amount DECIMAL(18,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust as needed)
CREATE POLICY "Allow all operations on receipts" ON receipts
  FOR ALL USING (true);
    `);
  }

  static async create(receiptData) {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("receipts")
        .insert([
          {
            receipt_no: receiptData.receiptNo,
            receipt_type: receiptData.receiptType || 'token',
            date: receiptData.date || null,
            from_name: receiptData.fromName,
            relation_type: receiptData.relationType || 'S/O',
            relation_name: receiptData.relationName,
            address: receiptData.address,
            mobile: receiptData.mobile,
            token_expiry_date: receiptData.tokenExpiryDate || null,
            received_amount: receiptData.receivedAmount,
            reference_name: receiptData.referenceName,
            site_name: receiptData.siteName,
            plot_villa_no: receiptData.plotVillaNo,
            plot_size: receiptData.plotSize,
            basic_rate: parseFloat(receiptData.basicRate) || 0,
            other: parseFloat(receiptData.other) || 0,
            cash: parseFloat(receiptData.cash) || 0,
            cheque: parseFloat(receiptData.cheque) || 0,
            rtgs_neft: parseFloat(receiptData.rtgsNeft) || 0,
            amount: parseFloat(receiptData.amount) || 0,
            rest_amount: parseFloat(receiptData.restAmount) || 0,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error creating receipt:", err);
      throw err;
    }
  }

  static async findAll() {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Convert snake_case to camelCase for frontend compatibility
      return data.map((receipt) => ({
        id: receipt.id,
        receiptNo: receipt.receipt_no,
        receiptType: receipt.receipt_type,
        date: receipt.date,
        fromName: receipt.from_name,
        relationType: receipt.relation_type,
        relationName: receipt.relation_name,
        address: receipt.address,
        mobile: receipt.mobile,
        tokenExpiryDate: receipt.token_expiry_date,
        receivedAmount: receipt.received_amount,
        referenceName: receipt.reference_name,
        siteName: receipt.site_name,
        plotVillaNo: receipt.plot_villa_no,
        plotSize: receipt.plot_size,
        basicRate: receipt.basic_rate,
        other: receipt.other,
        cash: receipt.cash,
        cheque: receipt.cheque,
        rtgsNeft: receipt.rtgs_neft,
        amount: receipt.amount,
        restAmount: receipt.rest_amount,
        createdAt: receipt.created_at,
        updatedAt: receipt.updated_at,
      }));
    } catch (err) {
      console.error("Error fetching receipts:", err);
      throw err;
    }
  }

  static async findById(id) {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Convert snake_case to camelCase
      return {
        id: data.id,
        receiptNo: data.receipt_no,
        receiptType: data.receipt_type,
        date: data.date,
        fromName: data.from_name,
        relationType: data.relation_type,
        relationName: data.relation_name,
        address: data.address,
        mobile: data.mobile,
        tokenExpiryDate: data.token_expiry_date,
        receivedAmount: data.received_amount,
        referenceName: data.reference_name,
        siteName: data.site_name,
        plotVillaNo: data.plot_villa_no,
        plotSize: data.plot_size,
        basicRate: data.basic_rate,
        other: data.other,
        cash: data.cash,
        cheque: data.cheque,
        rtgsNeft: data.rtgs_neft,
        amount: data.amount,
        restAmount: data.rest_amount,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.error("Error fetching receipt:", err);
      throw err;
    }
  }

  static async findByReceiptNo(receiptNo) {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("receipt_no", receiptNo)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (err) {
      console.error("Error fetching receipt by number:", err);
      throw err;
    }
  }

  static async getNextReceiptNumber() {
    const supabase = getSupabase();

    try {
      // Get the highest numeric receipt number
      const { data, error } = await supabase
        .from("receipts")
        .select("receipt_no")
        .not("receipt_no", "is", null)
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // No receipts exist, start from 1
        return "1";
      }

      // Find the highest numeric receipt number
      let maxNumber = -1;
      data.forEach((receipt) => {
        const num = parseInt(receipt.receipt_no);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      });

      return (maxNumber + 1).toString();
    } catch (err) {
      console.error("Error getting next receipt number:", err);
      // Fallback: return timestamp-based number
      return Date.now().toString().slice(-6);
    }
  }

  static async getReceiptStats() {
    const supabase = getSupabase();

    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("amount, created_at");

      if (error) {
        throw error;
      }

      const totalReceipts = data.length;
      const totalAmount = data.reduce(
        (sum, receipt) => sum + (parseFloat(receipt.amount) || 0),
        0
      );
      const dates = data.map((r) => new Date(r.created_at)).sort();

      return {
        totalReceipts,
        totalAmount,
        lastReceiptDate: dates.length > 0 ? dates[dates.length - 1] : null,
        firstReceiptDate: dates.length > 0 ? dates[0] : null,
      };
    } catch (err) {
      console.error("Error getting receipt stats:", err);
      throw err;
    }
  }
}

module.exports = Receipt;
