import { createClient } from '@supabase/supabase-js';

/**
 * A shared Supabase client instance for the browser.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);