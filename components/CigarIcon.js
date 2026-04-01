export default function CigarIcon({ size = 64 }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
      {/* Smoke wisps */}
      <path d="M30 18 Q28 10 32 4 Q34 0 31 -4" stroke="#8a6a50" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M36 16 Q33 8 37 2 Q39 -2 36 -6" stroke="#8a6a50" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Ash tip */}
      <rect x="2" y="24" width="18" height="12" rx="3" fill="#b0a89a"/>
      <rect x="4" y="25" width="14" height="10" rx="2" fill="#c8c0b8"/>
      <rect x="2" y="28" width="18" height="2" fill="#9a9288" opacity="0.5"/>

      {/* Burn ring */}
      <rect x="20" y="23" width="4" height="14" rx="1" fill="#e8650a" opacity="0.9"/>
      <rect x="21" y="24" width="2" height="12" rx="1" fill="#f59042" opacity="0.8"/>

      {/* Cigar body */}
      <rect x="24" y="22" width="106" height="16" rx="0" fill="#8B4513"/>

      {/* Wrapper texture */}
      <rect x="24" y="22" width="106" height="16" rx="0" fill="url(#wrapper)"/>

      {/* Cigar body rounded ends shaping */}
      <rect x="24" y="23" width="106" height="4" fill="#A0522D" opacity="0.3"/>
      <rect x="24" y="33" width="106" height="4" fill="#6B3410" opacity="0.3"/>

      {/* Band/label */}
      <rect x="90" y="22" width="28" height="16" fill="#C9913A"/>
      <rect x="91" y="23" width="26" height="14" fill="#b8791f" opacity="0.4"/>
      <text x="104" y="33" textAnchor="middle" fill="#1a0f0a" fontSize="5.5" fontFamily="serif" fontWeight="bold">JOURNAL</text>
      <rect x="90" y="22" width="28" height="1.5" fill="#e8d5b0" opacity="0.6"/>
      <rect x="90" y="36.5" width="28" height="1.5" fill="#e8d5b0" opacity="0.6"/>

      {/* Cap (rounded head) */}
      <ellipse cx="130" cy="30" rx="4" ry="8" fill="#7a3d0f"/>
      <ellipse cx="132" cy="30" rx="2" ry="7" fill="#9B4E18" opacity="0.5"/>

      {/* Cap seam */}
      <line x1="118" y1="22" x2="118" y2="38" stroke="#6B3410" strokeWidth="0.8" opacity="0.5"/>

      <defs>
        <linearGradient id="wrapper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0522D"/>
          <stop offset="40%" stopColor="#8B4513"/>
          <stop offset="100%" stopColor="#6B3410"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
