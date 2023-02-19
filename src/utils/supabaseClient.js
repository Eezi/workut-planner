import { createClient } from '@supabase/supabase-js'
import { env } from "../env/client.mjs";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_API_KEY;
console.log('URL', supabaseUrl, 'KEY', supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey);
