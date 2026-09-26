import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const supabaseUrl = env.SUPABASE_URL || 'https://rkmoizysggjcdowpldcz.supabase.co';
export const supabasePublishableKey = env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_NCHGz1hCJZe-i_vm4O1FGQ__b2_Cdee';
export const supabaseSecretKey = env.SUPABASE_SECRET_KEY || supabasePublishableKey;

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
