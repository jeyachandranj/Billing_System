// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
