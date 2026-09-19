'use client'

import React from 'react'
import { Bell, Menu, Search, Sparkles } from 'lucide-react'

export function AdminTopbar({ title, setDrawer, setChat, notify }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          className="admin-menu-button icon-button"
          onClick={() => setDrawer(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu size={18} />
        </button>

        <div className="admin-breadcrumb">
          <span>EcoScan Platform</span>
          <span className="sep">/</span>
          <strong>{title}</strong>
        </div>
      </div>

      <div className="admin-topbar-right">
        <label className="admin-search">
          <Search size={15} />
          <input placeholder="Rechercher une organisation, facture, ticket..." />
        </label>

        <button
          className="icon-button admin-icon-button"
          onClick={() => notify('Aucune nouvelle notification')}
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>

        <button
          className="admin-copilot-btn"
          onClick={() => setChat(true)}
          title="Ouvrir l'assistant AI"
        >
          <Sparkles size={15} />
          <span>Copilot</span>
        </button>

        <div className="admin-top-avatar" title="Camille Martin">
          CM
        </div>
      </div>
    </header>
  )
}