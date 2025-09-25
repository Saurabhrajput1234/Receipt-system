# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project name: "receipt-system" (or any name you prefer)
6. Enter database password (save this!)
7. Choose region closest to you
8. Click "Create new project"

## 2. Get Project Credentials

1. Go to your project dashboard
2. Click on "Settings" (gear icon) in the sidebar
3. Click on "API" in the settings menu
4. Copy the following:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Update Environment Variables

Update your `backend/.env` file:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Create Database Table

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Clean database schema with only fields used in frontend
CREATE TABLE IF NOT EXISTS receipts (
  id BIGSERIAL PRIMARY KEY,
  receipt_no VARCHAR(50),
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_no ON receipts(receipt_no);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);

-- Add constraint for relation_type
ALTER TABLE receipts ADD CONSTRAINT check_relation_type
  CHECK (relation_type IN ('S/O', 'D/O', 'W/O'));
```

5. Click "Run" to execute the SQL

## 5. Install Dependencies

Run in your backend directory:

```bash
npm install
```

This will install the new Supabase dependency.

## 6. Start the Server

```bash
npm run dev
```

## 7. Test the Connection

1. Open your browser and go to: `http://localhost:5000/api/health`
2. You should see a success message with "Supabase" as the database type

## 8. Optional: Set up Row Level Security (RLS)

If you want to add authentication later, you can modify the RLS policies:

```sql
-- Remove the allow-all policy
DROP POLICY "Allow all operations on receipts" ON receipts;

-- Add authenticated user policy
CREATE POLICY "Authenticated users can manage receipts" ON receipts
  FOR ALL USING (auth.role() = 'authenticated');
```

## Troubleshooting

### Connection Issues

- Double-check your SUPABASE_URL and SUPABASE_ANON_KEY
- Make sure your Supabase project is active (not paused)
- Check that you're using the correct anon key (not the service_role key)

### Table Issues

- Make sure you ran the SQL to create the table
- Check that RLS policies allow your operations
- Verify the table exists in the Supabase dashboard under "Table Editor"

### API Issues

- Check the browser console for CORS errors
- Make sure your frontend is running on the allowed origins (localhost:5173)

## Features Included

✅ **Removed**: SQL Server, SQLite dependencies and files
✅ **Added**: Supabase integration
✅ **Cleaned**: Removed unused database files and configurations
✅ **Updated**: All models and routes to work with Supabase
✅ **Added**: Better error handling for Supabase-specific errors
✅ **Added**: New API endpoints for receipt statistics and next receipt number

Your backend is now clean and ready to use with Supabase!
