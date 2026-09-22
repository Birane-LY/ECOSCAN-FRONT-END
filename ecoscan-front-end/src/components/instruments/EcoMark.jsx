import React from 'react'

/** Glyphe de marque : un cadran. Remplace l'icône ✨ dans toute l'interface. */
export function EcoMark({ size = 16, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.5 15.5A8 8 0 1 1 19.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 13.2 15.4 7.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="13.2" r="2.3" fill="currentColor" />
    </svg>
  )
}
