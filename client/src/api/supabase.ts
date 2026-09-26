import { createClient } from '@supabase/supabase-js';

const meta = (import.meta as any);
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://rkmoizysggjcdowpldcz.supabase.co';
const supabasePublishableKey = meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_NCHGz1hCJZe-i_vm4O1FGQ__b2_Cdee';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
