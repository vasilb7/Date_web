import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  "https://fbkjzteyzebyigrvmbps.supabase.co";

export const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZia2p6dGV5emVieWlncnZtYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODkxMTYsImV4cCI6MjEwNTc2NTExNn0.qH5AHUZAbvPDraJqyR1H8MyunMVgEaYsDk9krNBsXoU";

// Client-side / public Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client using service_role key
export const getSupabaseAdmin = () => {
  const serviceRoleKey =
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
