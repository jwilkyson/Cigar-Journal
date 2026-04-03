import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import StarRating from './StarRating'

const defaultForm = {
  name: '', brand: '', origin: '', wrapper: '',
  binder: '', filler: '', strength: '', size: '',
  price: '', rating: 0, notes: '',
}

const labelStyle = {
  display: 'block', fontSize: '11px', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px',
  fontFamily: "'Playfair Display', serif"
}

export default function AddEntry({ user, onSaved, onBack }) {
  const [form, setForm] = useState({ ...defaultForm })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchMode, setSearchMode] = useState('photo')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiStatus, setAiStatus] = useState('')
  const fileInputRef = useRef()

  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = () => rej(new Error('Read failed'))
    r.readAsDataURL(file)
  })

  const identifyFromPhoto = async (file) => {
    setLoading(true)
    setAiStatus('Analyzing cigar band...')
    try {
      const base64 = await toBase64(file)
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasImage: true,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
              { type: 'text', text: 'Identify this cigar from the band or packaging.' }
            ]
          }]
        })
      })
      const data = await res.json()
      setForm(f => ({ ...f, ...data }))
      setAiStatus(data.confidence === 'low' ? 'Low confidence — please verify details.' : '✓ Cigar identified! Review and fill in remaining fields.')
    } catch {
      setAiStatus('Could not identify — please fill in manually.')
    }
    setLoading(false)
  }

  const identifyFromText = async () => {
    if (!searchText.trim()) return
    setLoading(true)
    setAiStatus('Looking up cigar info...')
    try {
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasImage: false,
          messages: [{ role: 'user', content: `Look up this cigar: ${searchText}` }]
        })
      })
      const data = await res.json()
      setForm(f => ({ ...f, ...data }))
      setAiStatus('✓ Details filled in — review and adjust as needed.')
    } catch {
      setAiStatus('Lookup failed — please fill in manually.')
    }
    setLoading(false)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    identifyFromPhoto(file)
  }

  const handleSave = async () => {
    if (!form.name && !form.brand) { setAiStatus('Please add a name or brand before saving.'); return }
    setSaving(true)
    setAiStatus('Saving entry...')

    let image_url = null
    if (imageFile) {
      try {
        const base64 = await toBase64(imageFile)
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, fileName: imageFile.name, userId: user.id })
        })
        const data = await res.json()
        image_url = data.url
      } catch { /* continue without image */ }
    }

    const { confidence, ...formData } = form
    const { error } = await supabase.from('journal_entries').insert([{
      user_id: user.id,
      ...formData,
      image_url,
    }])

    setSaving(false)
    if (error) { setAiStatus('Save failed: ' + error.message); return }
    onSaved()
  }

  const fld = (label, key, placeholder = '', type = 'text') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
    </div>
  )

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", fontSize: '13px' }}>← Back</button>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", color: 'var(--cream)', fontSize: '20px' }}>New Entry</h2>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', background: '#2a1a10', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
        {['photo', 'text'].map(mode => (
          <button key={mode} onClick={() => setSearchMode(mode)}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", fontSize: '13px', background: searchMode === mode ? 'var(--gold)' : 'transparent', color: searchMode === mode ? '#1a0f0a' : 'var(--muted)', fontWeight: searchMode === mode ? '700' : '400', transition: 'all 0.2s' }}>
            {mode === 'photo' ? '📷 Photo Scan' : '🔍 Text Search'}
          </button>
        ))}
      </div>

      {searchMode === 'photo' ? (
        <div onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed var(--border)`, borderRadius: '12px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', background: '#2a1a10', overflow: 'hidden', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imagePreview
            ? <img src={imagePreview} alt="" style={{ maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }} />
            : <div>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📷</div>
                <div style={{ color: 'var(--cream)', fontFamily: "'Playfair Display', serif", fontSize: '15px' }}>Tap to take photo or upload</div>
                <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '4px' }}>Photo of band or label</div>
              </div>}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="e.g. Padron 1964 Anniversary Maduro" onKeyDown={e => e.key === 'Enter' && identifyFromText()} />
          <button onClick={identifyFromText} style={{ background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap', fontSize: '13px' }}>Search</button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} style={{ display: 'none' }} />

      {(loading || aiStatus) && (
        <div style={{ background: '#2a1a10', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {loading && <div style={{ width: '16px', height: '16px', border: '2px solid var(--border)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />}
          <span style={{ fontSize: '13px', color: loading ? 'var(--gold)' : 'var(--cream)' }}>{aiStatus}</span>
        </div>
      )}

      {/* Cigar Details */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Cigar Details</div>
        {fld('Brand', 'brand', 'e.g. Arturo Fuente')}
        {fld('Name / Line', 'name', 'e.g. Hemingway Short Story')}
        {fld('Country of Origin', 'origin', 'e.g. Dominican Republic')}
        {fld('Wrapper', 'wrapper', 'e.g. Cameroon')}
        {fld('Binder', 'binder', 'e.g. Dominican')}
        {fld('Filler', 'filler', 'e.g. Dominican, Nicaraguan')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Strength</label>
            <select value={form.strength} onChange={e => setForm(f => ({ ...f, strength: e.target.value }))}>
              <option value="">Select</option>
              {['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>{fld('Size / Vitola', 'size', 'e.g. Robusto')}</div>
        </div>
        <div style={{ marginTop: '14px' }}>{fld('Price Paid', 'price', 'e.g. $12.50')}</div>
      </div>

      {/* Review */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Your Review</div>
        <label style={labelStyle}>Rating</label>
        <div style={{ marginBottom: '16px' }}><StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} /></div>
        <label style={labelStyle}>Tasting Notes</label>
        <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Describe the flavor profile, draw, construction, smoke, finish..." style={{ minHeight: '100px', resize: 'vertical' }} />
      </div>

      <button onClick={handleSave} disabled={saving}
        style={{ width: '100%', background: 'linear-gradient(135deg, #b8791f, var(--gold))', color: '#1a0f0a', border: 'none', borderRadius: '8px', padding: '14px 24px', fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '15px', letterSpacing: '0.08em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving...' : 'Save to Journal'}
      </button>
    </div>
  )
}
