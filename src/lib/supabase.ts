import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or Vercel settings.');
}

const isBrowser = typeof window !== 'undefined';

const dualStorage = {
  getItem: (key: string) => {
    if (!isBrowser) return null;
    let val = window.localStorage.getItem(key);
    if (!val) {
      const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
      if (match) val = decodeURIComponent(match[2]);
    }
    return val;
  },
  setItem: (key: string, value: string) => {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  },
  removeItem: (key: string) => {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: dualStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // Disable Web Locks API to prevent orphaned lock deadlocks after logout
    lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
      return fn();
    },
  }
});
