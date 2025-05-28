import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwknsrbgpxogbaebmuyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a25zcmJncHhvZ2JhZWJtdXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTY5OTMsImV4cCI6MjA2Mzk3Mjk5M30.GPgVV5ybScAKjrjjuOCHrig3SQ_37VzaN-3P7xl3cAY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('err!! Supabase URL or Anon Key is not defined.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);