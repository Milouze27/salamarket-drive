import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_APP_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "[Supabase] Variables d'environnement manquantes : définis VITE_APP_SUPABASE_URL et VITE_APP_SUPABASE_ANON_KEY dans Lovable → Project Settings → Environment Variables.",
  );
}

let _client: SupabaseClient | null = null;

export const supabase: SupabaseClient =
  _client ??
  (_client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }));
