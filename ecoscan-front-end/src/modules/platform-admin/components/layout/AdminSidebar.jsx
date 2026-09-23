'use client'

import React from 'react'
import { LogOut, X, HelpCircle as SupportIcon } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '../../constants'

function NavButton({ id, label, Icon, active, badge, onClick }) {
  return (
    <button
      type="button"
      className={active ? 'active' : ''}
      aria-current={active ? 'page' : undefined}
      onClick={() => onClick(id)}
    >
      {Icon && <Icon size={17} />}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && <i>{badge}</i>}
    </button>
  )
}

function NavGroup({ label, items, view, select, pendingSupportCount }) {
  return (
    <div className="adm-group">
      {label && <p>{label}</p>}
      {items.map(([id, itemLabel, Icon]) => (
        <NavButton
          key={id}
          id={id}
          label={itemLabel}
          Icon={Icon}
          active={view === id}
          badge={id === 'support' ? pendingSupportCount : undefined}
          onClick={select}
        />
      ))}
    </div>
  )
}

export function AdminSidebar({
  drawer,
  setDrawer,
  view,
  select,
  userProfile,
  pendingSupportCount = 23,
  onLogout,
}) {
  // Récupération des champs du modèle Utilisateur Django (nom & email)
  const nom = (userProfile?.nom || '').trim()
  const email = (userProfile?.email || '').trim()

  // Calcul des initiales basé sur 'nom' ou 'email'
  const getInitials = () => {
    if (nom) {
      const parts = nom.split(/\s+/).filter(Boolean)
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return nom.slice(0, 2).toUpperCase()
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'AD'
  }

  const initials = getInitials()
  const displayName = nom || email || 'Administrateur'

  const handleLogoutClick = (e) => {
    e.preventDefault()
    if (setDrawer) setDrawer(false)
    if (onLogout) onLogout()
  }

  return (
    <aside className={`adm-side ${drawer ? 'open' : ''}`}>
      <div className="adm-brand">
        <span>EcoScan</span>
        <span className="chip">Admin</span>
        {/* Masqué sur Web / Desktop */}
        <button
          type="button"
          className="icon-button adm-close lg:hidden"
          onClick={() => setDrawer(false)}
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="adm-context">
        <strong>EcoScan Platform</strong>
        <small>Console créateurs</small>
      </div>

      <nav className="adm-nav" aria-label="Navigation de la console">
        <NavGroup
          label="Plateforme"
          items={ADMIN_NAV_ITEMS.slice(0, 3)}
          view={view}
          select={select}
        />
        <NavGroup
          label="Pilotage"
          items={ADMIN_NAV_ITEMS.slice(3, 6)}
          view={view}
          select={select}
        />
        <NavGroup
          label="Opérations & Support"
          items={ADMIN_NAV_ITEMS.slice(6)}
          view={view}
          select={select}
          pendingSupportCount={pendingSupportCount}
        />
      </nav>

      <div className="adm-side-bottom">
        <p className="adm-status">
          <i aria-hidden="true" />
          Tous les systèmes opérationnels
        </p>
        <div className="adm-profile">
          <span className="ad-avatar">{initials}</span>
          <div>
            <strong>{displayName}</strong>
            <small>{userProfile?.role_display || userProfile?.role || 'Super Admin'}</small>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={handleLogoutClick}
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}