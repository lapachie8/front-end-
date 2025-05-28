/*
  # Admin System Setup

  1. New Tables
    - `admin_profiles`
      - `id` (uuid, primary key) - References auth.users
      - `role` (text) - Admin role (super_admin, admin)
      - `two_factor_secret` (text) - 2FA secret
      - `two_factor_enabled` (boolean)
      - `login_attempts` (integer)
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `admin_audit_logs`
      - `id` (uuid, primary key)
      - `admin_id` (uuid) - References admin_profiles
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (uuid)
      - `details` (jsonb)
      - `created_at` (timestamptz)
    
    - `email_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subject` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `email_queue`
      - `id` (uuid, primary key)
      - `template_id` (uuid)
      - `recipient` (text)
      - `data` (jsonb)
      - `status` (text)
      - `attempts` (integer)
      - `error` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add function for rate limiting
*/

-- Create admin_profiles table
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN DEFAULT false,
  login_attempts INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_audit_logs table
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_profiles(id) NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create email_templates table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create email_queue table
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES email_templates(id),
  recipient TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Create is_admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create super_admin function
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.login_attempts >= 5 THEN
    RAISE EXCEPTION 'Too many login attempts';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for login attempts
CREATE TRIGGER check_login_attempts_trigger
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_login_attempts();

-- Admin Profiles Policies
CREATE POLICY "Admins can view all admin profiles"
  ON admin_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Super admins can insert admin profiles"
  ON admin_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update admin profiles"
  ON admin_profiles
  FOR UPDATE
  TO authenticated
  USING (is_super_admin());

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "System can insert audit logs"
  ON admin_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Email Templates Policies
CREATE POLICY "Admins can view email templates"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Email Queue Policies
CREATE POLICY "Admins can view email queue"
  ON email_queue
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "System can manage email queue"
  ON email_queue
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Insert default email templates
INSERT INTO email_templates (name, subject, content) VALUES
  ('order_confirmation', 'Order Confirmation - RentEase', 'Thank you for your order! Your order #{{order_id}} has been confirmed.'),
  ('order_status_update', 'Order Status Update - RentEase', 'Your order #{{order_id}} status has been updated to {{status}}.'),
  ('admin_login_code', 'Your Login Code - RentEase Admin', 'Your 2FA code is: {{code}}');