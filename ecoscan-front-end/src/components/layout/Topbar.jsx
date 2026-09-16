'use client'

import React from 'react'
import {
  Activity,
  Bell,
  ChevronRight,
  CircleHelp,
  Command,
  Menu,
  Search,
  Zap,
} from 'lucide-react'

export function Topbar({
  viewTitle,
  setMobileNav,
  setPaletteOpen,
  darkMode,
  setDarkMode,
  unreadCount,
  setNotificationsOpen,
  setHelpOpen,
}) {
  return (
    <header className="topbar">
      <button
        className="icon-button menu-button lg:hidden"
        aria-label="Ouvrir le menu"
        onClick={() => setMobileNav(true)}
      >
        <Menu />
      </button>

      <div className="breadcrumb">
        <span>{viewTitle}</span>
        <ChevronRight size={14} />
        <strong>Mon espace</strong>
      </div>

      <div className="top-actions">
        <button className="search-trigger" onClick={() => setPaletteOpen(true)}>
          <Search size={16} />
          <span>Rechercher</span>
          <kbd>
            <Command size={11} /> K
          </kbd>
        </button>

        <button
          className="icon-button"
          aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          onClick={() => setDarkMode((val) => !val)}
        >
          {darkMode ? <Zap size={18} /> : <Activity size={18} />}
        </button>

        <button
          className="icon-button has-dot"
          aria-label="Notifications"
          onClick={() => setNotificationsOpen((v) => !v)}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        </button>

        <button className="help-button" onClick={() => setHelpOpen(true)}>
          <CircleHelp size={16} /> Aide
        </button>
      </div>
    </header>
  )
}