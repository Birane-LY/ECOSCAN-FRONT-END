'use client'

import React from 'react'
import { Send, Trash2, X, Sparkles } from 'lucide-react'

export function AdminChatDrawer({ messages, message, setMessage, send, close, clear }) {
  return (
    <aside className="admin-chat-drawer">
      <div className="chat-head">
        <div className="chat-head-title">
          <Sparkles size={16} className="text-teal" />
          <div>
            <small className="eyebrow">ECOSCAN COPILOT</small>
            <strong>Assistant Plateforme</strong>
          </div>
        </div>
        <div className="chat-head-actions">
          <button className="icon-button" onClick={clear} aria-label="Effacer la conversation">
            <Trash2 size={15} />
          </button>
          <button className="icon-button" onClick={close} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Conversation vide. Posez une question sur les abonnements, les métriques système ou les organisations pour commencer.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={`${m}-${i}`} className={`chat-bubble ${i % 2 ? 'user' : 'assistant'}`}>
            <p>{m}</p>
          </div>
        ))}
      </div>

      <form
        className="chat-compose"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Demandez une analyse ou une action..."
        />
        <button type="submit" className="admin-primary icon-only" aria-label="Envoyer">
          <Send size={15} />
        </button>
      </form>
    </aside>
  )
}