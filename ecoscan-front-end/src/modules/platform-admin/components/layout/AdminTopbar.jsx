'use client'

import React, { useState } from 'react'
import { Bell, Menu, MessageSquareText, Moon, Search, Sun } from 'lucide-react'

export function AdminTopbar({
  title,
  setDrawer,
  setChat,
  notify,
  dark,
  setDark,
  userProfile,
  unreadCount = 0,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // Récupération des champs du modèle Utilisateur Django
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

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <header className="adm-top">
      <div className="adm-top-left">
        {/* Masqué sur Web / Desktop */}
        <button
          type="button"
          className="icon-button adm-menu lg:hidden"
          onClick={() => setDrawer && setDrawer(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={18} />
        </button>
        <span className="adm-crumb">
          EcoScan Platform <span aria-hidden="true">/</span>{' '}
          <strong>{title}</strong>
        </span>
      </div>

      <div className="adm-top-actions">
        <label className="adm-search">
          <Search size={16} />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher…"
            aria-label="Rechercher"
          />
        </label>

        <button
          type="button"
          className="icon-button"
          onClick={() => setDark && setDark((v) => !v)}
          aria-label={dark ? 'Passer en thème clair' : 'Passer en thème nuit'}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          className="icon-button adm-notif-btn"
          onClick={() =>
            notify &&
            notify(
              unreadCount > 0
                ? `Vous avez ${unreadCount} notification(s) non lue(s)`
                : 'Aucune nouvelle notification'
            )
          }
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && <span className="adm-badge-dot" />}
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={() => setChat && setChat(true)}
          aria-label="Ouvrir la messagerie de la plateforme"
        >
          <MessageSquareText size={17} />
        </button>

        <span className="ad-avatar" title={displayName}>
          {initials}
        </span>
      </div>
    </header>
  )
}