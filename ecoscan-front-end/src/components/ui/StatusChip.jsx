import React from 'react'
import { cn } from '@/lib/utils'

const OK = ['Prêt', 'Synchronisé', 'Actif', 'Éligible', 'Connecté', 'Confirmée']
const WARN = ['En revue', 'À vérifier', 'À valider', 'En attente', 'En cours', 'Configuré']
const ALERT = ['Rejeté', 'Échoué']

export function StatusChip({ status, variant, className }) {
  const tone =
    variant === 'ready' || OK.includes(status)
      ? 'chip-ok'
      : variant === 'review' || WARN.includes(status)
        ? 'chip-warn'
        : ALERT.includes(status)
          ? 'chip-alert'
          : ''
  return <span className={cn('chip', tone, className)}>{status}</span>
}
