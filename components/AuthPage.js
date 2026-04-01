import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import CigarIcon from './CigarIcon'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!email || !password) { setStatus('Please enter your email and password.'); return }
    setLoading(true)
    setStatus('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, email, password })
      })

      const data = await res.json()

      if (data.error) {
        setStatus(data.error)
        setLoading(false)
        return
      }

      if (mode === 'signup') {
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          })
        } else {
          setStatus('Account created! Check your email for a confirmation link, then sign in.')
        }
      } else {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }
    } catch (err) {
      setStatus('Connection error: ' + err.message)
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <CigarIcon size={120} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--cream)', fontWeight: '700', marginBottom: '6px' }}>
            Cigar Journal
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Your personal cigar tasting log</p>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', background: '#2a1a10', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setStatus('') }}
                style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", fontSize: '13px', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? '#1a0f0a' : 'var(--muted)', fontWeight: mode === m ? '700' : '400', transition: 'all 0.2s' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px', fontFamily: "'Playfair Display', serif" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px', fontFamily: "'Playfair Display', serif" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handle()} />
          </div>

          {status && (
            <div style={{ background: status.includes('created') || status.includes('Check') ? '#1a3a1a' : '#3a1a1a', border: '1px solid ' + (status.includes('created') || status.includes('Check') ? '#3a7a3a' : '#7a3a3a'), borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: status.includes('created') || status.includes('Check') ? '#8adf8a' : '#df8a8a' }}>
              {status}
            </div>
          )}

          <button onClick={handle} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #b8791f, var(--gold))', color: '#1a0f0a', border: 'none', borderRadius: '8px', padding: '13px 24px', fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '15px', letterSpacing: '0.08em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
