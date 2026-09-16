'use client'

import React from 'react'

export function AppShell({ darkMode, onAction, children }) {
  const handleClickCapture = (event) => {
    const button = event.target.closest('button')
    if (button && !button.disabled && onAction) {
      const label =
        button.getAttribute('aria-label') ||
        button.textContent?.replace(/\s+/g, ' ').trim()
      if (
        label &&
        !label.includes('Afficher le mot de passe') &&
        !label.includes('Ouvrir le menu') &&
        !label.includes('Fermer')
      ) {
        onAction(label.slice(0, 54))
      }
    }
  }

  return (
    <main
      className={`ecoscan-shell ${darkMode ? 'theme-dark' : ''}`}
      onClickCapture={handleClickCapture}
    >
      {children}
    </main>
  )
}
