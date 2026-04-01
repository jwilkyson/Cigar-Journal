export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readonly && onChange && onChange(s)}
          style={{
            fontSize: readonly ? '18px' : '28px',
            cursor: readonly ? 'default' : 'pointer',
            color: s <= value ? '#C9913A' : '#4a3728',
            textShadow: s <= value ? '0 0 8px #C9913A66' : 'none',
            transition: 'all 0.2s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
