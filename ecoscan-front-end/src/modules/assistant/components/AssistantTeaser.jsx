'use client'

import React, { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { GlassCard } from '@/components/instruments'

/**
 * `onAsk(question)` peut renvoyer (ou résoudre) une chaîne : elle est alors
 * affichée dans la carte. Avant, la question partait dans le vide et aucune
 * réponse ne s'affichait nulle part.
 */
export function AssistantTeaser({
  assistantName = 'Assistant EcoScan',
  subtitle = 'Répond à partir de vos données',
  message = 'Posez une question sur vos données.',
  suggestions = ['Où est mon plus gros levier ?', 'Y a-t-il des anomalies à traiter ?'],
  onAsk,
}) {
  const [text, setText] = useState('')
  const [reply, setReply] = useState(null)
  const [busy, setBusy] = useState(false)

  const send = async (question) => {
    const q = question.trim()
    if (!q || busy) return
    setBusy(true)
    try {
      const res = await onAsk?.(q)
      if (typeof res === 'string') setReply(res)
    } catch (err) {
      setReply(`Désolé, une erreur est survenue : ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const q = text
    setText('')
    send(q)
  }

  return (
    <GlassCard as="aside" className="asst">
      <div className="asst-head">
        <span className="orb" aria-hidden="true" />
        <div>
          <strong>{assistantName}</strong>
          <small>{subtitle}</small>
        </div>
      </div>
      <p
        className="asst-quote"
        aria-live="polite"
        style={{ whiteSpace: 'pre-wrap', maxHeight: 220, overflowY: 'auto' }}
      >
        {busy ? 'Je consulte vos données…' : reply ?? message}
      </p>
      <div className="asst-chips">
        {suggestions.map((s) => (
          <button key={s} type="button" disabled={busy} onClick={() => send(s)}>
            {s}
          </button>
        ))}
      </div>
      <form className="prompt" onSubmit={submit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Posez votre question…"
          aria-label="Question pour l’assistant"
        />
        <button type="submit" aria-label="Envoyer" disabled={busy || !text.trim()}>
          <ArrowUp size={18} />
        </button>
      </form>
    </GlassCard>
  )
}
