'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

export function NotificationsPopover({
  open,
  notifications,
  unreadCount,
  markAllRead,
  markOneRead,
}) {
  if (!open) return null

  return (
    <div className="popover notifications-panel">
      <div className="popover-heading">
        <div>
          <strong>Notifications</strong>
          <span>
            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
          </span>
        </div>
        <button className="text-button" onClick={markAllRead}>
          Tout lire
        </button>
      </div>

      {notifications.map((n) => (
        <button
          className={`notification-row ${n.unread ? 'unread' : ''}`}
          key={n.id}
          onClick={() => markOneRead(n.id)}
        >
          <span className="notification-icon">
            <Sparkles size={14} />
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
