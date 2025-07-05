// supabase.js
import { createClient } from '@supabase/supabase-js';
import env from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;