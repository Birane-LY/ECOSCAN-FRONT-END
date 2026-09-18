'use client'
import { useEffect } from 'react'

/**
 * Ouvre/ferme la palette de commandes avec Ctrl+K (Windows/Linux) ou Cmd+K (Mac).
 * Empêche le comportement par défaut du navigateur (ex: focus barre d'adresse
 * sur certains navigateurs) et ignore les frappes faites dans un champ de saisie
 * autre que la palette elle-même pour éviter les conflits.
 */
export function useCommandPaletteShortcut(setPaletteOpen) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey

      if (modifierPressed && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }

      if (e.key === 'Escape') {
        setPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setPaletteOpen])
}