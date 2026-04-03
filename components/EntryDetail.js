import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import StarRating from './StarRating'

const labelStyle = {
  display: 'block', fontSize: '11px', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px',
  fontFamily: "'Playfair Display', serif"
}

export default function EntryDetail({ entry, onBack, onDeleted, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...entry })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('journal_entries').delete().eq('id', entry.id)
    onDeleted()
  }

  const handleSave = async () => {
    setSaving(true)
    const { confidence, image_url, id, user_id, created_at, ...formData } = form
    const { error } = await supabase
      .from('journal_entries')
      .update(formData)
      .eq('id', entry.id)
    setSaving(false)
    if (error) { setStatus('Save failed: ' + error.message); return }
    setEditing(false)
    onUpdated({ ...form })
  }

  const fld = (label, key, placeholder = '') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
    </div>
  )

  const Row = ({ label, value }) => value ? (
    <div style={{ borderBottom: '1px solid var(--border)', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
      <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: "'Playfair Display', serif", letterSpacing: '0.08em', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '15px', color: 'var(--cream)', textAlign: 'right', fontFamily: "'Crimson Text', serif" }}>{value}</span>
    </div>
  ) : null

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", fontSize: '13px' }}>← Back</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
          )}
          <button onClick={handleDelete} style={{ background: 'transparent', border: '1px solid #5a1a1a', color: 'var(--danger)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
        </div>
      </div>

      {entry.image_url && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', maxHeight: '220px' }}>
          <img src={entry.image_url} alt="" style={{ width: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {!editing ? (
        <>
          <div style={{ marginBottom: '6px', fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--cream)', fontWeight: '700', lineHeight: '1.2' }}>
            {entry.name || entry.brand || 'Unknown Cigar'}
          </div>
          {entry.brand && entry.name && (
            <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '10px' }}>{entry.brand}</div>
          )}
          <div style={{ marginBottom: '8px' }}><StarRating value={entry.rating} readonly /></div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '24px' }}>
            {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>Blend</div>
            <Row label="Origin" value={entry.origin} />
            <Row label="Wrapper" value={entry.wrapper} />
            <Row label="Binder" value={entry.binder} />
            <Row label="Filler" value={entry.filler} />
            <Row label="Strength" value={entry.strength} />
            <Row label="Size" value={entry.size} />
            <Row label="Price Paid" value={entry.price} />
          </div>

          {entry.notes && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>Tasting Notes</div>
              <p style={{ margin: 0, color: 'var(--cream)', fontFamily: "'Crimson Text', serif", fontSize: '16px', lineHeight: '1.7' }}>{entry.notes}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Edit Details</div>
            {fld('Brand', 'brand')}
            {fld('Name / Line', 'name')}
            {fld('Country of Origin', 'origin')}
            {fld('Wrapper', 'wrapper')}
            {fld('Binder', 'binder')}
            {fld('Filler', 'filler')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Strength</label>
                <select value={form.strength || ''} onChange={e => setForm(f => ({ ...f, strength: e.target.value }))}>
                  <option value="">Select</option>
                  {['Mild', 'Mild-Medium', 'Medium', 'Medium-Full', 'Full'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>{fld('Size / Vitola', 'size')}</div>
            </div>
            <div style={{ marginTop: '14px' }}>{fld('Price Paid', 'price')}</div>
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px', fontFamily: "'Playfair Display', serif" }}>Your Review</div>
            <label style={labelStyle}>Rating</label>
            <div style={{ marginBottom: '16px' }}><StarRating value={form.rating || 0} onChange={v => setForm(f => ({ ...f, rating: v }))} /></div>
            <label style={labelStyle}>Tasting Notes</label>
            <textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ minHeight: '100px', resize: 'vertical' }} />
          </div>

          {status && <div style={{ color: '#df8a8a', fontSize: '13px', marginBottom: '12px' }}>{status}</div>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setEditing(false)} style={{ flex: 1, background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '13px', cursor: 'pointer', fontFamily: "'Playfair Display', serif", fontSize: '14px' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg, #b8791f, var(--gold))', color: '#1a0f0a', border: 'none', borderRadius: '8px', padding: '13px', fontFamily: "'Playfair Display', serif", fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
