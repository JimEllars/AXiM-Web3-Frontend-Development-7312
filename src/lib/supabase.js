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

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
