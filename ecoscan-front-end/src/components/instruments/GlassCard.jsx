import React from 'react'

/** tone : 'default' (verre) | 'inverse' (carte inversée, une seule par écran). */
export function GlassCard({ as: Tag = 'div', tone = 'default', className = '', children, ...rest }) {
  const cls = ['glass', tone === 'inverse' ? 'glass-inv' : '', className].filter(Boolean).join(' ')
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}
