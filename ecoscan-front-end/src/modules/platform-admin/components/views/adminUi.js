// Petits utilitaires d'affichage partagés par les vues de la console.

// Couleur de puce selon le libellé de statut (organisations, factures, abonnements).
const OK = ['Actif', 'Payée', 'Résolu', 'Opérationnel']
const WARN = ['À valider', 'À renouveler', 'En cours', 'Ouvert', 'À encaisser']
const ALERT = ['Suspendu', 'En retard', 'Carte expirée', 'Urgente', 'Impayée']

export function statusTone(status) {
  if (OK.includes(status)) return 'chip-ok'
  if (WARN.includes(status)) return 'chip-warn'
  if (ALERT.includes(status)) return 'chip-alert'
  return ''
}

// Colonnes d'un tableau : la première plus large, le reste à parts égales.
export const cols = (n) => ({ '--cols': `1.5fr repeat(${Math.max(1, n - 1)}, minmax(0, 1fr))` })
