-- Fix Database Schema and Constraints
-- Run these commands in your Supabase SQL Editor

-- First, check if the table exists and what columns it has
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'receipts' 
ORDER BY ordinal_position;

-- If the table doesn't have the correct structure, drop and recreate it
DROP TABLE IF EXISTS receipts;

-- Create the correct table structure with receipt_type
CREATE TABLE receipts (
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

-- Enable Row Level Security
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations on receipts" ON receipts
  FOR ALL USING (true);

-- Add constraints for relation_type and receipt_type
ALTER TABLE receipts ADD CONSTRAINT check_relation_type 
  CHECK (relation_type IN ('S/O', 'D/O', 'W/O'));

ALTER TABLE receipts ADD CONSTRAINT check_receipt_type 
  CHECK (receipt_type IN ('token', 'banking', 'emi'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_no ON receipts(receipt_no);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_relation_type ON receipts(relation_type);

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'receipts' 
ORDER BY ordinal_position;