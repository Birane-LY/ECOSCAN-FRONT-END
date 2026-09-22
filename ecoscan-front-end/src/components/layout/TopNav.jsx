'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Bell,
  BrainCircuit,
  Check,
  CircleHelp,
  CloudUpload,
  Command,
  FileSpreadsheet,
  Gauge,
  LogOut,
  MessageSquareText,
  Moon,
  Search,
  Settings2,
  Sun,
  Target,
  TrendingDown,
  Wrench,
} from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'

const NAV = [
  { id: 'overview', label: 'Aperçu', icon: Gauge },
  { id: 'analyses', label: 'Analyses', icon: TrendingDown },
  { id: 'data', label: 'Données', icon: FileSpreadsheet },
  { id: 'goals', label: 'Objectifs', icon: Target },
  { id: 'memory', label: 'Mémoire', icon: BrainCircuit },
  { id: 'assistant', label: 'Assistant', icon: MessageSquareText },
  { id: 'features', label: 'Outils', icon: Wrench },
]

export function TopNav({
  view,
  go,
  openUpload,
  currentProfile,
  organisations = [],
  activeOrganisation,
  onSwitchOrganisation,
  onLogout,
  darkMode,
  setDarkMode,
  unreadCount = 0,
  setNotificationsOpen,
  setPaletteOpen,
  setHelpOpen,
}) {
  const navRef = useRef(null)
  const menuRef = useRef(null)
  const [ind, setInd] = useState({ x: 0, w: 0, ready: false })
  const [menuOpen, setMenuOpen] = useState(false)

  // Indicateur glissant sous l'onglet actif
  const measure = useCallback(() => {
    const el = navRef.current?.querySelector('[data-active="true"]')
    if (!el) {
      setInd((s) => ({ ...s, ready: false }))
      return
    }
    setInd({ x: el.offsetLeft, w: el.offsetWidth, ready: true })
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [view, measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready?.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // Fermeture du menu profil au clic extérieur
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  const initials = currentProfile?.initials || (currentProfile?.name || 'E').slice(0, 2).toUpperCase()
  const orgName = activeOrganisation?.nom || 'Organisation'

  return (
    <header className="topnav" data-silent>
      <div className="topnav-brand">
        {APP_CONFIG.logoUrl && <img src={APP_CONFIG.logoUrl} alt="" />}
        <span>{APP_CONFIG.name}</span>
      </div>

      <nav className="pillnav glass" ref={navRef} aria-label="Navigation principale">
        <span
          className={`pill-indicator ${ind.ready ? 'ready' : ''}`}
          style={{ transform: `translateX(${ind.x}px)`, width: ind.w }}
          aria-hidden="true"
        />
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={label}
            data-active={view === id}
            aria-current={view === id ? 'page' : undefined}
            onClick={() => go(id)}
          >
            <Icon size={17} />
            <span className="lbl">{label}</span>
          </button>
        ))}
      </nav>

      <div className="topnav-actions">
        <button type="button" className="search-pill" onClick={() => setPaletteOpen(true)} aria-label="Rechercher">
          <Search size={16} />
          <span>Rechercher</span>
          <kbd>
            <Command size={12} />K
          </kbd>
        </button>

        <button
          type="button"
          className="primary-button btn-import"
          style={{ height: 44, padding: '0 18px' }}
          onClick={openUpload}
          aria-label="Importer des données"
        >
          <CloudUpload size={17} />
          <span>Importer</span>
        </button>

        <button
          type="button"
          className="icon-button"
          style={{ width: 44, height: 44 }}
          aria-label={darkMode ? 'Passer en thème clair' : 'Passer en thème nuit'}
          onClick={() => setDarkMode((v) => !v)}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          className="icon-button has-badge"
          style={{ width: 44, height: 44 }}
          aria-label="Notifications"
          data-notif-toggle
          onClick={() => setNotificationsOpen((v) => !v)}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
        </button>

        <div className="menu-anchor" ref={menuRef}>
          <button
            type="button"
            className="avatar-btn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Menu du compte"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {initials}
          </button>

          {menuOpen && (
            <div className="menu-pop glass" role="menu">
              <div className="menu-head">
                <span className="avatar-btn" style={{ cursor: 'default' }}>
                  {initials}
                </span>
                <div>
                  <strong>{currentProfile?.name || 'Mon compte'}</strong>
                  <small>{currentProfile?.label || orgName}</small>
                </div>
              </div>

              {organisations.length > 0 && (
                <>
                  <div className="menu-sep" />
                  <div className="menu-label">Organisation</div>
                  {organisations.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      role="menuitem"
                      className="menu-item"
                      onClick={() => {
                        onSwitchOrganisation?.(org.id)
                        setMenuOpen(false)
                      }}
                    >
                      <span>{org.nom}</span>
                      {activeOrganisation?.id === org.id && <Check size={16} />}
                    </button>
                  ))}
                </>
              )}

              <div className="menu-sep" />
              <button
                type="button"
                role="menuitem"
                className="menu-item"
                onClick={() => {
                  go('settings')
                  setMenuOpen(false)
                }}
              >
                <Settings2 size={17} />
                Paramètres
              </button>
              <button
                type="button"
                role="menuitem"
                className="menu-item"
                onClick={() => {
                  setHelpOpen(true)
                  setMenuOpen(false)
                }}
              >
                <CircleHelp size={17} />
                Aide
              </button>
              <div className="menu-sep" />
              <button type="button" role="menuitem" className="menu-item danger" onClick={onLogout}>
                <LogOut size={17} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
