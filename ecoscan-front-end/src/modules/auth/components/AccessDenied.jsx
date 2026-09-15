import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { ROLE_PROFILES } from '../constants'

export function AccessDenied({ role }) {
  const profile = ROLE_PROFILES[role] || ROLE_PROFILES.viewer

  return (
    <div className="access-denied">
      <ShieldAlert size={24} />
      <div>
        <strong>Accès limité pour {profile.label}</strong>
        <span>
          Cette action nécessite des droits administrateur. Demandez l’accès à un responsable de votre organisation.
        </span>
      </div>
    </div>
  )
}
