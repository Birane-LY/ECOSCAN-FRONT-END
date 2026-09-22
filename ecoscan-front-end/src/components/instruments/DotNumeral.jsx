import React from 'react'

/** Chiffres en matrice de points (police Doto). À réserver à 2 ou 3 chiffres clés. */
export function DotNumeral({ children, size = 54, className = '', style }) {
  return (
    <span className={`dotnum ${className}`.trim()} style={{ fontSize: size, ...style }}>
      {children}
    </span>
  )
}
