'use client'
import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

const unwrap = (r) => (Array.isArray(r) ? r : r?.results ?? [])
const nombre = (v) => (v == null || v === '' ? null : Number(v))
const STATUT = { EN_ATTENTE: 'En attente', VALIDEE: 'Validé', REJETEE: 'Rejeté' }

/**
 * Saisies manuelles récentes, lues à la source :
 *  - index de compteur par créneau (DonneeEnergetique) ;
 *  - soldes relevés (ReleveSolde) et recharges (AchatWoyofal) Woyofal.
 * Chaque liste échoue indépendamment : une ressource en panne n'efface pas les autres.
 */
export function useReleves(limite = 12) {
  const [state, setState] = useState({ loading: true, error: null, entrees: [] })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    let echecs = 0
    const lire = (chemin) => apiGet(chemin).then(unwrap).catch(() => { echecs += 1; return [] })

    const [indexes, releves, achats] = await Promise.all([
      lire('/energies/donnees-energetiques/'),
      lire('/energies/releves-solde/'),
      lire('/energies/achats-woyofal/'),
    ])

    const entrees = [
      ...indexes.map((d) => ({
        id: `i-${d.id}`, date: d.periode_fin || d.date_releve, statut: STATUT[d.statut_validation] || d.statut_validation,
        titre: `Index : ${nombre(d.valeur) ?? '—'} ${d.unite || 'kWh'}${d.creneau ? ` (${d.creneau})` : ''}`,
        detail: d.source || 'Relevé manuel',
      })),
      ...releves.map((r) => ({
        id: `s-${r.id}`, date: r.date_releve,
        titre: `Solde relevé : ${nombre(r.kwh_restants) ?? '—'} kWh`, detail: 'Relevé de solde',
      })),
      ...achats.map((a) => ({
        id: `a-${a.id}`, date: a.date_achat,
        titre: `Recharge : ${nombre(a.kwh_credites) ?? '—'} kWh`,
        detail: a.montant_fcfa != null ? `${Number(a.montant_fcfa).toLocaleString('fr-FR')} FCFA` : 'Achat Woyofal',
      })),
    ]
      .sort((x, y) => new Date(y.date) - new Date(x.date))
      .slice(0, limite)

    setState({ loading: false, error: echecs === 3 ? 'Impossible de charger les relevés.' : null, entrees })
  }, [limite])

  useEffect(() => { reload() }, [reload])
  return { ...state, reload }
}
