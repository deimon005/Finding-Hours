import { createClient } from "@supabase/supabase-js";
import { supabase_env } from "../env";

const supabase = createClient(supabase_env.SUPABASE_URL, supabase_env.SUPABASE_ANON_KEY)

export default supabase