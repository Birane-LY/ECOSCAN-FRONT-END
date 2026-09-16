import React from 'react'
import { CheckCircle2, X } from 'lucide-react'

export function ActionToast({ message, onClose }) {
  if (!message) return null

  return (
    <div className="action-toast" role="status">
      <CheckCircle2 size={15} />
      <span>{message}</span>
      <button aria-label="Fermer la confirmation" onClick={onClose}>
        <X size={13} />
      </button>
    </div>
  )
}
