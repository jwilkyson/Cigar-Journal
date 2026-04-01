import { supabase } from '../lib/supabaseClient'
import StarRating from './StarRating'

export default function EntryDetail({ entry, onBack, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('journal_entries').delete().eq('id', entry.id)
    onDeleted()
  }

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
        <button onClick={handleDelete} style={{ background: 'transparent', border: '1px solid #5a1a1a', color: 'var(--danger)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
      </div>

      {entry.image_url && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', maxHeight: '220px' }}>
          <img src={entry.image_url} alt="" style={{ width: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ marginBottom: '6px', fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--cream)', fontWeight: '700', lineHeight: '1.2' }}>
        {entry.name || entry.brand || 'Unknown Cigar'}
      </div>
      {entry.brand && entry.name && (
        <div style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '10px' }}>{entry.brand}</div>
      )}
      <div style={{ marginBottom: '8px' }}>
        <StarRating value={entry.rating} readonly />
      </div>
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
    </div>
  )
}
