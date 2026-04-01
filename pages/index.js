import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import AuthPage from '../components/AuthPage'
import AddEntry from '../components/AddEntry'
import EntryDetail from '../components/EntryDetail'
import StarRating from '../components/StarRating'
import Head from 'next/head'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState([])
  const [view, setView] = useState('journal') // journal | add | detail
  const [selectedEntry, setSelectedEntry] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) fetchEntries()
  }, [user])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
    setEntries(data || [])
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setEntries([])
    setView('journal')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚬</div>
        <div style={{ color: 'var(--muted)', fontFamily: "'Playfair Display', serif" }}>Loading...</div>
      </div>
    </div>
  )

  if (!user) return (
    <>
      <Head>
        <title>Cigar Journal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1a0f0a" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <AuthPage />
    </>
  )

  return (
    <>
      <Head>
        <title>Cigar Journal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1a0f0a" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

        {view === 'journal' && (
          <div className="fade-in">
            {/* Header */}
            <div style={{ textAlign: 'center', padding: '28px 20px 16px', position: 'relative' }}>
              <button onClick={handleSignOut} style={{ position: 'absolute', right: '16px', top: '28px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}>Sign Out</button>
              <div style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Personal Collection</div>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--cream)', fontWeight: '700' }}>Cigar Journal</h1>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '12px auto' }} />
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
            </div>

            {/* Entries */}
            <div style={{ padding: '0 16px 100px' }}>
              {entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🚬</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--cream)', marginBottom: '8px' }}>No entries yet</div>
                  <div style={{ fontSize: '14px' }}>Tap + to log your first cigar</div>
                </div>
              ) : entries.map(entry => (
                <div key={entry.id} className="fade-in" onClick={() => { setSelectedEntry(entry); setView('detail') }}
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#3d2518', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {entry.image_url
                      ? <img src={entry.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '22px' }}>🚬</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: 'var(--cream)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.name || entry.brand || 'Unknown Cigar'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      {[entry.origin, entry.strength].filter(Boolean).join(' · ')}
                    </div>
                    <div style={{ marginTop: '5px' }}>
                      <StarRating value={entry.rating} readonly />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0, textAlign: 'right' }}>
                    {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>

            {/* FAB */}
            <button onClick={() => setView('add')}
              style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #b8791f, var(--gold))', border: 'none', fontSize: '32px', cursor: 'pointer', boxShadow: '0 4px 20px #C9913A55', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, color: '#1a0f0a', fontWeight: 'bold' }}>
              +
            </button>
          </div>
        )}

        {view === 'add' && (
          <AddEntry
            user={user}
            onSaved={() => { fetchEntries(); setView('journal') }}
            onBack={() => setView('journal')}
          />
        )}

        {view === 'detail' && selectedEntry && (
          <EntryDetail
            entry={selectedEntry}
            onBack={() => setView('journal')}
            onDeleted={() => { fetchEntries(); setView('journal') }}
          />
        )}
      </div>
    </>
  )
}
