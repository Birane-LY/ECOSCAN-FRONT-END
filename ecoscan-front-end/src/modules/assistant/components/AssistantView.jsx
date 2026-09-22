'use client'

import React, { useEffect, useRef } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { ASSISTANT_SUGGESTIONS } from '@/modules/assistant/hooks/useAssistant'
import { ChatBubble } from '@/modules/assistant/components/ChatBubble'
import { ChatInput } from '@/modules/assistant/components/ChatInput'
import { SuggestionsSidebar } from '@/modules/assistant/components/SuggestionsSidebar'

export function AssistantView({
  messages,
  input,
  setInput,
  thinking,
  activeSuggestion,
  ask,
  sendPrompt,
  resetConversation,
}) {
  const bodyRef = useRef(null)

  // Fait défiler la conversation (et non la page) vers le dernier message
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length, thinking])

  const fresh = messages.length <= 1

  return (
    <div className="as">
      <PageHeader
        title="Assistant"
        subtitle="Posez une question, obtenez une réponse fondée sur vos données."
        action={<span className="chip chip-ok"><i className="live-dot" style={{ width: 7, height: 7 }} /> En ligne</span>}
      />

      <div className="as-layout">
        <section className="as-chat glass" aria-label="Conversation">
          <header className="as-head">
            <span className="orb" aria-hidden="true" />
            <div>
              <strong>Assistant EcoScan</strong>
              <small>Analyse vos données en contexte</small>
            </div>
            <button type="button" className="quiet-button" onClick={resetConversation}>
              Nouvelle conversation
            </button>
          </header>

          <div className="as-body" ref={bodyRef} aria-live="polite">
            {fresh && (
              <div className="as-welcome">
                <h2>Que voulez-vous comprendre aujourd’hui ?</h2>
                <p>Je réponds à partir de ce qui est réellement enregistré pour votre organisation.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <ChatBubble
                key={`${m.from}-${i}`}
                message={m}
                isAi={m.from === 'ai'}
                isFollowUp={i > 0}
                onActionClick={ask}
              />
            ))}
            {thinking && (
              <div className="as-thinking" role="status">
                <span className="thinking-dots">
                  <i />
                  <i />
                  <i />
                </span>
                Je consulte vos données…
              </div>
            )}
          </div>

          <div className="as-foot">
            <div className="as-chips">
              {ASSISTANT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={activeSuggestion === s ? 'on' : ''}
                  disabled={thinking}
                  onClick={() => sendPrompt(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <ChatInput input={input} setInput={setInput} onSend={ask} disabled={thinking} />
          </div>
        </section>

        <SuggestionsSidebar onSelectSuggestion={ask} />
      </div>
    </div>
  )
}
