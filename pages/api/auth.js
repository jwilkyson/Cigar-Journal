import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tjzarxkwkyxhwgaooss.supabase.co'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { mode, email, password } = req.body

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase key in environment' })
  }

  const supabase = createClient(SUPABASE_URL, supabaseKey)

  try {
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ user: data.user, session: data.session })
    }

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return res.status(400).json({ error: error.message })
      return res.status(200).json({ user: data.user, session: data.session })
    }

    return res.status(400).json({ error: 'Invalid mode' })
  } catch (err) {
    console.error('Auth error:', err)
    return res.status(500).json({ error: err.message })
  }
}
