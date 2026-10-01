'use client'

import { useState, useCallback } from 'react'
import { apiPost } from '@/lib/apiClient'

// Suggestions alignées sur les données réellement collectées : index par créneau
// (DonneeEnergetique.creneau), soldes Woyofal, factures, anomalies.
export const ASSISTANT_SUGGESTIONS = [
  'Que s’est-il passé sur ma consommation ?',
  'Compare mes créneaux du jour',
  'Combien de jours me reste-t-il avec mon solde ?',
  'Y a-t-il des anomalies à traiter ?',
]

export const CONTEXTUAL_SUGGESTIONS = [
  'Où est mon plus gros levier ?',
  'Compare mes dernières factures',
  'Où en sont mes objectifs ?',
]

const MESSAGE_ACCUEIL = {
  from: 'ai',
  text: 'Bonjour, je suis EcoScan. Posez-moi une question sur vos données énergétiques.',
}

const MAX_HISTORIQUE = 6

export function useAssistant() {
  const [messages, setMessages] = useState([MESSAGE_ACCUEIL])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState('')
  const [error, setError] = useState(null)

  const ask = useCallback(async (text) => {
    const question = (typeof text === 'string' ? text : input).trim()
    if (!question || thinking) return

    // Derniers échanges envoyés au backend : sans eux, « Confirme cette action »
    // ou « Montre-moi les sources » arrivaient sans aucun contexte.
    const historique = messages
      .filter((m) => m !== MESSAGE_ACCUEIL)
      .slice(-MAX_HISTORIQUE)
      .map((m) => ({ role: m.from === 'ai' ? 'assistant' : 'user', content: m.text }))

    setMessages((m) => [...m, { from: 'user', text: question }])
    setInput('')
    setThinking(true)
    setError(null)

    try {
      const res = await apiPost('/analyses/assistant/interroger/', { question, historique })
      setMessages((m) => [...m, { from: 'ai', text: res.answer, sources: res.sources ?? [] }])
    } catch (err) {
      setError(err.message)
      setMessages((m) => [...m, { from: 'ai', text: `Désolé, une erreur est survenue : ${err.message}` }])
    } finally {
      setThinking(false)
    }
  }, [input, messages, thinking])

  const sendPrompt = useCallback((text) => {
    setActiveSuggestion(text)
    ask(text)
  }, [ask])

  const resetConversation = useCallback(() => {
    setMessages([MESSAGE_ACCUEIL])
    setActiveSuggestion('')
    setError(null)
  }, [])

  return { messages, input, setInput, thinking, activeSuggestion, error, ask, sendPrompt, resetConversation }
}
