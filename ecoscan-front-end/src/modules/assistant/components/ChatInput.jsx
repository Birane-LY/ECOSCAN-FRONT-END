import React from 'react'
import { Paperclip, Send } from 'lucide-react'

export function ChatInput({ input, setInput, onSend }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSend(input)
  }

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <Paperclip size={16} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez une question à EcoScan..."
        aria-label="Message à EcoScan IA"
      />
      <button aria-label="Envoyer" type="submit">
        <Send size={16} />
      </button>
    </form>
  )
}
