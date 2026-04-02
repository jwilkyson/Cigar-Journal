import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tjzarxkwkyxhwgaooss.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
})
