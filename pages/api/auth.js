const SUPABASE_URL = 'https://tjzarxkwkyyxhwgaooss.supabase.co'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { mode, email, password } = req.body
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase anon key' })
  }

  const endpoint = mode === 'signup'
    ? `${SUPABASE_URL}/auth/v1/signup`
    : `${SUPABASE_URL}/auth/v1/token?grant_type=password`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(400).json({ error: data.error_description || data.msg || data.error || 'Auth failed' })
    }

    return res.status(200).json({
      user: data.user,
      session: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }
    })
  } catch (err) {
    console.error('Auth fetch error:', err)
    return res.status(500).json({ error: 'Server error: ' + err.message })
  }
}
