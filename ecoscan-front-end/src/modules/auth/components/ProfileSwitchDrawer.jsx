'use client'

import React from 'react'
import { Check, X } from 'lucide-react'
import { ROLE_PROFILES } from '../constants'

export function ProfileSwitchDrawer({ activeRole, onSelectRole, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="profile-switch-panel"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Fermer" onClick={onClose}>
          <X />
        </button>
        <p className="eyebrow">PROFIL DE DÉMONSTRATION</p>
        <h2>Changer de profil</h2>
        <p>Testez l’expérience adaptée aux permissions de chaque personne.</p>

        {Object.entries(ROLE_PROFILES).map(([roleKey, profile]) => (
          <button
            key={roleKey}
            className={activeRole === roleKey ? 'profile-option selected' : 'profile-option'}
            onClick={() => {
              onSelectRole(roleKey)
              onClose()
            }}
          >
            <span className="profile-avatar">{profile.initials}</span>
            <span>
              <strong>{profile.name}</strong>
              <small>{profile.label}</small>
            </span>
            {activeRole === roleKey && <Check size={16} />}
          </button>
        ))}
      </section>
    </div>
  )
}
