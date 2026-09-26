import { createClient } from '@supabase/supabase-js';

const meta = (import.meta as any);
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://rkmoizysggjcdowpldcz.supabase.co';
const supabaseAnonKey =
  meta.env?.VITE_SUPABASE_ANON_KEY ||
  meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbW9penlzZ2dqY2Rvd3BsZGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTM2MDAsImV4cCI6MjA1NDUzOTYwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
