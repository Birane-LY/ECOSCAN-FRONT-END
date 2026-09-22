'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiGet } from '@/lib/apiClient'

export function useAuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Appel à l' endpoint de journal d'audit Django
      const data = await apiGet('/audits/logs/')
      setLogs(data.results || data)
    } catch (err) {
      setError(err.message || "Impossible de charger le journal d'audit.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return { logs, loading, error, refresh: fetchLogs }
}