'use client'

import React, { useEffect } from 'react'
import { EcoMark } from '@/components/instruments'

export function NotificationsPopover({ open, onClose, notifications, unreadCount, markAllRead, markOneRead }) {
  // Fermeture au clic extérieur et sur Échap (le bouton cloche gère son propre basculement)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (e.target.closest?.('.notifications-panel, [data-notif-toggle]')) return
      onClose?.()
    }
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="popover notifications-panel" role="dialog" aria-label="Notifications">
      <div className="popover-heading">
        <div>
          <strong>Notifications</strong>
          <span>
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </span>
        </div>
        <button className="text-button" onClick={markAllRead}>
          Tout marquer comme lu
        </button>
      </div>

      {notifications.map((n) => (
        <button
          className={`notification-row ${n.unread ? 'unread' : ''}`}
          key={n.id}
          onClick={() => markOneRead(n.id)}
        >
          <span className="notification-icon">
            <EcoMark size={15} />
          </span>
          <span>
            <strong>{n.title}</strong>
            <small>{n.body}</small>
          </span>
          {n.unread && <i />}
        </button>
      ))}
    </div>
  )
}
