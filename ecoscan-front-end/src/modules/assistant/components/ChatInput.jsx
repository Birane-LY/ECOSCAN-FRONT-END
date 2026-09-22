import React from 'react'
import { ArrowUp } from 'lucide-react'

export function ChatInput({ input, setInput, onSend, disabled }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input)
  }

  return (
    <form className="prompt" onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez une question sur vos données…"
        aria-label="Message pour l’assistant"
      />
      <button type="submit" aria-label="Envoyer" disabled={disabled || !input.trim()}>
        <ArrowUp size={18} />
      </button>
    </form>
  )
}
