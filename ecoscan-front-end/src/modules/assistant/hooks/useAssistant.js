'use client'

import { useState, useCallback } from 'react'
import { apiPost } from '@/lib/apiClient'

export const ASSISTANT_SUGGESTIONS = [
  'Que s’est-il passé sur ma consommation ?',
  'Compare mes créneaux du jour',
  'Prépare une action pour demain',
]

export const CONTEXTUAL_SUGGESTIONS = [
  'Où est mon plus gros levier ?',
  'Compare mes 3 derniers mois',
  'Prépare le comité de direction',
]

const MESSAGE_ACCUEIL = {
  from: 'ai',
  text: "Bonjour, je suis EcoScan IA. Posez-moi une question sur vos données énergétiques.",
}

export function useAssistant() {
  const [messages, setMessages] = useState([MESSAGE_ACCUEIL])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState('')
  const [error, setError] = useState(null)

  const ask = useCallback(async (text) => {
    const question = (text ?? input).trim()
    if (!question) return

    setMessages((m) => [...m, { from: 'user', text: question }])
    setInput('')
    setThinking(true)
    setError(null)

    try {
      const res = await apiPost('/analyses/assistant/interroger/', { question })
      setMessages((m) => [...m, { from: 'ai', text: res.answer }])
    } catch (err) {
      setError(err.message)
      setMessages((m) => [...m, { from: 'ai', text: `Désolé, une erreur est survenue : ${err.message}` }])
    } finally {
      setThinking(false)
    }
  }, [input])

  const sendPrompt = useCallback((text) => {
    setActiveSuggestion(text)
    ask(text)
  }, [ask])

  const resetConversation = useCallback(() => {
    setMessages([MESSAGE_ACCUEIL])
    setActiveSuggestion('')
  }, [])

  return { messages, input, setInput, thinking, activeSuggestion, error, ask, sendPrompt, resetConversation }
}