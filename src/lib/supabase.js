import { createClient } from '@supabase/supabase-js';

// Ambil variabel lingkungan jika ada (dapat diset di file .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Cek apakah kredensial Supabase sudah diisi
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function untuk penyimpanan data (Fallback ke LocalStorage jika Supabase belum disetup)
export const saveUserData = async (table, data) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: result, error } = await supabase.from(table).insert([data]).select();
      if (error) throw error;
      return { success: true, data: result };
    } catch (err) {
      console.warn(`[Supabase Error] Menyipam ke LocalStorage sebagai fallback:`, err.message);
    }
  }

  // LocalStorage Fallback
  try {
    const existing = JSON.parse(localStorage.getItem(`seatle_${table}`) || '[]');
    const newItem = { id: Date.now().toString(), ...data, created_at: new Date().toISOString() };
    existing.push(newItem);
    localStorage.setItem(`seatle_${table}`, JSON.stringify(existing));
    return { success: true, data: [newItem] };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

export const fetchUserData = async (table) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn(`[Supabase Error] Mengambil dari LocalStorage:`, err.message);
    }
  }

  // LocalStorage Fallback
  try {
    return JSON.parse(localStorage.getItem(`seatle_${table}`) || '[]');
  } catch {
    return [];
  }
};
