import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ SUPABASE_PROTOCOL_WARNING: NEXT_PUBLIC_SUPABASE_URL is missing. Data persistence will be localized to the browser only.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
