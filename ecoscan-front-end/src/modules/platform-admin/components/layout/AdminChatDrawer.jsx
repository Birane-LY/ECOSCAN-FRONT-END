'use client'

import React from 'react'
import { ArrowUp, Trash2, X } from 'lucide-react'

export function AdminChatDrawer({ messages, message, setMessage, send, close, clear }) {
  return (
    <aside className="adm-chat" role="dialog" aria-label="Messagerie de la plateforme">
      <header>
        <strong>Assistant plateforme</strong>
        <div>
          <button type="button" className="icon-button" onClick={clear} aria-label="Effacer la conversation">
            <Trash2 size={16} />
          </button>
          <button type="button" className="icon-button" onClick={close} aria-label="Fermer">
            <X size={17} />
          </button>
        </div>
      </header>

      <div className="adm-chat-body">
        {messages.length === 0 && <p className="drawer-lead">Conversation vide. Posez une question pour commencer.</p>}
        {messages.map((m, i) => (
          <div className={`as-msg ${i % 2 ? 'user' : 'ai'}`} key={`${i}-${m.slice(0, 12)}`}>
            <div className="as-bubble">{m}</div>
          </div>
        ))}
      </div>

      <form
        className="prompt"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Posez une question…" aria-label="Message" />
        <button type="submit" aria-label="Envoyer" disabled={!message.trim()}>
          <ArrowUp size={17} />
        </button>
      </form>
    </aside>
  )
}
