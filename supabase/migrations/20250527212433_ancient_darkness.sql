/*
  # Add QR Code Tracking System

  1. New Tables
    - `item_instances`
      - `id` (uuid, primary key)
      - `product_id` (uuid) - References products
      - `qr_code` (text) - Unique QR code identifier
      - `status` (text) - Current status (available, rented, maintenance)
      - `last_rental_date` (timestamptz)
      - `expected_return_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `item_scans`
      - `id` (uuid, primary key)
      - `item_id` (uuid) - References item_instances
      - `scanned_by` (uuid) - References auth.users
      - `scan_type` (text) - Type of scan (check_in, check_out, inventory)
      - `status_before` (text)
      - `status_after` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and staff
*/

-- Create item_instances table
CREATE TABLE item_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) NOT NULL,
  qr_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
  last_rental_date TIMESTAMPTZ,
  expected_return_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create item_scans table
CREATE TABLE item_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES item_instances(id) NOT NULL,
  scanned_by UUID REFERENCES auth.users(id) NOT NULL,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('check_in', 'check_out', 'inventory')),
  status_before TEXT NOT NULL,
  status_after TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE item_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_scans ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Item Instances Policies
CREATE POLICY "Anyone can view item instances"
  ON item_instances
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Staff can manage item instances"
  ON item_instances
  FOR ALL
  TO authenticated
  USING (is_staff());

-- Item Scans Policies
CREATE POLICY "Staff can view all scans"
  ON item_scans
  FOR SELECT
  TO authenticated
  USING (is_staff());

CREATE POLICY "Staff can create scans"
  ON item_scans
  FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

-- Create function to update item status
CREATE OR REPLACE FUNCTION update_item_status(
  item_id UUID,
  new_status TEXT,
  scan_type TEXT,
  return_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS item_instances AS $$
DECLARE
  item item_instances;
BEGIN
  -- Get current item status
  SELECT * INTO item FROM item_instances WHERE id = item_id FOR UPDATE;
  
  -- Insert scan record
  INSERT INTO item_scans (
    item_id,
    scanned_by,
    scan_type,
    status_before,
    status_after
  ) VALUES (
    item_id,
    auth.uid(),
    scan_type,
    item.status,
    new_status
  );
  
  -- Update item status
  UPDATE item_instances SET
    status = new_status,
    last_rental_date = CASE 
      WHEN new_status = 'rented' THEN now()
      ELSE last_rental_date
    END,
    expected_return_date = return_date,
    updated_at = now()
  WHERE id = item_id
  RETURNING * INTO item;
  
  RETURN item;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;