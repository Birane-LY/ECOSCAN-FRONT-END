import React from 'react'
import { cn } from '@/lib/utils'

export function StatusChip({ status, variant, className }) {
  const getVariantClass = () => {
    if (variant) return variant
    if (status === 'Prêt' || status === 'Synchronisé' || status === 'Actif' || status === 'Éligible') {
      return 'ready'
    }
    if (status === 'En revue' || status === 'À vérifier' || status === 'À valider') {
      return 'review'
    }
    return ''
  }

  return (
    <span className={cn('status-chip', getVariantClass(), className)}>
      {status}
    </span>
  )
}
