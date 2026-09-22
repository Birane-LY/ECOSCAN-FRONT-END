'use client'

import React, { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { GlassCard } from '@/components/instruments'

export function AssistantTeaser({
  assistantName = 'Assistant EcoScan',
  subtitle = 'Répond à partir de vos données',
  message = 'Le prochain gain est à portée de main.',
  suggestions = ['Où est mon plus gros levier ?', 'Résume ma semaine'],
  onAsk,
}) {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const q = text.trim()
    if (!q) return
    onAsk?.(q)
    setText('')
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
      <p className="asst-quote">{message}</p>
      <div className="asst-chips">
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => onAsk?.(s)}>
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
        <button type="submit" aria-label="Envoyer">
          <ArrowUp size={18} />
        </button>
      </form>
    </GlassCard>
  )
}
