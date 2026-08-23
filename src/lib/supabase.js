import { createClient } from '@supabase/supabase-js';

// Fallback logic safely handles undefined import.meta.env properties
const getEnv = (key, fallback) => {
    try {
        if (import.meta && import.meta.env && import.meta.env[key]) {
            return import.meta.env[key];
        }
    } catch (e) {
        // Ignore errors in environments where import.meta is not fully supported
    }
    return fallback;
};

const supabaseUrl = getEnv('VITE_AXIM_CORE_URL', null);
const supabaseKey = getEnv('VITE_AXIM_CORE_ANON_KEY', null);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        refreshSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ error: new Error('Database uplink offline. Authentication disabled.') }),
        signUp: async () => ({ error: new Error('Database uplink offline. Registration disabled.') })
      },
      from: () => ({
        insert: async () => ({ error: new Error('Database uplink offline.') }),
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) })
      })
    };
