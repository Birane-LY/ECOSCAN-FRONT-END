'use client'

import React from 'react'
import { Bell, Menu, MessageSquareText, Moon, Search, Sun } from 'lucide-react'

export function AdminTopbar({ title, setDrawer, setChat, notify, dark, setDark }) {
  return (
    <header className="adm-top">
      <div className="adm-top-left">
        <button type="button" className="icon-button adm-menu" onClick={() => setDrawer(true)} aria-label="Ouvrir le menu">
          <Menu size={18} />
        </button>
        <span className="adm-crumb">
          EcoScan Platform <span aria-hidden="true">/</span> <strong>{title}</strong>
        </span>
      </div>

      <div className="adm-top-actions">
        <label className="adm-search">
          <Search size={16} />
          <input placeholder="Rechercher…" aria-label="Rechercher" />
        </label>
        <button type="button" className="icon-button" onClick={() => setDark((v) => !v)} aria-label={dark ? 'Passer en thème clair' : 'Passer en thème nuit'}>
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button type="button" className="icon-button" onClick={() => notify('Aucune nouvelle notification')} aria-label="Notifications">
          <Bell size={17} />
        </button>
        <button type="button" className="icon-button" onClick={() => setChat(true)} aria-label="Ouvrir la messagerie de la plateforme">
          <MessageSquareText size={17} />
        </button>
        <span className="ad-avatar" aria-hidden="true">
          CM
        </span>
      </div>
    </header>
  )
}
