-- Update Receipt Schema to match Frontend
-- Run this SQL in your Supabase SQL Editor

-- Add new columns for checkbox states and cheque number
ALTER TABLE receipts 
ADD COLUMN IF NOT EXISTS cash_checked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cheque_checked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cheque_no VARCHAR(100);

-- Update existing table structure comment
COMMENT ON TABLE receipts IS 'Updated receipt table with checkbox states and cheque number';

-- Optional: Update existing records to set default values
UPDATE receipts 
SET 
  cash_checked = CASE WHEN cash > 0 THEN TRUE ELSE FALSE END,
  cheque_checked = CASE WHEN cheque > 0 THEN TRUE ELSE FALSE END
WHERE cash_checked IS NULL OR cheque_checked IS NULL;

-- Create index for better performance on checkbox queries
CREATE INDEX IF NOT EXISTS idx_receipts_payment_methods ON receipts(cash_checked, cheque_checked);