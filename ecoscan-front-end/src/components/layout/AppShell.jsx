'use client'

import React from 'react'

export function AppShell({ darkMode, accent, density, onAction, children }) {
  // Annonce le libellé du bouton cliqué (comportement existant). Les zones
  // marquées data-silent (navigation, barres du graphique) sont exclues.
  const handleClickCapture = (event) => {
    const button = event.target.closest('button')
    if (!button || button.disabled || !onAction) return
    if (button.closest('[data-silent]')) return
    const label =
      button.getAttribute('aria-label') || button.textContent?.replace(/\s+/g, ' ').trim()
    if (
      label &&
      !label.includes('Afficher le mot de passe') &&
      !label.includes('Ouvrir le menu') &&
      !label.includes('Fermer')
    ) {
      onAction(label.slice(0, 54))
    }
  }

  return (
    <main
      className="eco-shell"
      data-theme={darkMode ? 'night' : 'light'}
      data-accent={accent || undefined}
      data-density={density || undefined}
      onClickCapture={handleClickCapture}
    >
      <div className="eco-backdrop" aria-hidden="true" />
      {children}
    </main>
  )
}
