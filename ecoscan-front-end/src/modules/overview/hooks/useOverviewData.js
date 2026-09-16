// modules/overview/useOverviewData.js
'use client'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const authHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useOverviewData() {
  const [state, setState] = useState({ loading: true, error: null, historique: [], objectifs: [] })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [histRes, objRes] = await Promise.all([
          fetch(`${API_BASE_URL}/energy/historiques-performance/`, { headers: authHeaders() }),
          fetch(`${API_BASE_URL}/energy/objectifs/`, { headers: authHeaders() }),
        ])
        if (!histRes.ok || !objRes.ok) throw new Error('Impossible de charger les données énergétiques.')
        const historique = await histRes.json()
        const objectifs = await objRes.json()
        if (!cancelled) setState({
          loading: false, error: null,
          historique: historique.results ?? historique,
          objectifs: objectifs.results ?? objectifs,
        })
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }))
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return state
}