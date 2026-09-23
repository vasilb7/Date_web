import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DateResponsePayload {
  name: string;
  selected_plan: string;
  selected_time: string;
  custom_note?: string;
  status?: string;
}

/**
 * Saves or logs the user's date invitation response to Supabase
 */
export async function saveDateResponse(payload: DateResponsePayload) {
  if (!supabase) {
    console.warn('Supabase is not configured yet. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    return { success: false, error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('date_responses')
      .insert([
        {
          name: payload.name,
          selected_plan: payload.selected_plan,
          selected_time: payload.selected_time,
          custom_note: payload.custom_note || null,
          status: payload.status || 'accepted',
        },
      ]);

    if (error) {
      console.error('Error saving date response to Supabase:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error inserting into Supabase:', err);
    return { success: false, error: err };
  }
}
